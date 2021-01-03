<style lang="less"></style>
<template>
  <div class="table-basic-vue frame-page h-panel h-panel-margin-0 w-1000">
    <div class="h-panel-bar">
      <span class="h-panel-title">编辑考试</span>
    </div>
    <div class="h-panel-body">
      <Form ref="form" mode="block" :validOnChange="true" :showErrorTip="true" :labelWidth="110" :rules="rules" :model="test">
        <Row :space="10">
          <Cell :width="16">
            <FormItem label="考试名称" prop="title">
              <input type="text" v-model="test.title" />
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="考试类型" prop="type">
              <Select v-model="test.type" :datas="test_type" keyName="id" titleName="name"></Select>
            </FormItem>
          </Cell>

        </Row>
        <Row :space="10">
          <Cell :width="8">
            <FormItem label="考试开始时间" prop="start_time">
                <DatePicker v-model="test.start_time" type="datetime" format="YYYY-MM-DD HH:mm:ss"></DatePicker>
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="考试结束时间" prop="end_time">
                <DatePicker v-model="test.end_time" type="datetime" format="YYYY-MM-DD HH:mm:ss"></DatePicker>
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="及格分数" prop="min_score">
              <input type="number" step="1" min="0" v-model="test.min_score" />
            </FormItem>
          </Cell>
        </Row>

        <Row :space="10">
          <Cell :width="8">
            <FormItem label="适用院校" prop="school_id">
                <Select
                v-model="test.school_id"
                :datas="school_list"
                keyName="school_id"
                titleName="school_name"
                :filterable="true" 
                ></Select>
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="适用学期" prop="term">
                <Select
                v-model="test.term"
                :datas="term"
                keyName="id"
                titleName="name"
                ></Select>
                </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="排序" prop="sort">
              <input type="number" step="1" min="0" v-model="test.sort" />
            </FormItem>
          </Cell>
        </Row>

        <FormItem label="考试说明" prop="remark">
          <tinymce-editor v-model="test.remark"></tinymce-editor>
        </FormItem>

        <FormItem>
          <Button color="primary" @click="update">保存</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import TinymceEditor from '../common/tinymce';

import Course from 'model/Course';

export default {
  components: { TinymceEditor },
  props: ['test_id'],
  data() {
    return {
      test: {},
      rules: {
        required: [
          'type',
          'start_time',
          'end_time',
        //   'title',
          'short_description',
          'comment_status',
        ]
      },
      test_type: [
          {id:1,name:'线上'},
          {id:2,name:'线下'},
      ],
      school_list:{},
      term:[
        {id:0,name:'通用'},
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
    this.init();
    this.getSchool();
  },
  methods: {
    init() {
        R.Test.Edit({test_id:this.test_id}).then(res => {
            this.test = res.data;
        });
    },
update() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        let data = this.test;
        data.test_id = this.test_id;
        R.Test.Update(data).then(res=>{
          this.$emit('success', res);
        })
      }
    },
    getSchool() {
        R.School.List().then(res => {
          this.school_list = res.data.data;
          this.school_list.unshift({school_id:0,school_name:'通用'});
        });
    }
  }
};
</script>
