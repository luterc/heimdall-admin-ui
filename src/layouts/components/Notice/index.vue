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
  <transition
    name="fade"
    enter-active-class="animate__animated animate__fadeIn animate__slower"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div v-if="items && items.length > 0" class="sys-notice">
      <el-carousel
        height="30px"
        direction="vertical"
        :autoplay="true"
        :interval="interval"
        indicator-position="none"
      >
        <el-carousel-item v-for="(item, index) in items" :key="index">
          <el-tag type="success">
            {{ item.type ? item.type : "通知:" }}
          </el-tag>
          <el-link
            v-if="item.url"
            type="primary"
            :href="item.url"
            target="_blank"
          >
            <span class="title">{{ item.title }}</span>
          </el-link>
          <span v-else class="title">{{ item.title }}</span>
          <span class="time">{{ item.receivedTime }}</span>
        </el-carousel-item>
      </el-carousel>
    </div>
  </transition>
</template>

<script>
  //组件引入:import 《组件名称》 from '《组件路径》';
  export default {
    name: "Notice",
    //组件注册
    components: {},
    props: {
      items: {
        type: Array,
        required: false,
        default: null,
      },
      interval: {
        type: Number,
        default: 5000,
      },
    },
  };
</script>
<style lang="scss" scoped>
  .sys-notice {
    height: 25px;
    padding-right: $base-padding;
    padding-left: $base-padding;
    padding-bottom: $small-padding;
    line-height: 25px;
    cursor: pointer;
    background: $base-backgound-color;

    a {
      color: $base-color-default;
      margin-left: $base-padding;
      font-size: 12px;
    }

    .time {
      float: right;
      margin-right: $base-padding;
      color: $base-color-default;
      font-size: $base-font-size-small;
      font-weight: bold;
    }

    .title {
      margin-left: 30px;
      font-size: $base-font-size-small;
      font-weight: bold;
    }
  }
  /*.fade-enter-active,*/
  /*.fade-leave-active {*/
  /*  transition: opacity 1s;*/
  /*}*/
  /*.fade-enter, .fade-leave-to !* .fade-leave-active below version 2.1.8 *! {*/
  /*  opacity: 0;*/
  /*}*/
</style>
