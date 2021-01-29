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
  <div class="nav-bar-container">
    <el-row :gutter="15">
      <el-col :xs="4" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="left-panel">
          <span @click="handleCollapse">
            <i
              :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
              class="fold-unfold"
            ></i>
          </span>
          <breadcrumb v-if="breadcrumb" class="hidden-md-and-down" />
        </div>
      </el-col>
      <el-col :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="right-panel">
          <error-log class="hover-effect mr20"></error-log>
          <tab-notice v-if="1 === 2"></tab-notice>
          <el-tooltip :content="$t('layout.navBar.fullscreen')">
            <full-screen-bar class="hover-effect"></full-screen-bar>
          </el-tooltip>
          <el-tooltip v-if="!showSetting" :content="$t('layout.navBar.theme')">
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
            <span class="mr10 hover-effect" @click="refreshRoute">
              <font-icon :pulse="pulse" :icon="['fas', 'fa-redo']"></font-icon>
            </span>
          </el-tooltip>
          <avatar class="mr10"></avatar>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from "vuex";
  import Language from "@/layouts/components/Language";
  import TabNotice from "@/layouts/components/TabNotice";
  import SizeSelect from "@/layouts/components/SizeSelect";
  import ThemeBar from "@/layouts/components/ThemeBar/index.vue";
  import {
    Avatar,
    Breadcrumb,
    ErrorLog,
    FullScreenBar,
  } from "@/layouts/components";

  import { breadcrumb, showSetting } from "@/config/settings";

  export default {
    name: "NavBar",
    components: {
      Avatar,
      Breadcrumb,
      ErrorLog,
      FullScreenBar,
      Language,
      TabNotice,
      SizeSelect,
      ThemeBar,
    },
    data() {
      return {
        breadcrumb: breadcrumb,
        showSetting: showSetting,
        pulse: false,
      };
    },
    computed: {
      ...mapGetters({
        collapse: "settings/collapse",
        visitedRoutes: "tabsBar/visitedRoutes",
        device: "settings/device",
        routes: "routes/routes",
      }),
    },
    mounted() {},
    methods: {
      ...mapActions({
        changeCollapse: "settings/changeCollapse",
      }),
      handleCollapse() {
        this.changeCollapse();
      },
      async refreshRoute() {
        this.$baseEventBus.$emit("reload-routerview");
        this.pulse = true;
        setTimeout(() => {
          this.pulse = false;
        }, 500);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .nav-bar-container {
    position: relative;
    height: $base-nav-bar-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    overflow: hidden;
    user-select: none;
    background: $base-color-white;

    .left-panel {
      display: flex;
      align-items: center;
      justify-items: center;
      height: $base-nav-bar-height;

      .fold-unfold {
        font-size: 20px;
        cursor: pointer;
      }

      ::v-deep {
        .breadcrumb-container {
          margin-left: 10px;
        }
      }
    }

    .right-panel {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: flex-end;
      height: $base-nav-bar-height;
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
          background-color: $base-backgound-color;
        }
      }

      ::v-deep {
        svg {
          width: 1em;
          height: 1em;
          margin-right: 15px;
          font-size: $base-font-size-big;
          color: $base-color-gray;
          cursor: pointer;
          fill: $base-color-gray;
        }

        i {
          cursor: pointer;
        }

        button {
          svg {
            margin-right: 0;
            color: $base-color-white;
            cursor: pointer;
            fill: $base-color-white;
          }
        }

        .el-badge {
          > sup {
            top: 10px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
</style>
