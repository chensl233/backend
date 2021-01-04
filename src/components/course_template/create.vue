<style lang="less"></style>
<template>
  <div class="h-panel w-800">
    <div class="h-panel-bar">
      <span class="h-panel-title">添加计划</span>
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
                :filterable="true" 
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
            <FormItem label="计划名称" prop="mould_name">
                <input type="text" v-model="schoolMould.mould_name" placeholder="例如:xx专业通用计划" />
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
  props: ['school_id'],
  data() {
    return {
      schoolMould: {
        major_level: 1, //专业层次 1专 2本 3研究
        major_id: null
      },
      major_level:[
        {id:1,name:'专科'},
        {id:2,name:'本科'},
        {id:3,name:'研究生'},
      ],
      rules: {
        required: ['school_id','major_id','mould_name']
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
        R.CourseMould.Store(data).then(res=>{
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
    }
  },
   mounted() {
    this.getSchool();
  }
};
</script>
