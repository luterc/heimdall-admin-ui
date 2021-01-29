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
    <el-row class="json-table-bar">
      <el-col :span="leftSpan">
        <slot name="left"></slot>
      </el-col>
      <el-col :span="rightSpan">
        <div class="json-table-bar-right hidden-sm-and-down">
          <slot name="right"></slot>
          <el-button
            v-if="showRefresh"
            circle
            icon="el-icon-refresh"
            @click="onRefresh"
          />
          <el-popover placement="bottom" width="30" trigger="hover">
            <el-checkbox-group v-model="checkedCols">
              <el-checkbox
                v-for="col in checkOptions"
                :key="col.prop"
                class="vertical-checkbox"
                :label="col.prop"
              >
                {{ col.label }}
              </el-checkbox>
            </el-checkbox-group>
            <el-button slot="reference" class="ml10" circle>
              <i class="fas fa-columns"></i>
            </el-button>
          </el-popover>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table v-bind="$attrs" v-on="$listeners">
          <el-table-column
            v-if="showSelection"
            type="selection"
          ></el-table-column>
          <el-table-column v-if="showSeq" :label="seqLabel" min-width="100">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="col in tableColumns"
            :key="col.prop"
            :prop="col.prop"
            :show-overflow-tooltip="col.tooltip && col.tooltip === true"
            :label="col.label"
            :min-width="col.width + ''"
            :sortable="col.sortable && col.sortable === true"
            :formatter="col.formatter"
          />
          <slot name="actions"></slot>
        </el-table>
        <slot name="pagination">这是分页</slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "JsonTable",
    //组件注册
    components: {},
    //指令注册
    directives: {},
    //参数
    props: {
      leftSpan: {
        type: Number,
        default() {
          return 20;
        },
        validate: (c) => {
          return c && c < 25;
        },
      },
      showSeq: {
        type: Boolean,
        required: false,
        default() {
          return true;
        },
      },
      showSelection: {
        type: Boolean,
        required: false,
        default() {
          return false;
        },
      },
      showRefresh: {
        type: Boolean,
        required: false,
        default() {
          return true;
        },
      },
      seqLabel: {
        type: String,
        required: false,
        default() {
          return "序号";
        },
      },
      columns: {
        type: Array,
        required: true,
        default() {
          return [];
        },
        validate: (c) => {
          return !c || !c.length;
        },
      },
    },
    data() {
      //数据
      return {
        checkOptions: [],
        checkedCols: [],
        btns: {},
      };
    },
    //计算属性
    computed: {
      rightSpan() {
        if (this.leftSpan && this.leftSpan < 25) return 24 - this.leftSpan;
        else return 0;
      },
      tableColumns() {
        if (this.checkedCols.length) {
          return this.columns.filter((item) =>
            this.checkedCols.some((ele) => ele === item.prop)
          );
        }
        return [];
      },
    },
    //监听属性
    watch: {},
    //创建完成
    created() {
      this.checkOptions = this.columns.filter((item) =>
        item.hasOwnProperty("hidden")
      );
      this.checkedCols = this.columns.map((item) => {
        if (!item.hasOwnProperty("hidden") || !item.hidden) {
          return item.prop + "";
        }
      });
    },
    //挂载完成
    mounted() {},
    //创建之前
    beforeCreate() {},
    //挂载之前
    beforeMount() {},
    //更新之前
    beforeUpdate() {},
    //更新之后
    updated() {},
    //销毁之前
    beforeDestroy() {},
    //销毁完成
    destroyed() {},
    //页面激活,
    activated() {},
    //方法
    methods: {
      onRefresh() {
        this.$emit("refresh-data");
      },
    },
  };
</script>
<style lang="scss" scoped>
  //@import url(); 引入css类
  .vertical-checkbox {
    display: block;
    padding-top: 10px;
  }
  .json-table-bar {
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
