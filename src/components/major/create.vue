<style lang="less"></style>
<template>
  <div class="h-panel w-800">
    <div class="h-panel-bar">
      <span class="h-panel-title">新建</span>
    </div>
    <div class="h-panel-body">
      <Form
        mode="block"
        ref="form"
        :validOnChange="true"
        :showErrorTip="true"
        :labelWidth="110"
        :model="major"
      >
        <Row :space="10">
          <Cell :width="6">
            <FormItem label="专业名称" prop="major_name">
              <input type="text" v-model="major.major_name" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="专业代码" prop="major_code">
              <input type="text" v-model="major.major_code" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="教育层次" prop="major_level">
              <Select
                v-model="major.major_level"
                :datas="major_level"
                keyName="id"
                titleName="name"
                :filterable="true"
              ></Select>
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
        </Row>
        <FormItem>
          <Button color="primary" @click="create">创建</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import Major from 'model/Major';

export default {
  data() {
    return {
      major: Major.parse({}),
      rules: {
        required: ['major_name', 'major_code','major_level']
      },
      major_level:[
        {id:1,name:'大专'},
        {id:2,name:'本科'},
        {id:3,name:'研究生'},
      ],
    };
  },
  mounted() {

  },
  methods: {
    create() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$emit('success', this.major);
      }
    }
  }
};
</script>
