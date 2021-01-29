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

import { storage, tokenTableName } from "@/config/settings";

/**
 * @description 获取accessToken
 */
export function getAccessToken() {
  if (storage) {
    if ("localStorage" === storage) {
      return localStorage.getItem(tokenTableName);
    } else if ("sessionStorage" === storage) {
      return sessionStorage.getItem(tokenTableName);
    } else {
      return localStorage.getItem(tokenTableName);
    }
  } else {
    return localStorage.getItem(tokenTableName);
  }
}

/**
 * @description 存储accessToken
 * @param accessToken
 * @returns {void|*}
 */
export function setAccessToken(accessToken) {
  console.warn("保存token到存储:", storage, accessToken);
  if (storage) {
    if ("localStorage" === storage) {
      return localStorage.setItem(tokenTableName, accessToken);
    } else if ("sessionStorage" === storage) {
      return sessionStorage.setItem(tokenTableName, accessToken);
    } else {
      return localStorage.setItem(tokenTableName, accessToken);
    }
  } else {
    return localStorage.setItem(tokenTableName, accessToken);
  }
}

/**
 * @description 移除accessToken
 * @returns {void|Promise<void>}
 */
export function removeAccessToken() {
  console.warn("移除token,key:", tokenTableName);
  if (storage) {
    if ("localStorage" === storage) {
      return localStorage.removeItem(tokenTableName);
    } else if ("sessionStorage" === storage) {
      return sessionStorage.clear();
    } else {
      return localStorage.removeItem(tokenTableName);
    }
  } else {
    return localStorage.removeItem(tokenTableName);
  }
}
