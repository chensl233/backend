<style lang="less"></style>
<template>
  <div class="h-panel w-800">
    <div class="h-panel-bar">
      <span class="h-panel-title">添加模板</span>
    </div>
    <div class="h-panel-body">
      <Form
        mode="block"
        ref="form"
        :validOnChange="true"
        :showErrorTip="true"
        :labelWidth="300"
        :rules="rules"
        :model="schoolMould"
      >
        <Row :space="10">
           <Cell :width="8">
            <FormItem label="适用院校" prop="school_id">
                <Select
                v-model="schoolMould.school_id"
                :datas="school_list"
                keyName="school_id"
                titleName="school_name"
                @change="getMajor()"
                ></Select>
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="专业层次" prop="major_level">
                <Select
                v-model="schoolMould.major_level"
                :datas="major_level"
                keyName="id"
                titleName="name"
                @change="getMajor()"
                ></Select>
            </FormItem>
          </Cell>
          <Cell :width="8">
              <FormItem label="适用专业" prop="major_id">
                    <Select
                    v-model="schoolMould.major_id" 
                    :datas="major_list" 
                    :filterable="true" 
                    keyName='major_id'
                    titleName='major_name'>
                    </Select>
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
          <Cell :width="16">
            <FormItem label="模板名称" prop="mould_name">
                <input type="text" v-model="schoolMould.mould_name" placeholder="例如:xx专业通用模板" />
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="适用学期" prop="term">
                <Select
                v-model="schoolMould.term"
                :datas="term"
                keyName="id"
                titleName="name"
                ></Select>
            </FormItem>
          </Cell>
        </Row>

        <FormItem>
          <Button color="primary" @click="create()">确认操作</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  props: ['mould_id'],
  data() {
    return {
      schoolMould: {
        major_level: 1, //专业层次 1专 2本 3研究
        term:1,
        major_id: null
      },
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
        required: ['school_id','major_id','mould_name','term']
      }, 
      major_list: [],
      school_list: [],
    };
  },
  methods: {
    create() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        let data = this.schoolMould;
        R.CourseMoudle.Store(data).then(res=>{
          return false;
          this.$emit('success', res);
        })
      }
    },
    getMajor() {
      if(this.schoolMould.major_level){
        this.schoolMould.major_id = null;
        R.School.SchoolMajor(this.schoolMould).then(res => {
            this.major_list = res.data.data;
            this.major_list.unshift({major_id:0,major_name:'通用'});
        });
      }
    },
    getSchool() {
        R.School.List().then(res => {
          this.school_list = res.data.data;
          this.school_list.unshift({school_id:0,school_name:'通用'});
        });
    },
    init() {
        console.log(this.mould_id);
        R.CourseMoudle.Edit({mould_id:this.mould_id}).then(res => {
            this.schoolMould = res.data;
            console.log(this.schoolMould);
        });
    }
  },
   mounted() {
    this.getSchool();
    this.init();
  }
};
</script>
