<!--
  - /*
  -  *
  -  *
  -  *      Copyright 2020-2021 Luter.me
  -  *
  -  *      Licensed under the Apache License, Version 2.0 (the "License");
  -  *      you may not use this file except in compliance with the License.
  -  *      You may obtain a copy of the License at
  -  *
  -  *        http://www.apache.org/licenses/LICENSE-2.0
  -  *
  -  *      Unless required by applicable law or agreed to in writing, software
  -  *      distributed under the License is distributed on an "AS IS" BASIS,
  -  *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  -  *      See the License for the specific language governing permissions and
  -  *      limitations under the License.
  -  *
  -  *
  -  */
  -->

<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <editorImage
      ref="upDialog"
      :action-url="actionUrl"
      @success="imageSuccessCBK"
    />
  </div>
</template>

<script>
  import editorImage from "./components/EditorImage";
  import plugins from "./plugins";
  import toolbar from "./toolbar";
  import load from "./dynamicLoadScript";

  const tinymceCDN =
    // "https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.5/tinymce.min.js";
    // "https://cdn.jsdelivr.net/npm/tinymce@5.6.1/tinymce.min.js";
    "/static/vendor/tinymce/tinymce.min.js";
  //图片上传后台地址
  const imageUploadUrl = "https://httpbin.org/post";
  export default {
    name: "TinyMce",
    components: { editorImage },
    props: {
      id: {
        type: String,
        default: function () {
          return (
            "vue-tinymce-" +
            +new Date() +
            ((Math.random() * 1000).toFixed(0) + "")
          );
        },
      },
      value: {
        type: String,
        default: "",
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return [];
        },
      },
      menubar: {
        type: String,
        default: "",
      },
      height: {
        type: [Number, String],
        required: false,
        default: 540,
      },
      width: {
        type: [Number, String],
        required: false,
        default: "auto",
      },
    },
    data() {
      return {
        actionUrl: imageUploadUrl,
        hasChange: false,
        hasInit: false,
        tinymceId: this.id,
        fullscreen: false,
        languageTypeList: {
          en: "en",
          "zh-CN": "zh_CN",
          "zh-TW": "zh_CN",
          es: "es_MX",
          ja: "ja",
        },
      };
    },
    computed: {
      language() {
        //读取系统当前语言
        console.log("语言", this.$store.getters["settings/language"]);
        return this.languageTypeList[this.$store.getters["settings/language"]];
      },
      containerWidth() {
        const width = this.width;
        if (/^[\d]+(\.[\d]+)?$/.test(width)) {
          // matches `100`, `'100'`
          return `${width}px`;
        }
        return width;
      },
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(val || "")
          );
        }
      },
      language() {
        console.log("语言变化》。。。");
        this.destroyTinymce();
        this.$nextTick(() => this.initTinymce());
      },
    },
    mounted() {
      this.init();
    },
    activated() {
      if (window.tinymce) {
        this.initTinymce();
      }
    },
    deactivated() {
      this.destroyTinymce();
    },
    destroyed() {
      this.destroyTinymce();
    },
    methods: {
      init() {
        // dynamic load tinymce from cdn
        load(tinymceCDN, (err) => {
          if (err) {
            this.$message.error(err.message);
            return;
          }
          this.initTinymce();
        });
      },
      initTinymce() {
        const _this = this;
        window.tinymce.init({
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:12px }",
          language: this.language,
          // language_url:
          //   "https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.5/langs/" +
          //   this.language +
          //   ".js",
          selector: `#${this.tinymceId}`,
          height: this.height,
          body_class: "panel-body ",
          //拖动图片四角进行缩放
          object_resizing: "img",
          //缩放的时候保持比例
          resize_img_proportional: true,
          //工具栏是否显示
          toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
          toolbar_mode: "floating",
          //菜单栏要不要显示，false:不显示
          menubar: this.menubar,
          plugins: plugins,
          end_container_on_empty_block: true,
          powerpaste_word_import: "clean",
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: "square",
          advlist_number_styles: "default",
          imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
          default_link_target: "_blank",
          link_title: false,
          // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
          nonbreaking_force_tab: true,
          //别显示版权信息
          branding: false,
          a11y_advanced_options: true,
          file_picker_types: "image",
          image_caption: true,
          image_advtab: true,
          image_description: true,
          init_instance_callback: (editor) => {
            if (_this.value) {
              editor.setContent(_this.value);
            }
            console.log("tinyMCE 初始化");
            _this.hasInit = true;
            editor.on("NodeChange Change KeyUp SetContent", () => {
              this.hasChange = true;
              this.$emit("input", editor.getContent());
            });
          },
          setup(editor) {
            editor.on("FullscreenStateChanged", (e) => {
              _this.fullscreen = e.state;
            });
            editor.ui.registry.addButton("uploadImagesButton", {
              icon: "browse",
              tooltip: "上传一张或者多张图片",
              onAction: function () {
                console.log(_this.$refs["upDialog"]);
                _this.$refs["upDialog"].dialogVisible = true;
              },
            });
          },
          convert_urls: false,
          // 设置为“true”即允许粘贴图像，而将其设置为“false”则不允许粘贴图像。
          paste_data_images: true,
          file_browser_callback_types: "file image media",
          // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
          /* and here's our custom image picker*/
          // file_picker_callback: function (cb, value, meta) {
          //   var input = document.createElement("input");
          //   input.setAttribute("type", "file");
          //   input.setAttribute("accept", "image/*");
          //   /*
          //     Note: In modern browsers input[type="file"] is functional without
          //     even adding it to the DOM, but that might not be the case in some older
          //     or quirky browsers like IE, so you might want to add it to the DOM
          //     just in case, and visually hide it. And do not forget do remove it
          //     once you do not need it anymore.
          //   */
          //   input.onchange = function () {
          //     var file = this.files[0];
          //     var reader = new FileReader();
          //     reader.onload = function () {
          //       /*
          //         Note: Now we need to register the blob in TinyMCEs image blob
          //         registry. In the next release this part hopefully won't be
          //         necessary, as we are looking to handle it internally.
          //       */
          //       var id = "blobid" + new Date().getTime();
          //       var blobCache = tinymce.activeEditor.editorUpload.blobCache;
          //       var base64 = reader.result.split(",")[1];
          //       var blobInfo = blobCache.create(id, file, base64);
          //       blobCache.add(blobInfo);
          //       /* call the callback and populate the Title field with the file name */
          //       cb(blobInfo.blobUri(), { title: file.name });
          //     };
          //     reader.readAsDataURL(file);
          //   };
          //   input.click();
          // },
          // 如需ajax上传,可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
          file_picker_callback: function (callback, value, meta) {
            console.log("执行:file_picker_callback");
            // 要先模拟出一个input用于上传本地文件
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            // 你可以给input加accept属性来限制上传的文件类型
            // 例如：input.setAttribute('accept', '.jpg,.png');
            input.click();
            input.onchange = function () {
              let file = this.files[0];
              let xhr, formData;
              xhr = new XMLHttpRequest();
              xhr.withCredentials = false;
              //post到后台
              xhr.open("POST", imageUploadUrl);
              xhr.onload = function () {
                //后端返回结果判断和数据解析，此处根据后端实际返回结果处理
                if (xhr.status !== 200) {
                  failure("HTTP Error: " + xhr.status);
                  return;
                }
                let json = JSON.parse(xhr.responseText);
                /* if (!json || typeof json.data.uri !== "string") {
                                                                                                                                                                  return;
                                                                                                                                                                }*/
                // callback(json.data.uri);
                callback(json.files.file);
              };
              formData = new FormData();
              formData.append("file", file, file.name);
              xhr.send(formData);
            };
          },
          //自动上传,开启后，拷贝黏贴图片，剪裁图片，都会自动执行下面这个方法上传到服务器
          automatic_uploads: true,
          images_upload_handler: function (blobInfo, success, failure) {
            console.log("执行:images_upload_handler");
            var xhr, formData;
            xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            //post到后台
            xhr.open("POST", imageUploadUrl);
            xhr.onload = function () {
              //后端返回结果判断和数据解析，此处根据后端实际返回结果处理
              var json;
              if (xhr.status !== 200) {
                failure("HTTP Error: " + xhr.status);
                return;
              }
              json = JSON.parse(xhr.responseText);
              // if (!json || typeof json.data.uri !== "string") {
              //   failure("Invalid JSON: " + xhr.responseText);
              //   return;
              // }
              // success(json.data.uri);
              success(json.files.file);
            };
            formData = new FormData();
            formData.append("file", blobInfo.blob());
            xhr.send(formData);
          },
          // it will try to keep these URLs intact
          // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
          // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions

          // 整合七牛上传
          // images_dataimg_filter(img) {
          //   setTimeout(() => {
          //     const $image = $(img);
          //     $image.removeAttr('width');
          //     $image.removeAttr('height');
          //     if ($image[0].height && $image[0].width) {
          //       $image.attr('data-wscntype', 'image');
          //       $image.attr('data-wscnh', $image[0].height);
          //       $image.attr('data-wscnw', $image[0].width);
          //       $image.addClass('wscnph');
          //     }
          //   }, 0);
          //   return img
          // },
          // images_upload_handler(blobInfo, success, failure, progress) {
          //   progress(0);
          //   const token = _this.$store.getters.token;
          //   getToken(token).then(response => {
          //     const url = response.data.qiniu_url;
          //     const formData = new FormData();
          //     formData.append('token', response.data.qiniu_token);
          //     formData.append('key', response.data.qiniu_key);
          //     formData.append('file', blobInfo.blob(), url);
          //     upload(formData).then(() => {
          //       success(url);
          //       progress(100);
          //     })
          //   }).catch(err => {
          //     failure('出现未知问题，刷新页面，或者联系程序员')
          //     console.log(err);
          //   });
          // },
        });
      },
      destroyTinymce() {
        const tinymce = window.tinymce.get(this.tinymceId);
        if (this.fullscreen) {
          tinymce.execCommand("mceFullScreen");
        }

        if (tinymce) {
          tinymce.destroy();
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value);
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent();
      },
      /**
       * 批量上传组件上传完毕提交后，将上传图片写入tinymce内容区域
       * 此处需要根据后端返回数据实际格式修改
       * @param arr
       */
      imageSuccessCBK(arr) {
        arr.forEach((v) =>
          window.tinymce
            .get(this.tinymceId)
            .insertContent(`<img class="wscnph" src="${v.url}" >`)
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container {
    ::v-deep {
      .mce-fullscreen {
        z-index: 10000;
      }
    }
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .mce-toolbar .mce-btn-group {
    width: 100%;
  }

  .mce-toolbar .mce-btn-group .mce-btn.mce-last {
    float: right;
  }
</style>
