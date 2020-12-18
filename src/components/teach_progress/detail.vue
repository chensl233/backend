<style lang="less" scoped>
.base-info {
  width: 100%;
  height: auto;
  float: left;
  line-height: 36px;
}
</style>
<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title">用户详情</span>
    </div>
    <div class="h-panel-body">
      <Row class="base-info mb-10" v-if="user">
        <Cell width="6">
          ID：
          <copytext :copytext="user.id" />
        </Cell>
        <Cell width="6">
          学员姓名：
          <copytext :copytext="user.nick_name" />
        </Cell>
      </Row>

      <Row class="mb-10">
        <Cell width="24">
          <Tabs :datas="tabs" v-model="selectTab" @change="tabChange"></Tabs>
        </Cell>
      </Row>

      <Row v-show="selectTab === 'course_progress'">
        <Cell width="24">
          <Table :datas="user_course_progress" class="mb-10">
            <TableItem :width="100" prop="term" title="课程学期">
              
            </TableItem>
            <TableItem :width="200" title="课程名">
              <template slot-scope="{ data }">
                <span v-if="data.course">{{ data.course.title }}</span>
                <span class="red" v-else>已删除</span>
              </template>
            </TableItem>
            <TableItem :width="100" prop="course_id" title="课程ID"></TableItem>
            <TableItem :width="150" prop="course_code" title="课程编码"></TableItem>
            <TableItem :width='80' title="完成状态">
                <template slot-scope="{data}">
                  <span class="greed" v-if="data.finish_course==1">已完成</span>
                  <span class="red" v-else>未完成</span>
                </template>
            </TableItem>
            <TableItem :width="160" title="视频学习时长">
                <template slot-scope="{data}">
                  <span v-if="data.course_user_records[0]">{{data.course_user_records[0].video_study_time|SecondToDate}}</span>
                  <span v-else>0</span>
                </template>
            </TableItem>
            <TableItem :width="160" title="课件学习时长">
                <template slot-scope="{data}">
                  <span v-if="data.course_user_records[0]">{{data.course_user_records[0].attach_study_time|SecondToDate}}</span>
                  <span v-else>0</span>
                </template>
            </TableItem>
            <TableItem prop="finish_video" :width="80" title="课程视频完成数"></TableItem>
            <TableItem :width="80" title="课程测验完成数	">
                <template slot-scope="{data}" >
                  0{{data.check}}
                </template>
            </TableItem>
            <TableItem :width="80" title="作业完成数	">
                <template slot-scope="{data}" >
                  0{{data.homework}}
                </template>
            </TableItem>
            <TableItem :width="80" title="考试完成数	">
                <template slot-scope="{data}" >
                  0{{data.check}}
                </template>
            </TableItem>

          </Table>
          <Pagination align="right" v-model="paginate.video_history" @change="paginateChange('video_history')" />
        </Cell>
      </Row>
      <Row v-show="selectTab === 'video_history'">
        <Cell width="24">
          <Table :datas="user_video_History" class="mb-10">
            <TableItem title="课程/章节">
              <template slot-scope="{ data }">
                <span v-if="user_video_HistoryMap[data.course_id]">{{ user_video_HistoryMap[data.course_id].title }}/{{ data.video.title }}</span>
                <span class="red" v-else>已删除</span>
              </template>
            </TableItem>
            <TableItem :width="150" title="观看进度">
                <template slot-scope="{data}">
                    {{data.watch_seconds|SecondToDate}}
                </template>
            </TableItem>
            <TableItem :width="150" title="学习时长">
                <template slot-scope="{data}">
                    {{data.study_seconds|SecondToDate}}
                </template>
            </TableItem>
            <TableItem prop="updated_at" :width="160" title="最后观看时间"></TableItem>
            <TableItem prop="created_at" :width="160" title="首次观看时间"></TableItem>
            <TableItem prop="watched_at" :width="160" title="完成观看时间"></TableItem>
          </Table>
          <Pagination align="right" v-model="paginate.video_history" @change="paginateChange('video_history')" />
        </Cell>
      </Row>
        <Row v-show="selectTab === 'attach_history'">
        <Cell width="24">
          <Table :datas="user_attach_History" class="mb-10">
            <TableItem title="课程">
              <template slot-scope="{ data }">
                <span v-if="user_attach_HistoryMap[data.course_id]">{{ user_attach_HistoryMap[data.course_id].title }}/{{ data.course_attach.name }}</span>
                <span class="red" v-else>已删除</span>
              </template>
            </TableItem>
            <TableItem :width="150" title="学习时长">
                <template slot-scope="{data}">
                    {{data.study_seconds|SecondToDate}}
                </template>
            </TableItem>
            <TableItem prop="updated_at" :width="160" title="最后观看时间"></TableItem>
            <TableItem prop="created_at" :width="160" title="首次观看时间"></TableItem>
          </Table>
          <Pagination align="right" v-model="paginate.video_history" @change="paginateChange('video_history')" />
        </Cell>
      </Row>
    </div>
  </div>
