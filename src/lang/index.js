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

import Vue from "vue";
import VueI18n from "vue-i18n";
import elementEnLocale from "element-ui/lib/locale/lang/en"; // element-ui lang
import elementZhCNLocale from "element-ui/lib/locale/lang/zh-CN"; // element-ui lang
import elementZhTWLocale from "element-ui/lib/locale/lang/zh-TW"; // element-ui lang
import elementJaLocale from "element-ui/lib/locale/lang/ja"; // element-ui lang
import enUSLocale from "./locales/en";
import zhCNLocale from "./locales/zh-CN";
import jaLocale from "./locales/ja";
import zhTWLocale from "./locales/zh-TW";

const messages = {
  "zh-CN": {
    ...zhCNLocale,
    ...elementZhCNLocale,
  },
  "zh-TW": {
    ...zhTWLocale,
    ...elementZhTWLocale,
  },
  en: {
    ...enUSLocale,
    ...elementEnLocale,
  },
  ja: {
    ...jaLocale,
    ...elementJaLocale,
  },
};
Vue.use(VueI18n);

/**
 * 确定系统语系
 * @return {string}
 */
export function getLanguage() {
  const chooseLanguage = localStorage.getItem("language");
  if (chooseLanguage) {
    console.log("采用localStorage已经设置的语言:", chooseLanguage);
    return chooseLanguage;
  }
  const language = navigator.language || navigator.browserLanguage;
  console.log("采用浏览器获取到的语言:", language);
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      localStorage.setItem("language", locale);
      console.log("根据浏览器语言匹配到的Locale:", locale);
      return locale;
    }
  }
  console.log("没有匹配到任何语言，采取默认语言:", "zh-CN");
  localStorage.setItem("language", "zh-CN");
  return "zh-CN";
}

export function getLocales() {
  const locales = Object.keys(messages);
  console.log("系统支持的语言:", locales);
  return locales;
}

/**
 * 设置语系
 * @param lang
 * @return {*}
 */
export function setI18nLanguage(lang) {
  console.log("切换语言到:", lang);
  i18n.locale = lang;
  localStorage.setItem("language", lang);
  // document.querySelector("html").setAttribute("lang", lang);
  return lang;
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  //if not ,fallback to this
  fallbackLocale: "zh",
  // set locale messages
  messages,
  //no warning when not find
  silentTranslationWarn: true,
});
export default i18n;
