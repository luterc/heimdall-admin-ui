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
  <div class="cropper-wrap">
    <div class="cropper-alert-mask" :class="{ show: imgHasLoad }"></div>
    <div class="cropper-alert" :class="{ show: imgHasLoad }">
      <div class="cropper">
        <span class="layout-icon-wrap">
          <i class="el-icon-circle-close" @click="imgHasLoad = false"></i>
        </span>
        <div class="cropper-box">
          <img ref="uploadPreview" style="width: 100px; height: auto" />
        </div>
        <div class="cropper-res-wrap">
          <div id="cropperRes" class="cropper-res">
            <img style="width: 100px; height: 100px" />
          </div>
        </div>
      </div>
      <div class="cropper-btns-wrap">
        <el-button
          type="primary"
          :disabled="btnTips.disable"
          @click="finishCropImage"
        >
          {{ btnTips.value }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Cropper from "cropperjs";
  import "cropperjs/dist/cropper.min.css";
  export default {
    name: "CropperBox",

    //组件注册
    components: {},
    //指令注册
    directives: {},
    props: {
      options: {
        type: Object,
        default: function () {
          return {
            aspectRatio: 1,
            preview: "#cropperRes",
            zoomOnWheel: false,
            minCropBoxWidth: 50,
            viewMode: 2,
          };
        },
      },
    },

    data() {
      //数据
      return {
        cropper: null,
        imgHasLoad: false,
        cropperHasInit: false,
        uploading: false,
        rawFile: null,
      };
    },
    //计算属性
    computed: {
      btnTips() {
        if (this.uploading) {
          return {
            value: "正在上传，请稍等",
            disable: true,
          };
        }
        return {
          value: "裁剪完成，立即上传",
          disable: false,
        };
      },
    },
    //监听属性
    watch: {
      imgHasLoad(val) {
        if (!val) {
          this.uploading = false;
        }
      },
    },
    //创建完成
    created() {},
    //挂载完成
    mounted() {},
    //创建之前
    beforeCreate() {},
    //挂载之前
    beforeMount() {},
    //更新之前
    beforeUpdate() {},
    //更新之后
    updated() {},
    //销毁之前
    beforeDestroy() {},
    //销毁完成
    destroyed() {},
    //页面激活,
    activated() {},
    //方法
    methods: {
      show() {
        this.imgHasLoad = true;
      },
      close() {
        this.imgHasLoad = false;
      },
      loadCropper(rawFile) {
        this.rawFile = rawFile;
        const URL = window.URL || window.webkitURL;
        const blobURL = URL.createObjectURL(rawFile);
        var image = this.$refs.uploadPreview;
        if (!this.cropper) this.cropper = new Cropper(image, this.options);
        this.cropper.reset().replace(blobURL);
      },
      // 完成裁剪，将文件进行格式转换，发送给父组件，请自行选择普通文件格式还是blob格式，格式转换方法已封装，请看下面的两个方法
      finishCropImage() {
        this.uploading = true;
        const croppedCanvas = this.cropper.getCroppedCanvas();
        const croppedDataUrl = croppedCanvas.toDataURL(this.rawFile.type);
        // const blob = this.dataURLtoBlob(croppedDataUrl);
        this.$emit("finishCropImage", croppedDataUrl);
        this.uploading = false;
      },
      // dataUrl 转 blob
      dataURLtoBlob(dataurl) {
        var arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      },
      //base64转为普通文件格式
      base64toFile(dataurl, filename = "file") {
        let arr = dataurl.split(",");
        let mime = arr[0].match(/:(.*?);/)[1];
        let suffix = mime.split("/")[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], `${filename}.${suffix}`, {
          type: mime,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .cropper-wrap {
    .cropper-alert-mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2000;
      background-color: rgba(#000000, 0.5);
      visibility: hidden;
      height: 0;
      transition: all 0.2s ease;

      &.show {
        visibility: visible;
        height: 100%;
      }
    }
    img {
      width: 100%;
    }
    .cropper-alert {
      opacity: 0;
      transition: all 0.3s ease;
      visibility: hidden;
      padding: 10px;
      position: fixed;
      z-index: 2000;
      top: 50px;
      left: 50%;
      transform: translateX(-50%) scale(2);
      background-color: #ffffff;
      border-radius: 5px;
      overflow: hidden;
      width: 100%;
      height: 100%;
      max-width: 500px;
      max-height: 470px;

      &.show {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) scale(1);
      }
    }

    .cropper {
      position: relative;
      max-width: 500px;
      max-height: 410px;
      height: 100%;
      padding: 10px;
      padding-right: 120px;
      @media (max-width: 1324px) {
        padding-top: 120px;
        padding-right: 10px;
      }
      background-color: #f9fbfc;

      .layout-icon-wrap {
        position: absolute;
        cursor: pointer;
        right: 0;
        top: 0;
        font-size: 20px;
      }

      .cropper-box {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
      }

      .cropper-res-wrap {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        @media (max-width: 1324px) {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        right: 0;
        width: 100px;
        height: auto;
        padding: 10px;
        background-color: #a8a8a8;
        box-sizing: content-box;

        .cropper-res {
          width: 100px;
          height: 100px;
          overflow: hidden;
          background-color: #ffffff;
        }
      }

      .cropper-btns-wrap {
        position: relative;
        margin-top: 20px;
      }
    }
  }
</style>
