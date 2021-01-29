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
 * 全局需要注册的插件配置在这里
 */
import Vue from "vue";
import "./element";
//浏览器检测
import "./support";
//自定义样式
import "@/styles/style.scss";
//路由守卫
import "@/router/permission";
//前端错误日志
import "@/utils/errorLog";
//font awsome5 免费字体图标
import "./fontIcon";
//封装的分页插件
import "./pagination";
//svg图标
import "../svgIcon/index";
//自定义配置
import config from "@/config/config";

Vue.prototype.$config = config;
//自定义的增删改查页面组件全局注册
import Crud from "@c/Crud/index";

Vue.use(Crud);
//可以最大化的dialog
import MaxDialog from "@c/MaxmizedDialog/index";

Vue.use(MaxDialog);
//Ui通用组件封装，绑定到VUE实例，可通过this调用
import Commons from "@/utils/commons";

Vue.use(Commons);
//sweetAlert2工具类全局注册
import sweetAlert2 from "@/utils/sweetAlert2";

Vue.use(sweetAlert2);
//引入animate.css
import animated from "animate.css";

Vue.use(animated);
//获取字典的方法全局注册
import { getDictItemsByTypeName } from "@/api/sys/dict";

Vue.prototype.getDictItemsByTypeName = getDictItemsByTypeName;
// 搜索文本高亮显示全局注册
import { highLightText } from "@/utils";

Vue.prototype.highLightText = highLightText;
//页面打印
import Print from "@/utils/print";

Vue.use(Print);
