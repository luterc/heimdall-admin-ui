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
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <font-icon icon="fa fa-text-height" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item of sizeOptions"
        :key="item.value"
        :disabled="size === item.value"
        :command="item.value"
      >
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  export default {
    name: "SizeSelect",
    data() {
      return {
        sizeOptions: [
          {
            label: this.$t("layout.sizeSelect.defaultText"),
            value: "default",
          },
          {
            label: this.$t("layout.sizeSelect.mediumText"),
            value: "medium",
          },
          {
            label: this.$t("layout.sizeSelect.smallText"),
            value: "small",
          },
          {
            label: this.$t("layout.sizeSelect.miniText"),
            value: "mini",
          },
        ],
      };
    },
    computed: {
      size() {
        return this.$store.state.settings.size;
      },
    },
    methods: {
      handleSetSize(size) {
        this.$ELEMENT.size = size;
        this.$store.dispatch("settings/changeSize", size);
        this.refreshView();
        this.$message({
          message: this.$t("layout.sizeSelect.successMessage"),
          type: "success",
        });
      },
      refreshView() {
        // In order to make the cached page re-rendered
        this.$store.dispatch("tabsBar/delAllVisitedRoutes", this.$route);

        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      },
    },
  };
</script>
