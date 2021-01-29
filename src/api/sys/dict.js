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

export function getDictList(params) {
  return request({
    url: "/sys/dict/type/list",
    method: "get",
    params,
  });
}

/**
 * 一次全部获取数据
 * @param params
 */
export function getAllDictData(params) {
  return request({
    url: "/sys/dict/type/list/all",
    method: "get",
    params,
  });
}

export function doDictSave(data) {
  return request({
    url: "/sys/dict/type/save",
    method: "post",
    data,
  });
}

export function doDictUpdate(data) {
  return request({
    url: "/sys/dict/type/update",
    method: "post",
    data,
  });
}

export function doDictDelete(id) {
  return request({
    url: "/sys/dict/type/delete/" + id,
    method: "post",
  });
}

export function getDictById(id) {
  return request({
    url: "/sys/dict/type/detail/" + id,
    method: "get",
  });
}

///item
export function getDictItemList(params) {
  return request({
    url: "/sys/dict/item/list",
    method: "post",
    params,
  });
}

export function getItemListByTypeId(params) {
  return request({
    url: "/sys/dict/item/list/type",
    method: "get",
    params,
  });
}

export function doDictItemSave(data) {
  return request({
    url: "/sys/dict/item/save",
    method: "post",
    data,
  });
}

export function doDictItemUpdate(data) {
  return request({
    url: "/sys/dict/item/update",
    method: "post",
    data,
  });
}

export function doDictItemDelete(id) {
  return request({
    url: "/sys/dict/item/delete/" + id,
    method: "post",
  });
}

export function getDictItemById(id) {
  return request({
    url: "/sys/dict/item/detail/" + id,
    method: "get",
  });
}

export function isTypeExist(params) {
  return request({
    url: "/sys/dict/type/exist",
    method: "post",
    params,
  });
}

export function isItemExist(params) {
  return request({
    url: "/sys/dict/item/exist",
    method: "post",
    params,
  });
}

/**
 * 根据字典分类ID获取字典项列表数据
 * @param typeId
 */
export function getDictItemsByTypeId(typeId) {
  return request({
    url: "/sys/dict/item/byid/" + typeId,
    method: "post",
  });
}

/**
 * 根据字典分类名称获取字典项列表数据
 * @param typeName
 */
export function getDictItemsByTypeName(typeName) {
  return request({
    url: "/sys/dict/item/byname/" + typeName,
    method: "post",
  });
}
