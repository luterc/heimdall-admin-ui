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
      <el-form ref="queryForm" :model="queryForm.query" inline>
        <el-form-item label="名字" prop="name">
          <el-input
            v-model="queryForm.query.name"
            style="width: 300px"
            placeholder="请输入标识或者名字模糊查询"
            clearable
            @keyup.enter.native="handleQuery"
            @clear="handleQuery"
          />
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
      :is-exporting="tableBar.exportLoading"
      :left-span="18"
      :show-delete-btn="false"
      :show-export-csv-btn="false"
      :show-export-excel-btn="false"
      :show-update-btn="false"
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
        fit
        highlight-current-row
        @selection-change="onTableSelectionChange"
        @sort-change="onTableSortChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="name" label="角色标识" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-html="highLightText(queryForm.query.name, row.name)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" show-overflow-tooltip>
          <template #default="{ row }">
            <span
              v-html="highLightText(queryForm.query.name, row.title)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column prop="reserved" label="类型">
          <template #default="{ row }">
            <el-tag effect="dark" :type="row.reserved ? 'danger' : 'info'">
              {{ row.reserved ? "系统角色" : "普通角色" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="说明"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="handleAuth(row)">授权</el-button>
            <el-button
              v-if="!row.reserved"
              type="text"
              @click="handleUpdate(row)"
            >
              修改
            </el-button>
            <el-popconfirm
              v-if="!row.reserved"
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
      <!--        分页-->
      <pagination
        hide-on-single-page
        :total="table.total"
        :page.sync="queryForm.query.page"
        :size.sync="queryForm.query.size"
        :auto-scroll="false"
        @pagination="getListData"
      />
    </list-panel>
    <save ref="save" @ok="getListData(true)"></save>
    <update ref="update" @ok="getListData(true)"></update>
    <auth ref="auth" @ok="getListData(true)"></auth>
  </div>
</template>

<script>
  import { getRoleList, doRoleDelete } from "@/api/sys/role";
  import Save from "./Save";
  import Update from "./Update";
  import Auth from "./Auth";

  export default {
    name: "SysRole",
    //组件注册
    components: { Save, Update, Auth },
    //指令注册
    directives: {},
    data() {
      //数据
      return {
        //查询表单
        queryForm: {
          show: true,
          //查询条件
          //查询条件和分页参数
          query: {
            ...this.$config.pager.default,
            name: "",
          },
        },
        //表格
        table: {
          loading: false,
          //选中的记录
          selections: [],
          items: [],
          total: 0,
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
      //表格数据选择事件
      onTableSelectionChange(selection) {
        this.table.selections = selection;
      },
      //表格排序
      onTableSortChange(sort) {
        this.queryForm.query = this.$config.pager.getSort(
          this.queryForm.query,
          sort
        );
      },
      //查询
      handleQuery() {
        this.getListData(true);
      },
      //查询条件重置
      handleQueryReset() {
        this.$refs.queryForm.resetFields();
        this.getListData(true);
      },
      //新增
      handleSave(row) {
        this.$refs["save"].show(row);
      }, //授权
      handleAuth(row) {
        this.$refs["auth"].show(row);
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
      async handleDelete(row) {
        await doRoleDelete(
          row && row.id ? row.id : this.table.selections[0].id
        );
      },
      //查询列表数据
      getListData(reload = false) {
        if (reload === true) {
          this.queryForm.query.page = 1;
        }
        this.table.loading = true;
        getRoleList(this.queryForm.query)
          .then((res) => {
            this.table.items = res.data.records;
            this.table.total = Number(res.data.totalCount);
            this.table.loading = false;
          })
          .catch(() => {
            this.table.loading = false;
          });
      },
    },
  };
</script>
