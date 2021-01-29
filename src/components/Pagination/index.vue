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
  <div class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
  import { scrollTo } from "@/utils/scroll-to";
  import { pager } from "@/config/config";

  export default {
    name: "Pagination",
    props: {
      total: {
        required: true,
        type: Number,
      },
      page: {
        type: Number,
        default: 1,
      },
      size: {
        type: Number,
        default() {
          return pager.default.size;
        },
      },
      pageSizes: {
        type: Array,
        default() {
          return pager.sizes;
        },
      },
      layout: {
        type: String,
        default() {
          return pager.layout;
        },
      },
      background: {
        type: Boolean,
        default: true,
      },
      autoScroll: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      currentPage: {
        get() {
          return this.page;
        },
        set(val) {
          this.$emit("update:page", val);
        },
      },
      pageSize: {
        get() {
          return this.size;
        },
        set(val) {
          this.$emit("update:size", val);
        },
      },
    },
    methods: {
      handleSizeChange(val) {
        this.$emit("size-change", { size: val });
        if (this.autoScroll) {
          scrollTo(60, 800);
        }
      },
      handleCurrentChange(val) {
        this.$emit("pagination", { page: val, size: this.pageSize });
        if (this.autoScroll) {
          scrollTo(60, 800);
        }
      },
    },
  };
</script>

<style scoped>
  .pagination-container {
    background: #fff;
    padding: 32px 16px;
  }
</style>
