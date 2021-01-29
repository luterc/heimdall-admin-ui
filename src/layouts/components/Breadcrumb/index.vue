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
  <el-breadcrumb class="breadcrumb-container" separator="/">
    <el-breadcrumb-item v-for="item in levelList" :key="item.path">
      <span>
        <font-icon
          v-if="item.meta.icon"
          :icon="['fas', item.meta.icon]"
        ></font-icon>
        {{ $t("router." + item.name) }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: "Breadcrumb",
    data() {
      return {
        levelList: null,
      };
    },
    watch: {
      $route() {
        this.getBreadcrumb();
      },
    },
    created() {
      this.getBreadcrumb();
    },
    methods: {
      getBreadcrumb() {
        let matched = this.$route.matched.filter((item) => item.name);
        this.levelList = matched.filter((item) => item.name);
      },
      isIndex(route) {
        const name = route && route.name;
        if (!name) {
          return false;
        }
        return name.trim().toLocaleLowerCase() === "Index".toLocaleLowerCase();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .breadcrumb-container {
    display: inline-block;
    font-size: $base-font-size-default;
    line-height: 50px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
</style>
