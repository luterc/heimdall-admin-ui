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
import App from "./App";
import store from "./store";
import router from "./router";
import i18n from "./lang";
import "./plugins";
import "./directive";
import "./filters";
Vue.config.productionTip = process.env.NODE_ENV !== "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";
new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: (h) => h(App),
});
