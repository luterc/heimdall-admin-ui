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
    title: "Heimdall Security Management System",
  },
  router: {
    401: "UnAuthorized",
    404: "Not Found",
    Login: "Sign In",
    Register: "Register",
    Index: "Index",
    Home: "Home",
    UserCenter: "User Center",
    Logout: "Sign Out",
    /////
    Components: "Components",
    Icons: "Icons",
    FontIcon: "Font Icon",
    SvgIcon: "Svg Icon",
    Crud: "Crud",
    IconPicker: "Font Icon Picker",
    Charts: "Charts",
    ChartsOne: "Charts One",
    ChartsTwo: "Charts Two",
    Table: "Tables",
    Card: "Image Card",
    Product: "Product List",
    CountTo: " Count To",
    Editors: "Editors",
    TinyMce: " TinyMce ",
    MarkDown: "MarkDown ",
    IFrame: "IFrame ",
    ExternalUrl: "External Url",
    ImageCropper: "Image Cropper",
    Print: "Print",
    FileManager: "File Manager",
    //////
    Sys: "Sys Manage",
    SysUser: "Sys Users",
    SysRole: "Sys Roles",
    SysSysLog: "Sys Logs",
    SysResource: "Sys Resources",
    SysMessage: "Sys Messages",
    SysDepartment: "Department",
    SysPost: "Job Post",
  },
  datepicker: {
    placeholder: "please select date",
  },
  commons: {
    baseConfirm: {
      title: "attention",
      confirmButtonText: "Ok",
      cancelButtonText: "Cancel",
    },
    baseAlert: {
      title: "attention",
      confirmButtonText: "Ok",
      cancelButtonText: "Cancel",
    },
  },
  buttons: {
    saveText: "Create",
    updateText: "Update",
    deleteText: "Delete",
    searchText: "Search",
    resetText: "Reset ",
    exportCSVText: "Export to CSV",
    exportExcelText: "Export to Excel",
    exportingText: "Exporting ...",
  },
  layout: {
    errorLog: {
      title: "error log",
      url: "url",
      message: "error",
      stack: "stack",
      detail: "view detail",
      action: "action",
      cancel: "cancel",
      clearAll: "clear all",
      time: "occur time",
      baidu: "search by BaiDu",
      google: "search by Google",
    },
    avatar: {
      confirmText: "sign out now ,are you sure ?",
    },
    settings: {
      title: "Theme Config",
      reset: "reset to default",
      confirm: "apply change",
      theme: {
        label: " Theme ",
        default: "default",
        green: "green",
        glory: "glory",
        white: "white",
        blue: "blue",
      },
      color: {
        label: "Primary Color",
      },
      layout: {
        label: "Layout",
        vertical: "Vertical",
        horizontal: "Horizontal",
      },
      header: {
        label: "Fixed",
        fixed: "Fixed",
        noFixed: "Not Fixed",
      },
      tabsBar: {
        label: "Tabs Bar",
        show: "enabled",
        hide: "disabled ",
      },
    },
    themeBar: {
      title: "Theme Config",
      reset: "reset to default",
      confirm: "apply change",
      theme: {
        label: " Theme ",
        default: "default",
        green: "green",
        glory: "glory",
        white: "white",
        blue: "blue",
      },
      color: {
        label: "Primary Color",
      },
      layout: {
        label: "Layout",
        vertical: "Vertical",
        horizontal: "Horizontal",
      },
      header: {
        label: "Fixed",
        fixed: "Fixed",
        noFixed: "Not Fixed",
      },
      tabsBar: {
        label: "Tabs Bar",
        show: "enabled",
        hide: "disabled ",
      },
    },
    navBar: {
      color: " color",
      theme: " theme",
      language: " locale",
      refresh: "refresh content",
      fullscreen: "fullscreen switch",
      size: "Components Size",
    },
    tabsBar: {
      CloseCurrent: "Close Current",
      CloseOther: "Close Other",
      CloseLeft: "Close Left",
      CloseRight: "Close Right",
      CloseAll: "Close All",
      Refresh: "Refresh",
    },
    footer: {
      CopyrightText: "Copyright ",
    },
    sizeSelect: {
      defaultText: "Big",
      mediumText: "Medium",
      smallText: "Small",
      miniText: "Mini",
      successMessage: "Switch Size Success",
    },
  },
  views: {
    login: {
      loginText: "Please Sign In",
      loginBtn: "Sign In",
      NoAccoutText: "New to Heimdall-Admin?  ",
      registerLinkText: "  Create an account",
      captchaText: "Captcha",
      captchaPlaceholder: "input captcha",
      passwordPlaceholder: "input password",
      usernamePlaceholder: "input username",
      passwordValidText: "password at least 6 chars",
    },
    register: {
      getSmsCode: "get Sms code",
      hasAccoutText: "I already have an account",
      loginLinkText: " , Sign in now ",
      registerText: "Wellcome to Sign Up",
      registerBtnText: "  Sign    Up  ",
    },
  },
  request: {
    serverErrorText: "INTERNAL SERVER ERROR",
    badRequestText: "BAD REQUEST",
    timeoutText: "REQUEST TIMEOUT",
    networkErrorText: "NETWORK ERROR",
    logExpireTitle: "Please Login",
    logExpireText: "Please Login first",
    noPermText: "You do not have the permission",
    failTitle: "Failed",
  },
};
