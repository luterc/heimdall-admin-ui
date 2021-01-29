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

import {
  addResizeListener,
  removeResizeListener,
} from "element-ui/src/utils/resize-event";

/**
 * How to use
 * <el-table height="100px" v-el-height-adaptive-table="{bottomOffset: 30}">...</el-table>
 * el-table height is must be set
 * bottomOffset: 30(default)   // The height of the table from the bottom of the page.
 */

const doResize = (el, binding, vnode) => {
  const { componentInstance: $table } = vnode;

  const { value } = binding;

  if (!$table.height) {
    throw new Error(`el-$table must set the height. Such as height='100px'`);
  }
  const bottomOffset = (value && value.bottomOffset) || 30;

  if (!$table) return;

  const height =
    window.innerHeight - el.getBoundingClientRect().top - bottomOffset;
  $table.layout.setHeight(height);
  $table.doLayout();
};

export default {
  bind(el, binding, vnode) {
    el.resizeListener = () => {
      doResize(el, binding, vnode);
    };
    // parameter 1 is must be "Element" type
    addResizeListener(window.document.body, el.resizeListener);
  },
  inserted(el, binding, vnode) {
    doResize(el, binding, vnode);
  },
  unbind(el) {
    removeResizeListener(window.document.body, el.resizeListener);
  },
};
