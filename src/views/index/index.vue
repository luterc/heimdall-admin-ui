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
  <div>
    <el-row :gutter="12" class="header-row">
      <el-col :span="16">
        <div class="header-content">
          <div class="avatar">
            <el-avatar
              size="large"
              :src="currentUser ? currentUser.avatar : ''"
            />
          </div>
          <div class="content">
            <div class="content-title">
              {{ timeFix }} ，{{
                currentUser.realName ||
                currentUser.nickName ||
                currentUser.username
              }}
            </div>
            <div>
              {{ currentUser ? currentUser.department.name : "" }}
              |
              {{ currentUser.posts ? currentUser.posts[0].name : "" }}
            </div>
            <div v-if="mingYan" class="quote-container">
              <p class="quote" v-html="mingYan.content"></p>
              <p class="quote-author">&ndash; {{ mingYan.author }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="extra-content">
          <div
            v-for="(item, index) in statItems"
            :key="index"
            class="stat-item"
          >
            <div class="statistic">
              <div class="title">{{ item.title }}</div>
              <div class="content">
                <span class="value">{{ item.value }}</span>
                <span class="suffix">{{ item.suffix }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="content-row">
      <el-col :span="16">
        <el-card body-style="height:300px">
          <div slot="header" class="clearfix">
            <span>武当山焦点</span>
          </div>
          <vue-chart
            autoresize
            :options="ciyun"
            :events="[['click', handleClick]]"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card body-style="height:300px">
          <div slot="header" class="clearfix">
            <span>动态</span>
          </div>
          <el-scrollbar style="height: 300px">
            <el-timeline style="margin: 20px 0 20px 0">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card>
          <vue-chart :options="line" height="300px"></vue-chart>
        </el-card>
      </el-col>
      <el-col>
        <el-card>
          <el-button
            type="primary"
            icon="el-icon-refresh"
            circle
            size="mini"
            @click="getLogChartHour"
          ></el-button>
          <vue-chart
            ref="logChart"
            theme="dark"
            :loading="loading"
            :options="logChart"
            height="300px"
          ></vue-chart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { timeFix } from "@/utils";
  import VueChart from "@/plugins/echarts";
  import { mapGetters } from "vuex";
  import axios from "axios";

  import { getLogChartHour } from "@/api/sys/syslog";

  export default {
    name: "Index",
    components: { VueChart },
    data() {
      return {
        loading: false,
        mingYan: null,
        activities: [
          {
            content: "丘处机路过牛家村",
            timestamp: "1834-04-12 20:46",
            type: "primary",
            icon: "el-icon-more",
          },
          {
            content: "江湖门派围攻武当山",
            timestamp: "1833-04-03 20:46",
            color: "#0bbd87",
          },
          {
            content: "张翠山回家了",
            timestamp: "1832-04-03 20:46",
          },
          {
            content: "张三丰闭关",
            timestamp: "1831-04-03 20:46",
          },
          {
            content: "张三丰把灭绝师太打哭了..",
            timestamp: "1830-04-03 20:46",
            type: "primary",
            icon: "far fa-grin-tears",
          },
          {
            content: "张无忌掉坑里了..",
            timestamp: "1831-03-03 20:46",
            type: "primary",
            icon: "far fa-grin-tears",
          },
          {
            content: "张无忌在白猿肚子发现九阳真经..",
            timestamp: "1831-06-03 01:46",
            type: "primary",
            icon: "far fa-grin-tears",
          },
        ],
        timeFix: timeFix(),
        statItems: [
          {
            title: "项目总数",
            value: 100,
          },
          {
            title: "排名",
            value: "30",
            suffix: "/ 1000",
          },
          {
            title: "访问量",
            value: 10000,
          },
        ],
        line: {
          title: {
            text: "武当大事件",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985",
              },
            },
          },
          legend: {
            data: ["被追杀", "开会", "闭关", "坐而论道", "聚餐"],
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "被追杀",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: [120, 132, 101, 134, 90, 230, 210],
            },
            {
              name: "开会",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: [220, 182, 191, 234, 290, 330, 310],
            },
            {
              name: "闭关",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: [150, 232, 201, 154, 190, 330, 410],
            },
            {
              name: "坐而论道",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: [320, 332, 301, 334, 390, 330, 320],
            },
            {
              name: "聚餐",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: [820, 932, 901, 934, 1290, 1330, 1320],
            },
          ],
        },
        ciyun: {
          grid: {
            top: "4%",
            left: "2%",
            right: "4%",
            bottom: "0%",
          },
          series: [
            {
              type: "wordCloud",
              gridSize: 15,
              layoutAnimation: true,
              sizeRange: [12, 40],
              rotationRange: [-45, 45],
              rotationStep: 15,
              width: "100%",
              height: "100%",
              data: [
                {
                  name: "围攻光明顶",
                  value: 15000,
                  textStyle: {
                    color: "red",
                  },
                },
                {
                  name: "下山吃饭",
                  value: 10081,
                  textStyle: {
                    color: "blue",
                  },
                },
                {
                  name: "活捉灭绝",
                  value: 9386,
                  textStyle: {
                    color: "green",
                  },
                },

                {
                  name: "追杀赵敏",
                  value: 6500,
                  textStyle: {
                    color: "#bb370e",
                  },
                },
                {
                  name: "寻找屠龙刀",
                  value: 60000,
                  textStyle: {
                    color: "rgba(238,227,28)",
                  },
                },
                {
                  name: "冰火岛在哪里",
                  value: 1200,
                  textStyle: {
                    color: "rgba(6,34,215)",
                  },
                },
                {
                  name: "金毛狮王下落",
                  value: 111200,
                  textStyle: {
                    color: "rgb(232,5,12)",
                  },
                },
              ],
            },
          ],
        },
        logChart: {
          title: {
            text: "每日访问量",
            subtext: "以系统日志为数据源按每日每小时统计访问量",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            axisLabel: {
              show: true,
              interval: 0,
              margin: 15,
              rotate: 45,
            },
            type: "category",
            boundaryGap: false,
            data: [],
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: "{value}次",
            },
          },
          series: [
            {
              name: "请求总数",
              type: "line",
              data: [],
              label: {
                show: true,
              },
              markPoint: {
                data: [
                  { type: "max", name: "最大" },
                  { type: "min", name: "最小" },
                ],
              },
              markLine: {
                data: [{ type: "average", name: "平均" }],
              },
            },
          ],
        },
      };
    },
    computed: {
      ...mapGetters({
        currentUser: "user/currentUser",
      }),
    },
    created() {},
    mounted() {
      // this.getMingYan();
      this.generateQuote();
      this.getLogChartHour();
    },
    methods: {
      handleClick(e) {
        this.$baseNotify(e.name);
      },
      generateQuote() {
        let quotes = [
          "真理惟一可靠的标准就是永远自相符合。@欧文",
          "土地是以它的肥沃和收获而被估价的；才能也是土地，不过它生产的不是粮食，" +
            "而是真理。如果只能滋生瞑想和幻想的话，即使再大的才能也只是砂地或盐池，那上面连小草也长不出来的。@别林斯基",
          "我需要三件东西：爱情友谊和图书。然而这三者之间何其相通！炽热的爱情可以充实图书的内容，图书又是人们最忠实的朋友。@蒙田",
          "时间是一切财富中最宝贵的财富。@德奥弗拉斯多",
          "世界上一成不变的东西，只有“任何事物都是在不断变化的这条真理“。@斯里兰卡",
          "去年今日此门中，人面桃花相映红。人面不知何处去，桃花依旧笑春风。@唐.崔护",
        ];
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        let quoteAuthor = randomQuote.split("@");
        this.mingYan = {
          content: quoteAuthor[0],
          author: quoteAuthor[1],
        };
      },
      getMingYan() {
        let me = this;
        axios
          .get("https://v1.alapi.cn/api/mingyan")
          .then(function (response) {
            me.mingYan = response.data.data;
          })
          .catch(function (response) {});
      },
      async getLogChartHour() {
        this.loading = true;
        const { data } = await getLogChartHour();
        if (data) {
          const x = [],
            y = [];
          data.filter((d) => {
            x.push(d.time);
            y.push(d.count);
          });
          this.logChart.xAxis.data = x;
          this.logChart.series[0].data = y;
          this.$refs.logChart.mergeOptions(this.logChart);
        }
        this.loading = false;
      },
    },
  };
