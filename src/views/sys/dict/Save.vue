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
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model.trim="form.name"
          maxlength="20"
          show-word-limit
          placeholder="请输入分类名称,简单直白点,一看就知道啥意思，如:gender 、emailStatus"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类说明" prop="remarks">
        <el-input
          v-model.trim="form.remarks"
          maxlength="30"
          show-word-limit
          placeholder="请输入字典分类说明,描述此字典的含义用途,如：用户性别、邮件状态"
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
  import { doDictSave, isTypeExist } from "@/api/sys/dict";
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
          remarks: "",
        },
        //验证规则
        rules: {
          name: [
            { required: true, message: "请输入名称", trigger: "blur" },
            {
              min: 3,
              max: 50,
              message: "长度在 3 到 50 个字符",
              trigger: "blur",
            },
            {
              validator: async (rule, value, callback) => {
                if (!isletter(value)) {
                  callback(new Error("只能输入大小写英文字母"));
                } else {
                  const { data } = await isTypeExist({
                    prop: "name",
                    value: value,
                  });
                  if (data) {
                    callback(new Error("名称已经被使用，请更换"));
                  } else {
                    callback();
                  }
                }
              },
              trigger: "blur",
            },
          ],
          remarks: [
            { required: true, message: "请输入名称", trigger: "blur" },
            {
              min: 2,
              max: 100,
              message: "长度在 2 到 100 个字符",
              trigger: "blur",
            },
          ],
        },
        //窗口标题
        title: "添加字典分类",
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
            const { msg } = await doDictSave(this.form);
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
