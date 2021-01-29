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
  <div class="skeleton">
    <div
      v-if="loading"
      class="skeleton-content"
      :class="{ 'skeleton-active': active }"
    >
      <h3 class="skeleton-title" :style="{ width: titleWidth }"></h3>
      <ul class="skeleton-paragraph">
        <li v-for="(item, index) in rows" :key="index"></li>
      </ul>
    </div>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>
<script>
  export default {
    name: "hSkeleton",
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      active: {
        type: Boolean,
        default: false,
      },
      title: {
        type: Boolean,
        default: true,
      },
      paragraph: {
        type: Boolean,
        default: true,
      },
      titleWidth: {
        type: String,
        default: "38%",
      },
      rows: {
        type: Number,
        default: 3,
      },
    },
    data() {
      return {};
    },
    computed: {},
    mounted() {
      this.init();
    },
    methods: {
      init() {},
    },
  };
</script>
<style lang="scss" scoped>
  // skeleton
  $skeleton-bg: #ea0a38;
  $skeleton-height: 16px;
  .skeleton {
    @keyframes skeleton-loading {
      0% {
        background-position: 100% 50%;
      }

      100% {
        background-position: 0 50%;
      }
    }

    .skeleton-content {
      .skeleton-title {
        height: $skeleton-height;
        margin-top: 16px;
        background: $skeleton-bg;
      }

      .skeleton-paragraph {
        margin-top: 24px;

        > li {
          width: 100%;
          height: $skeleton-height;
          list-style: none;
          background: $skeleton-bg;
        }

        > li + li {
          margin-top: 16px;
        }
      }

      &.skeleton-active {
        .skeleton-title,
        .skeleton-paragraph > li {
          background: linear-gradient(
            90deg,
            #f2f2f2 25%,
            #e6e6e6 37%,
            #f2f2f2 63%
          );
          background-size: 400% 100%;
          animation: skeleton-loading 1.4s ease infinite;
        }
      }
    }
  }
</style>
