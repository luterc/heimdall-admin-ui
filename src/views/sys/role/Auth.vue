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
    width="40%"
    @close="close"
  >
    <div class="el-dialog-div">
      <el-tree
        ref="tree"
        :data="tree.data"
        show-checkbox
        fit
        default-expand-all
        node-key="id"
        highlight-current
        check-strictly
        :default-checked-keys="tree.defaultCheckedKeys"
        :props="tree.defaultProps"
        @check="onTreeCheck"
      >
        <span slot-scope="{ node, data }">
          <i :class="data.icon"></i>
          <span style="padding-left: 4px">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getRoleAuthTree, saveRoleAuth } from "@/api/sys/role";

  export default {
    //name: "save",
    //组件注册
    components: {},
    //指令注册
    directives: {},
    data() {
      //数据
      return {
        tree: {
          defaultProps: {
            id: "id",
            children: "children",
            label: "title",
            isLeaf: "leaf",
          },
          data: [],
          defaultCheckedKeys: [],
        },
        //窗口标题
        title: "添加",
        //窗口显示隐藏
        visible: false,
        role: "",
      };
    },
    updated() {
      // 给多选树设置默认值
      this.$refs["tree"].setCheckedKeys(this.tree.defaultCheckedKeys);
    },
    //方法
    methods: {
      /**
       * 显示窗口
       */
      show(row) {
        this.role = row;
        this.title = "为角色:[" + row.name + "]授权";
        this.visible = true;
        this.getRoleAuthTreeData();
      },
      /**
       * 关闭窗口
       */
      close() {
        this.visible = false;
        this.$emit("close");
      },
      /**
       * 提交保存
       */
      submit() {
        let checkedKeys = this.$refs["tree"].getCheckedKeys();

        let ids = [];
        checkedKeys.filter((id) => {
          ids.push({
            id: id,
          });
        });
        console.log(ids);
        saveRoleAuth({
          id: this.role.id,
          resources: ids,
        })
          .then((res) => {
            this.$baseMessage(res.msg, "success");
            this.visible = false;
            this.$emit("ok");
          })
          .catch((err) => {});
      },
      getRoleAuthTreeData() {
        getRoleAuthTree(this.role.id)
          .then((res) => {
            this.tree.data = res.data.tree;
            this.tree.defaultCheckedKeys = res.data.checked;
          })
          .catch((err) => {});
      },
      onTreeCheck(currentObj, treeStatus) {
        // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
        let selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中
        // 选中
        if (selected !== -1) {
          // 子节点只要被选中父节点就被选中
          this.selectedParent(currentObj);
          // 统一处理子节点为相同的勾选状态
          this.uniteChildSame(currentObj, true);
        } else {
          // 未选中 处理子节点全部未选中
          if (currentObj.children.length !== 0) {
            this.uniteChildSame(currentObj, false);
          }
        }
      },
      // 统一处理子节点为相同的勾选状态
      uniteChildSame(treeList, isSelected) {
        this.$refs.tree.setChecked(treeList.id, isSelected);
        for (let i = 0; i < treeList.children.length; i++) {
          this.uniteChildSame(treeList.children[i], isSelected);
        }
      },
      // 统一处理父节点为选中
      selectedParent(currentObj) {
        let currentNode = this.$refs.tree.getNode(currentObj);
        if (currentNode.parent.key !== undefined) {
          this.$refs.tree.setChecked(currentNode.parent, true);
          this.selectedParent(currentNode.parent);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  //@import url(); 引入css类
  .el-dialog-div {
    height: 50vh;
    overflow: auto;
  }
</style>
