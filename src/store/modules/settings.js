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
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */

import defaultSettings from "@/config/settings";
const size = localStorage.getItem("size") || "default";
import { getLanguage, setI18nLanguage } from "@/lang/index";
const { tabsBar, logo, layout, header, themeBar } = defaultSettings;
const theme = JSON.parse(localStorage.getItem("theme")) || {};
const colorName = localStorage.getItem("colorName");

const state = {
  tabsBar: theme.tabsBar || tabsBar,
  logo,
  collapse: false,
  layout:
    theme.layout !== "vertical" || theme.layout !== "horizontal"
      ? layout
      : theme.layout,
  header: theme.header || header,
  device: "desktop",
  themeBar,
  colorName: colorName,
  size: size,
  language: getLanguage(),
};
const getters = {
  collapse: (state) => state.collapse,
  device: (state) => state.device,
  header: (state) => state.header,
  layout: (state) => state.layout,
  logo: (state) => state.logo,
  tabsBar: (state) => state.tabsBar,
  themeBar: (state) => state.themeBar,
  colorName: (state) => state.colorName,
  size: (state) => state.size,
  language: (state) => state.language,
};
const mutations = {
  changeSize: (state, size) => {
    state.size = size;
    localStorage.setItem("size", size);
  },
  changeColorName: (state, colorName) => {
    state.colorName = colorName;
    localStorage.setItem("colorName", colorName);
  },
  changeLayout: (state, layout) => {
    state.layout = layout;
  },
  changeHeader: (state, header) => {
    state.header = header;
  },
  changeTabsBar: (state, tabsBar) => {
    state.tabsBar = tabsBar;
  },
  setLanguage: (state, language) => {
    state.language = language;
    setI18nLanguage(language);
  },
  changeCollapse: (state) => {
    state.collapse = !state.collapse;
  },
  foldSideBar: (state) => {
    state.collapse = true;
  },
  openSideBar: (state) => {
    state.collapse = false;
  },
  toggleDevice: (state, device) => {
    state.device = device;
  },
};
const actions = {
  changeSize({ commit }, size) {
    commit("changeSize", size);
  },
  changeColorName({ commit }, colorName) {
    commit("changeColorName", colorName);
  },
  changeLayout({ commit }, layout) {
    commit("changeLayout", layout);
  },
  changeHeader({ commit }, header) {
    commit("changeHeader", header);
  },
  changeTabsBar({ commit }, tabsBar) {
    commit("changeTabsBar", tabsBar);
  },
  setLanguage({ commit }, language) {
    commit("setLanguage", language);
  },
  changeCollapse({ commit }) {
    commit("changeCollapse");
  },
  foldSideBar({ commit }) {
    commit("foldSideBar");
  },
  openSideBar({ commit }) {
    commit("openSideBar");
  },
  toggleDevice({ commit }, device) {
    commit("toggleDevice", device);
  },
};
export default { state, getters, mutations, actions };
