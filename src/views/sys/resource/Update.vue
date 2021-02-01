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
      <el-form-item label="类型" prop="resType">
        <el-radio-group v-model.trim="form.resType">
          <el-radio disabled :label="1">菜单</el-radio>
          <el-radio disabled :label="2">页面</el-radio>
          <el-radio disabled :label="3">权限</el-radio>
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
          :max="10000"
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
          placeholder="请输入前端路径，可以是前端页面或者外链"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-row v-if="form.resType == 2">
        <el-col :span="12">
          <el-form-item prop="keepAlive">
            <el-switch
              v-model="form.keepAlive"
              active-text="缓存"
              inactive-text="不缓存"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="affix">
            <el-switch
              v-model="form.affix"
              active-text="固定标签"
              inactive-text="不固定标签"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
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
  import { doResourceUpdate, getResourceById } from "@/api/sys/resource";
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
        //传入的对象唯一标识，一般是ID
        objId: "",
        //表单数据
        form: {
          remarks: null,
          enabled: true,
          icon: "fas fa-egg",
          name: "",
          perm: null,
          pid: "",
          resType: 1,
          title: "宠物商店",
          uri: null,
          affix: true,
          target: null,
          keepAlive: true,
          component: "Layout",
          hidden: true,
          path: "/pet",
          seqNo: 0,
        },
        //验证规则
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
        //弹窗标题
        title: "修改",
        //弹窗显示隐藏
        visible: false,
      };
    },
    //方法
    methods: {
      isExternal: isExternal,
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
            const { msg } = await doResourceUpdate(this.form);
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
        const { data } = await getResourceById(this.objId);
        this.form = data;
      },
    },
  };
</script>
