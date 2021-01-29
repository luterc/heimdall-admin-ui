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

import Vue from "vue";
import ElementUI from "element-ui";
// 响应式布局
import "element-ui/lib/theme-chalk/display.css";
// // elementui 自带基础样式
import "element-ui/lib/theme-chalk/index.css";
//自定义的elementui样式
// import "@/styles/element-variables.scss";
//国际化
import i18n from "@/lang";
function getDefaultSize() {
  let size = localStorage.getItem("size");
  if (!size) {
    console.log("初始化组件大小:small");
    localStorage.setItem("size", "small");
    return "small";
  }
  console.log("设置组件大小:", size);
  return size;
}

Vue.use(ElementUI, {
  size: getDefaultSize(),
  i18n: (key, value) => i18n.t(key, value),
});
