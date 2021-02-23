<style lang="less"></style>
<template>
  <div class="h-panel w-800">
    <div class="h-panel-bar">
      <span class="h-panel-title">添加专业</span>
    </div>
    <div class="h-panel-body">
      <Form
        mode="block"
        ref="form"
        :validOnChange="true"
        :showErrorTip="true"
        :labelWidth="110"
        :rules="rules"
        :model="schoolMajor"
      >
      
        <FormItem label="专业层次" prop="major_level">
              <div v-width="300">
                <Select
                v-model="schoolMajor.major_level"
                :datas="major_level"
                keyName="id"
                titleName="name"
                @change="getMajor()"
                ></Select>
              </div>
        </FormItem>
        <FormItem label="专业名称" prop="major_id">
        <template>
            <div v-width="300">
                <Select
                v-model="schoolMajor.major_id" 
                :datas="param" 
                :filterable="true" 
                keyName='major_id'
                titleName='major_name'
                :multiple="true">
                </Select>
            </div>
        </template>
        </FormItem>

        <FormItem>
          <Button color="primary" @click="create">确认操作</Button>
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
      schoolMajor: {
        major_level: 1, //专业层次 1专 2本 3研究
        major_id: null
      },
      major_level:[
        {id:1,name:'大专'},
        {id:2,name:'本科'},
        {id:3,name:'研究生'},
      ],
      rules: {
        required: ['major_id']
      }, 
      param: []
    };
  },
  methods: {
    create() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        let data = this.schoolMajor;
        data.school_id = this.school_id;
        delete data.major_level;
        this.$emit('success', data);
      }
    },
    getMajor() {
        R.Major.List(this.schoolMajor).then(res => {
            this.param = res.data.data;
        });
    }
  },
   mounted() {
    this.getMajor();
  }
};
</script>
