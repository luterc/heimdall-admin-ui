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
  <div v-if="items && items.length > 0" class="hover-effect">
    <el-popover placement="bottom" width="260" trigger="click">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="notice">
          <span slot="label">
            <i class="fas fa-bell"></i>
            通知
            <el-badge :value="3" />
          </span>
          <el-scrollbar style="height: 300px">
            <ul class="notice-list">
              <li v-for="(item, index) in items" :key="index">
                <el-avatar size="small" :src="item.img"></el-avatar>
                <span v-html="item.title"></span>
              </li>
            </ul>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane name="email">
          <span slot="label">
            <i class="fas fa-envelope"></i>
            邮件
            <el-badge :value="items.length || 0" />
          </span>
          <el-scrollbar style="height: 300px">
            <ul class="notice-list">
              <li v-for="(item, index) in items" :key="index">
                <el-avatar size="small" :src="item.img"></el-avatar>
                <span v-html="item.title"></span>
              </li>
            </ul>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <span class="notice-clear">
        <i class="fas fa-trash color mr20"></i>
        <el-link type="danger">清空消息</el-link>
      </span>
      <div slot="reference">
        <el-badge :value="items.length" :max="10">
          <span><i class="far fa-bell"></i></span>
        </el-badge>
      </div>
    </el-popover>
  </div>
</template>

<script>
  import { getUserNotices } from "@/api/sys/user";

  export default {
    name: "TabNotice",
    //组件注册
    components: {},
    //指令注册
    directives: {},

    data() {
      //数据
      return {
        activeName: "notice",
        items: [],
      };
    },
    //计算属性
    computed: {},
    //监听属性
    watch: {},
    //创建完成
    created() {},
    //挂载完成
    mounted() {
      this.getMessageListData();
    },
    //创建之前
    beforeCreate() {},
    //挂载之前
    beforeMount() {},
    //更新之前
    beforeUpdate() {},
    //更新之后
    updated() {},
    //销毁之前
    beforeDestroy() {},
    //销毁完成
    destroyed() {},
    //页面激活,
    activated() {},
    //方法
    methods: {
      /**
       * 获取通知
       * @returns {Promise<void>}
       */
      async getMessageListData() {
        const { data } = await getUserNotices();
        this.items = data.records;
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .hover-effect {
    cursor: pointer;
    transition: background 0.3s;
    width: 36px;
    text-align: center;

    &:hover {
      background-color: $base-backgound-color;
    }
  }

  .notice-list {
    padding: 0 15px 0 0;
    margin: 0;

    & > li {
      display: flex;
      align-items: center;
      padding: 10px 0 10px 0;
      list-style: none;

      .el-avatar {
        flex-shrink: 0;
      }

      & > span {
        margin-left: 10px;
      }
    }
  }

  .notice-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0 0 0;
    font-size: 14px;
    color: $base-color-red;
    text-align: center;
    cursor: pointer;
    border-top: 1px solid $base-border-color;
    transition: color 0.2s ease-in-out;
  }
</style>
