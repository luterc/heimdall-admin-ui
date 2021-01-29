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
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="queryForm.query.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter.native="handleQuery"
            @clear="handleQuery"
          />
        </el-form-item>
        <el-form-item label="类型" prop="resType">
          <el-select
            v-model="queryForm.query.resType"
            placeholder="类型"
            @change="handleQuery"
          >
            <el-option label="不限" value=""></el-option>
            <el-option label="菜单" :value="1"></el-option>
            <el-option label="页面" :value="2"></el-option>
            <el-option label="操作权限" :value="3"></el-option>
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
      :show-export-excel-btn="false"
      :show-export-csv-btn="false"
      :show-update-btn="false"
      :show-delete-btn="false"
      @save="handleSave"
      @refresh="getListData(true)"
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
        <el-table-column label="标题" show-overflow-tooltip width="240">
          <template #default="{ row }">
            <font-icon :icon="row.icon"></font-icon>
            <span
              v-html="highLightText(queryForm.query.title, row.title)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          show-overflow-tooltip
          min-width="120"
        ></el-table-column>
        <el-table-column label="类型" min-width="100">
          <template #default="{ row }">
            <el-tag
              size="mini"
              effect="dark"
              :type="
                row.resType === 1
                  ? ''
                  : row.resType === 2
                  ? 'success'
                  : 'danger'
              "
            >
              <span>{{ row.resType | resType }}</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="component"
          label="页面"
          min-width="220"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="path"
          label="路由"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="perm"
          label="权限标识"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="uri"
          label="操作url"
          show-overflow-tooltip
          min-width="200"
        ></el-table-column>

        <el-table-column label="是否隐藏" min-width="100">
          <template #default="{ row }">
            <span>{{ row.hidden ? "隐藏" : "显示" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="seqNo"
          label="顺序"
          min-width="70"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" min-width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.resType !== 3"
              type="text"
              @click="handleAddChild(row)"
            >
              添加
            </el-button>
            <el-button type="text" @click="handleUpdate(row)">修改</el-button>
            <el-popconfirm
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              class="ml10"
              @confirm="handleDelete(row)"
            >
              <el-button slot="reference" type="text" class="color-danger">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </list-panel>
    <save ref="save" @ok="getListData(false)"></save>
    <update ref="update" @ok="getListData(false)"></update>
  </div>
</template>

<script>
  import { getResourceTree } from "@/api/sys/resource";
  import Save from "./Save";
  import Update from "./Update";

  export default {
    name: "SysResource",
    //组件注册
    components: { Save, Update },
    //指令注册
    directives: {},
    filters: {
      resType(value) {
        switch (value) {
          case 1:
            return "菜单";
          case 2:
            return "页面";
          case 3:
            return "权限";
          default:
            return value;
        }
      },
    },
    data() {
      //数据
      return {
        //查询表单
        queryForm: {
          show: true,
          //查询条件
          query: {
            resType: "",
            title: "",
            searched: false,
          },
        },
        //表格
        table: {
          loading: false,
          items: [],
        },
        //table bar
        tableBar: {
          //导出按钮状态，用以显示导出按钮的loading状态标识
          exportLoading: false,
        },
      };
    },
    //计算属性
    computed: {},
    //监听属性
    watch: {},
    //创建完成
    created() {
      this.getListData();
    },
    //挂载完成
    mounted() {},
    //方法
    methods: {
      //显示隐藏查询表单
      toggleQueryForm() {
        this.queryForm.show = !this.queryForm.show;
      },
      //查询
      handleQuery() {
        this.getListData(true);
      },
      //查询条件重置
      handleQueryReset() {
        this.$refs.queryForm.resetFields();
        this.getListData(false);
      },
      //新增
      handleSave() {
        this.$refs["save"].show({
          id: 0,
          resType: 1,
          //说明是新建顶级
          ptype: 0,
          ptitle: "根节点",
        });
      },
      handleAddChild(row) {
        this.$refs["save"].show({
          id: row.id,
          resType: row.resType,
          ptype: row.resType,
          ptitle: row.title,
        });
      },
      //修改
      handleUpdate(row) {
        let id, title;
        if (row && row.id) {
          id = row.id;
          title = row.name;
        } else {
          id = this.table.selections[0].id;
          title = this.table.selections[0].name;
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
      async getListData(searched = false) {
        this.table.loading = true;
        this.queryForm.query.searched = searched;
        getResourceTree(this.queryForm.query)
          .then((res) => {
            this.table.items = res.data.children;
            this.table.loading = false;
          })
          .catch((err) => {
            this.table.loading = false;
          });
      },
      /////待实现
      async deleteById(param) {
        if (param && param.id) {
          console.log("调用ajax删除", param);
          this.$baseNotify("已删除");
        } else {
          this.$baseNotify("错误:id is null");
        }
      },
    },
  };
</script>
