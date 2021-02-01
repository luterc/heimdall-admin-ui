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
      :show-update-btn="false"
      :show-save-btn="false"
      :show-export-csv-btn="false"
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
        <el-table-column label="No.">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="SessionId"
          show-overflow-tooltip
          min-width="100"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="UserName"
          show-overflow-tooltip
          min-width="120"
        >
          <template #default="{ row }">
            <el-tag
              v-if="
                row.details &&
                $store.state.user.username === row.details.user.username
              "
              size="mini"
              effect="dark"
            >
              {{ row.details && row.details.user.username }}
            </el-tag>
            <span v-else>{{ row.details && row.details.user.username }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Last Active"
          show-overflow-tooltip
          min-width="120"
        >
          <template #default="{ row }">
            <span>{{ row | actTimes }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="host"
          label="Host"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="startTimestamp"
          label="StartTimestamp"
          show-overflow-tooltip
          min-width="180"
        ></el-table-column>
        <el-table-column
          prop="lastAccessTime"
          label="LastAccessTime"
          show-overflow-tooltip
          min-width="180"
        ></el-table-column>
        <el-table-column
          prop="timeout"
          label="TimeOut"
          min-width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row | timeout }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button
              v-if="
                row.details ||
                $store.state.user.username !== row.details.user.username
              "
              type="text"
              class="color-danger"
              @click="handleDelete(row)"
            >
              强制下线
            </el-button>
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
  </div>
</template>

<script>
  import { getOnlineuserList, kickoutUser } from "@/api/sys/onlineuser";
  import { formatTime } from "@/utils";
  import { formatDuration } from "@/utils";

  export default {
    //名字与路由里面名字对应，则可keep-alve页面缓存
    name: "SysOnlineUser",
    //组件注册
    components: {},
    //指令注册
    directives: {},
    filters: {
      actTimes(row) {
        return formatTime(new Date(row.lastAccessTime));
      },
      timeout(row) {
        return formatDuration(row.timeout * 1000);
      },
    },
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
      //删除
      handleDelete(row) {
        this.deleteById({
          sessionId: row && row.id ? row.id : this.table.selections[0].id,
        });
      },
      //查询列表数据
      async getListData(reload = false) {
        if (reload === true) {
          this.queryForm.query.page = 1;
        }
        this.table.loading = true;
        getOnlineuserList(this.queryForm.query)
          .then((res) => {
            this.table.items = res.data;
            this.table.total = Number(res.data.length);
            this.table.loading = false;
          })
          .catch((err) => {
            this.table.loading = false;
          });
      },
      /////待实现
      async deleteById(param) {
        let me = this;
        if (param && param.sessionId) {
          me.$baseConfirm(
            "强制下线后，此用户将需要重新登录系统",
            "确认吗",
            function () {
              kickoutUser(param).then((res) => {
                me.$baseMessage("强制用户下线成功");
                me.getListData(true);
              });
            }
          );
        } else {
        }
      },
    },
  };
</script>
