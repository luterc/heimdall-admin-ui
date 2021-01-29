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
  <el-row v-if="isHidden" class="title-bar">
    <el-col>
      <div class="title-text">{{ title }}</div>
      <p class="title-content">{{ content }}</p>
    </el-col>
  </el-row>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    //name: "index",
    //组件注册
    components: {},
    //指令注册
    directives: {},
    props: {
      title: {
        type: String,
        required: false,
        default() {
          return "";
        },
      },
      content: {
        type: String,
        required: false,
        default() {
          return "";
        },
      },
    },
    data() {
      //数据
      return {};
    },
    computed: {
      //获取tabs bar是否开启，如果没开启，则显示titlebar
      ...mapGetters({
        tabsBar: "settings/tabsBar",
      }),
      //当title和content只要有一个不空
      isHidden() {
        //meta中，title 和remarks 只要有一个不空
        let show =
          (this.title && this.title.length > 0) ||
          (this.content && this.content.length > 0);
        //并且当前没开启tabsBar
        return this.tabsBar !== "true" && show;
      },
    },
    //方法
    methods: {},
  };
</script>
<style lang="scss" scoped>
  //@import url(); 引入css类
  .title-bar {
    background: $base-color-white;
    margin: 2px 0 $small-padding 0;
    padding: $big-padding;
    border-bottom: 1px solid #e8eaec;

    .title-text {
      display: inline-block;
      color: #17233d;
      font-weight: bold;
      font-size: $base-font-size-bigger;
    }

    .title-content {
      margin-bottom: $base-padding;
      -webkit-box-flex: 1;
      -ms-flex: auto;
      flex: auto;
      text-align: left;
      display: -webkit-box;
      overflow: hidden;
      font-size: $base-font-size-default;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1;
    }
  }
</style>
