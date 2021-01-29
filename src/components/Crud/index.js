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

import ToolBar from "./ToolBar";
import QueryPanel from "./QueryPanel";
import ListPanel from "./ListPanel";

export default {
  install(Vue) {
    //顶部查询表单容器
    Vue.component("query-panel", QueryPanel);
    //表格顶部的操作工具条
    Vue.component("toolbar", ToolBar);
    //表格和分页容器
    Vue.component("list-panel", ListPanel);
  },
};
