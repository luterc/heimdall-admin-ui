<!--
  - /*
  -  *
  -  *
  -  *      Copyright 2020-2021 Luter.me
  -  *
  -  *      Licensed under the Apache License, Version 2.0 (the "License");
  -  *      you may not use this file except in compliance with the License.
  -  *      You may obtain a copy of the License at
  -  *
  -  *        http://www.apache.org/licenses/LICENSE-2.0
  -  *
  -  *      Unless required by applicable law or agreed to in writing, software
  -  *      distributed under the License is distributed on an "AS IS" BASIS,
  -  *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  -  *      See the License for the specific language governing permissions and
  -  *      limitations under the License.
  -  *
  -  *
  -  */
  -->

<template>
  <div class="page-container">
    <!--    查询-->
    <query-panel ref="queryPanel" :show="queryForm.show">
      <el-form
        ref="queryForm"
        :model="queryForm.query"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item label="名字" prop="name">
          <el-input
            v-model="queryForm.query.name"
            placeholder="请输入名字"
            clearable
            maxlength="20"
            show-word-limit
            @keyup.enter.native="handleQuery"
            @clear="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-select
            v-model="queryForm.query.enabled"
            placeholder="状态"
            @change="handleQuery"
          >
            <el-option label="正常" :value="true"></el-option>
            <el-option label="停用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">
            搜索
          </el-button>
          <el-button
            type="success"
            icon="el-icon-refresh"
            @click="handleQueryReset"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <!--    表格顶部操作栏-->
    <toolbar
      ref="tableBar"
      :selections="table.selections"
      :show-search="queryForm.show"
      :left-span="18"
      :show-export-csv-btn="false"
      :show-delete-btn="false"
      :show-update-btn="false"
      @save="handleSave"
      @update="handleUpdate"
      @refresh="getTreeData()"
      @toggle-search="toggleQueryForm"
    ></toolbar>
    <!--    分页表格-->
    <list-panel>
      <!--        表格-->
      <el-table
        ref="table"
        v-loading="table.loading"
        element-loading-text="加载中,请稍后..."
        :data="table.items"
        row-key="id"
        fit
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        highlight-current-row
      >
        <el-table-column label="名称" show-overflow-tooltip min-width="300">
          <template #default="{ row }">
            <span v-html="highLightText(queryForm.query.name, row.name)"></span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag
              size="mini"
              effect="dark"
              :type="row.enabled ? 'success' : 'danger'"
            >
              <span>{{ row.enabled ? "正常" : "停用" }}</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template #default="{ row }">
            <el-button type="text" @click="handleSave(row)">添加</el-button>
            <el-button type="text" @click="handleUpdate(row)">修改</el-button>
            <el-popconfirm
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              class="ml10"
              @confirm="handleDelete(row)"
            >
              <el-button
                v-if="0 != row.pid"
                slot="reference"
                type="text"
                class="color-danger"
              >
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </list-panel>
    <save ref="save" @ok="getTreeData()"></save>
    <update ref="update" @ok="getTreeData()"></update>
  </div>
</template>

<script>
  import { getDepartmentTree } from "@/api/sys/department";
  import Save from "./Save";
  import Update from "./Update";

  export default {
    //名字与路由里面名字对应，则可keep-alve页面缓存
    //name: "Department",
    //组件注册
    components: { Save, Update },
    //指令注册
    directives: {},
    data() {
      //数据
      return {
        //查询表单
        queryForm: {
          //默认是否显示搜索表单区域
          show: true,
          //查询条件
          //查询条件和分页参数
          query: {
            name: "",
            enabled: "",
            searched: false,
          },
        },
        //表格
        table: {
          loading: false,
          items: [],
        },
      };
    },
    //计算属性
    computed: {},
    //监听属性
    watch: {},
    //创建完成
    created() {
      this.getTreeData();
    },
    //挂载完成
    mounted() {},
    //方法
    methods: {
      //显示隐藏查询表单
      toggleQueryForm() {
        this.queryForm.show = !this.queryForm.show;
      },
      //表格数据选择事件
      //查询
      handleQuery() {
        this.getTreeData(true);
      },
      //查询条件重置
      handleQueryReset() {
        this.$refs.queryForm.resetFields();
        this.getTreeData(false);
      },
      //新增
      handleSave(row) {
        this.$refs["save"].show({
          pid: row && row.id ? row.id : null,
          tree: this.table.items,
        });
      },
      //修改
      handleUpdate(row) {
        let id, title;
        if (row && row.id) {
          id = row.id;
          title = row.name;
        }
        if (!id) {
          this.$baseNotify("请选择要修改的记录");
          return;
        }
        this.$refs["update"].show({
          title: "修改:" + title,
          id: id,
        });
      },
      //删除
      handleDelete(row) {
        this.deleteById({
          id: row && row.id ? row.id : this.table.selections[0].id,
        });
      },
      //查询列表数据
      async getTreeData(searched = false) {
        this.table.loading = true;
        this.queryForm.query.searched = searched;
        getDepartmentTree(this.queryForm.query)
          .then((res) => {
            this.table.items = res.data;
            this.table.loading = false;
          })
          .catch((err) => {
            this.table.loading = false;
          });
      },
    },
  };
</script>
