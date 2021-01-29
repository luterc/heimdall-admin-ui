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

import store from "@/store";
import log from "./colorLog";

/**
 * @description 检查权限
 * @param {Array} value
 * @returns {Boolean}
 */
export default function checkPermission(value) {
  if (value && value instanceof Array) {
    if (value.length > 0) {
      //所有权限
      const all_permission = "*";
      const permissions = store.getters && store.state.user.permissions;
      return permissions.some((perm) => {
        return value.includes(all_permission) || value.includes(perm);
      });
    } else {
      log.danger(`permission array is null ：${value}`, true);
    }
  } else {
    console.error(`参数必须是数组! 比如: v-permission="['admin','user']"`);
    return false;
  }
}
