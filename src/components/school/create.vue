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
        :model="school"
      >
      <Row :space="10">
          <Cell :width="24">
            <FormItem label="院校Logo" prop="school_logo">
              <image-upload v-model="school.school_logo" name="选择图片"></image-upload>
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
          <Cell :width="6">
            <FormItem label="负责人" prop="school_master">
              <input type="text" v-model="school.school_master" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="手机号" prop="school_master_tel">
              <input type="text" v-model="school.school_master_tel" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="负责人账号ID" prop="school_master_uid">
              <input type="text" v-model="school.school_master_uid" />
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
          <Cell :width="6">
            <FormItem label="院校名称" prop="school_name">
              <input type="text" v-model="school.school_name" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="院校代码" prop="school_code">
              <input type="text" v-model="school.school_code" />
            </FormItem>
          </Cell>
        </Row>
        <FormItem>
          <Button color="primary" @click="create">创建</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import School from 'model/School';

export default {
  data() {
    return {
      school: School.parse({}),
      rules: {
        required: ['school_name', 'school_code']
      },
    };
  },
  mounted() {
    // R.School.Create().then(res => {
    //   this.roles = res.data.roles;
    // });
  },
  methods: {
    create() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$emit('success', this.school);
      }
    }
  }
};
</script>
