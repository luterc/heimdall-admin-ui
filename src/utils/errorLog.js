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
import store from "@/store";
import { isArray, isString } from "@/utils/validate";
import { errorLog } from "@/config/settings";
import { parseTime } from "./index";

const needErrorLog = errorLog;
const checkNeed = () => {
  const env = process.env.NODE_ENV;
  if (isString(needErrorLog)) {
    return env === needErrorLog;
  }
  if (isArray(needErrorLog)) {
    return needErrorLog.includes(env);
  }
  return false;
};
if (checkNeed()) {
  Vue.config.errorHandler = (err, vm, info) => {
    console.error("错误拦截:", err, vm, info);
    const url = window.location.href;
    const time = parseTime(new Date());
    Vue.nextTick(() => {
      store.dispatch("errorLog/addErrorLog", {
        err,
        vm,
        info,
        url,
        time,
      });
    });
  };
}
