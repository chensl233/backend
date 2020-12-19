<template>
  <div class="h-panel w-800">
    <div class="h-panel-bar">
      <span class="h-panel-title">编辑</span>
    </div>
    <div class="h-panel-body">
      <Form
        mode="block"
        ref="form"
        :validOnChange="true"
        :showErrorTip="true"
        :labelWidth="110"
        :rules="rules"
        :model="student_grade" >
        <Row :space="10">
          <Cell :width="12">
            <FormItem label="年级名称" prop="grade_name">
              <input type="text" v-model="student_grade.grade_name" />
            </FormItem>
          </Cell>
          <Cell :width="12">
            <FormItem label="当前学期" prop="term">
              <Select
              v-model="student_grade.term"
              :datas="term"
              keyName="id"
              titleName="name"
              ></Select>
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
          <Cell :width="6">
            <FormItem label="所属院校" prop="school_id">
              <Select
                v-model="student_grade.school_id"
                :datas="school_list"
                :filterable="true"
                keyName="school_id"
                titleName="school_name"
                :disabled="true"
                @change="getMajor()"
                ></Select>
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="专业层次" prop="major_level">
                <Select
                v-model="student_grade.major_level"
                :datas="major_level"
                keyName="id"
                titleName="name"
                :disabled="true"
                @change="getMajor()"
                ></Select>
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="学生专业" prop="major_id">
              <Select
              v-model="student_grade.major_id" 
              :datas="major_list" 
              :filterable="true" 
              keyName='major_id'
              titleName='major_name' 
              :disabled="true"
              @change="getCourseMould()"
              ></Select>
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="课程方案" prop="mould_id">
              <Select
              v-model="student_grade.mould_id" 
              :datas="mould_list" 
              :filterable="true" 
              keyName='mould_id'
              titleName='mould_name'>
              </Select>
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
          <Cell :width="24">
            <FormItem>
              <Button color="primary" @click="update">编辑</Button>
            </FormItem>
          </Cell>
        </Row>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  props: ['grade_id'],
  data() {
    return {
      student_grade: {},
      rules: {
        required: ['grade_name']
      },
      school_list: [],
      major_list:[],
      mould_list:[],
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
    };
  },
  mounted() {
    this.getSchool().then(()=>{
      this.init();
    });
  },
  methods: {
    init() {
        R.StudentGrade.Edit({ grade_id: this.grade_id }).then(res => {
          this.student_grade = res.data;
          let major_id = this.student_grade.major_id;
          let mould_id = this.student_grade.mould_id;
          this.getMajor().then(()=>{
            this.student_grade.major_id = major_id;
            this.getCourseMould();
            this.student_grade.mould_id = mould_id;
          });
        });
    },
    update() {
      this.$emit('success', this.student_grade);
    },
    async getSchool() {
        R.School.List().then(res => {
          this.school_list = res.data.data;
        });
    },
    async getMajor() {
      if(this.student_grade.major_level){
        this.student_grade.major_id = null;
        this.student_grade.mould_id = null;
        let data = {};
        data.major_level = this.student_grade.major_level;
        data.school_id = this.student_grade.school_id;
        R.School.SchoolMajor(data).then(res => {
            this.major_list = res.data.data;
        });
      }
    },
    async getCourseMould() {
      this.student_grade.mould_id = null;
      let data = {};
      data.major_id = this.student_grade.major_id;
      data.school_id = this.student_grade.school_id;
      data.major_level = this.student_grade.major_level;
      R.CourseMould.List(data).then(res => {
        this.mould_list = res.data.data;
      });
    }
  }
};
</script>
