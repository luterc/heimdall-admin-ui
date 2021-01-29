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
    :title="title"
    :visible.sync="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色标识" prop="name">
        <el-input
          v-model.trim="form.name"
          disabled
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
  import { doRoleUpdate, getRoleById } from "@/api/sys/role";

  export default {
    //name: "save",
    //组件注册
    components: {},
    //指令注册
    directives: {},
    data() {
      //数据
      return {
        //传入的对象唯一标识，一般是ID
        objId: "",
        //表单数据
        form: {
          name: "",
          title: "",
          description: "",
        },
        //验证规则
        rules: {
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
        //弹窗标题
        title: "修改",
        //弹窗显示隐藏
        visible: false,
      };
    },
    //方法
    methods: {
      /**
       * 显示弹窗
       * @param params
       */
      show(params) {
        this.title = params.title || "编辑数据";
        let id = params.id;
        if (!id) {
          this.$baseNotify("编辑数据失败,is is null", "错误", "error");
        } else {
          this.visible = true;
          this.objId = id;
          this.getByid();
        }
      },
      /**
       * 关闭弹窗
       */
      close() {
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.visible = false;
        this.$emit("close");
      },
      /**
       * 提交修改
       */
      submit() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            const { msg } = await doRoleUpdate(this.form);
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
      /**
       * 通过传入ID从后台获取要修改的数据
       * @return {Promise<void>}
       */
      async getByid() {
        const { data } = await getRoleById(this.objId);
        this.form = data;
      },
    },
  };
</script>
