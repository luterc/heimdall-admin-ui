/*
 *
 *  *
 *  *
 *  *      Copyright 2020-2021 Luter.me
 *  *
 *  *      Licensed under the Apache License, Version 2.0 (the "License");
 *  *      you may not use this file except in compliance with the License.
 *  *      You may obtain a copy of the License at
 *  *
 *  *        http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  *      Unless required by applicable law or agreed to in writing, software
 *  *      distributed under the License is distributed on an "AS IS" BASIS,
 *  *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  *      See the License for the specific language governing permissions and
 *  *      limitations under the License.
 *  *
 *  *
 *
 */

/**
 * @description router全局配置，如有必要可分文件抽离
 */
import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layouts/index.vue";
import { publicPath, routerMode } from "@/config/settings";

Vue.use(VueRouter);
/**
 * 公共页面，不需要权限的
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
    name: "Login",
    meta: {
      title: "登录",
    },
  },
  {
    path: "/register",
    component: () => import("@/views/register/index"),
    hidden: true,
    name: "Register",
    meta: {
      title: "注册",
    },
  },
  {
    path: "/401",
    name: "401",
    component: () => import("@/views/error-page/401"),
    hidden: true,
    meta: {
      title: "权限错误",
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
    meta: {
      title: "未找到",
    },
  },
  // 用来切换大小用的redirect跳转页面
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
];
/**
 * 根据permissions数组进行动态过滤的，后台需要返回每个用户的所有permissons
 * 菜单上有某个页面需要的permissions，如果一个匹配，则具有权限
 */

const router = new VueRouter({
  base: routerMode === "history" ? publicPath : "",
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
});
/**
 * 处理异步路由加载异常信息
 */
router.onError((error) => {
  console.error("加载路由错误:", error);
  if (error.message && error.message.includes("Cannot find module") > 0) {
    Vue.prototype.$SAlert({
      title: "错误",
      text:
        "加载页面失败,组件未找到:" +
        error.message.replace("Cannot find module", ""),
      icon: "error",
    });
  } else {
    alert("加载失败:" + error.message);
  }
});

export function resetRouter() {
  router.matcher = new VueRouter({
    base: routerMode === "history" ? publicPath : "",
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  }).matcher;
}

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default router;
