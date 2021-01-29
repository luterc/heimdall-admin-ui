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

import store from "@/store";

/**
 * 根据字典类型名称获取字典项目
 * @param dictArrayData
 * @param typeName
 * @returns []
 */
export function getDictByTypeName(dictArrayData, typeName) {
  let dict = dictArrayData.find((dict) => dict.name == typeName);
  if (dict && Array.isArray(dict.items)) {
    return dict.items;
  } else {
    console.error(`There is no dictionary type named: ${typeName}`);
  }
}

/**
 *根据某个字典项的value获取显示label
 * @param dictArrayData
 * @param typeName
 * @param value
 * @returns 成功了返回对应label ,失败返回原value
 */
export function getDictLabelByValue(dictArrayData, typeName, value) {
  let dicts = getDictByTypeName(dictArrayData, typeName);
  if (dicts) {
    if (value) {
      let item = dicts.find((dict) => dict.itemValue == value);
      if (item) {
        return item.label;
      } else {
        console.error(
          `There is no dictionary type named: ${typeName} and value is : ${value}`
        );
      }
    } else {
      console.error(
        `There is no dictionary type named: ${typeName} and value is : ${value}`
      );
    }
  } else {
    console.error(`There is no dictionary type named: ${typeName}`);
  }
  return value;
}

/**
 * 给定字典数组，从数组通过value匹配label
 * @param dictArrayData
 * @param value
 */
export function getDictsLabelByValue(dictArrayData, value) {
  if (dictArrayData && dictArrayData.length) {
    let item = dictArrayData.find((dict) => dict.itemValue == value);
    if (item) {
      return item.label;
    } else {
      console.error(`There is no dictionary  value is : ${value}`);
    }
  } else {
    console.error("the dictionary array is null");
  }
  return value;
}

/**
 * 给定字典数组，从数组通过label匹配 value
 * @param dictArrayData
 * @param label
 */
export function getDictsValueByLabel(dictArrayData, label) {
  if (dictArrayData && dictArrayData.length) {
    let item = dictArrayData.find((dict) => dict.label == label);
    if (item) {
      return item.itemValue;
    } else {
      console.error(`There is no dictionary with label  : ${label}`);
    }
  } else {
    console.error("the dictionary array is null");
  }
  return label;
}

/**
 *根据某个字典项的label获取value值
 * @param dictArrayData
 * @param typeName
 * @param label
 * @return 成功了返回value ,失败返回原label
 */
export function getDictValueByLabel(dictArrayData, typeName, label) {
  let dicts = getDictByTypeName(dictArrayData, typeName);
  if (dicts) {
    let item = dicts.find((dict) => dict.label == label);
    if (item) {
      return item.itemValue;
    } else {
      console.error(
        `There is no dictionary type named: ${typeName} and label is : ${label}`
      );
    }
  } else {
    console.error(`There is no dictionary type named: ${typeName}`);
  }
  return label;
}

/**
 * 从vuex中数据，根据字典类型名称获取所有字典项
 * @param typeName
 * @returns []
 */
export function getStoredDictByTypeName(typeName) {
  return getDictByTypeName(store.state.dict.dictData, typeName);
}

/**
 *从vuex中数据，根据字典的value获取显示label
 * @param typeName
 * @param value
 * @returns 成功了返回对应label ,失败返回原value
 */
export function getStoredDictLabelByValue(typeName, value) {
  return getDictLabelByValue(store.state.dict.dictData, typeName, value);
}

/**
 *从vuex中数据，根据字典的label获取value值
 * @param typeName
 * @param label
 * @return 成功了返回value ,失败返回原label
 */
export function getStoredDictValueByLabel(typeName, label) {
  return getDictValueByLabel(store.state.dict.dictData, typeName, label);
}
