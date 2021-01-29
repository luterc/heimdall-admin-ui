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

export function getRoleList(params) {
  return request({
    url: "/sys/role/list",
    method: "get",
    params,
  });
}

export function getRoleListAll() {
  return request({
    url: "/sys/role/list/all",
    method: "get",
  });
}

export function doRoleSave(data) {
  return request({
    url: "/sys/role/save",
    method: "post",
    data,
  });
}

export function doRoleUpdate(data) {
  return request({
    url: "/sys/role/update",
    method: "post",
    data,
  });
}

export function doRoleDelete(id) {
  return request({
    url: "/sys/role/delete/" + id,
    method: "post",
  });
}

export function getRoleById(id) {
  return request({
    url: "/sys/role/detail/" + id,
    method: "get",
  });
}

export function getRoleAuthTree(roleId) {
  return request({
    url: "/sys/role/auth/tree",
    method: "post",
    form: true,
    data: {
      roleId: roleId,
    },
  });
}

/**
 * 保存角色的权限信心
 * {
 *   id:xxx
 *   perms:[]
 * }
 * @param data
 */
export function saveRoleAuth(data) {
  return request({
    url: "/sys/role/auth/save",
    method: "post",
    data,
  });
}

export function isExistName(params) {
  return request({
    url: "/sys/role/exist",
    method: "post",
    params,
  });
}
