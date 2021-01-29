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
  <div
    class="login-container"
    :style="{
      background: 'url(' + bgImage + ')' + ' center center fixed',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }"
  >
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
        <div style="color: transparent">$nbsp</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          label-position="left"
        >
          <language style="color: #ffffff; float: right"></language>
          <div class="title">{{ $t("views.login.loginText") }}</div>
          <div class="title-tips">{{ $t("base.title") }}</div>
          <el-form-item style="margin-top: 40px" prop="username">
            <span class="svg-container svg-container-admin">
              <font-icon :icon="['fas', 'fa-user']" />
            </span>
            <el-input
              v-model.trim="form.username"
              v-focus
              :placeholder="$t('views.login.usernamePlaceholder')"
              tabindex="1"
              type="text"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <font-icon :icon="['fas', 'fa-lock']" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :type="passwordType"
              tabindex="2"
              :placeholder="$t('views.login.passwordPlaceholder')"
            />
            <span
              v-if="passwordType === 'password'"
              class="show-password"
              @click="handlePassword"
            >
              <font-icon :icon="['fas', 'fa-eye-slash']"></font-icon>
            </span>
            <span v-else class="show-password" @click="handlePassword">
              <font-icon :icon="['fas', 'fa-eye']"></font-icon>
            </span>
          </el-form-item>
          <el-form-item style="margin-top: 40px" prop="captcha">
            <el-row :gutter="12">
              <el-col :span="14">
                <span class="svg-container svg-container-admin">
                  <font-icon :icon="['fas', 'fa-user']" />
                </span>
                <el-input
                  v-model.trim="form.captcha"
                  :placeholder="$t('views.login.captchaPlaceholder')"
                  tabindex="3"
                  type="text"
                  @keyup.enter.native="handleLogin"
                />
              </el-col>
              <el-col :span="10">
                <img
                  v-if="captchaData && captchaData.content"
                  style="width: 98%"
                  class="captcha-img"
                  :src="captchaData.content"
                  alt=""
                  @click="getCaptchaData"
                />
                <span v-else class="color-info">正在获取验证码....</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            @click="handleLogin"
          >
            {{ $t("views.login.loginBtn") }}
          </el-button>

          <div class="register-text">
            {{ $t("views.login.NoAccoutText") }}
            <router-link to="/register">
              <span>
                {{ $t("views.login.registerLinkText") }}
              </span>
            </router-link>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Language } from "@/layouts/components";
  import { getCaptcha } from "@/api/sys/user";

  export default {
    name: "Login",
    components: {
      Language,
    },
    data() {
      return {
        form: {
          username: "",
          password: "",
          captcha: "",
          uuid: "",
        },
        rules: {
          username: [
            {
              required: true,
              trigger: "blur",
            },
          ],
          password: [
            {
              required: true,
              trigger: "blur",
            },
          ],
        },
        loading: false,
        passwordType: "password",
        redirect: undefined,
        captchaData: {},
      };
    },
    computed: {
      bgImage() {
        const bgs = [
          "static/images/login/3.jpg",
          "static/images/login/4.png",
          "static/images/login/5.png",
          "static/images/login/6.jpg",
        ];
        return bgs[Math.floor(Math.random() * bgs.length)];
      },
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || "/";
        },
        immediate: true,
      },
    },
    created() {
      document.body.style.overflow = "hidden";
    },
    beforeDestroy() {
      document.body.style.overflow = "auto";
    },
    mounted() {
      this.form.username = "admin";
      this.form.password = "aaaaaa";
      this.getCaptchaData();
    },
    methods: {
      async getCaptchaData() {
        const { data } = await getCaptcha();
        this.captchaData = data;
        this.form.uuid = data.uuid;
      },
      handlePassword() {
        this.passwordType === "password"
          ? (this.passwordType = "")
          : (this.passwordType = "password");
        this.$nextTick(() => {
          this.$refs.password.focus();
        });
      },
      handleLogin() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("user/login", this.form)
              .then(() => {
                const routerPath =
                  this.redirect === "/404" || this.redirect === "/401"
                    ? "/"
                    : this.redirect;
                this.$router.push(routerPath).catch(() => {});
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
                this.form.captcha = "";
                this.getCaptchaData();
              });
          } else {
            return false;
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;

    .title {
      font-size: 48px;
      font-weight: 500;
      color: $base-color-white;
    }

    .title-tips {
      margin-top: 29px;
      font-size: 26px;
      font-weight: 400;
      color: $base-color-white;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .login-btn {
      display: inherit;
      width: 100%;
      height: 60px;
      margin-top: 5px;
      border: 0;

      font-weight: 900;
      font-size: 18px;

      &:hover {
        opacity: 0.9;
      }
    }

    .login-form {
      position: relative;
      max-width: 100%;
      padding: 5vh;
      margin: calc(50vh - 300px) 1vw 1vw;
      overflow: hidden;
      background: rgba(35, 32, 32, 0.5);
      background-size: 100% 100%;
      border-radius: 5%;

      .forget-password {
        width: 100%;
        margin-top: 40px;
        text-align: left;

        .forget-pass {
          width: 129px;
          height: 19px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(92, 102, 240, 1);
        }
      }
    }

    .captcha-img {
      border-radius: 2px;
      min-height: 45px;
      height: 45px;
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: $base-color-white;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: $base-color-blue;
        text-align: center;
      }
    }

    .svg-container {
      position: absolute;
      top: 14px;
      left: 15px;
      z-index: $base-z-index;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    .show-password {
      position: absolute;
      top: 14px;
      right: 25px;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    .register-text {
      padding-top: $base-padding;
      color: $base-color-white;
      font-weight: 900;
    }

    ::v-deep {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: $base-color-red;
        }
      }

      .el-input {
        box-sizing: border-box;

        input {
          height: 45px;
          padding-left: 45px;
          font-size: $base-font-size-default;
          line-height: 45px;
          color: $base-font-color;
          background: #f6f4fc;
          border: 0;
          caret-color: $base-font-color;
        }
      }
    }
  }
</style>
