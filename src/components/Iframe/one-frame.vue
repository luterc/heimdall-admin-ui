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

<script>
  export default {
    props: {
      setting: {
        type: Object,
        required: true,
        default: function () {
          return null;
        },
      },
      //宽度，默认'100%'
      width: {
        type: String,
        default: "100%",
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
      //iframe的ID
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
      return { fHeight: 0 };
    },
    computed: {
      // 是否隐藏滚动条
      hideScrollBar() {
        if (this.setting.hideScrolling) {
          if (
            Object.prototype.toString.call(this.setting.hideScrolling) ===
            "[object String]"
          ) {
            return {
              width: `calc(100% + ${this.setting.hideScrolling})`,
            };
          } else {
            return { width: `calc(100% + 18px)` };
          }
        }
        return {};
      },
      // iframe参数处理
      attrs() {
        const attr = {};
        Object.keys(this.setting).forEach((key) => {
          if (!(key === "hideScrolling" || key === "css")) {
            attr[key] = this.setting[key];
          }
          // 处理css样式
          if (key === "srcdoc" && this.setting.css && this.setting.srcdoc) {
            // 查找head标签
            const pattern = "<head.*(?=>)(.|\n)*?</head>";
            const html = this.setting.srcdoc.match(pattern)[0];
            // 插入style
            const style = `<style>${this.setting.css}</style></head>`;
            const newHtml = html.replace("</head>", style);
            attr[key] = this.setting.srcdoc.replace(html, newHtml);
          }
        });
        // 设置默认值
        if (!attr.sandbox || attr.sandbox !== "") {
          // 同源文档
          if (this.setting.srcdoc) {
            attr.sandbox = "allow-scripts";
          } else {
            attr.sandbox = "allow-same-origin allow-scripts";
          }
        }
        // 无边框
        if (!attr.frameborder) {
          attr.frameborder = 0;
        }
        return attr;
      },
    },
    watch: {
      src: {
        handler(val) {
          val && this.iframeOnload();
        },
        immediate: true,
      },
      srcdoc: {
        handler(val) {
          val && this.iframeOnload();
        },
        immediate: true,
      },
    },
    created() {},
    mounted() {
      let me = this;
      me.fHeight = me.height;
      me.iframeOnload();
      me.fHeight = me.height;
      me.onResize();
      window.onresize = function () {
        me.onResize();
      };
    },
    methods: {
      /**
       * @name: onload
       * @return:
       */
      iframeOnload() {
        this.$nextTick(() => {
          const iframe = document.getElementById(this.id);
          const that = this;
          iframe.onload = function () {
            that.$emit("onload");
          };
        });
      },
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
    render() {
      return (
        <el-row>
          <el-col>
            <el-card>
              <iframe
                {...{
                  attrs: this.attrs,
                }}
                style={this.hideScrollBar}
                width={this.width}
                height={this.fHeight}
                id={this.id}
              >
                {" "}
              </iframe>
            </el-card>
          </el-col>
        </el-row>
      );
    },
  };
</script>

<style lang="scss" scoped>
  .iframe-body {
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
    ::-webkit-scrollbar {
      display: none;
    }
  }
</style>
