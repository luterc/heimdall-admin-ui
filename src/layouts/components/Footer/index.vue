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
  <footer v-show="footerCopyright" class="footer-copyright">
    {{ $t("layout.footer.CopyrightText") }}
    <a target="_blank" :href="homepage">{{ copyright }}</a>
    {{ fullYear }}
    <font-icon :icon="['fas', 'fa-copyright']"></font-icon>
    {{ $t("base.title") }} v{{ version }}
  </footer>
</template>

<script>
  import {
    copyright,
    version,
    footerCopyright,
    homepage,
  } from "@/config/settings";
  export default {
    name: "Footer",
    //组件注册
    components: {},
    data() {
      //数据
      return {
        fullYear: new Date().getFullYear(),
        copyright,
        version,
        homepage,
        footerCopyright,
      };
    },
    //计算属性
    computed: {},
    //监听属性
    watch: {},
    //创建完成
    created() {},
    //挂载完成
    mounted() {},
    //创建之前
    beforeCreate() {},
    //挂载之前
    beforeMount() {},
    //更新之前
    beforeUpdate() {},
    //更新之后
    updated() {},
    //销毁之前
    beforeDestroy() {},
    //销毁完成
    destroyed() {},
    //页面激活,
    activated() {},
    //方法
    methods: {},
  };
</script>
<style lang="scss" scoped>
  .footer-copyright {
    background-color: $base-backgound-color;
    min-height: 25px;
    line-height: 25px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 10px;
    text-align: center;
    /*border-top: 1px dashed $base-border-color;*/
  }
</style>
