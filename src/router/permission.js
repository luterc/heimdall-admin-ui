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

import router from "@/router";
import store from "@/store";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import getPageTitle from "@/utils/pageTitle";
import lang from "@/lang";
import {
  authentication,
  progressBar,
  recordRoute,
  routesWhiteList,
} from "@/config/settings";

nProgress.configure({
  easing: "ease",
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});
router.beforeEach(async (to, from, next) => {
  if (progressBar) nProgress.start();
  //浏览器标题栏文字设置一下
  console.log("设置标题:", lang.t("router." + to.name), "router." + to.name);
  document.title = getPageTitle(lang.t("router." + to.name));
  let hasToken = store.getters["user/accessToken"];
  if (hasToken) {
    if (to.path === "/login") {
      next({
        replace: true,
        path: "/",
      });
      if (progressBar) nProgress.done();
    } else {
      const hasPermissions =
        store.getters["user/permissions"] &&
        store.getters["user/permissions"].length > 0;
      console.log("是否具备权限:", hasPermissions);
      if (hasPermissions) {
        next();
      } else {
        if (!store.state.routes.hasGetRoute) {
          console.log("渲染路由.....");
          try {
            let permissions = await store.dispatch("user/getUserInfo");
            console.log("从后台获取到的用户权限:", permissions);
            let accessRoutes = [];
            if (authentication === "frontend") {
              console.warn("路由模式:前端路由初始化");
              accessRoutes = await store.dispatch(
                "routes/setRoutes",
                permissions
              );
              //如果是后端路由，直接设置后台返回数据
            } else if (authentication === "backend") {
              console.warn("路由模式:后端路由初始化");
              accessRoutes = await store.dispatch("routes/setAllRoutes");
              console.log("从后台获取和转化的路由数据:", accessRoutes);
            }
            console.log("最终权限:", permissions);
            console.log("最终路由:", accessRoutes);
            router.addRoutes(accessRoutes);
            next({ ...to, replace: true });
          } catch (e) {
            console.error("路由守卫出现异常:", e);
            await store.dispatch("user/resetAccessToken");
            if (progressBar) nProgress.done();
          }
        } else {
          next();
        }
      }
    }
  } else {
    // path在白名单里的
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (recordRoute) {
        next(`/login?redirect=${to.path}`);
      } else {
        next("/login");
      }
      if (progressBar) nProgress.done();
    }
  }
});
router.afterEach(() => {
  if (progressBar) nProgress.done();
});
