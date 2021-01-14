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

        <Cell width="24" class="mt-10 mb-10">
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

            <TableItem prop="title" :width="180" title="课程名称" ></TableItem>
            <TableItem prop="course_code" :width="150" title="专属课程代码"></TableItem>
            <TableItem prop="study_score" title="学分"></TableItem>
            <TableItem prop="term" title="适用学期"></TableItem>
            <TableItem prop="study_time1" title="面授学时"></TableItem>
            <TableItem prop="study_time2" title="自学学时"></TableItem>
            <TableItem prop="study_time3" title="实践学时"></TableItem>
            <TableItem title="是否网络课">
              <template slot-scope="{data}">
                {{data.is_network|yesOrNo}}
              </template>
            </TableItem>
            <TableItem title="是否论文课">
              <template slot-scope="{data}">
                {{data.is_thesis|yesOrNo}}
              </template>
            </TableItem>
            <TableItem title="是否考察课">
              <template slot-scope="{data}">
                {{data.is_check|yesOrNo}}
              </template>
            </TableItem>
            <TableItem title="是否毕业课">
              <template slot-scope="{data}">
                {{data.is_graduate|yesOrNo}}
              </template>
            </TableItem>
            <TableItem title="课程类型">
              <template slot-scope="{ data }">
                {{data.course_type|courseToType}}
              </template>
            </TableItem>

            <TableItem title="操作" align="center" :width="200">
              <template slot-scope="{ data }">
                <p-button glass="h-btn h-btn-s h-btn-primary" permission="course.edit" text="编辑" @click="mouldCourseEdit(data)"></p-button>
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
  },
  methods: {
    getMouldCourse(){
      let data = this.paginate.courses;
      data.mould_id = this.mould_info.mould_id;
      R.CourseMould.MouldCourseList(data).then(res => {
        this.MouldCourse = res.data.data;
        this.paginate.courses.total = res.data.total;
      }) 
    },
    paginateChange(t) {
        this.getMouldCourse();
    },
    mouldCourseAdd() {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./mould_course_save'], resolve);
          },
          datas: {
            mould_id: this.mould_info.mould_id,
          }
        },
        events: { 
          success: (modal, data) => {
            HeyUI.$Message.success('添加成功');
            modal.close();
            this.getMouldCourse();
          }
        }
      });
    },
    mouldCourseEdit(item) {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./mould_course_save'], resolve);
          },
          datas: {
            mould_id: this.mould_info.mould_id,
            course_info: item
          }
        },
        events: { 
          success: (modal, data) => {
            HeyUI.$Message.success('编辑成功');
            modal.close();
            this.getMouldCourse();
          }
        }
      });
    },
    mouldCourseDel(item) {
      let data = {};
      data.mould_id = this.mould_info.mould_id;
      data.course_id = item.course_id;
      R.CourseMould.MouldCourseDelete(data).then(res => {
          HeyUI.$Message.success('删除成功');
          this.getMouldCourse();
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
            return '必修';
            break;
          case 2:
            return '选修';
            break;
        }
      },
      yesOrNo: (v)=>{
        if(v==1)
          return '是';
        else
          return '否';
      }
  }
};
</script>
