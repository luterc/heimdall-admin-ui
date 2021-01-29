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
      <el-form-item label="上级">
        <el-input
          v-model.trim="form.ptitle"
          disabled
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="resType">
        <el-radio-group v-model.trim="form.resType">
          <template v-if="form.ptype == 0">
            <el-radio :label="1">菜单</el-radio>
          </template>
          <template v-if="form.ptype == 1">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">页面</el-radio>
          </template>
          <template v-if="form.ptype == 2">
            <el-radio :label="3">权限</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model.trim="form.name"
          placeholder="名称,英文字母，作为组件key使用，用以实现前端路由、国际化、页面缓存"
          maxlength="30"
          show-word-limit
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model.trim="form.title"
          placeholder="菜单或者页面的标题，用作显示，建议中文"
          maxlength="10"
          show-word-limit
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="顺序" prop="seqNo">
        <el-input-number
          v-model="form.seqNo"
          :min="0"
          :max="1000"
          label="顺序"
        ></el-input-number>
      </el-form-item>
      <el-form-item v-if="form.resType == 3" label="url路径" prop="uri">
        <el-input
          v-model.trim="form.uri"
          placeholder="后台的url，如: /sys/user/save、/sys/role/list"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="form.resType == 3" label="权限" prop="perm">
        <el-input
          v-model.trim="form.perm"
          placeholder="权限字符串，如:sys:user:save 、 sys:role:list"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="form.resType == 2" label="页面路径" prop="component">
        <el-input
          v-model.trim="form.component"
          placeholder="前端组件路径，对应vue router里的component，如:@/views/user/index"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="isExternal(form.component)"
        label="打开方式"
        prop="target"
      >
        <el-radio-group v-model.trim="form.target">
          <el-radio label="_self">本页打开</el-radio>
          <el-radio label="_blank">新页打开</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <icon-picker
          v-model.trim="form.icon"
          autocomplete="off"
          placeholder="菜单或者页面的图标,支持Font图标"
        ></icon-picker>
      </el-form-item>
      <el-form-item v-if="form.resType == 2" label="路由" prop="path">
        <el-input
          v-model.trim="form.path"
          placeholder="请输入前端路由path路径，如:/sys/user、/sys/role，可以是外链（http://）"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="form.resType == 2" label="页面缓存" prop="keepAlive">
        <el-checkbox v-model.trim="form.keepAlive">开启</el-checkbox>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model.trim="form.remarks"
          type="textarea"
          placeholder="菜单或者页面的功能性说明，用以描述本资源的功能说明"
          autocomplete="off"
          maxlength="255"
          show-word-limit
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
  import { doResourceSave } from "@/api/sys/resource";

  import { isletter, isChinese, isExternal } from "@/utils/validate";
  import iconPicker from "@c/IconPicker/index";

  export default {
    //name: "save",
    //组件注册
    components: { iconPicker },
    //指令注册
    directives: {},
    data() {
      //数据
      return {
        //表单数据
        form: {
          remarks: null,
          enabled: true,
          icon: "",
          name: "",
          perm: null,
          pid: "",
          resType: 1,
          title: "",
          uri: null,
          affix: false,
          target: "_self",
          keepAlive: true,
          component: "",
          hidden: false,
          path: "",
          ptype: "",
          ptitle: "",
          seqNo: 0,
        },
        rules: {
          name: [
            { required: true, trigger: "blur", message: "请输入名字" },
            {
              validator: (rule, value, callback) => {
                if (!isletter(value)) {
                  callback(new Error("只能输入大小写英文字母"));
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
          title: [
            { required: true, trigger: "blur", message: "请输入显示标题" },
            {
              validator: (rule, value, callback) => {
                if (!isChinese(value)) {
                  callback(new Error("只能输入中文"));
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
          uri: [
            { required: true, trigger: "blur", message: "请输入后台url路径" },
          ],
          perm: [
            { required: true, trigger: "blur", message: "请输入权限标志" },
            {
              validator: (rule, value, callback) => {
                var pattern = /[A-Za-z:]+$/;
                if (!pattern.test(value)) {
                  callback(
                    new Error("只能输入英文字母和英文冒号，不能有其他字符")
                  );
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
        },
        //窗口显示隐藏
        visible: false,
      };
    },
    computed: {
      title() {
        switch (this.form.resType) {
          case 1:
            return "添加菜单";
          case 2:
            return "添加页面";
          case 3:
            return "添加权限";
          default:
            return "添加";
        }
      },
    },
    //方法
    methods: {
      isExternal: isExternal,
      /**
       * 显示窗口
       */
      show(row) {
        this.form.pid = row.id;
        this.form.resType = row.ptype + 1;
        this.form.ptype = row.ptype;
        this.form.ptitle = row.ptitle;
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
            let data = this.form;
            data.component =
              this.form.resType == 1 ? "Layout" : this.form.component;
            const { msg } = await doResourceSave(data);
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
