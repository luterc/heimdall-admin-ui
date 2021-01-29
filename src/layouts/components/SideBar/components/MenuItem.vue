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
  <el-menu-item :index="handlePath(routeChildren.path)" @click="handleLink">
    <font-icon
      v-if="routeChildren.meta.icon"
      :icon="[routeChildren.meta.icon]"
      class="menu-icon"
    />
    <!--    采用后端返回的title-->
    <!--    <span>{{ routeChildren.title || $t(`router.` + routeChildren.name) }}</span>-->
    <span>{{ $t(`router.` + routeChildren.name) }}</span>
    <el-tag
      v-if="routeChildren.meta && routeChildren.meta.badge"
      type="danger"
      effect="dark"
    >
      {{ routeChildren.meta.badge }}
    </el-tag>
  </el-menu-item>
</template>

<script>
  import { isExternal } from "@/utils/validate";
  import path from "path";
  export default {
    name: "MenuItem",
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
      handlePath(routePath) {
        if (isExternal(routePath)) {
          return routePath;
        }
        if (isExternal(this.fullPath)) {
          return this.fullPath;
        }
        return path.resolve(this.fullPath, routePath);
      },
      handleLink() {
        const routePath = this.routeChildren.path;
        const target = this.routeChildren.meta.target;

        if (target === "_blank") {
          if (isExternal(routePath)) {
            window.open(routePath);
          } else if (isExternal(this.fullPath)) {
            window.open(this.fullPath);
          } else if (
            this.$route.path !== path.resolve(this.fullPath, routePath)
          ) {
            let routeData = this.$router.resolve(
              path.resolve(this.fullPath, routePath)
            );
            window.open(routeData.href);
          }
        } else {
          if (isExternal(routePath)) {
            window.location.href = routePath;
          } else if (isExternal(this.fullPath)) {
            window.location.href = this.fullPath;
          } else if (
            this.$route.path !== path.resolve(this.fullPath, routePath)
          ) {
            this.$router.push(path.resolve(this.fullPath, routePath));
          }
        }
      },
    },
  };
</script>
