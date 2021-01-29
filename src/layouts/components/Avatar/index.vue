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
  <el-dropdown @command="handleCommand">
    <span class="avatar-dropdown">
      <!--      <el-avatar class="user-avatar" :src="avatar"></el-avatar>-->
      <img class="user-avatar" :src="avatar" alt="" />
      <div class="user-name">
        {{ username }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="userCenter">
        <font-icon :icon="['fas', 'fa-user']"></font-icon>
        {{ $t("router.UserCenter") }}
      </el-dropdown-item>
      <el-dropdown-item command="logout" divided>
        <font-icon :icon="['fas', 'fa-sign-out-alt']"></font-icon>
        {{ $t("router.Logout") }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import { mapGetters } from "vuex";
  import { recordRoute } from "@/config/settings";

  export default {
    name: "Avatar",
    computed: {
      ...mapGetters({
        avatar: "user/avatar",
        username: "user/username",
      }),
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case "logout":
            this.logout();
            break;
          case "userCenter":
            this.$router.push("/uc/profile");
            break;
        }
      },
      logout() {
        this.$baseConfirm(
          this.$t("layout.avatar.confirmText"),
          null,
          async () => {
            await this.$store.dispatch("user/logout");
            if (recordRoute) {
              const fullPath = this.$route.fullPath;
              this.$router.push(`/login?redirect=${fullPath}`);
            } else {
              this.$router.push("/login");
            }
          }
        );
      },
    },
  };
</script>
<style lang="scss" scoped>
  .avatar-dropdown {
    padding: 0;
    height: 50px;
    display: flex;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 50%;
    }

    .user-name {
      margin-left: 5px;
      position: relative;
      font-weight: 600;
      cursor: pointer;
    }
  }
</style>
