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

const PageGenerator = require("./plop/page/prompt");
const MockGenerator = require("./plop/mock/prompt.js");
const ApiGenerator = require("./plop/api/prompt.js");
const CrudGenerator = require("./plop/crud/prompt.js");
const StoreGenerator = require("./plop/store/prompt.js");
const AllGenerator = require("./plop/all/prompt.js");
const TestGenerator = require("./plop/test/prompt.js");

module.exports = function (plop) {
  //转首字母大写
  plop.setHelper("upperFirst", function (text) {
    return text.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
  });
  plop.setHelper("timestamp", function (text) {
    return new Date().getTime();
  });
  plop.setGenerator("page", PageGenerator);
  plop.setGenerator("mock", MockGenerator);
  plop.setGenerator("api", ApiGenerator);
  plop.setGenerator("crud", CrudGenerator);
  plop.setGenerator("store", StoreGenerator);
  plop.setGenerator("all", AllGenerator);
  plop.setGenerator("test", TestGenerator);
};
