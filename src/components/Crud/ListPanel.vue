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
  <el-row class="list-panel">
    <el-col>
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
  //组件引入:import 《组件名称》 from '《组件路径》';
  export default {
    name: "ListPanel",
    //组件注册
    components: {},
    //指令注册
    directives: {},
    data() {
      //数据
      return {};
    },
    //计算属性
    computed: {},
    //监听属性
    watch: {},
    //创建完成
    created() {},
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
    methods: {},
  };
</script>
<style lang="scss" scoped>
  //@import url(); 引入css类
  .list-panel {
  }
</style>
