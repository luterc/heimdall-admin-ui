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
 * @description 自定义配置,自己系统个性化的公共配置可以写这里
 **/
const config = {
  //分页组件默认参数配置
  pager: {
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    sizes: [5, 10, 15, 20, 25, 30, 40, 50, 100, 200],
    //分页请求参数的默认值
    default: {
      page: 1,
      size: 10,
    },
    /**
     * 点击table组件后从sort-change事件参数转化成后台需要的排序参数
     * @param params 排序参数携带到哪个对象，一般是往后台发送的查询条件对象
     * @param sort table的排序参数
     * @returns {*}
     */
    getSort(params, sort) {
      if (!params) {
        console.error("分页输入参数为空");
        return;
      }
      const { prop, order } = sort;
      if (order === "ascending") {
        if (params.desc) delete params.desc;
        params.asc = prop;
      } else {
        if (params.asc) delete params.asc;
        params.desc = prop;
      }
      return params;
    },
  },
};
module.exports = config;
