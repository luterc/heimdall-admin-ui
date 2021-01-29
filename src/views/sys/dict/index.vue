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
  <div>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-card style="height: 79vh">
          <div slot="header" class="clearfix">
            <span>
              字典分类
              <small>(双击记录查看字典数据)</small>
            </span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleSave"
            >
              添加字典分类
            </el-button>
          </div>
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
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="handleQuery"
                >
                  {{ $t("buttons.searchText") }}
                </el-button>
                <el-button
                  type="success"
                  icon="el-icon-refresh"
                  @click="handleQueryReset"
                >
                  {{ $t("buttons.resetText") }}
                </el-button>
              </el-form-item>
            </el-form>
          </query-panel>
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
              @row-dblclick="onTableRowDbClick"
            >
              <el-table-column prop="name" label="名称" show-overflow-tooltip>
                <template #default="{ row }">
                  <span
                    v-html="highLightText(queryForm.query.name, row.name)"
                  ></span>
                </template>
              </el-table-column>
              <el-table-column
                prop="remarks"
                label="备注"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button type="text" @click="handleUpdate(row)">
                    修改
                  </el-button>
                  <el-popconfirm
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除吗？"
                    class="ml10"
                    @confirm="handleDelete(row)"
                  >
                    <el-button
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
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="height: 79vh">
          <div slot="header" class="clearfix">
            <span style="font-weight: 900">
              {{
                currentDictType
                  ? "选中分类:" + currentDictType.remarks
                  : "请选择分类"
              }}
            </span>
            <el-button
              v-show="currentDictType"
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleItemSave(currentDictType)"
            >
              添加字典项
            </el-button>
          </div>
          <!--        表格-->
          <el-table
            ref="itemTable"
            v-loading="dictItem.table.loading"
            element-loading-text="加载中,请稍后..."
            :data="dictItem.table.items"
            fit
            highlight-current-row
          >
            <el-table-column
              prop="label"
              label="显示"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="itemValue"
              label="字典值"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="seqNo"
              label="顺序"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="text" @click="handleItemUpdate(row)">
                  修改
                </el-button>
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
          <save ref="save" @ok="getListData(true)"></save>
          <item-save ref="itemSave" @ok="getDictItemListData()"></item-save>
          <update ref="update" @ok="getListData(true)"></update>
          <item-update
            ref="itemUpdate"
            @ok="getDictItemListData()"
          ></item-update>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getDictList, getItemListByTypeId } from "@/api/sys/dict";
  import Save from "./Save";
  import ItemSave from "./ItemSave";
  import Update from "./Update";
  import ItemUpdate from "./ItemUpdate";

  export default {
    name: "SysDict",
    //组件注册
    components: { ItemSave, ItemUpdate, Save, Update },
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
        dictItem: {
          table: {
            loading: false,
            //选中的记录
            selections: [],
            items: [],
            total: 0,
          },
          query: {
            ...this.$config.pager.default,
            typeId: "",
          },
        },
        currentDictType: "",
      };
    },
    mounted() {
      this.getListData(true);
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
      //字典分类表格row双击事件
      onTableRowDbClick(row) {
        this.currentDictType = row;
        this.dictItem.table.items = [];
        this.getDictItemListData();
      },
      //查询
      handleQuery() {
        this.getListData(true);
      },
      //查询条件重置
      handleQueryReset() {
        this.$refs["queryForm"].resetFields();
        this.getListData(true);
      },
      //新增
      handleSave() {
        this.$refs["save"].show();
      },
      //新增字典项
      handleItemSave(row) {
        this.$refs["itemSave"].show(row);
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
          title: "修改字典分类，标识:" + title,
          id: id,
        });
      },
      //修改
      handleItemUpdate(row) {
        let id, title;
        if (row && row.id) {
          id = row.id;
          title = row.label;
        } else {
          id = this.dictItem.table.selections[0].id;
          title = this.dictItem.table.selections[0].label;
        }
        if (!id) {
          this.$baseNotify("请选择要修改的记录");
          return;
        }
        this.$refs["itemUpdate"].show({
          title: `修改字典项显示值：${title}`,
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
      getListData(reload = false) {
        this.table.loading = true;
        if (reload === true) {
          this.queryForm.query.page = 1;
        }
        getDictList(this.queryForm.query)
          .then((res) => {
            this.table.items = res.data.records;
            this.table.total = Number(res.data.totalCount);
            this.table.loading = false;
          })
          .catch((err) => {
            this.table.loading = false;
          });
      },
      getDictItemListData() {
        this.dictItem.table.loading = true;
        getItemListByTypeId({
          typeId: this.currentDictType.id,
        })
          .then((res) => {
            this.dictItem.table.items = res.data;
            this.dictItem.table.loading = false;
          })
          .catch((err) => {
            this.dictItem.table.loading = false;
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
