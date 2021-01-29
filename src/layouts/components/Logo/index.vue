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
  <div v-if="logo" :class="'logo-container-' + layout">
    <router-link to="/">
      <img alt="Heimdall-Admin" class="logo" :src="LogoImg" />
      <span
        v-show="!collapse"
        class="title"
        :class="{ 'hidden-xs-only': layout === 'horizontal' }"
        :title="title"
      >
        {{ this.$t("base.title") }}
      </span>
    </router-link>
  </div>
</template>
<script>
  import { mapGetters } from "vuex";
  import LogoImg from "@/assets/logo/14.png";

  export default {
    name: "Logo",
    data() {
      return {
        LogoImg,
      };
    },

    computed: {
      title() {
        return this.$t("base.title");
      },
      ...mapGetters({
        collapse: "settings/collapse",
        logo: "settings/logo",
        layout: "settings/layout",
      }),
    },
    created() {},
  };
</script>
<style lang="scss" scoped>
  @mixin container {
    position: relative;
    height: $base-top-bar-height;
    overflow: hidden;
    line-height: $base-top-bar-height;
    background: $base-menu-background;
    vertical-align: center;
  }

  @mixin title {
    display: inline-block;
    overflow: hidden;
    font-size: 16px;
    font-weight: 900;
    line-height: $base-logo-height;
    color: $base-title-color;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .logo-container-horizontal {
    @include container;

    .title {
      @include title;
    }
    .logo {
      display: inline-block;
      object-fit: fill;
      width: 40px;
      height: 40px;
      color: $base-title-color;
      vertical-align: middle;
      overflow: hidden;
      border-radius: 50%;
    }
  }

  .logo-container-vertical {
    @include container;

    height: $base-logo-height;
    line-height: $base-logo-height;
    text-align: center;

    .logo {
      display: inline-block;
      object-fit: fill;
      width: 40px;
      height: 40px;
      color: $base-title-color;
      vertical-align: middle;
      overflow: hidden;
      border-radius: 50%;
    }

    .title {
      @include title;

      max-width: calc(#{$base-left-menu-width} - 40px);
    }
  }
</style>
