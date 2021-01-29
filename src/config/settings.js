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
 * @description 主题配置
 */
const theme = {
  //是否国定头部 固定fixed 不固定noFixed
  header: "fixed",
  //横纵布局 horizontal vertical
  layout: "vertical",
  //是否开启主题配置按钮
  themeBar: true,
  //是否显示多标签页
  tabsBar: false,
};
/**
 * @description 网络相关配置
 **/
const network = {
  // 默认的接口地址 如果是开发环境和生产环境走mock-server，当然你也可以选择自己配置成需要的接口地址
  baseURL: process.env.NODE_ENV === "development" ? "" : "api",
  //配后端数据的接收方式application/json;charset=UTF-8或者application/x-www-form-urlencoded;charset=UTF-8
  contentType: "application/json;charset=UTF-8",
  //form data 形式提交数据
  formContentType: "application/x-www-form-urlencoded;charset=UTF-8",
  //文件上传形式请求类型
  multipartContentType: "multipart/form-data;charset=UTF-8",
  //消息框消失时间
  messageDuration: 3000,
  //最长请求时间
  requestTimeout: 30000,
  //操作正常code，支持String、Array、int多种类型,这个需要根据后台接口调整
  successCode: [200, 0, -1],
};
/**
 * @description 通用配置
 */
const setting = {
  // 开发以及部署时的URL
  publicPath: "/",
  // 生产环境构建文件的目录名
  outputDir: "dist",
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: "static",
  // 开发环境自动eslint
  lintOnSave: process.env.NODE_ENV === "development",
  // Babel 转译范围,进行编译的依赖,echart的
  transpileDependencies: ["vue-echarts", "resize-detector"],
  //标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
  title: "Heimdall-Admin",
  //开发环境端口号
  devPort: "8000",
  //版本号
  version: process.env.VUE_APP_VERSION,
  //版权
  copyright: process.env.VUE_APP_AUTHOR,
  //作者主页
  homepage: process.env.VUE_APP_HOMEPAGE,
  //是否显示页面底部自定义版权信息
  footerCopyright: true,
  //是否显示顶部进度条
  progressBar: true,
  //缓存路由的最大数量
  keepAliveMaxNum: 99,
  // 路由模式，可选值为 history 或 hash
  routerMode: "hash",
  //不经过token校验的路由
  routesWhiteList: ["/login", "/register", "/404", "/401", "/redirect"],
  //加载时显示文字
  loadingText: "正在加载中...",
  //token名称,也就是通过headers中传给后台的token名称
  tokenName: "HSessionId",
  //token在localStorage、sessionStorage存储的key的名称
  tokenTableName: "heimdall-token",
  //token存储位置localStorage sessionStorage
  storage: "localStorage",
  //退到登录页时是否记录本次的路由,最后一次打开的页面会在登录后自动打开
  recordRoute: true,
  //是否显示logo
  logo: true,
  //页面内容区域右上角github的角标
  githubCorner: true,
  //是否显示在页面高亮错误
  errorLog: ["development"],
  //frontend和backend两种方式，前者后端权限只控制permissions
  // backend方式完全交给后端,前端只负责加载
  authentication: "backend", // frontend or  backend
  //vertical布局时是否只保持一个子菜单的展开
  uniqueOpened: true,
  //vertical布局时默认展开的菜单path
  defaultOpened: ["/sys"],
  //需要自动注入并加载的模块
  providePlugin: {},
  //主题风格设置入口:侧边设置还是顶部设置，true:侧边设置,false:顶部设置
  showSetting: true,
  //是否显示顶部的面包屑导航
  breadcrumb: true,
};

//自定义配置
const config = require("./config");
//导出配置
module.exports = Object.assign({}, setting, theme, network, config);
