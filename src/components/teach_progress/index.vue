<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">教学进度管理</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="搜索">
                <input type="text" v-model="cond.student_sn" placeholder="姓名/学号" />
              </FormItem>
            </Cell>

            <Cell :width="6">
              <FormItem>
                <Button color="primary" @click="getData(true)">搜索</Button>
                <!-- <Button @click="reset">重置</Button> -->
              </FormItem>
            </Cell>
          </Row>
        </Form>
      </div>
      <div class="float-box mb-10">
        <!-- <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="school.store" text="添加" @click="create()"></p-button> -->
      </div>
      <div class="float-box mb-10">
         <Table :datas="student_list" >
            <TableItem title="学员姓名" prop="nick_name"></TableItem>
            <TableItem title="学员编号" :width='120' prop="student_sn"></TableItem>
            <TableItem align="center" :width='180' title="所属院校" >
                <template slot-scope="{ data }">
                  {{data.school.school_name}}
                </template>
            </TableItem>
            <TableItem title="培养层次">
                <template slot-scope="{ data }">
                  {{data.major.major_level|level}}
                </template>
            </TableItem>
            <TableItem title="所属专业" >
                <template slot-scope="{ data }">
                  {{data.major.major_name}}
                </template>
            </TableItem>
            <TableItem title="课程总数" prop="mould_course_count"></TableItem>
            <TableItem title="已完成课程" prop="course_record_count"></TableItem>
            <TableItem title="视频学习时长">
                <template slot-scope="{ data }">
                    {{data.study_second|SecondToDate}}
                </template>
            </TableItem>
            <TableItem title="课件学习时长">
                <template slot-scope="{ data }">
                    {{data.read_second|SecondToDate}}
                </template>
            </TableItem>
            <div slot="empty">暂时无数据</div>
            <TableItem title="操作" align="center" :width="240">
            <template slot-scope="{ data }">
              <p-button glass="h-btn h-btn-s h-btn-primary" permission="member.edit" text="详情" @click="detail(data)"></p-button>
            </template>
          </TableItem>
        </Table>
      </div>
      <div class="float-box mb-10">
        <Pagination v-if="pagination.total > 0" align="right" v-model="pagination" @change="changePage" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
        student_list:[],
        pagination:{},
        cond:{},
    };
  },
  mounted() {
      this.getData();
  },
  methods: {
    getData(){
        let data = this.pagination;
        data.student_sn = this.cond.student_sn;
        R.TeachProgress.List(data).then((res)=>{
            this.student_list = res.data.data;
            this.pagination.total = res.data.total;
        });
    },
    changePage() {
      this.getData();
    },
    detail(item) {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./detail'], resolve);
          },
          datas: {
            id: item.id
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            this.getData();
          }
        }
      });
    },
  },
  filters:{
      level : (value)=>{
        switch(value){
          case 1:
            return '专科';
            break;
          case 2:
            return '本科';
            break;
          case 3:
            return '研究生';
            break;
        }
      },
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
