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
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑
 */

import Vue from "vue";
import { login, getUserInfo, logout } from "@/api/sys/user";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/utils/accessToken";
import { resetRouter } from "@/router";
import { tokenName } from "@/config/settings";

import { timeFix } from "@/utils";

const state = {
  accessToken: getAccessToken(),
  username: "",
  avatar: "",
  permissions: [],
  currentUser: null,
};
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  currentUser: (state) => state.currentUser,
  permissions: (state) => state.permissions,
};
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
    setAccessToken(accessToken);
  },
  setUsername(state, username) {
    state.username = username;
  },
  setCurrentUser(state, currentUser) {
    state.currentUser = currentUser;
  },
  setAvatar(state, avatar) {
    state.avatar = avatar;
  },
  setPermissions(state, permissions) {
    state.permissions = permissions;
  },
};
const actions = {
  setPermissions({ commit }, permissions) {
    commit("setPermissions", permissions);
  },
  async login({ commit }, userInfo) {
    const { data } = await login(userInfo);
    const accessToken = data;
    if (accessToken) {
      commit("setAccessToken", accessToken);
      Vue.prototype.$baseNotify(
        `欢迎登录 : ${userInfo.username}`,
        "success",
        timeFix()
      );
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        "error"
      );
    }
  },
  async getUserInfo({ commit, state }) {
    const { data } = await getUserInfo();
    if (!data) {
      Vue.prototype.$baseMessage("验证失败，请重新登录...", "error");
      return false;
    }
    let { perms, username, avatar } = data;
    commit("setUsername", username);
    commit("setAvatar", avatar);
    commit("setCurrentUser", data);
    console.log("获取登录用户信息:", data);
    //如果拿到了权限
    if (!perms) {
      perms = ["no:right:now"];
      console.warn("此用户无任何权限,设置默认权限标识");
    }
    commit("setPermissions", perms);
    return perms;
  },
  async logout({ dispatch }) {
    await logout();
    await dispatch("resetAccessToken");
    await resetRouter();
  },
  resetAccessToken({ commit, state }) {
    commit("setPermissions", []);
    commit("setAccessToken", "");
    removeAccessToken();
  },
};
export default { state, getters, mutations, actions };
