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
  <el-color-picker
    v-model="color"
    size="mini"
    :predefine="[
      '#409EFF',
      '#1890ff',
      '#2932e1',
      '#304156',
      '#212121',
      '#11a983',
      '#13c2c2',
      '#6959CD',
      '#f5222d',
    ]"
    class="color-picker"
    popper-class="color-picker-dropdown"
  />
</template>

<script>
  const version = require("element-ui/package.json").version; // element-ui version from node_modules
  const ORIGINAL_THEME = "#409EFF"; // default color

  export default {
    data() {
      return {
        chalk: "",
        color: "",
      };
    },
    watch: {
      async color(val) {
        const oldVal = this.chalk ? this.color : ORIGINAL_THEME;
        if (typeof val !== "string") return;
        const themeCluster = this.getThemeCluster(val.replace("#", ""));
        const originalCluster = this.getThemeCluster(oldVal.replace("#", ""));
        // const $message = this.$message({
        //   message: "  正在更换主题色...",
        //   customClass: "theme-message",
        //   type: "success",
        //   duration: 0,
        //   iconClass: "el-icon-loading",
        // });
        const getHandler = (variable, id) => {
          return () => {
            const originalCluster = this.getThemeCluster(
              ORIGINAL_THEME.replace("#", "")
            );
            const newStyle = this.updateStyle(
              this[variable],
              originalCluster,
              themeCluster
            );
            let styleTag = document.getElementById(id);
            if (!styleTag) {
              styleTag = document.createElement("style");
              styleTag.setAttribute("id", id);
              document.head.appendChild(styleTag);
            }
            styleTag.innerText = newStyle;
          };
        };
        if (!this.chalk) {
          // Npm库
          // const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
          // 本地服务，注意按照目录版本形式保存样式文件
          const url = `/static/vendor/elementui/${version}/theme-chalk/index.css`;
          await this.getCSSString(url, "chalk");
        }
        const chalkHandler = getHandler("chalk", "chalk-style");
        chalkHandler();
        const styles = [].slice
          .call(document.querySelectorAll("style"))
          .filter((style) => {
            const text = style.innerText;
            return (
              new RegExp(oldVal, "i").test(text) &&
              !/Chalk Variables/.test(text)
            );
          });
        styles.forEach((style) => {
          const { innerText } = style;
          if (typeof innerText !== "string") return;
          style.innerText = this.updateStyle(
            innerText,
            originalCluster,
            themeCluster
          );
        });
        //保存到LS
        this.$store.dispatch("settings/changeColorName", val);
        this.$baseEventBus.$emit("change-color", val);
        // $message.close();
      },
    },
    created() {
      this.color = this.$store.state.settings.colorName;
      console.log(
        "当前颜色:",
        this.color,
        this.$store.state.settings.colorName
      );
      //注册颜色修改事件
      this.$baseEventBus.$on("change-color", (color) => {
        this.color = color;
      });
    },
    methods: {
      updateStyle(style, oldCluster, newCluster) {
        let newStyle = style;
        oldCluster.forEach((color, index) => {
          newStyle = newStyle.replace(
            new RegExp(color, "ig"),
            newCluster[index]
          );
        });
        return newStyle;
      },
      getCSSString(url, variable) {
        return new Promise((resolve) => {
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
              this[variable] = xhr.responseText.replace(
                /@font-face{[^}]+}/,
                ""
              );
              resolve();
            }
          };
          xhr.open("GET", url);
          xhr.send();
        });
      },
      getThemeCluster(theme) {
        const tintColor = (color, tint) => {
          let red = parseInt(color.slice(0, 2), 16);
          let green = parseInt(color.slice(2, 4), 16);
          let blue = parseInt(color.slice(4, 6), 16);
          if (tint === 0) {
            // when primary color is in its rgb space
            return [red, green, blue].join(",");
          } else {
            red += Math.round(tint * (255 - red));
            green += Math.round(tint * (255 - green));
            blue += Math.round(tint * (255 - blue));
            red = red.toString(16);
            green = green.toString(16);
            blue = blue.toString(16);
            return `#${red}${green}${blue}`;
          }
        };
        const shadeColor = (color, shade) => {
          let red = parseInt(color.slice(0, 2), 16);
          let green = parseInt(color.slice(2, 4), 16);
          let blue = parseInt(color.slice(4, 6), 16);
          red = Math.round((1 - shade) * red);
          green = Math.round((1 - shade) * green);
          blue = Math.round((1 - shade) * blue);
          red = red.toString(16);
          green = green.toString(16);
          blue = blue.toString(16);
          return `#${red}${green}${blue}`;
        };
        const clusters = [theme];
        for (let i = 0; i <= 9; i++) {
          clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
        }
        clusters.push(shadeColor(theme, 0.1));
        return clusters;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .color-picker {
    margin-right: 10px;
  }
</style>
