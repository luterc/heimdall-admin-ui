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
  <div v-if="loaded" class="main-wrapper" :class="classObj">
    <div
      v-if="'horizontal' === layout"
      class="layout-container-horizontal"
      :class="{
        fixed: header === 'fixed',
        'no-tabs-bar': tabsBar === 'false' || tabsBar === false,
      }"
    >
      <div :class="header === 'fixed' ? 'fixed-header' : ''">
        <top-bar></top-bar>
        <div
          v-if="tabsBar === 'true' || tabsBar === true"
          :class="{ 'tag-view-show': tabsBar }"
        >
          <div class="main">
            <tabs-bar></tabs-bar>
          </div>
        </div>
      </div>
      <div class="main main-padding">
        <notice :items="noticeItems"></notice>
        <app-main></app-main>
      </div>
    </div>
    <div
      v-else
      class="layout-container-vertical"
      :class="{
        fixed: header === 'fixed',
        'no-tabs-bar': tabsBar === 'false' || tabsBar === false,
      }"
    >
      <div
        v-if="device === 'mobile' && collapse === false"
        class="mask"
        @click="handleFoldSideBar"
      />
      <side-bar></side-bar>
      <div class="main" :class="collapse ? 'is-collapse-main' : ''">
        <div :class="header === 'fixed' ? 'fixed-header' : ''">
          <nav-bar></nav-bar>
          <tabs-bar v-if="tabsBar === 'true' || tabsBar === true" />
        </div>
        <notice :items="noticeItems"></notice>
        <app-main></app-main>
      </div>
    </div>
    <!--    右侧悬浮设置弹层-->
    <right-panel v-show="showSetting">
      <settings />
    </right-panel>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
  import {
    Notice,
    AppMain,
    NavBar,
    SideBar,
    TabsBar,
    TopBar,
  } from "./components";
  import { mapActions, mapGetters } from "vuex";
  import { tokenName, showSetting } from "@/config/settings";
  import { getUserNotices } from "@/api/sys/user";
  ///右侧悬浮按钮设置入口
  import settings from "./components/Settings/index";
  import RightPanel from "./components/SettingPanel/index";

  export default {
    name: "Layout",
    components: {
      Notice,
      TopBar,
      NavBar,
      SideBar,
      AppMain,
      TabsBar,
      settings,
      RightPanel,
    },
    data() {
      return {
        oldLayout: "",
        //顶部通知数据
        noticeItems: [],
        //设置页面是否加载
        loaded: false,
      };
    },
    computed: {
      ...mapGetters({
        layout: "settings/layout",
        tabsBar: "settings/tabsBar",
        collapse: "settings/collapse",
        header: "settings/header",
        device: "settings/device",
      }),
      classObj() {
        return {
          mobile: this.device === "mobile",
        };
      },
      showSetting() {
        return showSetting;
      },
    },
    beforeCreate() {},
    beforeMount() {
      window.addEventListener("resize", this.handleResize);
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.handleResize);
    },
    mounted() {
      console.log("首页mounted...");
      this.oldLayout = this.layout;
      const userAgent = navigator.userAgent;
      if (userAgent.includes("Juejin")) {
        this.$baseAlert(
          "不支持在掘金内置浏览器演示，请手动复制以下地址到浏览器中"
        );
        return;
      }
      const isMobile = this.handleIsMobile();
      if (isMobile) {
        if (isMobile) {
          //横向布局时如果是手机端访问那么改成纵向版
          this.$store.dispatch("settings/changeLayout", "vertical");
        } else {
          this.$store.dispatch("settings/changeLayout", this.oldLayout);
        }

        this.$store.dispatch("settings/toggleDevice", "mobile");
        setTimeout(() => {
          this.$store.dispatch("settings/foldSideBar");
        }, 1000);
      } else {
        this.$store.dispatch("settings/openSideBar");
      }
      this.$nextTick(() => {
        window.addEventListener(
          "storage",
          (e) => {
            if (e.key === tokenName || e.key === null) window.location.reload();
            if (e.key === tokenName && e.value === null)
              window.location.reload();
          },
          false
        );
      });
    },
    created() {
      console.log("首页created...");
      let me = this;
      //获取全局字典值，字典值加载到vuex后，开始渲染整个页面，确保后续页面可以直接使用vuex中的字典值
      //如果没实现，可以先直接放行
      me.getDictData();
      // //获取通知消息
      setTimeout(function () {
        me.getMessageListData();
      }, 3000);
    },
    methods: {
      ...mapActions({
        handleFoldSideBar: "settings/foldSideBar",
      }),
      handleIsMobile() {
        return document.body.getBoundingClientRect().width - 1 < 992;
      },
      handleResize() {
        if (!document.hidden) {
          const isMobile = this.handleIsMobile();
          if (isMobile) {
            //横向布局时如果是手机端访问那么改成纵向版
            this.$store.dispatch("settings/changeLayout", "vertical");
          } else {
            this.$store.dispatch("settings/changeLayout", this.oldLayout);
          }
          const width = document.documentElement.clientWidth;
          if (width && width <= 1000) {
            this.$store.dispatch("settings/foldSideBar");
            // this.$store.dispatch("settings/changeTabsBar", false);
          } else {
            // this.$store.dispatch("settings/changeTabsBar", true);
            this.$store.dispatch("settings/openSideBar");
          }
          this.$store.dispatch(
            "settings/toggleDevice",
            isMobile ? "mobile" : "desktop"
          );
        }
      },
      /**
       * 获取通知
       * @returns {Promise<void>}
       */
      async getMessageListData() {
        const { data } = await getUserNotices();
        this.noticeItems = data.records;
      },
      /**
       * 加载字典数据，不论成功与否，页面都继续加载
       */
      getDictData() {
        let loadingInstance = this.$baseLoading(1, "加载中，请稍后...");
        this.$store
          .dispatch("dict/getDictData")
          .then((res) => {
            this.loaded = true;
            if (loadingInstance) loadingInstance.close();
          })
          .catch((err) => {
            console.error("加载字典数据失败.", err.msg);
            this.loaded = true;
            if (loadingInstance) loadingInstance.close();
          });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @mixin fix-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: $base-z-index;
    width: 100%;
  }

  .main-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    .layout-container-horizontal {
      position: relative;

      &.fixed {
        padding-top: calc(#{$base-top-bar-height} + #{$base-tabs-bar-height});
      }

      &.fixed.no-tabs-bar {
        padding-top: $base-top-bar-height;
      }

      ::v-deep {
        .main {
          width: 99%;
          margin: auto;
        }

        .fixed-header {
          @include fix-header;
        }

        .tag-view-show {
          background: $base-color-white;
          box-shadow: $base-box-shadow;
        }

        .nav-bar-container {
          .language {
            color: $base-color-white;
          }

          .fold-unfold {
            display: none;
          }
        }

        .main-padding {
          .app-main-container {
            margin-top: $base-padding;
            margin-bottom: $base-padding;
            background: $base-color-white;
          }
        }
      }
    }

    .layout-container-vertical {
      position: relative;

      .mask {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: $base-z-index - 1;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background: #000;
        opacity: 0.5;
      }

      &.fixed {
        padding-top: calc(#{$base-nav-bar-height} + #{$base-tabs-bar-height});
      }

      &.fixed.no-tabs-bar {
        padding-top: $base-nav-bar-height;
      }

      .main {
        position: relative;
        min-height: 100%;
        margin-left: $base-left-menu-width;
        background: $base-backgound-color;
        transition: $base-transition;

        ::v-deep {
          .fixed-header {
            @include fix-header;
            left: $base-left-menu-width;
            width: $base-right-content-width;
            transition: $base-transition;
          }

          .nav-bar-container {
            position: relative;
            box-sizing: border-box;
          }

          .tabs-bar-container {
            box-sizing: border-box;
            background-color: $base-backgound-color;
          }

          .app-main-container {
            /*width: calc(100% - #{$base-padding});*/
            width: 100%;
            /*margin: 5px auto;*/
            border-radius: $base-border-radius;
          }
        }

        &.is-collapse-main {
          margin-left: $base-left-menu-width-min;

          ::v-deep {
            .fixed-header {
              left: $base-left-menu-width-min;
              width: calc(100% - 55px);
            }
          }
        }
      }
    }

    /* 手机端开始 */
    &.mobile {
      ::v-deep {
        .el-pager,
        .el-pagination__jump {
          display: none;
        }

        .layout-container-vertical {
          .el-scrollbar.side-bar-container.is-collapse {
            width: 0;
          }

          .main {
            width: 100%;
            margin-left: 0;
          }
        }

        .main {
          .fixed-header {
            left: 0 !important;
            width: 100% !important;
          }
        }
      }
    }

    /* 手机端结束 */
  }
</style>
