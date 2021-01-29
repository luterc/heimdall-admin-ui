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
    v-dragable
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="visible"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
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
        <el-input
          v-model.trim="form.remarks"
          maxlength="50"
          type="textarea"
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
  import { doDictItemSave, isItemExist } from "@/api/sys/dict";

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
          typeId: "",
          label: "",
          itemValue: "",
          remarks: "",
          seqNo: 0,
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
            {
              validator: async (rule, value, callback) => {
                const { data } = await isItemExist({
                  typeId: this.form.typeId,
                  itemValue: value,
                });
                if (data) {
                  callback(new Error("字典值已经存在，请更换"));
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
        },
        //窗口标题
        title: "添加字典项",
        //窗口显示隐藏
        visible: false,
      };
    },
    //方法
    methods: {
      /**
       * 显示窗口
       */
      show(row) {
        this.title = "在字典分类:" + row.name + "下新增字典数据";
        this.visible = true;
        this.form.typeId = row.id;
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
            const { msg } = await doDictItemSave(this.form);
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
