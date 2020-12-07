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
      <span class="h-panel-title">{{mould_info.mould_name}}</span>
    </div>
    <div class="h-panel-body">
      <Row class="base-info mb-10" v-if="mould_info">
        <Cell width="6">
          适用院校：
          <copytext :copytext="mould_info.school_name|nullToStr" />
        </Cell>
        <Cell width="6">
          适用层次：
          <copytext :copytext="mould_info.major_level|level" />
        </Cell>
        <Cell width="6">
          适用专业：
          <copytext :copytext="mould_info.major_name|nullToStr" />
        </Cell>
        <Cell width="12" class="mt-6 mb-6">
          <Select
            v-model="course_id"
            :datas="course_list"
            keyName="id"
            titleName="title"
            :filterable="true"
            ></Select>
        </Cell>
        <Cell width="7" class="mt-4 mb-4">
          <p-button glass="h-btn h-btn-s h-btn-primary" permission="member.credit1.change" text="添加课程" @click="mouldCourseAdd()"></p-button>
        </Cell>
      </Row>

      <Row class="mb-10">
        <Cell width="24">
          <Tabs :datas="tabs" v-model="selectTab" ></Tabs>
        </Cell>
      </Row>

      <Row v-show="selectTab === 'courses'">
        <Cell width="24">
          <Table :datas="MouldCourse" class="mb-10">

            <TableItem prop="title" title="课程名称" ></TableItem>
            <TableItem prop="course_code" title="专属课程代码"></TableItem>
            <TableItem prop="study_score" title="学分"></TableItem>
            <TableItem prop="study_time1" title="面授学时"></TableItem>
            <TableItem prop="study_time2" title="自学学时"></TableItem>
            <TableItem prop="study_time3" title="实践学时"></TableItem>
            <TableItem prop="term" title="适用学期"></TableItem>
            <TableItem title="课程类型">
              <template slot-scope="{ data }">
                {{data.course_type|courseToType}}
              </template>
            </TableItem>

            <TableItem prop="created_at" title="记录时间"></TableItem>
            <TableItem title="操作" align="center" :width="240">
              <template slot-scope="{ data }">
                <p-del-button glass="h-btn h-btn-s" permission="member.tags" text="删除" @click="mouldCourseDel(data)"></p-del-button>
              </template>
            </TableItem>
          </Table>
          <Pagination align="right" v-model="paginate.courses" @change="paginateChange('courses')" />
        </Cell>
      </Row>


    </div>
  </div>
</template>
<script>
export default {
  props: ['mould_info'],
  data() {
    return {
      school: {},
      tabs: {
        courses: '课程列表',
      },
      selectTab: 'courses',
      paginate: {
        courses: {
          page: 1,
          size: 10,
          total: 0
        }
      },
      course_list:[],
      course_id:null,
      MouldCourse: [],
      MouldCourseMap: [],
    };
  },
  mounted() {
    this.getMouldCourse();
    this.getCourse();
  },
  methods: {
    getMouldCourse(){
      R.CourseMould.MouldCourseList(this.mould_info).then(res => {
        this.MouldCourse = res.data.data;
      })
    },
    paginateChange(t) {
        this.getMouldCourse();
    },
    mouldCourseAdd() {
      if(this.course_id){
        let data = {};
        data.mould_id = this.mould_info.mould_id;
        data.course_id = this.course_id;
        R.CourseMould.MouldCourseStore(data).then(res => {
            HeyUI.$Message.success('添加成功');
            this.getMouldCourse();
        });
      }
    },
    mouldCourseDel(item) {
      let data = {};
      data.mould_id = this.mould_info.mould_id;
      data.course_id = this.course_id;
      R.CourseMould.MouldCourseDelete(data).then(res => {
          HeyUI.$Message.success('删除成功');
          this.getMouldCourse();
      });
    },
    getCourse() {
      R.CourseMould.CourseList().then(res=>{
        this.course_list = res.data.data;
      });
    },

  },filters:{
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
      nullToStr : (value)=>{
        return value!=null?value:'通用';
      },
      courseToType : (value)=>{
        switch(value){
          case 1:
            return '选修';
            break;
          case 2:
            return '必修';
            break;
        }
      }
  }
};
</script>
