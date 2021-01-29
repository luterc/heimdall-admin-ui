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
  <el-tooltip v-bind="$attrs" v-on="$listeners">
    <font-icon
      style="margin-left: 5px; font-size: 10px"
      color="gray"
      icon="fas fa-info-circle"
    ></font-icon>
  </el-tooltip>
</template>

<script>
  //组件引入:import 《组件名称》 from '《组件路径》';
  export default {
    name: "TipsIndex",
  };
</script>
<style lang="scss" scoped>
  //@import url(); 引入css类
</style>
