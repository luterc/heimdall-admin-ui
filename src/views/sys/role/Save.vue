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
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="visible"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="角色标识" prop="name">
        <el-input
          v-model.trim="form.name"
          maxlength="20"
          show-word-limit
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="title">
        <el-input
          v-model.trim="form.title"
          maxlength="20"
          show-word-limit
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色说明" prop="description">
        <el-input
          v-model.trim="form.description"
          type="textarea"
          placeholder="请输入角色说明"
          maxlength="100"
          show-word-limit
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doRoleSave, isExistName } from "@/api/sys/role";
  import { isletter } from "@/utils/validate";

  export default {
    //name: "save",
    //组件注册
    components: {},
    //指令注册
    directives: {},
    data() {
      //数据
      return {
        //表单数据
        form: {
          name: "",
          title: "",
          description: "",
        },
        //验证规则
        rules: {
          name: [
            { required: true, trigger: "blur", message: "请输入角色标识" },
            {
              trigger: "blur",
              min: 3,
              max: 20,
              message: "至少5个字，最多20个字，只支持英文字母",
            },
            {
              validator: async (rule, value, callback) => {
                if (!isletter(value)) {
                  callback(new Error("只能输入大小写英文字母"));
                }
                const { data } = await isExistName({
                  prop: "name",
                  value: value,
                });
                if (data) {
                  callback(new Error("名称已经存在，请更换"));
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
          title: [
            { required: true, trigger: "blur", message: "请输入角色名称" },
            {
              trigger: "blur",
              min: 3,
              max: 20,
              message: "至少3个字，最多20个字",
            },
          ],
          description: [
            { required: true, trigger: "blur", message: "请输入角色说明" },
            {
              trigger: "blur",
              min: 3,
              max: 100,
              message: "至少3个字，最多100个字",
            },
          ],
        },
        //窗口标题
        title: "添加",
        //窗口显示隐藏
        visible: false,
      };
    },
    //方法
    methods: {
      /**
       * 显示窗口
       */
      show() {
        this.visible = true;
      },
      /**
       * 关闭窗口
       */
      close() {
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.visible = false;
        this.$emit("close");
      },
      /**
       * 提交保存
       */
      submit() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            const { msg } = await doRoleSave(this.form);
            this.$baseMessage(msg, "success");
            this.$refs["form"].resetFields();
            this.visible = false;
            this.$emit("ok");
            this.form = this.$options.data().form;
          } else {
            return false;
          }
        });
      },
    },
  };
</script>
