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
        <el-form-item label="名字" prop="username">
          <el-input
            v-model="queryForm.query.username"
            placeholder="请输入名字"
            clearable
            @keyup.enter.native="handleQuery"
            @clear="handleQuery"
          />
        </el-form-item>
        <el-form-item label="是否锁定" prop="locked">
          <el-select
            v-model="queryForm.query.locked"
            placeholder="是否锁定?"
            @change="handleQuery"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="锁定" :value="true"></el-option>
            <el-option label="未锁定" :value="false"></el-option>
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
          <tips content="重置搜索条件为默认"></tips>
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
      :show-export-excel-btn="false"
      :show-delete-btn="false"
      @save="handleSave"
      @update="handleUpdate"
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
        <el-table-column label="序号">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="账号" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag
              v-if="$store.state.user.username === row.username"
              size="mini"
              effect="dark"
            >
              <span
                v-html="highLightText(queryForm.query.username, row.username)"
              ></span>
            </el-tag>
            <span
              v-else
              v-html="highLightText(queryForm.query.username, row.username)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" show-overflow-tooltip>
          <template #default="{ row }">
            <span
              v-html="highLightText(queryForm.query.username, row.realName)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cellPhone"
          label="手机号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="nickName" label="昵称" show-overflow-tooltip>
          <template #default="{ row }">
            <span
              v-html="highLightText(queryForm.query.username, row.nickName)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column prop="locked" label="锁定?" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag
              size="mini"
              effect="dark"
              :type="row.locked ? 'danger' : 'success'"
            >
              {{ row.locked ? "锁定" : "正常" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          show-overflow-tooltip
          :formatter="
            (row, col, value) => getStoredDictLabelByValue('gender', value)
          "
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="text" @click="handleUpdate(row)">修改</el-button>
            <el-button
              v-if="$store.state.user.username !== row.username"
              type="text"
              @click="resetPassword(row)"
            >
              重置密码
            </el-button>
            <el-popconfirm
              v-if="$store.state.user.username !== row.username"
              icon="el-icon-info"
              icon-color="red"
              :title="row.locked ? '确定解锁用户吗?' : '确定锁定用户吗?'"
              class="ml10"
              @confirm="handleLock(row)"
            >
              <el-button
                slot="reference"
                v-permission="['sys:user:save']"
                type="text"
                :class="[row.locked ? 'color-success' : 'color-danger']"
              >
                {{ row.locked ? "解锁" : "锁定" }}
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
  </div>
</template>

<script>
  import {
    getUserList,
    changeUserLocked,
    resetUserPassword,
  } from "@/api/sys/user";
  import Save from "./Save";
  import Update from "./Update";
  import Tips from "@c/Tips";
  export default {
    name: "SysUser",
    //组件注册
    components: { Save, Update, Tips },
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
            username: "",
            locked: "",
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
    created() {},
    //挂载完成
    mounted() {
      this.getListData();
    },
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
      handleSave() {
        this.$refs["save"].show();
      },
      //修改
      handleUpdate(row) {
        let id, title;
        if (row && row.id) {
          id = row.id;
          title = row.username;
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
      handleLock(row) {
        if (row && row.id) {
          changeUserLocked({
            id: row.id,
            locked: !row.locked,
          }).then((res) => {
            this.$baseNotify(res.msg);
            this.getListData();
          });
        } else {
          this.$baseNotify("错误:id is null");
        }
      },
      resetPassword(row) {
        let me = this;
        if (row && row.id) {
          me.$prompt("请输入新密码", `重置用户: [ ${row.username}]  的密码`, {
            closeOnPressEscape: false,
            closeOnClickModal: false,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputPlaceholder: "请输入新密码",
            // inputPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/,
            inputErrorMessage:
              "密码至少6-16个字符，至少1个大写字母，1个小写字母和1个数字",
          })
            .then(({ value }) => {
              resetUserPassword({
                id: row.id,
                password: value.trim(),
              }).then((res) => {
                me.$SAlert(res.msg);
                me.getListData();
              });
            })
            .catch(() => {});
        } else {
          this.$baseNotify("错误:id is null");
        }
      },
      //查询列表数据
      getListData(reload = false) {
        this.table.loading = false;
        if (reload === true) {
          this.queryForm.query.page = 1;
        }
        this.table.loading = true;
        getUserList(this.queryForm.query)
          .then((res) => {
            this.table.items = res.data.records;
            this.table.total = Number(res.data.totalCount);
            this.table.loading = false;
          })
          .catch((err) => {
            this.table.loading = false;
          });
      },
    },
  };
</script>
