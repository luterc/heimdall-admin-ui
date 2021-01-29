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
  <section v-if="routerView" class="app-main-container">
    <!--    不开启tabsbar的情况下，如果title和remarks都有值，则显示-->
    <title-bar
      :title="$route.meta.title"
      :content="$route.meta.remarks"
    ></title-bar>
    <github-corner v-if="githubCorner"></github-corner>
    <!--    <transition mode="out-in" name="fade-transform">-->
    <!--      <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">-->
    <!--        <router-view :key="key" class="app-main-content" />-->
    <!--      </keep-alive>-->
    <!--    </transition>-->
    <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">
      <router-view :key="key" class="app-main-content" />
    </keep-alive>
    <Footer />
  </section>
</template>

<script>
  import { mapGetters } from "vuex";
  import GithubCorner from "../GithubCorner";
  import Footer from "../Footer";
  import { githubCorner, keepAliveMaxNum, title } from "@/config/settings";
  import TitleBar from "./TitleBar/index";

  export default {
    name: "AppMain",
    components: {
      GithubCorner,
      Footer,
      TitleBar,
    },
    data() {
      return {
        title,
        keepAliveMaxNum,
        routerView: true,
        githubCorner: githubCorner,
      };
    },
    computed: {
      ...mapGetters({
        visitedRoutes: "tabsBar/visitedRoutes",
        device: "settings/device",
      }),
      cachedRoutes() {
        const cachedRoutesArr = [];
        this.visitedRoutes.forEach((item) => {
          if (item.meta && item.meta.keepAlive) {
            //这里的名字是xxx.vue文件里的name
            cachedRoutesArr.push(item.name);
          }
        });
        return cachedRoutesArr;
      },
      key() {
        return this.$route.path;
      },
    },
    watch: {
      $route: {
        handler(route) {
          if ("mobile" === this.device) {
            this.$store.dispatch("settings/foldSideBar");
          }
        },
        immediate: true,
      },
    },
    created() {
      //重载所有路由
      this.$baseEventBus.$on("reload-routerview", () => {
        this.routerView = false;
        this.$nextTick(() => {
          this.routerView = true;
        });
      });
    },
    mounted() {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .app-main-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    .app-main-content {
      /*可以在这里全局设置内容区域背景色，也可以每页根元素加class="*-page-container"，
      以page-container结尾的class会被自动设置背景色为白色*/
      /*background-color: $base-color-white;
      padding: $small-padding;
      margin: 0 $base-padding 0 $base-padding;*/

      min-height: $base-app-main-height;
    }
  }
</style>
