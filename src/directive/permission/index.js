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

import permission from "./permission";

/**
 *权限判断指令，具备其中一个，即具备权限。
 * 用法：
 * v-permission="['xxx','yyy']"
 */
const install = function (Vue) {
  Vue.directive("permission", permission);
};

if (window.Vue) {
  window["permission"] = permission;
  Vue.use(install); // eslint-disable-line
}

permission.install = install;

export default permission;
