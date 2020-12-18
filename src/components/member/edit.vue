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
        :model="user" >
        <Row :space="10">
          <Cell :width="24">
            <FormItem label="头像" prop="avatar">
              <image-upload v-model="user.avatar" name="选择头像"></image-upload>
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
          <Cell :width="12">
            <FormItem label="学员姓名" prop="nick_name">
              <input type="text" v-model="user.nick_name" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="手机号" prop="mobile">
              <input type="text" v-model="user.mobile" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="密码" prop="password">
              <input type="text" v-model="user.password" />
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
          <Cell :width="12">
            <FormItem label="身份证号" prop="mobile">
              <input type="text" v-model="user.idcard" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="邮箱" prop="email">
              <input type="text" v-model="user.email" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="入学时间" prop="student_income">
              <DatePicker v-model="user.student_income" ></DatePicker>
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
          <Cell :width="6">
            <FormItem label="所属院校" prop="school_id">
              <Select
                v-model="user.school_id"
                :datas="school_list"
                :filterable="true"
                keyName="school_id"
                titleName="school_name"
                @change="getMajor()"
                ></Select>
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="专业层次" prop="major_level">
                <Select
                v-model="user.major_level"
                :datas="major_level"
                keyName="id"
                titleName="name"
                @change="getMajor()"
                ></Select>
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="学生专业" prop="major_id">
              <Select
              v-model="user.major_id" 
              :datas="major_list" 
              :filterable="true" 
              keyName='major_id'
              titleName='major_name' 
              @change="getCourseMould()"
              ></Select>
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="课程方案" prop="mould_id">
              <Select
              v-model="user.mould_id" 
              :datas="mould_list" 
              :filterable="true" 
              keyName='mould_id'
              titleName='mould_name'>
              </Select>
            </FormItem>
          </Cell>

        </Row>
        <Row :space="10">
          <Cell :width="6">
            <FormItem label="学生学号" prop="student_sn">
              <input type="text" v-model="user.student_sn" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="学生来源" prop="student_from">
              <input type="text" v-model="user.student_from" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="学生年级" prop="student_grade">
              <input type="text" v-model="user.student_grade" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="当前学期" prop="term">
              <input type="text" v-model="user.term" />
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
import User from 'model/User';
export default {
  props: ['id'],
  data() {
    return {
      user: User.parse({}),
      rules: {
        required: ['avatar', 'mobile', 'nick_name']
      },
      roles: [],
      school_list: [],
      major_list:[],
      mould_list:[],
      major_level:[
        {id:1,name:'专科'},
        {id:2,name:'本科'},
        {id:3,name:'研究生'},
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
        R.Member.Edit({ id: this.id }).then(res => {
          this.user = res.data;
          let major_id = this.user.major_id;
          let mould_id = this.user.mould_id;
          this.getMajor().then(()=>{
            this.user.major_id = major_id;
            this.getCourseMould();
            this.user.mould_id = mould_id;
          });
        });

    },
    update() {
      this.$emit('success', this.user);
    },
    async getSchool() {
        R.School.List().then(res => {
          this.school_list = res.data.data;
        });
    },
    async getMajor() {
      if(this.user.major_level){
        this.user.major_id = null;
        this.user.mould_id = null;
        let data = {};
        data.major_level = this.user.major_level;
        data.school_id = this.user.school_id;
        R.School.SchoolMajor(data).then(res => {
            this.major_list = res.data.data;
        });
      }
    },
    getCourseMould() {
      this.user.mould_id = null;
      let data = {};
      data.major_id = this.user.major_id;
      data.school_id = this.user.school_id;
      data.major_level = this.user.major_level;
      R.CourseMould.List(data).then(res => {
        this.mould_list = res.data.data;
      });
    }
  }
};
</script>
