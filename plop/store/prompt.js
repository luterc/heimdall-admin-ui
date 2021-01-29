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

const { notEmpty } = require("../utils.js");

module.exports = {
  description: "生成vuex Store",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "请输入store名字，不要重复! name:",
      validate: notEmpty("name"),
    },
  ],
  actions(data) {
    const name = "{{name}}";
    return [
      {
        type: "add",
        path: `gen/store/modules/${name}.js`,
        skipIfExists: true,
        templateFile: "plop/store/index.hbs",
        data: { name: name },
      },
    ];
  },
};
