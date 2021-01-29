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
import axios from "axios";
import {
  baseURL,
  contentType,
  requestTimeout,
  successCode,
  tokenName,
  formContentType,
  multipartContentType,
} from "@/config/settings";
import store from "@/store";
import qs from "qs";
import { isArray } from "@/utils/validate";
import i18n from "../lang";

/**
 * @description 处理code异常
 * @param {*} status http状态
 * @param {*} code 业务状态码
 * @param {*} msg
 * @param {*} config 请求参数，包括url method等信息
 */
const handleError = (status, msg, code, config) => {
  console.error("发生错误:status,msg", status, msg);

  if (status) {
    switch (status) {
      //没登录401
      case 401:
        Vue.prototype.$baseMessage(
          msg || i18n.t("request.logExpireText"),
          "error"
        );
        setTimeout(() => {
          location.reload();
        }, 1000);
        break;
      //没权限403
      case 403:
        Vue.prototype.$baseMessage(
          msg || i18n.t("request.noPermText"),
          "error"
        );
        break;
      default:
        const message =
          msg ||
          `${i18n.t("request.serverErrorText")},status:[${status}${
            code ? ",code:" + code : ""
          }]-${config.method.toUpperCase()}:${config.url}`;
        Vue.prototype.$baseMessage(message, "error");
        break;
    }
  } else {
    Vue.prototype.$baseMessage(`${i18n.t("request.serverErrorText")}`, "error");
  }
};
/**
 * 请求实例定义
 */
const instance = axios.create({
  baseURL,
  timeout: requestTimeout || 15000,
  // 跨域请求携带Cookies凭证
  withCredentials: true,
  //默认的请求headers
  headers: {
    "Content-Type": contentType,
  },
});
/**
 * 请求预处理
 */
instance.interceptors.request.use(
  (config) => {
    //携带token
    if (store.getters["user/accessToken"]) {
      config.headers[tokenName] = store.getters["user/accessToken"];
    }
    //如果是form提交，转换请求格式
    if (config.data && config.form === true) {
      config.headers["Content-Type"] = formContentType;
      config.data = qs.stringify(config.data);
    }
    //如果是上传文件，添加content-type
    else if (config.data && config.upload === true) {
      config.headers["Content-Type"] = multipartContentType;
    } else {
      //默认request payload json提交
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
/**
 * 响应统一处理
 */
instance.interceptors.response.use(
  (response) => {
    const { data, config } = response;
    const { code, status, msg, success } = data;
    // 操作正常Code数组
    const codeVerificationArray = isArray(successCode)
      ? [...successCode]
      : [...[successCode]];
    // 是否操作正常
    if (codeVerificationArray.includes(status)) {
      return data;
    } else {
      handleError(status, msg);
      return Promise.reject(
        i18n.t("request.badRequestText") +
          JSON.stringify({ url: config.url, code, msg }) || "Error"
      );
    }
  },
  (error) => {
    const { response, message } = error;
    if (error.response) {
      if (error.response.data) {
        const { status, code, data, config } = response;
        handleError(status, data.msg || message, code, config);
        return Promise.reject(error);
      } else {
        const { status } = response;
        handleError(status);
      }
    }
    if (error.response && error.response.data) {
      const { status, code, data, config } = response;
      handleError(status, data.msg || message, code, config);
      return Promise.reject(error);
    } else {
      let { message } = error;
      if (message === "Network Error") {
        message = i18n.t("request.networkErrorText");
      }
      if (message.includes("timeout")) {
        message = i18n.t("request.timeoutText");
      }
      if (message.includes("Request failed with status code")) {
        const code = message.substr(message.length - 3);
        message = i18n.t("request.serverErrorText") + ",code:" + code;
      }
      Vue.prototype.$baseMessage(
        message || i18n.t("request.serverErrorText"),
        "error"
      );
      return Promise.reject(error);
    }
  }
);

export default instance;
