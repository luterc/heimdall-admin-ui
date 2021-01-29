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
  <div class="tabs-bar-container">
    <el-tabs
      v-model="tabActive"
      type="card"
      class="tabs-content"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
      @contextmenu.prevent.native="openContextMenu(selectedTag, $event)"
    >
      <el-tab-pane
        v-for="item in visitedRoutes"
        :key="item.path"
        :name="item.path"
        :closable="!isAffix(item)"
      >
        <!--        带tooltip提示信息的-->
        <!--        <el-tooltip-->
        <!--          slot="label"-->
        <!--          effect="dark"-->
        <!--          :content="item.meta.remarks"-->
        <!--          placement="bottom"-->
        <!--        >-->
        <!--          <span-->
        <!--            slot="label"-->
        <!--            data-role="rightClick"-->
        <!--            @click.right="openContextMenu(item, $event)"-->
        <!--          >-->
        <!--            <font-icon-->
        <!--              v-if="item.meta.icon"-->
        <!--              :icon="['fas', item.meta.icon]"-->
        <!--            ></font-icon>-->
        <!--            {{ $t("router." + item.name) }}-->
        <!--          </span>-->
        <!--        </el-tooltip>-->
        <span
          slot="label"
          data-role="rightClick"
          @click.right="openContextMenu(item, $event)"
        >
          <font-icon
            v-if="item.meta.icon"
            :icon="['fas', item.meta.icon]"
          ></font-icon>
          {{ $t("router." + item.name) }}
        </span>
      </el-tab-pane>
    </el-tabs>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li v-if="!isAffixTag()" @click="handleTabRemove(selectedTag)">
        <font-icon :icon="['fas', 'fa-times']"></font-icon>
        {{ $t("layout.tabsBar.CloseCurrent") }}
      </li>
      <li @click="closeOtherstabs(selectedTag)">
        <font-icon :icon="['fas', 'fa-times-circle']" />
        {{ $t("layout.tabsBar.CloseOther") }}
      </li>
      <li @click="closeAlltabs">
        <font-icon :icon="['fas', 'fa-ban']"></font-icon>
        {{ $t("layout.tabsBar.CloseAll") }}
      </li>
    </ul>
    <el-dropdown @command="handleCommand">
      <el-button
        class="more-actions"
        plain
        icon="el-icon-arrow-down"
      ></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="closeOthersTabs">
          <font-icon :icon="['fas', 'fa-times-circle']" />
          {{ $t("layout.tabsBar.CloseOther") }}
        </el-dropdown-item>
        <el-dropdown-item command="closeLeftTabs">
          <font-icon :icon="['fas', 'fa-arrow-alt-circle-left']"></font-icon>
          {{ $t("layout.tabsBar.CloseLeft") }}
        </el-dropdown-item>
        <el-dropdown-item command="closeRightTabs">
          <font-icon :icon="['fas', 'fa-arrow-alt-circle-right']"></font-icon>
          {{ $t("layout.tabsBar.CloseRight") }}
        </el-dropdown-item>
        <el-dropdown-item command="closeAllTabs">
          <font-icon :icon="['fas', 'fa-ban']"></font-icon>
          {{ $t("layout.tabsBar.CloseAll") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import path from "path";
  import { mapGetters } from "vuex";

  export default {
    name: "TabsBar",
    data() {
      return {
        affixtabs: [],
        tabActive: "",
        selectedTag: "",
        //右键
        visible: false,
        top: 10,
        left: 0,
      };
    },

    computed: {
      ...mapGetters({
        visitedRoutes: "tabsBar/visitedRoutes",
        routes: "routes/routes",
      }),
    },
    watch: {
      $route: {
        handler(route) {
          this.inittabs();
          this.addtabs();
          let tabActive = "";
          this.visitedRoutes.forEach((item, index) => {
            if (item.path === this.$route.path) {
              tabActive = item.path;
            }
          });
          this.tabActive = tabActive;
        },
        immediate: true,
      },
      visible(value) {
        if (value) {
          document.body.addEventListener("click", this.closeMenu);
        } else {
          document.body.removeEventListener("click", this.closeMenu);
        }
      },
    },
    mounted() {},
    methods: {
      openContextMenu(item, e) {
        let path;
        //tab本身点击
        if (e.srcElement && e.srcElement.id) {
          path = e.srcElement.id.split("-")[1];
        }
        //tab里面那个span的点击
        if (e.target && e.target.dataset && e.target.dataset.role) {
          if (e.target.dataset.role === "rightClick" && item) {
            path = item.path;
          }
        }
        if (path) {
          const menuMinWidth = 65;
          const titleBarHeight = 40;
          const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
          const offsetWidth = this.$el.offsetWidth; // container width
          const maxLeft = offsetWidth - menuMinWidth; // left boundary
          const left = e.clientX - offsetLeft + 15; // 15: margin right
          if (left > maxLeft) {
            this.left = maxLeft;
          } else {
            this.left = left;
          }
          this.top = e.clientY - titleBarHeight;
          this.visible = true;
          this.selectedTag = path;
          console.log("选中的tag:", path);
        }
      },
      closeMenu() {
        this.visible = false;
      },
      async handleTabRemove(tabActive) {
        let view;
        this.visitedRoutes.forEach((item, index) => {
          if (tabActive === item.path) {
            view = item;
          }
        });
        const { visitedRoutes } = await this.$store.dispatch(
          "tabsBar/delRoute",
          view
        );
        if (this.isActive(view)) {
          this.toLastTag(visitedRoutes, view);
        }
      },
      handleTabClick(tab) {
        const route = this.visitedRoutes.filter((item, index) => {
          if (tab.index === index + "") return item;
        })[0];
        if (this.$route.path !== route.path) {
          this.$router.push({
            path: route.path,
            query: route.query,
            fullPath: route.fullPath,
          });
        } else {
          return false;
        }
      },
      isActive(route) {
        return route.path === this.$route.path;
      },
      isAffix(tag) {
        return tag.meta && tag.meta.affix;
      },
      isAffixTag() {
        const view = this.visitedRoutes.filter((item, index) => {
          if (item.path === this.selectedTag) {
            return item;
          }
        })[0];
        if (view) return this.isAffix(view);
      },
      filterAffixtabs(routes, basePath = "/") {
        let tabs = [];
        routes.forEach((route) => {
          if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path);
            tabs.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: { ...route.meta },
            });
          }
          if (route.children) {
            const temptabs = this.filterAffixtabs(route.children, route.path);
            if (temptabs.length >= 1) {
              tabs = [...tabs, ...temptabs];
            }
          }
        });
        return tabs;
      },
      inittabs() {
        const affixtabs = (this.affixtabs = this.filterAffixtabs(this.routes));
        for (const tag of affixtabs) {
          if (tag.name) {
            this.$store.dispatch("tabsBar/addVisitedRoute", tag);
          }
        }
      },
      addtabs() {
        const { name } = this.$route;
        if (name) {
          this.$store.dispatch("tabsBar/addVisitedRoute", this.$route);
        }
        return false;
      },
      handleCommand(command) {
        switch (command) {
          case "closeOthersTabs":
            this.closeOtherstabs();
            break;
          case "closeLeftTabs":
            this.closeLefttabs();
            break;
          case "closeRightTabs":
            this.closeRighttabs();
            break;
          case "closeAllTabs":
            this.closeAlltabs();
            break;
          default:
            break;
        }
      },
      async refreshRoute() {
        this.$baseEventBus.$emit("reloadrouter-view");
      },
      async closeOtherstabs(path) {
        if (path) {
          console.log("关闭tag:", path);
          const view = this.visitedRoutes.filter((item, index) => {
            if (item.path === path) {
              return item;
            }
          })[0];
          //关闭tab
          await this.$store.dispatch("tabsBar/delOthersRoutes", view);
          //切换到自己
          if (view && this.$route.path !== view.path) this.$router.push(view);
        } else {
          const view = await this.toThisTag();
          await this.$store.dispatch("tabsBar/delOthersRoutes", view);
        }
      },
      async closeLefttabs() {
        const view = await this.toThisTag();
        await this.$store.dispatch("tabsBar/delLeftRoutes", view);
      },
      async closeRighttabs() {
        const view = await this.toThisTag();
        await this.$store.dispatch("tabsBar/delRightRoutes", view);
      },
      async closeAlltabs() {
        const view = await this.toThisTag();
        if (view) {
          const { visitedRoutes } = await this.$store.dispatch(
            "tabsBar/delAllRoutes"
          );
          if (this.affixtabs.some((tag) => tag.path === view.path)) {
            return;
          }
          this.toLastTag(visitedRoutes, view);
        }
      },
      toLastTag(visitedRoutes, view) {
        const latestView = visitedRoutes.slice(-1)[0];
        if (latestView) {
          this.$router.push(latestView);
        } else {
          this.$router.push("/");
        }
      },
      async toThisTag() {
        const view = this.visitedRoutes.filter((item, index) => {
          if (item.path === this.$route.fullPath) {
            return item;
          }
        })[0];
        if (view && this.$route.path !== view.path) this.$router.push(view);
        return view;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .tabs-bar-container {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    height: $base-tabs-bar-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    user-select: none;

    ::v-deep {
      .fold-unfold {
        margin-right: $base-padding;
      }
    }

    .tabs-content {
      width: calc(100% - 110px);
      height: $base-tabs-item-height;

      ::v-deep {
        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          height: $base-tabs-item-height;
          line-height: $base-tabs-item-height;
        }

        .el-tabs__header {
          border-bottom: 0;

          .el-tabs__nav {
            border: 0;
          }

          .el-tabs__item {
            background-color: $base-color-white;
            box-sizing: border-box;
            height: $base-tabs-item-height;
            margin-right: 5px;
            line-height: $base-tabs-item-height;
            border: 1px solid $base-color-white;
            border-radius: 2px;
            transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
          }
        }
      }
    }

    .more-actions {
      background-color: $base-color-white;
      padding: 7px;
    }

    .contextmenu {
      margin: 0;
      background: $base-color-white;
      z-index: $base-z-index + 5;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      box-shadow: $base-box-shadow;

      li {
        margin: 0;
        padding: 10px 20px;
        cursor: pointer;

        &:hover {
          background: $base-color-blue;
          color: $base-color-white;
          box-shadow: $base-box-shadow;
          border-radius: 4px;
        }
      }
    }
  }
</style>
