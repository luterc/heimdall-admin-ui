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

export default {
  base: {
    title: "Heimdall 权限管理系统",
  },
  router: {
    401: "无权访问",
    404: "404",
    Login: "登录",
    Register: "注册",
    Index: "首页",
    Home: "首页",
    UserCenter: "个人中心",
    Logout: "退出登录",
    Sys: "系统管理",
    SysUser: "用户管理",
    SysRole: "角色管理",
  },
  datepicker: {
    placeholder: "请选择日期",
  },
  commons: {
    baseConfirm: {
      title: "提示",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    },
    baseAlert: {
      title: "提示",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    },
  },
  buttons: {
    saveText: "新增",
    updateText: "修改",
    deleteText: "删除",
    searchText: "搜索",
    resetText: "重置",
    exportCSVText: "导出到CSV",
    exportExcelText: "导出到Excel",
    exportingText: "正在导出...",
  },
  layout: {
    errorLog: {
      title: "前端异常信息",
      url: "报错页面URL",
      message: "错误信息",
      stack: "错误详情",
      detail: "查看详情",
      action: "操作",
      cancel: "取 消",
      clearAll: "全部清除",
      time: "发生时间",
      baidu: "百度搜索",
      google: "谷歌搜索",
    },
    avatar: {
      confirmText: "您确定要退出吗 ?",
    },
    themeBar: {
      title: "外观配置",
      reset: "恢复默认",
      confirm: "确定",
      theme: {
        label: " 主题 ",
        default: "默认",
        green: "绿色",
        glory: "金色",
        white: "纯白",
        blue: "深蓝",
      },
      color: {
        label: "组件主色调",
      },
      layout: {
        label: "页面布局",
        vertical: "垂直布局",
        horizontal: "水平布局",
      },
      header: {
        label: "顶部标题栏",
        fixed: "固定",
        noFixed: "不固定",
      },
      tabsBar: {
        label: "标签页",
        show: "开启",
        hide: "关闭 ",
      },
    },
    settings: {
      title: "外观配置",
      reset: "恢复默认",
      confirm: "确定",
      theme: {
        label: " 主题 ",
        default: "默认",
        green: "绿色",
        glory: "金色",
        white: "纯白",
        blue: "深蓝",
      },
      color: {
        label: "组件主色调",
      },
      layout: {
        label: "页面布局",
        vertical: "垂直布局",
        horizontal: "水平布局",
      },
      header: {
        label: "顶部标题栏",
        fixed: "固定",
        noFixed: "不固定",
      },
      tabsBar: {
        label: "标签页",
        show: "开启",
        hide: "关闭 ",
      },
    },
    navBar: {
      color: "组件颜色",
      theme: "界面配置",
      language: "切换语言",
      refresh: "刷新页面",
      fullscreen: "全屏/退出全屏",
      size: "组件大小",
    },
    tabsBar: {
      CloseCurrent: "关闭本页",
      CloseOther: "关闭其他",
      CloseLeft: "关闭左侧",
      CloseRight: "关闭右侧",
      CloseAll: "全部关闭",
      Refresh: "刷新",
    },
    footer: {
      CopyrightText: "版权所有 ",
    },
    sizeSelect: {
      defaultText: "默认",
      mediumText: "中等",
      smallText: "较小",
      miniText: "迷你",
      successMessage: "控件大小切换成功",
    },
  },
  views: {
    login: {
      loginText: "欢迎登录",
      loginBtn: "登  录",
      NoAccoutText: "没有账号?现在   ",
      registerLinkText: "注册",
      captchaPlaceholder: "请输入图形验证码",
      passwordPlaceholder: "请输入密码",
      usernamePlaceholder: "请输入账号",
      passwordValidText: "密码不能少于6位",
    },
    register: {
      registerText: "欢迎注册",
      getSmsCode: "获取验证码",
      hasAccoutText: "已有账户",
      loginLinkText: " , 现在登录",
      registerBtnText: "  注  册 ",
    },
  },
  request: {
    serverErrorText: "后端接口异常",
    badRequestText: "请求错误",
    timeoutText: "网络请求超时,请刷新页面后再试",
    networkErrorText: "网络连接异常",
    logExpireTitle: "未登录",
    logExpireText: "您当前未登录系统或者登录已经失效，请登录后操作",
    noPermText: "您不具备此操作权限",
    failTitle: "失败",
  },
};
