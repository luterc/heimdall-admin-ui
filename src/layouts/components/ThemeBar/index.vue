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
  <div v-if="themeBar">
    <span
      style="height: 50px; width: 30px; display: inline-block"
      @click="handleOpenThemeBar"
    >
      <font-icon :icon="['fas', 'fa-palette']" />
    </span>
    <el-drawer
      :title="$t('layout.themeBar.title')"
      :visible.sync="drawerVisible"
      direction="rtl"
      :modal-append-to-body="false"
      size="320px"
    >
      <el-scrollbar style="height: 94vh; overflow: hidden">
        <div class="el-drawer__body">
          <el-form ref="form" :model="theme">
            <el-form-item :label="$t('layout.themeBar.theme.label')">
              <el-radio-group v-model="theme.name">
                <el-radio-button label="default">
                  {{ $t("layout.themeBar.theme.default") }}
                </el-radio-button>
                <el-radio-button label="green">
                  {{ $t("layout.themeBar.theme.green") }}
                </el-radio-button>
                <el-radio-button label="glory">
                  {{ $t("layout.themeBar.theme.glory") }}
                </el-radio-button>
                <el-radio-button label="blue">
                  {{ $t("layout.themeBar.theme.blue") }}
                </el-radio-button>
                <el-radio-button label="white">
                  {{ $t("layout.themeBar.theme.white") }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('layout.themeBar.color.label')">
              <color></color>
            </el-form-item>
            <el-form-item :label="$t('layout.themeBar.layout.label')">
              <el-radio-group v-model="theme.layout">
                <el-radio-button label="vertical">
                  {{ $t("layout.themeBar.layout.vertical") }}
                </el-radio-button>
                <el-radio-button label="horizontal">
                  {{ $t("layout.themeBar.layout.horizontal") }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('layout.themeBar.header.label')">
              <el-radio-group v-model="theme.header">
                <el-radio-button label="fixed">
                  {{ $t("layout.themeBar.header.fixed") }}
                </el-radio-button>
                <el-radio-button label="noFixed">
                  {{ $t("layout.themeBar.header.noFixed") }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('layout.themeBar.tabsBar.label')">
              <el-radio-group v-model="theme.tabsBar">
                <el-radio-button label="true">
                  {{ $t("layout.themeBar.tabsBar.show") }}
                </el-radio-button>
                <el-radio-button label="false">
                  {{ $t("layout.themeBar.tabsBar.hide") }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleSetDfaultTheme">
                {{ $t("layout.themeBar.reset") }}
              </el-button>
              <el-button type="primary" @click="handleSaveTheme">
                {{ $t("layout.themeBar.confirm") }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { layout as defaultLayout } from "@/config/settings";
  import Color from "../Color";

  export default {
    name: "ThemeBar",
    components: { Color },
    data() {
      return {
        drawerVisible: false,
        theme: {
          name: "default",
          layout: "",
          header: "",
          tabsBar: "",
        },
        colorName: "",
      };
    },
    computed: {
      ...mapGetters({
        layout: "settings/layout",
        header: "settings/header",
        tabsBar: "settings/tabsBar",
        themeBar: "settings/themeBar",
      }),
    },
    mounted() {},
    created() {
      //对外暴露打开事件
      this.$baseEventBus.$on("open-theme", () => {
        this.handleOpenThemeBar();
      });
      //默认主题
      const theme = localStorage.getItem("theme");
      if (null !== theme) {
        this.theme = JSON.parse(theme);
      } else {
        console.log("设置默认主题配置");
        this.theme.layout = this.layout;
        this.theme.header = this.header;
        this.theme.tabsBar = this.tabsBar;
        this.theme.name = "default";
      }

      this.handleSetTheme();
    },
    methods: {
      handleIsMobile() {
        return document.body.getBoundingClientRect().width - 1 < 992;
      },
      handleOpenThemeBar() {
        this.drawerVisible = true;
      },
      handleSetTheme() {
        //先从LS里拿到当前的主题名称
        let preThemeName;
        const theme = localStorage.getItem("theme");
        if (null !== theme) {
          preThemeName = JSON.parse(theme).name;
        }
        let { name, layout, header, tabsBar } = this.theme;
        localStorage.setItem(
          "theme",
          `{
            "name":"${name}",
            "layout":"${layout}",
            "header":"${header}",
            "tabsBar":"${tabsBar}"
          }`
        );
        if (!this.handleIsMobile()) {
          this.$store.dispatch("settings/changeLayout", layout);
        }
        this.$store.dispatch("settings/changeHeader", header);
        this.$store.dispatch("settings/changeTabsBar", tabsBar);
        document.getElementsByTagName("body")[0].className = `theme-${name}`;
        //如果发现主题发生变动了，则应用主题的颜色，否则不变
        if (preThemeName && preThemeName !== name) {
          console.log(`主题修改:原主题:${this.preTheme},现在主题:${name}`);
          console.log("themeBar,设置颜色:", this.getThemeColor());
          // this.$store.dispatch("settings/changeColorName", this.getThemeColor());
          this.$baseEventBus.$emit("change-color", this.getThemeColor());
        }
        this.drawerVisible = false;
      },
      //获取不同主题下的主色
      getThemeColor() {
        let color = "#409EFF";
        let { name } = this.theme;
        switch (name) {
          case "default":
            break;
          case "glory":
            color = "#f6ca9d";
            break;
          case "green":
            color = "#009688";
            break;
          case "white":
            color = "#2932e1";
            break;
          case "blue":
            color = "#2932e1";
            break;
        }
        return color;
      },
      handleSaveTheme() {
        this.handleSetTheme();
      },
      handleSetDfaultTheme() {
        let { name } = this.theme;
        document
          .getElementsByTagName("body")[0]
          .classList.remove(`theme-${name}`);
        localStorage.removeItem("theme");
        this.$refs["form"].resetFields();
        Object.assign(this.$data, this.$options.data());
        this.$store.dispatch("settings/changeLayout", defaultLayout);
        this.theme.name = "default";
        this.theme.layout = this.layout;
        this.theme.header = this.header;
        this.theme.tabsBar = this.tabsBar;
        //重设主题
        this.handleSetTheme();
        this.drawerVisible = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @mixin right-bar {
    position: fixed;
    right: 0;
    z-index: $base-z-index;
    width: 60px;
    min-height: 60px;
    text-align: center;
    cursor: pointer;
    background: $base-color-blue;
    border-radius: $base-border-radius;

    > div {
      padding-top: 10px;
      border-bottom: 0 !important;

      &:hover {
        opacity: 0.9;
      }

      & + div {
        border-top: 1px solid $base-color-white;
      }

      p {
        padding: 0;
        margin: 0;
        font-size: $base-font-size-small;
        line-height: 30px;
        color: $base-color-white;
      }
    }
  }

  .theme-bar-setting {
    @include right-bar;

    top: calc((100vh - 110px) / 2);

    ::v-deep {
      svg:not(:root).svg-inline--fa {
        display: block;
        margin-right: auto;
        margin-left: auto;
        color: $base-color-white;
      }

      .svg-icon {
        display: block;
        margin-right: auto;
        margin-left: auto;
        font-size: 20px;
        color: $base-color-white;
        fill: $base-color-white;
      }
    }
  }

  .el-drawer__body {
    padding: 20px;
  }
</style>
<style lang="scss">
  .el-drawer__open .el-drawer.rtl {
    -webkit-animation: none !important;
    animation: none !important;
  }
  .el-drawer__wrapper {
    outline: none !important;

    * {
      outline: none !important;
    }
  }

  .color-picker {
    .el-color-dropdown__link-btn {
      display: none;
    }
  }
</style>
