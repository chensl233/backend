<style lang='less'>
.app-home-vue {
  .home-part-body {
    height: 350px;
    .echarts-vue {
      height: 350px;
    }
  }

  .home-part-body2 {
    height: 420px;
    .echarts-vue {
      height: 420px;
    }
  }

  .progress-div {
    >p {
      padding: 8px 0;
    }
    .h-progress {
      &-title {
        color: @dark2-color;
        font-size: 15px;
      }
      &-text {
        width: 40px;
      }
    }
  }
}
</style>
<template>
  <div class="app-home-vue frame-page">
    <Row :space="30">
      <Cell :xs='24' :sm='24' :md='24' :lg='14' :xl='14'>
        <div class="h-panel">
          <div class="relative">
            <Tabs class="common-panel-tabs" v-model="type" :datas="{type1: '活跃趋势'}"></Tabs>
            <!-- <div class="middle-right" style="right: 25px;"><span class="text-hover" @click="openMore">查看更多</span></div> -->
          </div>
          <div class="home-part-body">
            <Chart :options="data1" v-if="type=='type1'" key="type1"></Chart>
            <!-- <Chart :options="data3" v-if="type=='type2'" key="type2"></Chart> -->
          </div>
        </div>
      </Cell>
      <Cell :xs='24' :sm='24' :md='24' :lg='10' :xl='10'>
        <div class="h-panel">
          <div class="h-panel-bar">
            <div class="h-panel-title">日活统计</div>
            <div class="h-panel-right"><span class="gray-color">日活跃量</span><i class="h-split"></i><span class="font20 primary-color">212</span><i class="h-split"></i><span class="gray-color">人</span></div>
          </div>
          <div class="h-panel-body progress-div home-part-body">
            <p><Progress :percent="80" color="green"><span slot="title">观看视频进度</span><span slot="text"></span></Progress></p>
            <p><Progress :percent="40" color="blue"><span slot="title">观看课件进度</span><span slot="text"></span></Progress></p>
            <p><Progress :percent="22" color="red"><span slot="title">今日评论数量</span><span slot="text"></span></Progress></p>
            <p><Progress :percent="95" color="blue"><span slot="title">学生每日签到</span><span slot="text"></span></Progress></p>
            <p><Progress :percent="68" content="68%" placement="bottom" v-tooltip color="yellow"><span slot="title">全平台活跃率</span><span slot="text"></span></Progress></p>
          </div>
        </div>
      </Cell>
      <Cell :xs='24' :sm='24' :md='24' :lg='24' :xl='24'>
        <div class="h-panel">
          <div class="h-panel-bar">
            <div class="h-panel-title">快捷处理</div>
          </div>
          <div class="h-panel-body progress-div">
            <p>暂无数据</p>
          </div>
        </div>
      </Cell>
      <Cell :xs='24' :sm='24' :md='24' :lg='24' :xl='24'>
        <div class="h-panel">
          <div class="h-panel-bar">
            <div class="h-panel-title">站内消息</div>
          </div>
          <div class="h-panel-body progress-div">
            <p>暂无消息</p>
          </div>
        </div>
      </Cell>
    </Row>
  </div>
</template>
<script>
// import data1 from 'components/demo-components/components/datas/data1';
// import data2 from 'components/demo-components/components/datas/data2';
// import data3 from 'components/demo-components/components/datas/data4';

export default {
  data() {
    return {
      data1:{
        tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['最高价', '最低价']
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: '{value} K'
      }
    }
  ],
  series: [
    {
      name: '最高价',
      type: 'line',
      data: [11, 11, 15, 13, 12, 13, 10],
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      },
      smooth: true,
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ]
      }
    },
    {
      name: '最低价',
      type: 'line',
      data: [1, -2, 2, 5, 3, 2, 0],
      smooth: true,
      markPoint: {
        data: [
          { name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }
        ]
      },
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ]
      }
    }
  ]
      },
      type: 'type1'
    };
  },
  methods: {

  }
};
</script>
