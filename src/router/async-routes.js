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

//一级页面使用默认布局，这个布局左侧是导航菜单，右侧是内容区域
import Layout from "@/layouts/index.vue";
//二级一下菜单使用空白布局，这个布局铺满整个内容区域，是Layout的下级
import EmptyLayout from "@/layouts/EmptyLayout.vue";

/**
 * 自己的异步路由写这里
 */
const routers = [
  {
    path: "/sys",
    component: Layout,
    name: "Sys",
    meta: { icon: "fas fa-atom", title: "系统管理" },
    children: [
      {
        path: "user",
        name: "SysUser",
        component: () => import("@/views/sys/user/index"),
        meta: {
          icon: "far fa-address-card",
          affix: false,
          keepAlive: false,
          title: "用户管理",
          remarks: "管理系统用户信息、禁用启用用户账户等操作",
          permissions: ["sys:user:save"],
        },
      },
      {
        path: "role",
        name: "SysRole",
        component: () => import("@/views/sys/role/index"),
        meta: {
          icon: "fas fa-users",
          affix: false,
          keepAlive: false,
          title: "角色管理",
          remarks: "管理系统角色，为角色分配系统权限",
          permissions: ["sys:user:save"],
        },
      },
      {
        path: "resource",
        name: "SysResource",
        component: () => import("@/views/sys/resource/index"),
        meta: {
          affix: false,
          keepAlive: false,
          title: "资源管理",
          remarks:
            "管理系统内菜单和资源权限，设置菜单图标文字等信息，修改系统资源信息，会影响系统权限判断逻辑，修改不当，可能导致系统无法正确访问",
          icon: "fas fa-cubes",
          permissions: ["sys:user:save"],
        },
      },
      {
        path: "department",
        name: "SysDepartment",
        component: () => import("@/views/sys/department/index"),
        meta: {
          affix: false,
          keepAlive: false,
          title: "组织机构",
          remarks: "管理组织机构层级信息",
          icon: "far fa-calendar-alt",
          permissions: ["sys:user:save"],
        },
      },
      {
        path: "post",
        name: "SysPost",
        component: () => import("@/views/sys/post/index"),
        meta: {
          affix: false,
          keepAlive: false,
          title: "工作岗位",
          remarks: "工作岗位管理",
          icon: "far fa-dizzy",
          permissions: ["sys:user:save"],
        },
      },
    ],
  },
];
/**
 * 异步路由配置在前端，由后台返回权限标志控制是否可访问路由
 */
export default [
  {
    path: "/",
    component: Layout,
    redirect: {
      name: "Home",
    },
    children: [
      {
        path: "/index",
        name: "Home",
        component: () => import("@/views/index"),
        meta: {
          icon: "fas fa-home",
          affix: true,
          badge: "New",
        },
      },
    ],
  },
  {
    path: "/uc",
    component: Layout,
    hidden: true,
    name: "Uc",
    meta: {
      icon: "fas fa-user-cog",
      affix: false,
      keepAlive: false,
    },
    children: [
      {
        path: "profile",
        name: "UserCenter",
        component: () => import("@/views/profile/index"),
        meta: {
          icon: "fas fa-user-cog",
          affix: false,
          keepAlive: false,
        },
      },
    ],
  },
  ///自己的路由引入
  ...routers,
  /**
   * 404必须在最后一个，路由是按顺序寻找匹配，上面的任何一个找不到，最后都会由此路由响应
   */
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];