</script>
<style lang="scss" scoped>
  @mixin text-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }

  @mixin clearfix {
    zoom: 1;
    &::before,
    &::after {
      display: table;
      content: " ";
    }
    &::after {
      clear: both;
      height: 0;
      font-size: 0;
      visibility: hidden;
    }
  }

  .header-row {
    padding: 30px;
    background-color: white;
    min-height: 100px;

    .header-content {
      display: flex;

      .avatar {
        flex: 0 1 72px;

        & > span {
          display: block;
          width: 72px;
          height: 72px;
          border-radius: 72px;
        }
      }

      .content {
        position: relative;
        top: 4px;
        flex: 1 1 auto;
        margin-left: 24px;
        color: #545458;
        line-height: 22px;
        font-weight: 500;

        .content-title {
          margin-bottom: 12px;
          color: #0a0a0a;
          font-weight: 500;
          font-size: 24px;
          line-height: 28px;
        }
      }
    }

    .extra-content {
      @include clearfix;
      float: right;
      white-space: nowrap;

      .stat-item {
        position: relative;
        display: inline-block;
        padding: 0 32px;

        .statistic {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: #000000;
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5;
          list-style: none;

          .title {
            margin-bottom: 4px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 14px;
          }

          .content {
            color: #000000;
            font-size: 24px;

            .value {
              color: rgba(0, 0, 0, 0.9);
              font-size: 24px;
              font-weight: bold;
            }

            .suffix {
              color: rgba(0, 0, 0, 0.6);
              font-size: 16px;
            }
          }
        }

        &::after {
          position: absolute;
          top: 8px;
          right: 0;
          width: 1px;
          height: 40px;
          background-color: #eee7ee;
          content: "";
        }

        &:last-child {
          padding-right: 0;

          &::after {
            display: none;
          }
        }
      }
    }
  }

  .content-row {
    padding: 10px;
    margin: 10px;
  }

  .quote-container {
    padding-top: 0.5rem;
    border-bottom: 2px dotted #c6d1bf;

    .quote {
      position: relative;
      letter-spacing: 0.03em;
      font-size: 0.5rem;
      color: gray;
      line-height: 1.2rem;
    }

    .quote:before {
      content: "“";
      position: absolute;
      left: -0.7em;
      font-weight: 900;
      color: #0a0a0a;
      font-size: 14px;
    }

    p {
      line-height: 1em;
    }

    .quote:after {
      content: "”";
      margin-right: -1rem;
      font-weight: 900;
      color: #0a0a0a;
      font-size: 14px;
    }

    .quote-author {
      font-size: 0.8rem;
      text-align: right;
      font-weight: 300;
      margin-right: 2rem;
    }
  }
</style>
