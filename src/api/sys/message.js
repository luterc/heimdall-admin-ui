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

import request from "@/utils/request";

/**
 * 列表查询
 * @param params
 */
export function getMessageList(params) {
  return request({
    url: "/sys/message/list",
    method: "get",
    params,
  });
}

/**
 * 新增
 * @param params
 */
export function doMessageSave(data) {
  return request({
    url: "/sys/message/save",
    method: "post",
    data,
  });
}

/**
 * 修改
 * @param params
 */
export function doMessageUpdate(data) {
  return request({
    url: "/sys/message/update",
    method: "post",
    data,
  });
}

/**
 * 根据ID删除数据
 * @param id
 */
export function doMessageDelete(id) {
  return request({
    url: "/sys/message/delete/" + id,
    method: "post",
  });
}

/**
 * 根据ID查询单个数据
 * @param id
 */
export function getMessageById(id) {
  return request({
    url: "/sys/message/detail/" + id,
    method: "get",
  });
}
