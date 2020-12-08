<style lang="less"></style>
<template>
  <div class="h-panel w-800">
    <div class="h-panel-bar">
      <span class="h-panel-title">课程管理</span>
    </div>
    <div class="h-panel-body">
      <Form
        mode="block"
        ref="form"
        :validOnChange="true"
        :showErrorTip="true"
        :labelWidth="300"
        :rules="rules"
        :model="mouldCourse"
      >
        <Row :space="10">
           <Cell :width="8">
            <FormItem label="课程" prop="course_id">
                <Select
                v-model="mouldCourse.course_id"
                :datas="course_list"
                keyName="id"
                titleName="title"
                @change="courseDetail()"
                ></Select>
            </FormItem>
          </Cell>
          <Cell :width="8">
              <FormItem label="课程代码" prop="course_code">
                <input type="text" v-model="mouldCourse.course_code" placeholder="" />
               </FormItem>
          </Cell>
          <Cell :width="4">
            <FormItem label="课程学分" prop="study_score">
                <input type="number" min="0" step="0.5" v-model="mouldCourse.study_score" placeholder="" />
            </FormItem>
          </Cell>
          <Cell :width="4">
            <FormItem label="适用学期" prop="term">
                <Select
                v-model="mouldCourse.term"
                :datas="term"
                keyName="id"
                titleName="name"
                ></Select>
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
            <Cell :width="8">
                <FormItem label="面授学时" prop="study_time1">
                    <input type="number" min="0" step="1" v-model="mouldCourse.study_time1" placeholder="" />
                </FormItem>
          </Cell>
          <Cell :width="8">
                <FormItem label="自学学时" prop="study_time2">
                    <input type="number" min="0" step="1" v-model="mouldCourse.study_time2" placeholder="" />
                </FormItem>
          </Cell>
          <Cell :width="8">
                <FormItem label="实践学时" prop="study_time3">
                    <input type="number" min="0" step="1" v-model="mouldCourse.study_time3" placeholder="" />
                </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
            <Cell :width="4">
            <FormItem label="是否网络课" prop="is_network">
              <h-switch v-model="mouldCourse.is_network" :trueValue="1" :falseValue="0"></h-switch>
            </FormItem>
          </Cell>
          <Cell :width="4">
            <FormItem label="是否毕业课" prop="is_graduate">
              <h-switch v-model="mouldCourse.is_graduate" :trueValue="1" :falseValue="0"></h-switch>
            </FormItem>
          </Cell>
         <Cell :width="4">
            <FormItem label="是否论文课" prop="is_thesis">
              <h-switch v-model="mouldCourse.is_thesis" :trueValue="1" :falseValue="0"></h-switch>
            </FormItem>
          </Cell>
            <Cell :width="4">
            <FormItem label="是否考察课" prop="is_check">
              <h-switch v-model="mouldCourse.is_check" :trueValue="1" :falseValue="0"></h-switch>
            </FormItem>
          </Cell>
            <Cell :width="8">
                    <FormItem label="课程类型" prop="course_type">
                    <Select v-model="mouldCourse.course_type" :datas="courseType"></Select>
                    </FormItem>
            </Cell>
        </Row>

        <FormItem>
          <Button color="primary" @click="submit()">确认操作</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  props: ['mould_id','course_info'],
  data() {
    return {
      mouldCourse: {},
      major_level:[
        {id:1,name:'专科'},
        {id:2,name:'本科'},
        {id:3,name:'研究生'},
      ],
      term:[
        {id:1,name:'第一学期'},
        {id:2,name:'第二学期'},
        {id:3,name:'第三学期'},
        {id:4,name:'第四学期'},
        {id:5,name:'第五学期'},
        {id:6,name:'第六学期'},
        {id:7,name:'第七学期'},
        {id:8,name:'第八学期'},
      ],
      rules: {
        required: ['course_id','study_score','course_code','term']
      }, 
      course_list: [],
      courseType: [
        {
          title: '必修',
          key: 1
        },
        {
          title: '选修',
          key: 2
        }
      ]
    };
  },
  methods: {
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        let data = this.mouldCourse;
        data.mould_id = this.mould_id;
        if(this.course_info){
            R.CourseMould.MouldCourseUpdate(data).then(res=>{
              this.$emit('success', res);
            })
        }else{
            R.CourseMould.MouldCourseStore(data).then(res => {
                this.$emit('success',res);
            });
        }
      }
    },
    getCourse() {
      R.CourseMould.CourseList().then(res=>{
        this.course_list = res.data.data;
      });
    },
    courseDetail() {
      R.CourseMould.CourseList({course_id:this.mouldCourse.course_id}).then(res=>{
        this.mouldCourse = res.data;
        this.mouldCourse.study_time1 = res.data.course_hour;
        this.mouldCourse.study_time2 = this.mouldCourse.study_time3 = 0;
        this.mouldCourse.term = 1;
      });
    }
  },
   mounted() {
    this.getCourse();
    console.log(this.course_info);
    if(this.course_info){
        this.mouldCourse = this.course_info;
    }
  }
};
</script>
