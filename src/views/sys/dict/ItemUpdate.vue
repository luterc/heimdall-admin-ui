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
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <el-form-item label="字典项名称" prop="label">
        <el-input
          v-model.trim="form.label"
          v-focus
          tabindex="1"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典值" prop="itemValue">
        <el-input
          v-model.trim="form.itemValue"
          tabindex="2"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="顺序" prop="seqNo">
        <el-input-number
          v-model="form.seqNo"
          style="width: 50%"
          :min="1"
          :max="1000"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="说明" prop="remarks">
        <el-input v-model.trim="form.remarks" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doDictItemUpdate, getDictItemById } from "@/api/sys/dict";

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
          label: "",
          itemValue: "",
          remarks: "",
          seqNo: "",
        },
        //验证规则
        rules: {
          label: [
            { required: true, message: "请输入字典项名称", trigger: "blur" },
            {
              min: 1,
              max: 50,
              message: "长度在 1 到 50 个字符",
              trigger: "blur",
            },
          ],
          itemValue: [
            { required: true, message: "请输入字典值", trigger: "blur" },
            {
              min: 1,
              max: 50,
              message: "长度在 3 到 50 个字符",
              trigger: "blur",
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
            const { msg } = await doDictItemUpdate(this.form);
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
        const { data } = await getDictItemById(this.objId);
        this.form = data;
      },
    },
  };
</script>
