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

/**
 * 全局工具函数
 */
import { loadingText, messageDuration, title } from "@/config/settings";
import * as lodash from "lodash";
import { Loading, Message, MessageBox, Notification } from "element-ui";
import store from "@/store";
import { getAccessToken } from "@/utils/accessToken";

import i18n from "../lang";

const accessToken = store.getters["user/accessToken"];
const layout = store.getters["settings/layout"];
import {
  getStoredDictByTypeName,
  getStoredDictLabelByValue,
  getStoredDictValueByLabel,
} from "@/utils/dict";

const install = (Vue, opts = {}) => {
  /* 全局accessToken */
  Vue.prototype.$baseAccessToken = () => {
    return accessToken || getAccessToken();
  };
  /* 全局标题 */
  Vue.prototype.$baseTitle = (() => {
    return title;
  })();
  /* 全局加载层 */
  Vue.prototype.$baseLoading = (index, text) => {
    let loading;
    if (!index) {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        background: "hsla(0,0%,100%,.8)",
      });
    } else {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        spinner: "loading-type" + index,
        background: "hsla(0,0%,100%,.8)",
      });
    }
    return loading;
  };
  /* 全局多彩加载层 */
  Vue.prototype.$baseColorLoading = (text, index) => {
    let loading;
    if (!index) {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        spinner: "dots-loader",
        background: "hsla(0,0%,100%,.8)",
      });
    } else {
      switch (index) {
        case 1:
          index = "dots";
          break;
        case 2:
          index = "gauge";
          break;
        case 3:
          index = "inner-circles";
          break;
        case 4:
          index = "plus";
          break;
      }
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        spinner: index + "-loader",
        background: "hsla(0,0%,100%,.8)",
      });
    }
    return loading;
  };
  /**
   * 全局Message
   * @param message 显示消息
   * @param type 类型
   * @param duration 时长
   */
  Vue.prototype.$baseMessage = (message, type, duration) => {
    Message({
      offset: 20,
      showClose: true,
      message: message,
      type: type,
      dangerouslyUseHTMLString: true,
      duration: duration || messageDuration,
    });
  };
  /* 全局Alert */
  Vue.prototype.$baseAlert = (content, title, callback) => {
    MessageBox.alert(content, title || i18n.t("commons.baseAlert.title"), {
      confirmButtonText: i18n.t("commons.baseAlert.confirmButtonText"),
      dangerouslyUseHTMLString: true,
      callback: (action) => {
        if (callback) {
          callback(action);
        }
      },
    });
  };

  /* 全局Confirm */
  Vue.prototype.$baseConfirm = (content, title, ok, cancel) => {
    MessageBox.confirm(content, title || i18n.t("commons.baseConfirm.title"), {
      confirmButtonText: i18n.t("commons.baseConfirm.confirmButtonText"),
      cancelButtonText: i18n.t("commons.baseConfirm.cancelButtonText"),
      closeOnClickModal: false,
      showCancelButton: !!cancel,
      type: "warning",
    })
      .then((data) => {
        if (ok) {
          ok(data);
        }
      })
      .catch((error) => {
        if (cancel) {
          cancel(error);
        }
      });
  };
  /* 全局Notification */
  Vue.prototype.$baseNotify = (message, type, title, position) => {
    Notification({
      title: title || "提示",
      message: message,
      position: position || "top-right",
      type: type || "success",
      duration: messageDuration,
      dangerouslyUseHTMLString: true,
    });
  };
  /* 全局TableHeight */
  Vue.prototype.$baseTableHeight = (formType) => {
    let height = window.innerHeight;
    let paddingHeight = 400;
    const formHeight = 50;

    if (layout === "vertical") {
      paddingHeight = 340;
    }

    if ("number" == typeof formType) {
      height = height - paddingHeight - formHeight * formType;
    } else {
      height = height - paddingHeight;
    }
    return height;
  };
  /* 全局lodash */
  Vue.prototype.$baseLodash = lodash;
  /* 全局事件总线 */
  Vue.prototype.$baseEventBus = new Vue();
  //字典全局方法
  /**
   * 根据字典分类名称获取分类项
   * @param typeName
   * @return {*}
   */
  Vue.prototype.getStoredDictByTypeName = (typeName) => {
    return getStoredDictByTypeName(typeName);
  };
  /**
   * 根据字典分类名称和字典值获取字典项目的显示文字
   * @param typeName
   * @param value
   * @return {*}
   */
  Vue.prototype.getStoredDictLabelByValue = (typeName, value) => {
    return getStoredDictLabelByValue(typeName, value);
  };
  /**
   * 根据字典分类名称、字典项的显示文字获取字典项的值
   * @param typeName
   * @param label
   * @return {*}
   */
  Vue.prototype.getStoredDictValueByLabel = (typeName, label) => {
    return getStoredDictValueByLabel(typeName, label);
  };
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export default install;
