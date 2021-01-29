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
  <el-scrollbar class="side-bar-container" :class="{ 'is-collapse': collapse }">
    <logo />
    <el-menu
      :background-color="variables['menu-background']"
      :text-color="variables['menu-color']"
      :active-text-color="variables['menu-color-active']"
      :default-active="activeMenu"
      :collapse="collapse"
      :collapse-transition="true"
      :default-openeds="defaultOpens"
      :unique-opened="uniqueOpened"
      mode="vertical"
    >
      <template v-for="route in routes">
        <side-bar-item
          :key="route.path"
          :full-path="route.path"
          :item="route"
        ></side-bar-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>
<script>
  import { Logo } from "@/layouts/components";
  import SideBarItem from "./components/SideBarItem";
  import variables from "@/styles/variables.scss";
  import { mapGetters } from "vuex";
  import { defaultOpened, uniqueOpened } from "@/config/settings";

  export default {
    name: "SideBar",
    components: { SideBarItem, Logo },
    data() {
      return {
        uniqueOpened,
      };
    },
    computed: {
      ...mapGetters({
        collapse: "settings/collapse",
        routes: "routes/routes",
      }),
      ////设置默认打开的菜单节点
      defaultOpens() {
        if (this.collapse) {
        }
        return defaultOpened;
      },
      activeMenu() {
        const route = this.$route;
        const { meta, path } = route;
        if (meta.activeMenu) {
          return meta.activeMenu;
        }
        return path;
      },
      variables() {
        return variables;
      },
    },
  };
</script>
<style lang="scss" scoped>
  @mixin active {
    &:hover {
      color: $base-color-white;
    }

    &.is-active {
      color: $base-color-white;
    }
  }

  .side-bar-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: $base-z-index;
    width: $base-left-menu-width;
    height: 100vh;
    overflow: hidden;
    transition: width $base-transition-time;

    &.is-collapse {
      width: $base-left-menu-width-min;
      border-right: 0;

      ::v-deep {
        .el-menu {
          transition: width $base-transition-time;
        }

        .el-menu-item,
        .el-submenu__title {
          text-overflow: clip;
        }

        .el-menu--collapse {
          border-right: 0;

          .el-submenu__icon-arrow {
            margin-top: -3px;
          }
        }
      }
    }

    ::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-menu {
        border: 0;

        .menu-icon {
          padding-right: $base-padding;
          font-size: $base-font-size-default;
        }
      }

      .el-menu-item,
      .el-submenu__title {
        height: $base-menu-item-height;
        overflow: hidden;
        line-height: $base-menu-item-height;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }

      .el-menu-item {
        @include active;
      }
    }
  }
</style>
