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
 * @description backend模式渲染后端返回路由
 * @returns {*}
 * @param asyncRoutes
 */
export function convertRouter(asyncRoutes) {
  return asyncRoutes.map((route) => {
    //后台平面返回数据构造meta数据
    route.meta = {
      icon: route.icon, //菜单图标
      keepAlive: route.keepAlive, //是否缓存页面
      affix: route.affix, //是否一直显示不可以关闭
      badge: route.badge, //角标
      target: route.target, //外链的打开方式，会根据返回的path自动识别是否为外链，参考:validate.js/isExternal()
      title: route.title, //页面标题文字
      remarks: route.remarks, //页面功能性说明文字
    };
    //处理页面
    if (route.component) {
      if (route.component === "Layout") {
        route.component = (resolve) =>
          require(["@/layouts/index.vue"], resolve);
      } else if (route.component === "EmptyLayout") {
        route.component = (resolve) =>
          require(["@/layouts/EmptyLayout.vue"], resolve);
      } else {
        const index = route.component.indexOf("views");
        const path =
          index > 0 ? route.component.slice(index) : `views/${route.component}`;
        route.component = (resolve) => require([`@/${path}`], resolve);
      }
    }
    //如果有子节点，递归处理
    if (route.children && route.children.length)
      route.children = convertRouter(route.children);
    //如果子节点不存在或者长度为0，删除children字段
    if (route.children && route.children.length === 0) delete route.children;

    return route;
  });
}

/**
 * @description 判断当前路由是否包含权限，路由保存在前端的时候
 * @param permissions
 * @param route
 * @returns {boolean|*}
 */
function hasPermission(permissions, route) {
  //根据meta属性进行判断
  if (route.meta && route.meta.permissions) {
    // return permissions.some((role) => route.meta.permissions.includes(role));
    return permissions.some((perms) => {
      return perms.includes("*") || route.meta.permissions.includes(perms);
    });
  } else {
    return true;
  }
}

/**
 * @description frontend模式根据permissions数组拦截路由，路由保存在前端的时候
 * @param routes
 * @param permissions
 * @returns {[]}
 */
export function filterAsyncRoutes(routes, permissions) {
  const finallyRoutes = [];
  routes.forEach((route) => {
    const item = { ...route };
    if (hasPermission(permissions, item)) {
      if (item.children) {
        item.children = filterAsyncRoutes(item.children, permissions);
      }
      finallyRoutes.push(item);
    }
  });
  return finallyRoutes;
}
