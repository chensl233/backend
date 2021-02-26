<style lang="less"></style>
<template>
  <div class="table-basic-vue frame-page h-panel h-panel-margin-0 ">
    <div class="h-panel-bar">
      <span class="h-panel-title">编辑试卷</span>
    </div>
    <div class="h-panel-body">
      <Form ref="form" mode="block" :validOnChange="true" :showErrorTip="true" :labelWidth="110" :rules="rules" :model="library">
        <Row :space="10">
          <Cell :width="24">
            <FormItem label="题库名称" prop="title">
              <input type="text" v-model="library.title" />
            </FormItem>
          </Cell>
        </Row>

        <FormItem>
          <Button color="primary" @click="edit">编辑</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>

export default {
  props: ['item'],
  data() {
    return {
      library: {},
      rules: {
        required: [
          'title',
        ]
      },
    };
  },
  mounted() {
    this.library = this.item;
  },
  methods: {
    edit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        R.ExamLibrary.Update(this.library).then(resp => {
          HeyUI.$Message.success('添加成功');
          this.$emit('success');
        });
      }
    },
  }
};
</script>
