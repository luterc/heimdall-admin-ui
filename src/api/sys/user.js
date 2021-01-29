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

import request from "@/utils/request";

/**
 * 获取图形验证码
 * @param data
 */
export function getCaptcha(data) {
  return request({
    url: "/sys/captcha",
    method: "get",
    data,
  });
}

/**
 * 登录
 * @param data
 * @return {Promise<void>}
 */
export async function login(data) {
  return request({
    url: "/sys/user/login",
    method: "post",
    data,
  });
}

/**
 * 获取登录用户的信息，包括权限等
 */
export function getUserInfo() {
  return request({
    url: "/sys/user/current",
    method: "get",
  });
}

/**
 * 获取当前用户所有的菜单
 * @param data
 */
export function getUserMenus(data) {
  return request({
    url: "/sys/user/current/menus",
    method: "get",
    data,
  });
}

export function logout() {
  return request({
    url: "/sys/user/logout",
    method: "post",
  });
}

//////////用户部分
export function getUserList(params) {
  return request({
    url: "/sys/user/list",
    method: "get",
    params,
  });
}

export function doUserSave(data) {
  return request({
    url: "/sys/user/save",
    method: "post",
    data,
  });
}

export function doUserUpdate(data) {
  return request({
    url: "/sys/user/update",
    method: "post",
    data,
  });
}

export function doUserDelete(id) {
  return request({
    url: "/sys/user/delete/" + id,
    method: "post",
  });
}

export function getUserById(id) {
  return request({
    url: "/sys/user/detail/" + id,
    method: "get",
  });
}

export function changeUserLocked(data) {
  return request({
    url: "/sys/user/update/locked",
    method: "post",
    data,
  });
}

export function resetUserPassword(data) {
  return request({
    url: "/sys/user/password/reset",
    method: "post",
    data,
  });
}

export function isExistUsername(params) {
  return request({
    url: "/sys/user/exist",
    method: "post",
    params,
  });
}

/**
 * 获取用户的站内信
 */
export function getUserNotices() {
  return request({
    url: "/sys/message/box/list/current",
    method: "get",
  });
}