</template>
<script>
export default {
  props: ['id'],
  data() {
    return {
      user: null,
      tabs: {
        course_progress: '进度详情',
        video_history: '视频进度',
        attach_history: '课件进度',
      },
      selectTab: 'course_progress',
      paginate: {
        course_progress: {
          page: 1,
          size: 10,
          total: 0
        },
        video_history: {
          page: 1,
          size: 10,
          total: 0
        },
        attach_history: {
          page: 1,
          size: 10,
          total: 0
        }
      },
      user_video_History: [],
      user_video_HistoryMap: [],
      user_attach_History: [],
      user_attach_HistoryMap: [],
      user_course_progress: [],
      user_course_progressMap: [],
    };
  },
  mounted() {
    this.get_course_progress();
  },
  methods: {
    getUser() {
      R.Member.Detail({ id: this.id }).then(res => {
        this.user = res.data.data;
      });
    },
    tabChange(data) {
        let key = data.key;
      if (key === 'video_history') {
        this.get_video_History(true);
      } else if (key === 'attach_history') {
        this.get_attach_History(true);
      } else if (key === 'course_progress') {
        this.get_course_progress(true);
      }
    },
    get_course_progress(reset = false) {
      if (reset === true) {
        this.paginate.course_progress.page = 1;
      }
      let data = this.paginate.course_progress;
      data.id = this.id;
      R.TeachProgress.StudentDetail(data).then(res => {
        this.user_course_progress = res.data.data;
        this.paginate.course_progress.total = res.data.total;
      });
    },
    get_video_History(reset = false) {
      if (reset === true) {
        this.paginate.video_history.page = 1;
      }
      let data = this.paginate.video_history;
      data.id = this.id;
      R.Member.History(data).then(res => {
        this.user_video_History = res.data.data.data;
        this.paginate.video_history.total = res.data.data.total;
        this.user_video_HistoryMap = res.data.courses;
      });
    },
    get_attach_History(reset = false) {
      if (reset === true) {
        this.paginate.attach_history.page = 1;
      }
      let data = this.paginate.attach_history;
      data.id = this.id;
      data.type = 2;
      R.Member.History(data).then(res => {
        this.user_attach_History = res.data.data.data;
        this.paginate.attach_history.total = res.data.data.total;
        this.user_attach_HistoryMap = res.data.courses;
      });
    },
    paginateChange(t) {
      this.get_video_History();
    }
  },
  filters: {
    SecondToDate: function (msd) {
      var time = msd;
      if (null != time && '' != time) {
        if (time > 60 && time < 60 * 60) {
          time = parseInt(time / 60.0) + '分钟' + parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) + '秒';
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          time =
            parseInt(time / 3600.0) +
            '小时' +
            parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) +
            '分钟' +
            parseInt(
              (parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) *
                60
            ) +
            '秒';
        } else if (time >= 60 * 60 * 24) {
          time =
            parseInt(time / 3600.0 / 24) +
            '天' +
            parseInt((parseFloat(time / 3600.0 / 24) - parseInt(time / 3600.0 / 24)) * 24) +
            '小时' +
            parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) +
            '分钟' +
            parseInt(
              (parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) *
                60
            ) +
            '秒';
        } else {
          time = parseInt(time) + '秒';
        }
      }
      return time;
    }
  }
};
</script>
