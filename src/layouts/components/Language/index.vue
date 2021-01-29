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
  <el-dropdown
    v-if="locales && locales.length > 0"
    trigger="click"
    @command="handleSetLanguage"
  >
    <div class="language">
      <i class="fas fa-language"></i>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in locales"
        :key="item"
        :disabled="language === item"
        :command="item"
      >
        {{ item | trans }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import { getLocales, getLanguage, setI18nLanguage } from "@/lang";

  export default {
    name: "Language",
    filters: {
      trans: function (org) {
        switch (org) {
          case "zh-CN":
            return "中文";
          case "en":
            return "English";
          case "ja":
            return "にほんご";
          case "zh-TW":
            return "台湾";
          default:
            return org;
        }
      },
    },
    data() {
      return {
        language: getLanguage() || "zh-CN",
        locales: getLocales() || [],
      };
    },
    created() {},
    methods: {
      handleSetLanguage(lang) {
        this.language = lang;
        this.$store.dispatch("settings/setLanguage", this.language);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .language {
    padding: 0 10px 0 5px;
    vertical-align: -0.15em;
    fill: currentColor;
    cursor: pointer;
  }
</style>
