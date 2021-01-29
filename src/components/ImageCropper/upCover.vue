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
    ref="coverOutWrap"
    class="cover-upload-wrap"
    :style="{
      width: width ? width + 'px' : '100%',
      height: calcHeight + 'px',
      maxWidth: maxWidth ? maxWidth + 'px' : '100px',
      maxHeight: maxHeight ? maxHeight + 'px' : '100px',
    }"
  >
    <el-upload
      ref="upload"
      class="cover-uploader"
      :show-file-list="false"
      :before-upload="beforeVipImageUpload"
      :auto-upload="false"
      :on-change="onFileChange"
      :on-progress="onUploadProgress"
      action="/aa/bb"
    >
      <div class="img-wrap">
        <img v-if="imageUrl" :src="imageUrl" class="cover" />
        <div class="img-mask-default" :class="{ 'img-mask': imageUrl }">
          <i class="el-icon-upload"></i>
          <div>{{ tip }}</div>
        </div>
      </div>
    </el-upload>
    <cropperBox
      ref="cropperBox"
      :options="options"
      @finishCropImage="finishCropImage"
    ></cropperBox>
  </div>
</template>
<script>
  import cropperBox from "./cropperBox";

  export default {
    name: "up-cover",
    components: {
      cropperBox,
    },
    props: {
      defaultImg: {
        type: String,
        default: function () {
          return "";
        },
      },
      ratio: {
        type: Number,
        // 裁剪结果宽高比
        default: function () {
          return 1;
        },
      },
      width: {
        type: [Number, String],
        default: function () {
          return "100%";
        },
      },
      height: {
        type: [Number, String],
        default: function () {
          return "100%";
        },
      },
      whRatio: {
        // 组件宽高比
        type: Number,
        default: function () {
          return 1;
        },
      },
      cropBoxResizable: Boolean, //是否可以修改裁剪框的尺寸
      maxWidth: {
        type: String,
        default: function () {
          return "";
        },
      },
      maxHeight: {
        type: String,
        default: function () {
          return "";
        },
      },
      tip: {
        type: String,
        default: function () {
          return "上传图片";
        },
      },
      maxSize: {
        // 最大选择图片的大小，单位M
        type: Number,
        default: function () {
          return 3;
        },
      },
    },
    data() {
      return {
        cropper: null,
        newFile: null,
        options: {
          aspectRatio: 2.166,
          preview: "#cropperRes",
          zoomOnWheel: false,
          cropBoxResizable: false,
          minCropBoxWidth: 50,
          viewMode: 2,
        },
        token: {},
        uploadProgress: 0,
        calcHeight: 0,
      };
    },
    computed: {
      imageUrl() {
        return this.defaultImg;
      },
    },
    created() {
      this.options.aspectRatio = this.ratio;
      this.options.cropBoxResizable = this.cropBoxResizable;
      if (this.height) {
        this.calcHeight = this.height;
      }
    },
    mounted() {
      if (!this.calcHeight) {
        if (this.width) {
          this.calcHeight = this.width / this.whRatio;
        } else {
          this.calcHeight = this.$refs.coverOutWrap.offsetWidth / this.whRatio;
        }
      }
    },
    methods: {
      //截取图片上传的事件，有图片的情况就打开裁剪框，并且将文件传入到裁剪框中
      onFileChange(file, fileList) {
        if (file.status === "ready") {
          this.$refs.cropperBox.show();
          this.$refs.cropperBox.loadCropper(file.raw);
        }
      },
      //文件裁剪，nerFile就是最终拿到的文件，自行调接口进行图片上传
      finishCropImage(newFile) {
        this.newFile = newFile;
        //图片上传调接口请自行补充
        this.$emit("uploadSuccess", newFile);
        this.$refs.cropperBox.close();
      },
      //上传图片之前的大小检测，文件大小通过prop传递，可在组件使用自定义文件大小限制
      beforeVipImageUpload(file) {
        const isLt3M = file.size / 1024 / 1024 < this.maxSize;
        if (!isLt3M) {
          this.$message.error("上传图片大小不可大于" + this.maxSize + "M");
        }
        let uploadFile = new window.File([this.newFile], file.name, {
          type: this.newFile.type,
        });
        uploadFile.uid = this.newFile.uid;
        return Promise.resolve(uploadFile);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .cover-upload-wrap {
    position: relative;
    width: 100%;
    max-width: 300px;
    height: 150px;
    border-radius: 5px;
    .cover-uploader {
      width: 100%;
      height: 100%;
      .el-upload {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 5px;
        cursor: pointer;
        border: 1px solid #dddddd;
        .img-wrap {
          position: relative;
          width: 100%;
          height: 100%;

          &:hover {
            .img-mask-default {
              opacity: 1;
              background-color: rgba(0, 0, 0, 0.5);
              color: #ffffff;
            }
          }

          .cover {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }

          .img-mask-default {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding-left: 10px;
            padding-right: 10px;
            background-color: #ffffff;
            color: #555555;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 12px;
            transition: all 0.2s linear;

            .el-icon-upload {
              font-size: 18px;
            }
          }
          .img-mask {
            opacity: 0;
          }
        }
      }
    }
  }
</style>
