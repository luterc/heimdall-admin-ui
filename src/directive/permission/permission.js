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

/**
 * 检查权限
 * @param el
 * @param binding
 */
function checkPermission(el, binding) {
  const { value } = binding;
  //所有权限，对于不需要鉴权的组件，可以直接配置*
  const all_permission = "*";
  const permissions = store.getters && store.state.user.permissions;
  //如果参数是字符串
  //如果字符串不匹配，则页面元素不显示
  if (value && typeof value === "string") {
    if (all_permission !== value) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
  //如果参数是数组
  else if (value && value instanceof Array) {
    //如果数组不为空
    if (value.length > 0) {
      const hasPermission = permissions.some((perm) => {
        return value.includes(perm);
      });

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      //配置的权限数组不正确，默认不显示页面元素
      // el.parentNode && el.parentNode.removeChild(el);
      //暂定显示提示信息
      console.error(
        `permissions array is null,provide value is ：${value} . ignored!`
      );
    }
  } else {
    throw new Error(
      `need perms params! Like v-permission="['admin','editor']",v-permission="*"`
    );
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding);
  },
  update(el, binding) {
    checkPermission(el, binding);
  },
};
