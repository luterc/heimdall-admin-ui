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
 * @description 路由拦截状态管理，目前两种模式：backend模式与frontend模式，其中partialRoutes是菜单暂未使用
 */
import { constantRoutes } from "@/router";
import asyncRoutes from "@/router/async-routes";
import { getUserMenus } from "@/api/sys/user";
import { convertRouter, filterAsyncRoutes } from "@/utils/handleRoutes";

const state = { routes: [], partialRoutes: [], hasGetRoute: false };
const getters = {
  routes: (state) => state.routes,
  partialRoutes: (state) => state.partialRoutes,
};
const mutations = {
  setRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes);
    state.hasGetRoute = true;
  },
  setAllRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes);
    state.hasGetRoute = true;
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = constantRoutes.concat(routes);
  },
};
const actions = {
  /**
   * 路由配置在前端，后端返回perms情况下处理菜单路由
   * @param commit
   * @param permissions
   * @return {Promise<*>}
   */
  async setRoutes({ commit }, permissions) {
    const finallyAsyncRoutes = await filterAsyncRoutes(
      [...asyncRoutes],
      permissions
    );
    commit("setRoutes", finallyAsyncRoutes);
    return finallyAsyncRoutes;
  },
  /**
   * 从后台获取所有菜单路由的配置信息
   * @param commit
   * @return {Promise<*>}
   */
  async setAllRoutes({ commit }) {
    let { data } = await getUserMenus();
    console.log("用户菜单:", data);
    let menus = [];
    //把首页和用户中心配置在这里,当然了，也可以配置在后端
    // menus.push(
    //   {
    //     path: "/",
    //     component: "Layout",
    //     redirect: "index",
    //     icon: "fas fa-home",
    //     affix: true,
    //     children: [
    //       {
    //         path: "index",
    //         name: "Home",
    //         component: "@/views/index/index",
    //         icon: "fas fa-home",
    //         affix: true,
    //         keepAlive: false,
    //         badge: "新",
    //       },
    //     ],
    //   },
    //   {
    //     path: "/uc",
    //     component: "Layout",
    //     hidden: true,
    //     icon: "fas fa-user-cog",
    //     affix: false,
    //     children: [
    //       {
    //         path: "/uc/profile",
    //         name: "UserCenter",
    //         component: "profile/index",
    //         icon: "fas fa-user-cog",
    //         affix: false,
    //         keepAlive: false,
    //       },
    //     ],
    //   }
    // );
    //后端拿回来的路由配置在这里
    if (data && data.length) {
      menus = menus.concat(data);
    }
    //404一定配置在最后
    menus.push({ path: "*", redirect: "/404", hidden: true });
    let accessRoutes = convertRouter(menus);
    commit("setAllRoutes", accessRoutes);
    return accessRoutes;
  },
  setPartialRoutes({ commit }, accessRoutes) {
    commit("setPartialRoutes", accessRoutes);
    return accessRoutes;
  },
};
export default { state, getters, mutations, actions };
