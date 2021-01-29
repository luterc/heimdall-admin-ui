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
  <div v-if="errorLogs.length > 0">
    <el-badge
      :value="errorLogs.length"
      @click.native="dialogTableVisible = true"
    >
      <el-button size="mini" type="danger">
        <font-icon :icon="['fas', 'fa-bug']" />
      </el-button>
    </el-badge>

    <el-dialog
      :visible.sync="dialogTableVisible"
      append-to-body
      width="70%"
      :title="$t('layout.errorLog.title')"
    >
      <el-table :data="errorLogs">
        <el-table-column :label="$t('layout.errorLog.url')">
          <template slot-scope="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.url"
              placement="bottom"
            >
              <el-tag type="success">{{ row.url }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('layout.errorLog.message')">
          <template slot-scope="{ row }">
            <el-tag type="danger">
              {{ decodeUnicode(row.err.message) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('layout.errorLog.time')">
          <template slot-scope="{ row }">
            <el-tag type="danger">{{ row.time }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('layout.errorLog.stack')" min-width="120">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover">
              <div style="color: red">
                {{ scope.row.err.stack }}
              </div>
              <el-button slot="reference">
                {{ $t("layout.errorLog.detail") }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column min-width="380" :label="$t('layout.errorLog.action')">
          <template slot-scope="{ row }">
            <a
              v-for="(item, index) in searchList"
              :key="index"
              :href="item.url + decodeUnicode(row.err.message)"
              target="_blank"
            >
              <el-button style="margin-left: 5px" type="primary">
                <font-icon :icon="['fas', 'fa-search']" />
                {{ item.title }}
              </el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">
          {{ $t("layout.errorLog.cancel") }}
        </el-button>
        <el-button type="danger" icon="el-icon-delete" @click="clearAll">
          {{ $t("layout.errorLog.clearAll") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { title } from "@/config/settings";
  import { mapGetters } from "vuex";

  export default {
    name: "ErrorLog",

    data() {
      return {
        dialogTableVisible: false,
        title: title,
      };
    },
    computed: {
      ...mapGetters({
        errorLogs: "errorLog/errorLogs",
      }),
      searchList: function () {
        return [
          {
            title: this.$t("layout.errorLog.baidu"),
            url: "https://www.baidu.com/baidu?wd=",
          },
          {
            title: this.$t("layout.errorLog.google"),
            url: "https://www.google.com/search?q=",
          },
        ];
      },
    },
    methods: {
      clearAll() {
        this.dialogTableVisible = false;
        this.$store.dispatch("errorLog/clearErrorLog");
      },
      decodeUnicode(str) {
        str = str.replace(/\\/g, "%");
        str = unescape(str);
        str = str.replace(/%/g, "\\");
        str = str.replace(/\\/g, "");
        return str;
      },
    },
  };
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-badge {
      .el-button {
        height: 28px;
        display: flex;
        justify-items: center;
        align-items: center;
      }
    }
  }
</style>
