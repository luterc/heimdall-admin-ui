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

const log = {};

/**
 * @description 返回这个样式的颜色值
 * @param {String} type 样式名称 [ primary | success | warning | danger | text ]
 */
export function typeColor(type = "default") {
  let color;
  switch (type) {
    case "primary":
      color = "#1089ff";
      break;
    case "success":
      color = "#52c41a";
      break;
    case "warning":
      color = "#fea638";
      break;
    case "danger":
      color = "#ff4d4f";
      break;
    case "default":
      color = "#35495E";
      break;
    default:
      color = type;
      break;
  }
  return color;
}

log.print = function (text, type = "default", back = false) {
  if (typeof text === "object") {
    // 如果是对象则调用打印对象方式
    console.dir(text);
    return;
  }
  if (back) {
    // 如果是打印带背景图的
    console.log(
      `%c ${text} `,
      `background:${typeColor(
        type
      )}; padding: 2px; border-radius: 2px;color: #fff;`
    );
  } else {
    console.log(`%c ${text} `, `color: ${typeColor(type)};`);
  }
};
log.pretty = function (title, text, type = "primary") {
  console.log(
    `%c ${title} %c ${text} %c`,
    `background:${typeColor(type)};border:1px solid ${typeColor(
      type
    )}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
    `border:1px solid ${typeColor(
      type
    )}; padding: 1px; border-radius: 0 2px 2px 0; color: ${typeColor(type)};`,
    "background:transparent"
  );
};

log.primary = function (text, back = false) {
  this.print(text, "primary", back);
};
log.success = function (text, back = false) {
  this.print(text, "success", back);
};
log.info = function (text, back = false) {
  this.print(text, "info", back);
};
log.warning = function (text, back = false) {
  this.print(text, "warning", back);
};
log.danger = function (text, back = false) {
  this.print(text, "danger", back);
};

export default log;
