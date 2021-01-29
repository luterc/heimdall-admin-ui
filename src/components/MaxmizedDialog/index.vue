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
  <el-dialog :fullscreen="fullscreen" v-bind="$attrs" v-on="$listeners">
    <div slot="title" class="dialog__header">
      <span class="el-dialog__title">{{ title }}</span>
      <slot v-if="$slots.title" name="title"></slot>
      <span class="dialog__menu" @click="onFullScreen">
        <i v-if="!fullscreen" class="fa fa-expand"></i>
        <i v-else class="fa fa-compress"></i>
      </span>
    </div>
    <slot></slot>
    <div slot="footer">
      <slot name="footer"></slot>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    //组件注册
    components: {},
    props: {
      title: {
        type: String,
        required: false,
        default: function () {
          return "";
        },
      },
    },
    data() {
      //数据
      return {
        fullscreen: false,
      };
    },

    //方法
    methods: {
      onFullScreen() {
        this.fullscreen = !this.fullscreen;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .dialog {
    &__header {
      display: flex;
      min-height: 20px;
      justify-content: space-between;
    }

    &__menu {
      padding-right: 25px;

      i {
        color: #909399;
        font-size: 15px;
        position: absolute;
        top: 20px;
        right: 50px;
        padding: 0;
        background: 0 0;
        border: none;
        outline: 0;
        cursor: pointer;

        &:hover {
          color: #409eff;
        }
      }
    }
  }
</style>
