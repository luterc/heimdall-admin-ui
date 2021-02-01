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
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号" prop="username">
            <el-input
              v-model.trim="form.username"
              disabled
              maxlength="30"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input
              v-model.trim="form.realName"
              clearable
              maxlength="30"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="cellPhone">
            <el-input
              v-model.trim="form.cellPhone"
              placeholder="请输入手机号"
              clearable
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickName">
            <el-input
              v-model.trim="form.nickName"
              clearable
              maxlength="30"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" clearable placeholder="请选择性别">
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
              v-model="form.roles"
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
  import { doUserUpdate, getUserById } from "@/api/sys/user";
  import { getRoleListAll } from "@/api/sys/role";
  import { getPostList } from "@/api/sys/post";
  import { isPhone } from "@/utils/validate";
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
        //传入的对象唯一标识，一般是ID
        objId: "",
        //表单数据
        form: {
          realName: "",
          nickName: "",
          username: "",
          roles: [],
          posts: [],
          address: "",
          department: null,
          gender: null,
        },
        //验证规则
        rules: {
          roleIds: [{ required: true, trigger: "blur", message: "请选择角色" }],
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
        //弹窗标题
        title: "修改",
        //弹窗显示隐藏
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
       * 显示弹窗
       * @param params
       */
      show(params) {
        this.title = params.title || "编辑数据";
        let id = params.id;
        if (!id) {
          this.$baseNotify("编辑数据失败,is is null", "错误", "error");
        } else {
          this.objId = id;
          this.getTreeData();
          this.getSysAllRoles();
          this.visible = true;
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
            const { msg } = await doUserUpdate(this.form);
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
        const { data } = await getUserById(this.objId);
        this.form = data;
      },
      async getSysAllRoles() {
        const { data } = await getRoleListAll();
        this.dicts.roles = data;

        //拿完角色，再拿用户信息
        this.getByid();
        this.getPosts();
      },
      async getPosts() {
        const { data } = await getPostList({
          page: 1,
          size: 1000,
        });
        this.dicts.posts = data.records;
      },
      async getTreeData() {
        getDepartmentTree().then((res) => {
          this.options = res.data;
        });
      },
    },
  };
</script>
