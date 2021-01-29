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

import { getHooks } from "./LifecycleHooks";
import ResizeObserverSham from "./ResizeObserverSham";

/**
 * Create a component
 * @param {object} options
 * @param {echarts} options.echarts
 * @param {function} [options.h] `createElement`, required for Vue 3
 * @param {function} [options.ResizeObserver]
 * @param {string} [options.name]
 * @returns {object} definition
 */
export function createComponent({
  echarts,
  h,
  ResizeObserver = ResizeObserverSham,
  name = "VECharts",
}) {
  const isVue3 = typeof h === "function";
  const hooks = getHooks(echarts);

  if (!isVue3) {
    hooks.beforeDestroy = hooks.beforeUnmount;
    delete hooks.beforeUnmount;
  }

  return {
    ...hooks,

    name,
    render: isVue3 ? getVue3Render(h) : vue2Render,

    props: {
      initTheme: [Object, String],
      initOpts: Object,
      theme: Object,
      loading: {
        type: Boolean,
        default: false,
      },
      loadingType: {
        type: String,
        default: "default",
      },
      loadingOpts: {
        type: Object,
        default: function () {
          return {
            text: "加载中...",
            color: "#0cf518",
            textColor: "#000",
            maskColor: "rgba(255, 255, 255, 0.5)",
          };
        },
      },
      option: Object,
      setOptionOpts: Object,
      events: Array,
      autoResize: {
        type: Boolean,
        default: true,
      },
      height: {
        type: String,
        default: false,
      },
      width: {
        type: String,
        default: function () {
          return "100%";
        },
      },
    },

    data() {
      return {
        _private: Object.freeze({
          observer: new ResizeObserver(() => this.resize()),
          dynamic: {},
        }),
      };
    },

    computed: {
      inst() {
        return this.$data._private.dynamic.inst;
      },
    },

    watch: {
      loading(val) {
        if (val) {
          this.inst.showLoading(this.loadingType, this.loadingOpts);
        } else {
          this.inst.hideLoading();
        }
      },

      option(val) {
        this.setOption(val, this.setOptionOpts);
      },

      autoResize(val) {
        if (val) {
          this.addResizeListener();
        } else {
          this.removeResizeListener();
        }
      },
    },

    methods: {
      setOption(option, opts) {
        this.inst.setOption(option, {
          ...this.setOptionOpts,
          ...opts,
        });
      },

      resize() {
        const { clientWidth, clientHeight } = this.$el;
        this.inst.resize({
          width: clientWidth,
          height: clientHeight,
        });
      },

      addResizeListener() {
        this.$data._private.observer.observe(this.$el);
      },

      removeResizeListener() {
        this.$data._private.observer.disconnect();
      },
    },
  };
}

function vue2Render(h) {
  return h("div", {
    attrs: this.$attrs,
    style: {
      height: this.height,
      width: this.width,
      overflow: "hidden",
    },
  });
}

function getVue3Render(h) {
  return function () {
    return h("div", {
      ...this.$attrs,
      style: {
        height: this.height,
        width: this.width,
        overflow: "hidden",
      },
    });
  };
}

/**
 * Install plugin
 * @param {Vue} app
 * @param {object} options
 */
export function plugin(app, options) {
  const definition = createComponent(options);
  app.component(definition.name, definition);
}
