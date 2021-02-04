<template>
  <div class="table-basic-vue frame-page h-panel h-panel-margin-0 w-800">
    <div class="h-panel-bar">
      <span class="h-panel-title">新增试题</span>
    </div>
    <div class="h-panel-body">
      <Form :label-width="130" :mode="mode" :model="data" :rules="validationRules" ref="form" :top="0.2" showErrorTip>
        <FormItem label="题目" :single="true" prop="title">
          <textarea rows="3" v-autosize v-wordcount="50" v-model="data.title"></textarea>
        </FormItem>
        <!-- <FormItem label="Multiple" prop="checkboxData">
          <Checkbox v-model="data.checkboxData" :datas="answerData"></Checkbox>
        </FormItem> -->
        <!--
            这里定义的required属性同样适用与验证规则中。
          -->
          <FormItem v-for="(item, index) of data.choicesData" :key="index" :label="'选项'+(index+1)" :prop="'choicesData['+index+'].value'">
            <Row type="flex">
              <Cell class="flex1">
              <input type="text" v-model="item.content" />
              </Cell>
              <Cell class="text-right" v-width="50">
              <Poptip @confirm="remove(index)" content="确定删除？">
                <Button text-color="red" :no-border="true" icon="h-icon-trash"></Button>
              </Poptip>
              </Cell>
            </Row>
          </FormItem>
        <FormItem single>
          <Button size="s" text-color="blue" @click="add">添加输入框</Button>
        </FormItem>
          <FormItem label="答案" prop="expect">
            <Radio v-model="data.expect" :key='fill_count' :datas="answerData"></Radio>
          </FormItem>
        <FormItem label="答案解析" :single="true" prop="analysis">
          <textarea rows="3" v-autosize v-wordcount="50" v-model="data.analysis"></textarea>
        </FormItem>
        <FormItem :no-padding="true" single>
          <Button color="primary" :loading="isLoading" @click="create" >提交</Button>
          <i class="h-split"></i>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  props:['lib_id'],
  data() {
    return {
      mode: 'single',
      data: {
        inputData: '',
        title: '',
        analysis:'',
        checkboxData: [1],
        choicesData: [{flag:"A",content:''}],
        expect: 1,
      },
      fill_count:1,
      answerData: { //单选框
        1: 'A',
      },
      isLoading: false,
      question_type:[ //试题类型
        'single','multiple','judgement','fill','open'
      ],
      validationRules: {
        rules: {
          title: {
            maxLen: 50,
            minLen: 5
          },
        },
        required: [
          'title',
        ],
      }
    };
  },
  methods: {
    create() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        let answer = {
          expect:String.fromCharCode(64 + parseInt(this.data.expect)),
          analysis:this.data.analysis
        };
        let data = {
          lib_id:this.lib_id,
          question_content:this.data.choicesData,
          answer_content:answer,
          fill_count:1,
          title:this.data.title,
          type:'single',
        };
        R.ExamQuestion.Store(data).then(resp => {
          HeyUI.$Message.success('添加成功');
          this.$emit('success');
        });
      }
    },
    add() { //添加输入框
      let key = this.data.choicesData.length+1;
      let flag = String.fromCharCode(64 + parseInt(key));
      this.fill_count = key;

      this.data.choicesData.push({ flag,content:'' });
      this.answerData[key] = flag;
    },
    remove(index) { //删除输入框
      this.data.choicesData.splice(index, 1);
      let key = this.data.choicesData.length;
      this.fill_count = key; //更新key值才能强制重新渲染
      delete this.answerData[key+1];
    }
  }
};
</script>