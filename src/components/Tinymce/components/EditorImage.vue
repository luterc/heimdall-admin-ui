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
  <div class="upload-container">
    <el-dialog
      destroy-on-close
      title="批量图片上传"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @open="onOpen"
    >
      <el-upload
        multiple
        :limit="10"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        class="editor-slide-upload"
        :action="actionUrl"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </el-dialog>
  </div>
</template>
<script>
  /**
   * 批量图片上传
   */
  export default {
    name: "EditorSlideUpload",
    props: {
      //按钮颜色
      color: {
        type: String,
        default: "#1890ff",
      },
      //后端上传接口url
      actionUrl: {
        type: String,
        default: "https://httpbin.org/post",
      },
    },
    data() {
      return {
        dialogVisible: false,
        images: [],
        fileList: [],
      };
    },
    methods: {
      onOpen() {
        //保存上传后的图片信息
        this.images = [];
        //用作展示预览图
        this.fileList = [];
      },
      handleSubmit() {
        this.$emit("success", this.images);
        this.images = [];
        this.fileList = [];
        this.dialogVisible = false;
      },
      handleSuccess(response, file) {
        const uid = file.uid;
        this.images.push({
          uid: uid,
          // url: response.data.uri,
          url: response.files.file,
        });
      },
      handleRemove(file) {
        const uid = file.uid;
        console.log(this.fileList);
        for (let i = 0, len = this.fileList.length; i < len; i++) {
          if (this.fileList[i].uid === uid) {
            delete this.fileList[i];
            return;
          }
        }
        for (let i = 0, len = this.images.length; i < len; i++) {
          if (this.images[i].uid === uid) {
            delete this.images[i];
            return;
          }
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;

    ::v-deep .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
