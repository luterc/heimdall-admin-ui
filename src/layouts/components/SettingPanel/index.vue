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
  <div
    ref="settingPanel"
    :class="{ show: show }"
    class="settingPanel-container"
  >
    <div class="settingPanel-background" />
    <div class="settingPanel">
      <div
        class="handle-button"
        :style="{
          top: buttonTop + 'px',
          'background-color': colorName,
        }"
        @click="show = !show"
      >
        <i :class="show ? 'el-icon-close' : 'el-icon-setting'" />
      </div>
      <div class="settingPanel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
  import { addClass, removeClass } from "@/utils";

  export default {
    name: "SettingPanel",
    props: {
      clickNotClose: {
        default: false,
        type: Boolean,
      },
      buttonTop: {
        default: 250,
        type: Number,
      },
    },
    data() {
      return {
        show: false,
      };
    },
    computed: {
      colorName() {
        return this.$store.state.settings.colorName;
      },
    },
    watch: {
      show(value) {
        if (value && !this.clickNotClose) {
          this.addEventClick();
        }
        if (value) {
          addClass(document.body, "showSettingPanel");
        } else {
          removeClass(document.body, "showSettingPanel");
        }
      },
    },
    mounted() {
      this.insertToBody();
    },
    beforeDestroy() {
      const elx = this.$refs.settingPanel;
      elx.remove();
    },
    methods: {
      addEventClick() {
        window.addEventListener("click", this.closeSidebar);
      },
      closeSidebar(evt) {
        const parent = evt.target.closest(".settingPanel");
        if (!parent) {
          this.show = false;
          window.removeEventListener("click", this.closeSidebar);
        }
      },
      insertToBody() {
        const elx = this.$refs.settingPanel;
        const body = document.querySelector("body");
        body.insertBefore(elx, body.firstChild);
      },
    },
  };
</script>

<style>
  .showSettingPanel {
    overflow: hidden;
    position: relative;
    width: calc(100% - 15px);
  }
</style>

<style lang="scss" scoped>
  .settingPanel-background {
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    background: rgba(0, 0, 0, 0.2);
    z-index: -1;
  }

  .settingPanel {
    width: 100%;
    max-width: 340px;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
    transform: translate(100%);
    background: #fff;
    z-index: $base-z-index + 10;
  }

  .show {
    transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

    .settingPanel-background {
      z-index: $base-z-index + 1;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0.5;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }

    .settingPanel {
      transform: translate(0);
    }
  }

  .handle-button {
    width: 32px;
    height: 32px;
    position: absolute;
    left: -32px;
    text-align: center;
    font-size: 16px;
    border-radius: 6px 0 0 6px !important;
    z-index: 0;
    pointer-events: auto;
    cursor: pointer;
    color: #fff;
    line-height: 32px;

    i {
      font-size: 16px;
      line-height: 32px;
    }
  }
</style>
