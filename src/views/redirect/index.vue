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

<!--这个文件是用作路由redirect的中间页面使用，主要是SizeSelect组件使用-->
<!--当切换全局elementui大小后，刷新redirect到切换大小之前的路由-->

<script>
  export default {
    created() {
      const { params, query } = this.$route;
      const { path } = params;
      this.$router.replace({ path: "/" + path, query });
    },
    render: function (h) {
      return h(); // avoid warning message
    },
  };
</script>
