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
  <div class="drawer-container">
    <h3 class="drawer-title">{{ $t("layout.settings.title") }}</h3>
    <el-scrollbar style="height: 94vh; overflow: hidden">
      <div class="drawer-item">
        <el-form ref="form" :model="theme">
          <el-form-item :label="$t('layout.settings.theme.label')">
            <el-radio-group v-model="theme.name">
              <el-radio-button label="default">
                {{ $t("layout.settings.theme.default") }}
              </el-radio-button>
              <el-radio-button label="green">
                {{ $t("layout.settings.theme.green") }}
              </el-radio-button>
              <el-radio-button label="glory">
                {{ $t("layout.settings.theme.glory") }}
              </el-radio-button>
              <el-radio-button label="blue">
                {{ $t("layout.settings.theme.blue") }}
              </el-radio-button>
              <el-radio-button label="white">
                {{ $t("layout.settings.theme.white") }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('layout.settings.color.label')">
            <color></color>
          </el-form-item>
          <el-form-item :label="$t('layout.settings.layout.label')">
            <el-radio-group v-model="theme.layout">
              <el-radio-button label="vertical">
                {{ $t("layout.settings.layout.vertical") }}
              </el-radio-button>
              <el-radio-button label="horizontal">
                {{ $t("layout.settings.layout.horizontal") }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('layout.settings.header.label')">
            <el-radio-group v-model="theme.header">
              <el-radio-button label="fixed">
                {{ $t("layout.settings.header.fixed") }}
              </el-radio-button>
              <el-radio-button label="noFixed">
                {{ $t("layout.settings.header.noFixed") }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('layout.settings.tabsBar.label')">
            <el-radio-group v-model="theme.tabsBar">
              <el-radio-button label="true">
                {{ $t("layout.settings.tabsBar.show") }}
              </el-radio-button>
              <el-radio-button label="false">
                {{ $t("layout.settings.tabsBar.hide") }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleSetDfaultTheme">
              {{ $t("layout.settings.reset") }}
            </el-button>
            <el-button type="primary" @click="handleSaveTheme">
              {{ $t("layout.settings.confirm") }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { layout as defaultLayout } from "@/config/settings";
  import Color from "../Color";

  export default {
    name: "Settings",
    components: { Color },
    data() {
      return {
        theme: {
          name: "default",
          layout: "",
          header: "",
          tabsBar: "",
        },
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
        this.theme.layout = this.layout;
        this.theme.header = this.header;
        this.theme.tabsBar = this.tabsBar;
        this.theme.name = "default";
      }

      //设置系统默认颜色
      const colorName = localStorage.getItem("colorName");
      if (!colorName || !colorName.startsWith("#")) {
        //提交修改
        this.$store.dispatch("settings/changeColorName", this.getThemeColor());
        this.$baseEventBus.$emit("change-color", this.getThemeColor());
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
        this.$baseEventBus.$emit("change-color", this.getThemeColor());
      },
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
            color = "#0d0e0e";
            break;
          case "blue":
            color = "#2932e1";
            break;
        }
        return color;
      },
      handleSaveTheme() {
        this.handleSetTheme();
        this.$parent.show = false;
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
        //改变颜色
        this.$baseEventBus.$emit("change-color", this.getThemeColor());
        this.$parent.show = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
      margin-bottom: 12px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      line-height: 22px;
    }

    .drawer-item {
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      padding: 12px 0;
    }

    .drawer-switch {
      float: right;
    }

    .job-link {
      display: block;
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
    }
  }
</style>
