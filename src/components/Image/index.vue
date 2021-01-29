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
  <div class="image__outter">
    <el-image
      :src="bigSrc"
      fit="cover"
      style="width: 100%; height: 100%"
      @click="clickBig"
    ></el-image>
    <el-image
      :src="smallSrc"
      class="image__outter__small"
      fit="cover"
      @click="clickSmall"
    ></el-image>
    <span class="image__outter__percent">{{ percent }}%</span>
  </div>
</template>

<script>
  export default {
    name: "VueImage",
    components: {},
    props: {
      bigSrc: {
        type: String,
        default: "",
      },
      smallSrc: {
        type: String,
        default: "",
      },
      percent: {
        type: Number,
        default: 97,
      },
    },
    data() {
      return {};
    },
    created() {},
    mounted() {},
    methods: {
      clickBig() {
        this.$emit("click-big");
      },
      clickSmall() {
        this.$emit("click-small");
      },
    },
  };
</script>

<style lang="scss" scoped>
  .image {
    &__outter {
      position: relative;
      width: 100%;
      height: 100%;

      ::v-deep {
        img {
          border-radius: $base-border-radius;
        }
      }

      &__small {
        position: absolute;
        top: 0;
        right: 0;
        width: 80px;
        height: 100px;
        border-bottom: 1px solid $base-color-white;
        border-left: 1px solid $base-color-white;
        border-radius: $base-border-radius;
      }

      &__percent {
        position: absolute;
        right: 0;
        bottom: 0;
        display: inline-block;
        min-width: 50px;
        height: 25px;
        line-height: 25px;
        color: $base-color-white;
        text-align: center;
        background-color: $base-color-red;
        border-radius: $base-border-radius;
      }
    }
  }
</style>
