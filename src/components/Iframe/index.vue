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
  <el-row>
    <el-col :span="24">
      <el-card>
        <div slot="header">
          <span class="title">{{ title }}</span>
        </div>
        <iframe
          :id="id"
          :height="fHeight"
          :width="width"
          :src="src"
          :style="{
            border: border,
            overflow: scrolling ? 'auto' : 'hidden',
          }"
          sandbox="allow-same-origin allow-scripts "
        ></iframe>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "IframePanel",
    components: {},
    props: {
      //标题
      title: {
        type: String,
        default: "",
      },
      //url
      src: {
        type: String,
        default: "",
      },
      //宽度，默认'100%'
      width: {
        type: String,
        default: "100%",
      },
      border: {
        type: Number,
        default: 0,
      },
      //ifrme高度，默认100%
      height: {
        type: String,
        default: "100%",
      },
      //内容区域高度比例，通过测量屏幕获得,deviceHeight*percent得出iframe高度,默认0.87
      percent: {
        type: Number,
        default: 0.87,
      },
      scrolling: {
        type: Boolean,
        defalut: true,
      },
      id: {
        type: String,
        default: function () {
          return (
            "vue-iframe-" +
            +new Date() +
            ((Math.random() * 1000).toFixed(0) + "")
          );
        },
      },
    },
    data() {
      return {
        fHeight: 0,
      };
    },
    computed: {},
    beforeMount() {
      //挂载之前
    },
    mounted() {
      console.log(this.id);
      //挂载完毕
      let me = this;
      me.$nextTick(() => {
        const iframe = document.getElementById(me.id);
        iframe.onload = function () {
          me.$emit("onload");
        };
      });
      //父子传值
      //在iframe中可以：window.parent.postMessage({})
      window.addEventListener("message", (event) => {
        console.log(event);
      });
      me.fHeight = me.height;
      me.onResize();
      window.onresize = function () {
        me.onResize();
      };
    },
    beforeCreate() {
      //创建之前
    },
    created() {
      //创建完毕
    },
    beforeDestroy() {
      //销毁之前
    },
    destroyed() {
      //销毁
    },
    methods: {
      onResize() {
        let me = this;
        const deviceHeight = document.documentElement.clientHeight;
        const iframe = document.getElementById(this.id);
        if (iframe) {
          //可以指定高度，不精确
          // me.fHeight = (Number(deviceHeight) - Number(me.subHeight)) + 'px'
          //可以根据上下其他元素占比，计算高度，相对精确
          me.fHeight = Number(deviceHeight) * me.percent + "px";
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .title {
    color: $base-color-black;
    font-weight: bold;
  }
</style>
