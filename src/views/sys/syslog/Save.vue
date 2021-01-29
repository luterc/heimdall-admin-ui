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
      <el-form-item label="名字" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doSyslogSave } from "@/api/sys/syslog";
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
        },
        //验证规则
        rules: {
          name: [{ required: true, trigger: "blur", message: "请输入名字" }],
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
            const { msg } = await doSyslogSave(this.form);
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
