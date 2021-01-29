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
  <el-row class="table-bar">
    <el-col :span="leftSpan">
      <el-button
        v-if="showSaveBtn"
        v-permission="savePerm"
        type="success"
        icon="el-icon-plus"
        @click="handleSave"
      >
        {{ $t("buttons.saveText") }}
      </el-button>
      <el-button
        v-if="showUpdateBtn"
        v-permission="updatePerm"
        class="hidden-sm-and-down"
        type="primary"
        icon="el-icon-edit"
        :disabled="selections.length !== 1"
        @click="handleUpdate"
      >
        {{ $t("buttons.updateText") }}
      </el-button>
      <el-button
        v-if="showDeleteBtn"
        v-permission="deletePerm"
        class="hidden-sm-and-down"
        type="danger"
        icon="el-icon-delete"
        :disabled="!selections.length"
        @click="handleDelete"
      >
        {{
          selections && selections.length > 0
            ? this.$t("buttons.deleteText") + "(" + selections.length + ")"
            : this.$t("buttons.deleteText")
        }}
      </el-button>
      <el-button
        v-if="showExportExcelBtn"
        v-permission="exportPerm"
        class="hidden-sm-and-down"
        type="warning"
        icon="el-icon-download"
        :loading="isExporting"
        :disabled="selections.length <= 0"
        @click="handleExcelExport"
      >
        {{
          isExporting
            ? $t("buttons.exportingText")
            : selections && selections.length > 0
            ? this.$t("buttons.exportExcelText") + "(" + selections.length + ")"
            : this.$t("buttons.exportExcelText")
        }}
      </el-button>
      <el-button
        v-if="showExportCsvBtn"
        v-permission="exportPerm"
        class="hidden-sm-and-down"
        type="warning"
        icon="el-icon-download"
        :disabled="selections.length <= 0"
        @click="handleCSVExport"
      >
        {{
          selections && selections.length > 0
            ? this.$t("buttons.exportCSVText") + "(" + selections.length + ")"
            : this.$t("buttons.exportCSVText")
        }}
      </el-button>
      <slot name="left"></slot>
    </el-col>
    <el-col :span="rightSpan">
      <div class="table-bar-right">
        <slot name="right"></slot>
        <el-tooltip
          v-if="showRefreshBtn"
          effect="dark"
          content="刷新数据"
          placement="bottom"
        >
          <el-button circle icon="el-icon-refresh" @click="handleRefresh" />
        </el-tooltip>
        <el-tooltip
          v-if="showToggleSearchBtn"
          :content="showSearch ? '隐藏搜索' : '显示搜索'"
          placement="bottom"
        >
          <el-button circle icon="el-icon-search" @click="handleToggleSearch" />
        </el-tooltip>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "ToolBar",
    //组件注册
    components: {},
    //指令注册
    props: {
      savePerm: {
        type: [Array, String],
        required: false,
        default() {
          return [];
        },
      },
      updatePerm: {
        type: [Array, String],
        required: false,
        default() {
          return [];
        },
      },
      deletePerm: {
        type: [Array, String],
        required: false,
        default() {
          return [];
        },
      },
      exportPerm: {
        type: [Array, String],
        required: false,
        default() {
          return [];
        },
      },
      selections: {
        type: Array,
        required: true,
        default() {
          return [];
        },
      },
      showSaveBtn: {
        type: Boolean,
        default() {
          return true;
        },
      },
      showUpdateBtn: {
        type: Boolean,
        default() {
          return false;
        },
      },
      showDeleteBtn: {
        type: Boolean,
        default() {
          return false;
        },
      },
      showExportCsvBtn: {
        type: Boolean,
        default() {
          return false;
        },
      },
      showExportExcelBtn: {
        type: Boolean,
        default() {
          return false;
        },
      },
      //是否显示刷新表格数据的按钮
      showRefreshBtn: {
        type: Boolean,
        default() {
          return true;
        },
      },
      //是否显示切换查询区域显示隐藏的按钮
      showToggleSearchBtn: {
        type: Boolean,
        default() {
          return true;
        },
      },
      //传进来控制显示tooltip文字的
      showSearch: {
        type: Boolean,
        default() {
          return true;
        },
      },
      isExporting: {
        type: Boolean,
        default() {
          return false;
        },
      },
      leftSpan: {
        type: Number,
        default() {
          return 20;
        },
      },
    },
    data() {
      //数据
      return {};
    },
    //计算属性
    computed: {
      rightSpan() {
        if (this.leftSpan && this.leftSpan < 25) return 24 - this.leftSpan;
        else return 0;
      },
    },
    //监听属性
    watch: {},
    //创建完成
    created() {},
    //挂载完成
    mounted() {},
    //页面激活,
    activated() {},
    //方法
    methods: {
      handleSave() {
        this.$emit("save");
      },
      handleUpdate() {
        this.$emit("update");
      },
      handleDelete() {
        this.$emit("delete");
      },
      handleRefresh() {
        this.$emit("refresh");
      },
      handleToggleSearch() {
        this.$emit("toggle-search");
      },
      handleCSVExport() {
        this.$emit("csv-export");
      },
      handleExcelExport() {
        this.$emit("excel-export");
      },
    },
  };
</script>
<style lang="scss" scoped>
  //@import url(); 引入css类
  .table-bar {
    margin: $base-margin 0;
    padding: 0 $base-padding;

    &-right {
      float: right;
      margin-right: $base-padding;
    }

    //就算el-col里没内容，也具有布局宽度
    .el-col {
      min-height: 1px;
    }
  }
</style>
