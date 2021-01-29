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

export function getResourceList(params) {
  return request({
    url: "/sys/resource/list",
    method: "get",
    params,
  });
}

export function getResourceTree(params) {
  return request({
    url: "/sys/resource/tree",
    method: "get",
    params,
  });
}

export function doResourceSave(data) {
  return request({
    url: "/sys/resource/save",
    method: "post",
    data,
  });
}

export function doResourceUpdate(data) {
  return request({
    url: "/sys/resource/update",
    method: "post",
    data,
  });
}

export function doResourceDelete(id) {
  return request({
    url: "/sys/resource/delete/" + id,
    method: "post",
  });
}

export function getResourceById(id) {
  return request({
    url: "/sys/resource/detail/" + id,
    method: "get",
  });
}
