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

export function getHooks(echarts) {
  return {
    mounted() {
      const inst = echarts.init(this.$el, this.initTheme, this.initOpts);
      this.$data._private.dynamic.inst = inst;

      if (this.loading) {
        inst.showLoading(this.loadingType, this.loadingOpts);
      }
      if (this.option) {
        this.setOption(this.option, this.setOptionOpts);
      }
      if (this.events) {
        this.events.forEach((args) => inst.on(...args));
      }
      if (this.autoResize) {
        this.addResizeListener();
      }
    },

    activated() {
      if (this.autoResize) {
        this.addResizeListener();
      }
    },

    deactivated() {
      if (this.autoResize) {
        this.removeResizeListener();
      }
    },

    beforeUnmount() {
      this.removeResizeListener();
      this.inst.dispose();
    },
  };
}
