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

import json2csv from "json2csv";

/**
 * 判断浏览器是否是IE
 * @returns {boolean}
 */
function isIE() {
  let isIE = false;
  if (
    navigator.userAgent.indexOf("compatible") > -1 &&
    navigator.userAgent.indexOf("MSIE") > -1
  ) {
    // ie浏览器
    isIE = true;
  }
  if (navigator.userAgent.indexOf("Trident") > -1) {
    // edge 浏览器
    isIE = true;
  }
  return isIE;
}

/**
 * 数据转换
 * @param row
 * @param columns
 * @returns {{}}
 */
function getRow(row, columns) {
  let obj = {};
  columns.forEach((col) => {
    let val = row[col.prop];
    if (col.formatter) {
      val = col.formatter(row, col, val);
    }
    obj[col.prop] = val;
  });
  return obj;
}

/**
 *
 * @param data 要导出的数据
 * @param columns 导出列配置，如：[{"prop":"ID","label":"序号"},....]
 * @param fileName 导出生成的文件名称
 * @constructor
 */
export default function ExportCsv(data, columns, fileName) {
  //导出的数据行
  const rows = data.map((t) => getRow(t, columns));
  //导出的数据列标题
  const fields = columns.map((t) => {
    return { value: t.prop, label: t.label };
  });
  try {
    const result = json2csv.parse(rows, {
      fields: fields,
      excelStrings: true,
    });
    if (isIE()) {
      // IE10以及Edge浏览器
      var BOM = "\uFEFF";
      // 文件转Blob格式
      var csvData = new Blob([BOM + result], { type: "text/csv" });
      navigator.msSaveBlob(csvData, `${fileName}.csv`);
    } else {
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + result;
      const link = document.createElement("a");
      link.href = encodeURI(csvContent);
      link.download = `${fileName}.csv`;
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link); // Required for FF
    }
  } catch (err) {
    alert(err);
  }
}
