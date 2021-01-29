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
  <div class="m20">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card>
          <div class="user-info">
            <el-avatar
              class="avatar-img"
              fit="cover"
              alt="你的样子"
              :size="100"
              :src="$store.getters['user/avatar']"
              @click.native="onAvatar"
            ></el-avatar>
            <div class="name">张三丰</div>
            <div class="additional-info">武当山老大|集团CEO</div>
            <ul class="info-list">
              <li v-for="(item, index) in infos" :key="index">
                <font-icon :icon="item.icon" :color="item.color"></font-icon>
                <span class="text">{{ item.text }}</span>
              </li>
            </ul>
            <div class="tag-group">
              <el-tag
                v-for="(item, index) in tags"
                :key="index"
                :type="item.type"
                effect="dark"
              >
                {{ item.label }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="基本信息" name="info">
              <el-form style="width: 50%" label-width="80px" :model="infoForm">
                <el-form-item label="账号">
                  <el-input v-model="infoForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                  <el-input v-model="infoForm.realName"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                  <el-input v-model="infoForm.nickName"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                  <el-input v-model="infoForm.cellPhone"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-select v-model="infoForm.gender" placeholder="请选择性别">
                    <el-option
                      v-for="item in getStoredDictByTypeName('gender')"
                      :key="item.itemValue"
                      :label="item.label"
                      :value="item.itemValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">
                    保存信息
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="通知信息" name="notice">
              <el-scrollbar style="height: 300px">
                <ul class="notice-list">
                  <li v-for="(item, index) in notices" :key="index">
                    <el-avatar
                      v-if="item.img"
                      size="small"
                      :src="item.img"
                    ></el-avatar>
                    <span class="title" v-html="item.title"></span>
                    <span class="time">
                      {{ item.time }}
                    </span>
                  </li>
                </ul>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <avatar ref="avatar" @upload="onUpload"></avatar>
  </div>
</template>

<script>
  import { getUserInfo } from "@/api/sys/user";
  import avatar from "./components/avatar";

  export default {
    name: "PersonalCenter",
    components: { avatar },
    data() {
      return {
        activeTab: "info",
        user: null,
        infoForm: {},
        notices: [
          {
            img: "/static/images/14.png",
            title: "粗大事啦，六大派上武当啦",
            time: "昨天 12:01",
          },
          {
            img: "/static/images/14.png",
            title: "粗大事啦，六大派上武当啦",
            time: "昨天 12:01",
          },
          {
            title: "粗大事啦，六大派上武当啦",
            time: "昨天 12:01",
          },
        ],
        infos: [
          {
            text: "武当开山鼻祖",
            color: "black",
            icon: "fas fa-user",
          },
          {
            text: "武当山集团|总部|总经理办公室",
            color: "black",
            icon: "fas fa-male",
          },
          {
            text: "中国 • 汉东省 • 武当市 ",
            color: "black",
            icon: "fas fa-male",
          },
          {
            text: "1301-11-11",
            color: "black",
            icon: "fas fa-user",
          },
          {
            text: "男",
            color: "black",
            icon: "fas fa-baby",
          },
        ],
        tags: [
          {
            label: "功夫好",
            type: "success",
          },
          {
            label: "爱睡觉",
            type: "info",
          },
          {
            label: "白胡子",
            type: "warning",
          },
          {
            label: "脚臭",
            type: "danger",
          },
        ],
      };
    },
    created() {
      this.getUser();
    },
    methods: {
      handleTabClick(el) {
        switch (this.activeTab) {
          case "info":
            //拿一下用户信息
            break;
          case "notice":
            //拿一下通知
            break;
        }
      },
      onSubmit() {},
      onAvatar() {
        console.log("上传头像");
        this.$refs.avatar.show(this.user);
      },
      onUpload(file, data) {
        console.log(file, data);
      },
      async getUser() {
        const { data } = await getUserInfo();
        this.user = data;
        this.infoForm = data;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .notice-list {
    line-height: 30px;
    text-align: left;
    list-style: none;
    list-style-position: inside;

    li {
      display: flex;
      flex-flow: row;
      align-items: flex-start;
      padding: 10px 0 10px 0;
      border-bottom: 1px solid #ddd;

      .el-avatar {
        flex-shrink: 0;
      }

      .title {
        flex: 1;
        margin-left: 10px;
      }

      .time {
        float: right;
        margin-right: 10px;
        color: #1d1c1c;
        font-size: $base-font-size-small;
      }
    }
  }

  .user-info {
    text-align: center;
    margin-top: 20px;

    .avatar-img {
      cursor: pointer;
    }

    .name {
      margin-top: 15px;
      font-size: 24px;
      font-weight: 500;
      color: #262626;
    }

    .additional-info {
      margin-top: 10px;
    }

    .info-list {
      margin-top: 30px;
      line-height: 30px;
      text-align: left;
      list-style: none;
      list-style-position: inside;

      > li {
        i {
          display: inline-block;
          width: 10%;
          font-size: 14px;
        }

        .text {
          width: 90%;
        }
      }
    }

    .tag-list {
    }
  }
</style>
