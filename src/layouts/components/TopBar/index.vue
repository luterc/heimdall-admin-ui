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
  <div class="top-bar-container">
    <div class="main">
      <el-row>
        <el-col :xl="5" :lg="5" :md="5" :sm="5" :xs="5">
          <logo />
        </el-col>
        <el-col :xl="12" :lg="12" :md="12" :sm="12" :xs="12">
          <el-menu
            :background-color="variables['menu-background']"
            :text-color="variables['menu-color']"
            :active-text-color="variables['menu-color-active']"
            :default-active="activeMenu"
            mode="horizontal"
            menu-trigger="hover"
          >
            <template v-for="route in routes">
              <side-bar-item
                v-if="!route.hidden"
                :key="route.path"
                :full-path="route.path"
                :item="route"
              ></side-bar-item>
            </template>
          </el-menu>
        </el-col>
        <el-col :xl="7" :lg="7" :md="7" :sm="7" :xs="7">
          <div class="right-panel">
            <error-log class="hover-effect mr20"></error-log>
            <tab-notice v-if="1 === 2"></tab-notice>
            <el-tooltip :content="$t('layout.navBar.fullscreen')">
              <full-screen-bar class="hover-effect"></full-screen-bar>
            </el-tooltip>
            <el-tooltip
              v-if="!showSetting"
              :content="$t('layout.navBar.theme')"
            >
              <theme-bar class="hover-effect"></theme-bar>
            </el-tooltip>
            <el-tooltip :content="$t('layout.navBar.language')">
              <language class="hover-effect"></language>
            </el-tooltip>
            <el-tooltip
              :content="$t('layout.navBar.size')"
              effect="dark"
              placement="bottom"
            >
              <size-select class="hover-effect" />
            </el-tooltip>

            <el-tooltip
              :content="$t('layout.navBar.refresh')"
              effect="dark"
              placement="bottom"
            >
              <span class="hover-effect mr10" @click="refreshRoute">
                <font-icon
                  :pulse="pulse"
                  :icon="['fas', 'fa-redo']"
                ></font-icon>
              </span>
            </el-tooltip>
            <avatar class="mr20"></avatar>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import SideBarItem from "../SideBar/components/SideBarItem";
  import Language from "@/layouts/components/Language";
  import variables from "@/styles/variables.scss";
  import { mapGetters } from "vuex";
  import ThemeBar from "@/layouts/components/ThemeBar";
  import { Avatar, ErrorLog, FullScreenBar, Logo } from "@/layouts/components";
  import SizeSelect from "@/layouts/components/SizeSelect";
  import TabNotice from "@/layouts/components/TabNotice";
  import { showSetting } from "@/config/settings";

  export default {
    components: {
      Avatar,
      ErrorLog,
      FullScreenBar,
      SideBarItem,
      Logo,
      Language,
      SizeSelect,
      ThemeBar,
      TabNotice,
    },
    data() {
      return {
        showSetting: showSetting,
        menuTrigger: "hover",
        pulse: false,
      };
    },
    computed: {
      ...mapGetters({
        routes: "routes/routes",
        visitedRoutes: "tabsBar/visitedRoutes",
      }),
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
    methods: {
      async refreshRoute() {
        this.$baseEventBus.$emit("reload-router-view");
        this.pulse = true;
        setTimeout(() => {
          this.pulse = false;
        }, 1000);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .top-bar-container {
    display: flex;
    align-items: center;
    justify-items: flex-end;
    height: $base-top-bar-height;

    .main {
      ::v-deep {
        .el-menu {
          &.el-menu--horizontal {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: $base-top-bar-height;
            border-bottom: 0 solid transparent !important;

            .el-menu-item,
            .el-submenu__title {
              padding: 0 15px;
            }

            @media only screen and (max-width: 767px) {
              .el-menu-item,
              .el-submenu__title {
                padding: 0 8px;
              }

              li:nth-child(4),
              li:nth-child(5) {
                display: none !important;
              }
            }

            > .el-menu-item {
              height: $base-top-bar-height;
              line-height: $base-top-bar-height;
            }

            > .el-submenu {
              .el-submenu__title {
                height: $base-top-bar-height;
                line-height: $base-top-bar-height;
              }
            }
          }

          svg {
            width: 1rem;
            margin-right: 3px;
          }

          &--horizontal {
            .el-menu {
              .el-menu-item,
              .el-submenu__title {
                height: $base-menu-item-height;
                line-height: $base-menu-item-height;
              }
            }

            .el-submenu,
            .el-menu-item {
              &.is-active {
                border-bottom: 0 solid transparent !important;

                .el-submenu__title {
                  border-bottom: 0 solid transparent !important;
                }
              }
            }

            > .el-menu-item {
              .el-tag {
                margin-top: calc(#{$base-top-bar-height} / 2 - 7.5px);
                margin-left: 5px;
              }

              @media only screen and (max-width: 1199px) {
                .el-tag {
                  display: none;
                }
              }

              &.is-active {
                border-bottom: 3px solid $base-color-blue !important;
              }
            }
          }
        }
      }
    }

    .right-panel {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: $base-top-bar-height;
      line-height: $base-nav-bar-height;

      &:focus {
        outline: none;
      }

      .hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        width: 36px;
        text-align: center;

        &:hover {
          background: rgba(62, 57, 57, 0.9);
        }
      }

      ::v-deep {
        .user-name {
          color: rgba($base-color-white, 0.9);
        }

        .user-name + i {
          color: rgba($base-color-white, 0.9);
        }

        svg {
          width: 1em;
          height: 1em;
          margin-right: 15px;
          font-size: $base-font-size-big;
          color: rgba($base-color-white, 0.9);
          cursor: pointer;
          fill: rgba($base-color-white, 0.9);
        }

        button {
          svg {
            margin-right: 0;
            color: rgba($base-color-white, 0.9);
            cursor: pointer;
            fill: rgba($base-color-white, 0.9);
          }
        }

        .el-badge {
          margin-right: 15px;

          > sup {
            top: 10px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
</style>
