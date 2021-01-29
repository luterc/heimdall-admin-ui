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

const path = require("path");
const {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  devPort,
  providePlugin,
} = require("./src/config/settings");
const { version, author, homepage } = require("./package.json");
const Webpack = require("webpack");
const WebpackBar = require("webpackbar");
const dayjs = require("dayjs");
const time = new dayjs().format("YYYY-M-D HH:mm:ss");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
process.env.VUE_APP_TITLE = title || "Heimdall-Admin";
process.env.VUE_APP_AUTHOR = author || "Luter";
process.env.VUE_APP_VERSION = version;
process.env.VUE_APP_HOMEPAGE = homepage;

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: false,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy: {
      "/": {
        target: "http://localhost:10000/",
        ws: true,
        secure: false,
        changOrigin: true,
      },
    },
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          "@": resolve("src"),
          "@c": resolve("src/components"),
        },
      },
      plugins: [
        new Webpack.ProvidePlugin(providePlugin),
        new WebpackBar({
          name: "Luter",
        }),
      ],
    };
  },
  chainWebpack(config) {
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");

    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/svgIcon")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/svgIcon"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
    config.when(process.env.NODE_ENV === "development", (config) => {
      config.devtool("source-map");
    });
    //打包插件配置
    config.when(process.env.NODE_ENV === "production", (config) => {
      config.performance.set("hints", false);
      config.devtool("none");
      config.optimization.splitChunks({
        chunks: "all",
        minSize: 300000,
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
          elementUI: {
            name: "chunk-elementUI",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          fontawesome: {
            name: "chunk-fontawesome",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?@fontawesome(.*)/,
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      //打包优化
      config.optimization.minimize = true;
      //css注释去掉
      config
        .plugin("optimize")
        .use(OptimizeCssAssetsPlugin, [
          {
            cssProcessorPluginOptions: {
              preset: ["default", { discardComments: { removeAll: true } }],
            },
          },
        ])
        .end();
      //去除注释和console，添加版权
      config.optimization.minimizer("terser").tap((args) => {
        Object.assign(args[0], {
          //并行处理
          parallel: true,
          //使用缓存
          cache: false,
          //不单独输出注释到文件
          extractComments: false,
          terserOptions: {
            output: {
              //不输出注释
              comments: false,
              //顶部输出版权信息
              preamble:
                `/******** Heimdall Admin UI ********\n ` +
                `* Version:${version}\n ` +
                `* Author:${author} cluter@qq.com \n` +
                ` * Built at :${time}\n` +
                ` */`,
            },
            //压缩
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              //移除console
              pure_funcs: ["console.log"],
            },
          },
        });
        return args;
      });
      //压缩成gzip
      config
        .plugin("compression")
        .use(CompressionWebpackPlugin, [
          {
            // filename: "[path][base].gz",
            // // filename: "[path].gz[query]",
            // algorithm: "gzip",
            // test: new RegExp(
            //   "\\.(" + productionGzipExtensions.join("|") + ")$"
            // ),
            // threshold: 8192,
            minRatio: 0.5,
          },
        ])
        .end();
      config.module
        .rule("images")
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({
          bypassOnDebug: true,
        })
        .end();
    });
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps
    requireModuleExtension: true,
    loaderOptions: {
      scss: {
        /*sass-loader 8.0语法 */
        //prependData: '@import "~@/styles/variables.scss";',

        /*sass-loader 9.0写法*/
        additionalData(content, loaderContext) {
          const { resourcePath, rootContext } = loaderContext;
          const relativePath = path.relative(rootContext, resourcePath);
          if (
            relativePath.replace(/\\/g, "/") !== "src/styles/variables.scss"
          ) {
            return '@import "~@/styles/variables.scss";' + content;
          }
          return content;
        },
      },
    },
  },
};
