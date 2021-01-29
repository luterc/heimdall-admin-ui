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
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号" prop="username">
            <el-input
              v-model.trim="form.username"
              maxlength="30"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model.trim="form.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码确认" prop="repeatPassword">
            <el-input
              v-model.trim="form.repeatPassword"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="cellPhone">
            <el-input
              v-model.trim="form.cellPhone"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="realName">
            <el-input
              v-model.trim="form.realName"
              maxlength="30"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input
              v-model.trim="form.nickName"
              maxlength="30"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择性别">
              <el-option
                v-for="item in getStoredDictByTypeName('gender')"
                :key="item.itemValue"
                :label="item.label"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属部门" prop="department">
            <treeselect
              v-model="form.department"
              label-in-value
              :normalizer="normalizer"
              :options="options"
              :show-count="true"
              value-format="object"
              placeholder="请选择归属部门"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色" prop="roles">
            <el-select
              v-model="form.userRoles"
              style="width: 100%"
              multiple
              filterable
              clearable
              allow-create
              default-first-option
              value-key="id"
              change="changeValue"
              placeholder="分配角色"
            >
              <el-option
                v-for="item in dicts.roles"
                :key="item.id"
                :label="item.title"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位" prop="posts">
            <el-select
              v-model="form.posts"
              style="width: 100%"
              multiple
              filterable
              clearable
              allow-create
              value-key="id"
              change="changeValue"
              default-first-option
              placeholder="请选择岗位"
            >
              <el-option
                v-for="item in dicts.posts"
                :key="item.id"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input
              v-model.trim="form.address"
              maxlength="200"
              show-word-limit
              type="textarea"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model.trim="form.remarks"
              maxlength="200"
              show-word-limit
              type="textarea"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doUserSave, isExistUsername } from "@/api/sys/user";
  import { getRoleListAll } from "@/api/sys/role";

  import { isPhone } from "@/utils/validate";
  import { getPostList } from "@/api/sys/post";
  // import the component
  import Treeselect from "@riophae/vue-treeselect";
  // import the styles
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { getDepartmentTree } from "@/api/sys/department";

  export default {
    //name: "save",
    //组件注册
    components: { Treeselect },
    //指令注册
    directives: {},
    data() {
      //数据
      return {
        dicts: {
          roles: [],
          posts: [],
        },
        //表单数据
        form: {
          username: "",
          password: "",
          repeatPassword: "",
          realName: "",
          userRoles: [],
          posts: [],
          address: "",
          department: null,
          gender: null,
        },
        //验证规则
        rules: {
          roleIds: [{ required: true, trigger: "blur", message: "请选择角色" }],
          username: [
            { required: true, trigger: "blur", message: "请输入账号" },
            {
              trigger: "blur",
              min: 5,
              max: 30,
              message:
                "账号至少5个字，最多30个字，只支持英文字母数字和符号，不支持中文",
            },
            {
              validator: async (rule, value, callback) => {
                const { data } = await isExistUsername({
                  prop: "username",
                  value: value,
                });
                if (data) {
                  callback(new Error("账号已经被占用，请更换"));
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
          password: [
            { required: true, trigger: "blur", message: "请输入密码" },
            {
              trigger: "blur",
              min: 6,
              max: 18,
              message: "密码长度6-18个字符",
            },
            {
              validator: (rule, value, callback) => {
                if (value === "") {
                  callback(new Error("请输入密码"));
                } else {
                  if (this.form.repeatPassword !== "") {
                    this.$refs.form.validateField("repeatPassword");
                  }
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
          repeatPassword: [
            { required: true, trigger: "blur", message: "请输入确认密码" },
            {
              validator: (rule, value, callback) => {
                if (value === "") {
                  callback(new Error("请再次输入密码"));
                } else if (value !== this.form.password) {
                  callback(new Error("两次输入密码不一致!"));
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
          cellPhone: [
            {
              validator: (rule, value, callback) => {
                if (value && !isPhone(value)) {
                  callback(new Error("请输入正确的手机号码"));
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
        },
        //窗口标题
        title: "添加",
        //窗口显示隐藏
        visible: false,
        //组织机构树
        options: [],
        normalizer(node) {
          if (node.children && !node.children.length) {
            delete node.children;
          }
          node.children === "" ||
          node.children === undefined ||
          node.children === null
            ? delete node.children
            : "";
          return {
            id: node.id,
            label: node.name,
            children: node.children,
          };
        },
      };
    },
    //方法
    methods: {
      /**
       * 显示窗口
       */
      show() {
        this.getSysAllRoles();
        this.getTreeData();
        this.getPosts();
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
            const { msg } = await doUserSave(this.form);
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
      async getPosts() {
        const { data } = await getPostList({
          page: 1,
          size: 1000,
        });
        this.dicts.posts = data.records;
      },
      async getSysAllRoles() {
        const { data } = await getRoleListAll();
        this.dicts.roles = data;
      },
      async getTreeData() {
        getDepartmentTree().then((res) => {
          this.options = res.data;
        });
      },
    },
  };
</script>
