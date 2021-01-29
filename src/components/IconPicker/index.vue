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
  <el-popover
    ref="popover"
    v-model="visible"
    :width="popoverWidth"
    placement="bottom"
    trigger="click"
    @show="onTypeChange"
  >
    <el-input
      ref="input"
      slot="reference"
      readonly
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-if="icon.length" slot="prepend">
        <font-icon :icon="icon" :color="color" />
      </template>
    </el-input>

    <el-form inline label-width="0" @submit.native.prevent>
      <el-form-item>
        <el-select
          v-model="pager.type"
          style="width: 110px"
          size="mini"
          placeholder="请选择"
          @change="onTypeChange"
        >
          <el-option
            v-for="(item, index) in icons"
            :key="index"
            :label="item.title"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="pager.name"
          clearable
          size="mini"
          @clear="onClear"
          @change="filterIcons(true)"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          native-type="submit"
          type="primary"
          @click="filterIcons(true)"
        >
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <el-scrollbar
      ref="e-scrollbar"
      tag="div"
      wrap-class="el-select-dropdown__wrap"
      view-class="el-select-dropdown__list"
      class="is-empty"
    >
      <ul
        v-if="table.items && table.items.length > 0"
        ref="fasIconList"
        class="fas-icon-list"
      >
        <li
          v-for="(item, index) in table.items"
          :key="index"
          :title="item"
          @click="selectIcon(item)"
        >
          <font-icon :icon="item" :color="color" />
        </li>
      </ul>
      <span v-else class="fas-no-data">暂无图标</span>
    </el-scrollbar>
    <el-pagination
      small
      hide-on-single-page
      :background="true"
      :current-page="pager.page"
      :page-size="pager.size"
      layout="total,prev, pager, next"
      :total="pager.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </el-popover>
</template>

<script>
  import { off } from "@/utils";
  import icons from "./IconsData";

  export default {
    //name: "index",
    //组件注册
    components: {},
    //指令注册
    directives: {},
    props: {
      width: {
        type: Number,
        default() {
          return -1;
        },
      },
      color: {
        type: String,
        default() {
          return "black";
        },
      },
    },
    data() {
      //数据
      return {
        visible: false,
        icon: "",
        icons: icons,
        pager: {
          page: 1,
          size: 50,
          total: 0,
          type: "regular",
          name: "",
        },
        table: {
          items: [],
        },
        popoverWidth: 300,
      };
    },
    //计算属性
    computed: {},
    //创建完成
    created() {},
    //挂载完成
    mounted() {
      this.updateWidth();
      this.onTypeChange();
    },
    //创建之前
    beforeCreate() {},
    //挂载之前
    beforeMount() {},
    //更新之前
    beforeUpdate() {},
    //更新之后
    updated() {},
    //销毁之前
    beforeDestroy() {
      off(document, "mouseup", this.popoverHideFun);
    },
    //销毁完成
    destroyed() {},
    //页面激活,
    activated() {},
    //方法
    methods: {
      onTypeChange() {
        this.pager.name = "";
        this.filterIcons(true);
      },
      onClear() {
        this.pager.name = "";
        this.filterIcons(true);
      },
      handleSizeChange(val) {
        this.pager.size = val;
        this.filterIcons();
      },
      handleCurrentChange(val) {
        this.pager.page = val;
        this.filterIcons();
      },
      queryData() {
        this.filterIcons(true);
      },
      async filterIcons(reload = false) {
        if (reload) {
          this.pager.page = 1;
        }
        const { name, page = 1, size = 72, type = "" } = this.pager;
        let icons = this.icons.find((d) => d.name === type);
        if (icons && icons.items && icons.items.length) {
          let mockList = icons.items.filter((item) => {
            return !(name && item.indexOf(name) < 0);
          });
          this.table.items = mockList.filter(
            (item, index) => index < size * page && index >= size * (page - 1)
          );
          this.pager.total = mockList.length;
        }
      },
      selectIcon(row) {
        this.icon = row;
        this.visible = false;
        this.$emit("input", row);
        setTimeout(() => {
          this.$refs.popover.updatePopper();
        }, 50);
      },
      popoverHideFun(e) {
        let path = e.path || (e.composedPath && e.composedPath());
        let isInter = path.some((list) => {
          return (
            list.className &&
            list.className.toString().indexOf("fas-icon-list") !== -1
          );
        });
        if (!isInter) {
          this.visible = false;
        }
      },
      updateWidth() {
        this.$nextTick(() => {
          if (this.width === -1) {
            this.popoverWidth =
              this.$refs.input.$el.getBoundingClientRect().width - 26;
          } else {
            this.popoverWidth = this.width;
          }
          this.$refs["e-scrollbar"].wrap.scrollTop =
            this.$refs.input.$el.getBoundingClientRect().height - 35;
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .fas-icon-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .fas-icon-list li {
    width: 30px;
    height: 30px;
    margin: 5px;
  }

  .fas-icon-list li i {
    font-size: 20px;
    cursor: pointer;
    margin: 5px;

    &:hover {
      font-size: 26px;
      border: #2932e1 1px solid;
    }
  }
</style>
