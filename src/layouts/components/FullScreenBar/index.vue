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
  <span @click="click">
    <font-icon
      :icon="['fas ', isFullscreen ? 'fa-compress' : 'fa-expand']"
    ></font-icon>
  </span>
</template>
<script>
  import screenfull from "screenfull";

  export default {
    name: "FullScreenBar",
    data() {
      return {
        isFullscreen: false,
      };
    },
    mounted() {
      this.init();
    },
    beforeDestroy() {
      this.destroy();
    },
    methods: {
      click() {
        if (!screenfull.isEnabled) {
          this.$baseMessage("开启全屏失败", "error");
          return false;
        }
        screenfull.toggle();
        this.$emit("refresh");
      },
      change() {
        this.isFullscreen = screenfull.isFullscreen;
      },
      init() {
        if (screenfull.isEnabled) {
          screenfull.on("change", this.change);
        }
      },
      destroy() {
        if (screenfull.isEnabled) {
          screenfull.off("change", this.change);
        }
      },
    },
  };
</script>
