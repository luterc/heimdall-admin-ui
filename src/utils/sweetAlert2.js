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

import Swal from "sweetalert2";

const install = (Vue, opts = {}) => {
  //定义toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });
  //普通样式定义
  const swal = Swal.mixin(
    {
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    },
    ""
  );
  //绑定到vue实例
  Vue.prototype.swal = swal;
  Vue.prototype.$SToast = (title, text, icon) => {
    Toast.fire({
      icon: icon || "info",
      title: title || "",
      text: text || "",
    });
  };
  /**
   *
   * @param config
   * {
   *   title:'',text:'',icon:''
   * }
   */
  Vue.prototype.$SAlert = (config) => {
    swal.fire({
      title: config.title || "提示",
      allowOutsideClick: false,
      allowEscapeKey: false,
      text: config.text || "操作成功",
      icon: config.icon || "success",
      confirmButtonText: "知道了",
    });
  };
  Vue.prototype.$SConfirm = (title, text, icon, ok, cancel) => {
    swal
      .fire({
        title: title || "确定吗？",
        text: text || "",
        icon: icon || "question",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
      .then((result) => {
        if (result.value) {
          if (ok) {
            ok(swal);
          }
        } else if (result.dismiss === swal.DismissReason.cancel) {
          if (cancel) {
            cancel(swal);
          }
        }
      })
      .catch(swal.noop);
  };
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export default install;
