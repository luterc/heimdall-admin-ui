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
      <el-form ref="queryForm" :model="queryForm.query" :inline="true">
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="queryForm.query.username"
            placeholder="请输入账号"
            clearable
            @keyup.enter.native="handleQuery"
            @clear="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryForm.query.status"
            placeholder="是否锁定?"
            @change="handleQuery"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="成功" :value="1"></el-option>
            <el-option label="失败" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="username">
          <el-date-picker
            v-model="queryForm.requestTime"
            type="datetimerange"
            range-separator="至"
            :clearable="false"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :picker-options="queryForm.pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
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
      :show-search="false"
      :left-span="18"
      :show-save-btn="false"
      show-delete-btn
      show-export-csv-btn
      @csv-export="handleCSVExport"
      @delete="handleBatchDelete"
      @refresh="getListData(true)"
      @toggle-search="queryForm.show = !queryForm.show"
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
        :default-sort="{ prop: 'requestTime', order: 'descending' }"
        @selection-change="onTableSelectionChange"
        @sort-change="onTableSortChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <b>请求参数:</b>
            <p v-html="props.row.requestParam"></p>
            <b>响应结果:</b>
            <p v-html="props.row.responseResult"></p>
          </template>
        </el-table-column>
        <el-table-column
          prop="requestTime"
          sortable
          label="时间"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="username"
          min-width="80"
          label="账号"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span
              v-html="highLightText(queryForm.query.username, row.username)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="操作内容"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="requestUrl"
          label="资源"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="requestUrl" label="状态" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag
              size="mini"
              effect="dark"
              :type="row.status ? 'success' : 'danger'"
            >
              {{ row.status === 1 ? "成功" : "失败" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="consumingTime"
          label="用时(ms)"
          min-width="90"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="browserName"
          label="浏览器"
          show-overflow-tooltip
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="terminalOsName"
          label="客户端OS"
          show-overflow-tooltip
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="userLocation"
          label="归属地"
          show-overflow-tooltip
          min-width="160"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="60">
          <template #default="{ row }">
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
      <!--        分页-->
      <pagination
        hide-on-single-page
        :total="table.total"
        :page.sync="queryForm.query.page"
        :size.sync="queryForm.query.size"
        :auto-scroll="true"
        @pagination="getListData"
        @size-change="getListData(true)"
      />
    </list-panel>
  </div>
</template>

<script>
  import {
    getSyslogList,
    doSyslogDelete,
    doSyslogDeleteBatch,
  } from "@/api/sys/syslog";
  import ExportCSV from "@/vendor/ExportCSV";

  export default {
    //名字与路由里面名字对应，则可keep-alve页面缓存
    name: "SysSysLog",
    //组件注册
    //指令注册
    directives: {},
    data() {
      //数据
      return {
        //查询表单
        queryForm: {
          show: true,
          requestTime: [],
          minDate: "",
          maxDate: "",
          pickerOptions: {
            disabledDate: (time) => {
              // 返回是否禁用
              // 当前时间的时间戳
              let curDate = new Date().getTime();
              // 能查看几年前的时间 单位是年 （当前是10年）
              let cutTime = 365 * 24 * 3600 * 1000;
              // 最小时间的时间戳
              let minTime = curDate - cutTime;
              // 当前的23点59分59秒
              let nowLast = new Date(
                new Date(new Date().getTime()).setHours(23, 59, 59, 999)
              ).getTime();
              return time.getTime() > nowLast || time.getTime() < minTime;
            },
          },
          //查询条件
          //查询条件和分页参数
          query: {
            ...this.$config.pager.default,
            username: "",
            desc: "requestTime",
            requestTimeStart: "",
            requestTimeEnd: "",
            status: "",
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
        this.getListData(true);
      },
      //查询
      handleQuery() {
        this.getListData(true);
      },
      //查询条件重置
      handleQueryReset() {
        this.$refs.queryForm.resetFields();
        this.queryForm.requestTime = [];
        this.queryForm.query.requestTimeStart = "";
        this.queryForm.query.requestTimeEnd = "";
        this.getListData(true);
      },
      //删除
      handleDelete(row) {
        this.deleteById({
          id: row && row.id ? row.id : this.table.selections[0].id,
        });
      },
      //导出CSV
      handleCSVExport() {
        const filterVal = [
          {
            prop: "username",
            label: "用户名",
          },
          {
            prop: "userLocation",
            label: "用户归属地",
          },
          {
            prop: "title",
            label: "操作",
          },
          {
            prop: "requestUrl",
            label: "请求资源",
          },
          {
            prop: "requestTime",
            label: "请求时间",
          },
        ];
        ExportCSV(this.table.items, filterVal, "系统日志导出");
      },
      //查询列表数据
      async getListData(reload = false) {
        if (reload === true) {
          this.queryForm.query.page = 1;
        }
        if (this.queryForm.requestTime.length) {
          this.queryForm.query.requestTimeStart = this.queryForm.requestTime[0];
          this.queryForm.query.requestTimeEnd = this.queryForm.requestTime[1];
        }
        this.table.loading = true;
        getSyslogList(this.queryForm.query)
          .then((res) => {
            this.table.items = res.data.records;
            this.table.total = Number(res.data.totalCount);
            this.table.loading = false;
          })
          .catch((err) => {
            this.table.loading = false;
          });
      },
      deleteById(param) {
        if (param && param.id) {
          doSyslogDelete(param.id)
            .then((res) => {
              this.$baseNotify(res.msg);
              this.getListData();
            })
            .catch((err) => {});
        } else {
          this.$baseNotify("错误:id is null");
        }
      },
      handleBatchDelete() {
        this.$baseConfirm(
          "即将删除:" + this.table.selections.length + " 条数据，点击确定删除",
          "删除吗？",
          () => {
            if (this.table.selections.length) {
              let ids = [];
              this.table.selections.forEach((item) => {
                ids.push(item.id);
              });
              doSyslogDeleteBatch(ids)
                .then((res) => {
                  this.$baseNotify(res.msg);
                  this.getListData();
                })
                .catch((err) => {});
            } else {
              this.$baseNotify("请选择要删除的数据");
            }
          }
        );
      },
    },
  };
</script>
