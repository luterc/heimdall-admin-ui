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
  <el-submenu
    ref="subMenu"
    :index="handlePath(item.path)"
    :popper-append-to-body="false"
  >
    <template slot="title">
      <font-icon
        v-if="item.meta && item.meta.icon"
        :icon="['fas ', item.meta.icon]"
        class="icon"
      />
      <!--      采用后端返回的title-->
      <!--      <span>{{ item.title || $t(`router.` + item.name) }}</span>-->
      <span>{{ $t(`router.` + item.name) }}</span>
    </template>
    <slot></slot>
  </el-submenu>
</template>

<script>
  import { isExternal } from "@/utils/validate";
  import path from "path";

  export default {
    name: "Submenu",
    props: {
      routeChildren: {
        type: Object,
        default() {
          return null;
        },
      },
      item: {
        type: Object,
        default() {
          return null;
        },
      },
      fullPath: {
        type: String,
        default: "",
      },
    },
    methods: {
      /**
       * path处理
       * @param routePath
       * @return {*|P|P|Promise<void>|Promise<string>|string}
       */
      handlePath(routePath) {
        if (isExternal(routePath)) {
          return routePath;
        }
        if (isExternal(this.fullPath)) {
          return this.fullPath;
        }
        return path.resolve(this.fullPath, routePath);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .icon {
    padding-right: $base-padding;
  }
</style>
