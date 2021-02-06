<template>
  <div class="table-basic-vue frame-page h-panel h-panel-margin-0 w-800">
    <div class="h-panel-bar">
      <span class="h-panel-title">编辑试题</span>
    </div>
    <div class="h-panel-body">
      <Form :label-width="130" :mode="mode" :model="data" :rules="validationRules" ref="form" :top="0.2" showErrorTip>
        <FormItem label="题目" :single="true" prop="title">
          <textarea rows="3" v-autosize v-wordcount="2000" v-model="data.title"></textarea>
        </FormItem>
        <!-- <FormItem label="Multiple" prop="checkboxData">
          <Checkbox v-model="data.checkboxData" :datas="answerData"></Checkbox>
        </FormItem> -->
        <!--
            这里定义的required属性同样适用与验证规则中。
          -->
        <FormItem
          v-if="selectTab == 'single' || selectTab == 'multiple'"
          v-for="(item, index) of data.choicesData"
          :key="index"
          :label="'选项' + (index + 1)"
          :prop="'choicesData[' + index + '].value'"
        >
          <Row type="flex">
            <Cell class="flex1">
              <input type="text" v-model="data.choicesData[index]" />
            </Cell>
            <Cell class="text-right" v-width="50" v-if="index != 0">
              <Poptip @confirm="remove(index)" content="确定删除？">
                <Button text-color="red" :no-border="true" icon="h-icon-trash"></Button>
              </Poptip>
            </Cell>
          </Row>
        </FormItem>
        <FormItem single v-if="selectTab !='open' && selectTab !='judgement'">
            <Button size="s" text-color="blue" @click="add">添加选项</Button>
        </FormItem>
        <FormItem :label="daanTxt" prop="expect" v-if="selectTab !='open'">
            <Radio v-if="selectTab =='single'" v-model="data.answerData" :key="data.fill_count" :datas="data.choicesKey"></Radio>
            <Checkbox v-if="selectTab =='multiple'" v-model="data.answerData" :key="data.fill_count" :datas="data.choicesKey"></Checkbox>
            <Radio v-if="selectTab =='judgement'" v-model="data.answerData" :key="data.fill_count" :datas="data.judgementKey"></Radio>
            <FormItem :show-label="false" v-if="selectTab =='fill'" v-for="(item, index) of data.fillData" :key="index" :prop="'choicesData['+index+'].value'">
                <Row type="flex">
                    <Cell class="flex1">
                        <input type="text" :placeholder="'填空项'+(index+1)" v-model="data.fillData[index]" />
                    </Cell>
                    <Cell class="text-right" v-width="50">
                        <Poptip @confirm="remove(index)" content="确定删除？">
                            <Button text-color="red" :no-border="true" icon="h-icon-trash"></Button>
                        </Poptip>
                    </Cell>
                </Row>
            </FormItem>
            <FormItem style="padding-bottom:0px;" :show-label="false" v-if="selectTab =='fill' && data.fillData.length > 0">
                <Cell class="flex1"><Checkbox v-model="data.free_sort" style="margin-right:10px;"></Checkbox>允许答题与答案顺序不一致</Cell>
            </FormItem>
            <FormItem style="padding-bottom:0px;" :show-label="false" v-if="selectTab =='fill' && data.fillData.length == 0">
                <div style="line-height:40px;">请先插入题目的填空项</div>
            </FormItem>
        </FormItem>
        <FormItem label="答案解析" :single="true" prop="analysis">
            <textarea rows="3" v-autosize v-wordcount="50" v-model="data.analysis"></textarea>
        </FormItem>
        <FormItem :no-padding="true" single>
          <Button color="primary" :loading="isLoading" @click="update" >提交</Button>
          <i class="h-split"></i>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
let format = {
  title: '',
  analysis: '',
  // checkboxData: [1],
  choicesData: [],
  choicesKey: [],
  judgementKey: ['对', '错'],
  fillData: [],
  free_sort: false,
  fill_count: 0,
  answerData: []
};
export default {
  props: ['item'],
  data() {
    let format_data = Object.assign({}, format);
    return {
      selectTab: '',
      daanTxt: '答案',
      mode: 'single',
      data: format_data,
      isLoading: false,
      validationRules: {
        rules: {
          title: {
            maxLen: 2000,
            minLen: 5
          }
        },
        required: ['title']
      }
    };
  },
  mounted() {
    // console.log(this.item);
    format.choicesData = [];
    format.choicesKey = [];
    format.fillData = [];
    this.data = Object.assign({}, format);
    if (this.item.type == 'open') {
        this.daanTxt = '得分关键词';
    } else {
        this.daanTxt = '答案';
    }
    this.selectTab = this.item.type;
    this.data.title = this.item.title;
    this.data.analysis = this.item.answer.analysis;
    let fillList = this.item.answer.expect.split("||");   //填空题的答案、多选的答案
    let optionList = this.item.choices;   //选项：单选、多选
    // let expect = '';
    for (let i = 0; i < optionList.length; i++) {
      // let index = i + 1;
      // let flag = String.fromCharCode(64 + parseInt(index));
      this.data.choicesData.push(optionList[i].content);
      this.data.choicesKey.push(optionList[i].flag);
      // if (flag == this.item.answer.expect){
      //   expect = index;
      // }
    }
    if(this.item.type == 'single' || this.item.type == 'judgement'){
      this.data.answerData = fillList[0];
    }else{
      this.data.answerData = fillList;
    }
    if(this.item.type == "fill"){
      for (let i = 0; i < fillList.length; i++) {
        this.data.fillData[i] = fillList[i];
      }
    }
    this.data.free_sort = (this.item.answer.free_sort == 0 ? false : true)
    this.data.fill_count = this.item.fill_count;
    // console.log(this.data);
    // this.data.expect = expect;
  },
  methods: {
    update() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        let answer = {
          expect:this.data.answerData,
          analysis:this.data.analysis,
          free_sort:this.data.free_sort,
        };
        let cdata=[],
          chData=this.data.choicesData,
          chKey=this.data.choicesKey
        // [{flag:"A",content:"123"},{flag:"A",content:"123"},]
        for(let k=0;k<chData.length;k++){
            cdata.push({
              flag:chKey[k],
              content:chData[k]
            })
        }
        if(this.selectTab == "fill"){
          answer.expect=this.data.fillData
        }
        let data = {
          question_id:this.item.answer.question_id,
          question_content:cdata,
          answer_content:answer,
          fill_count:this.data.fillData.length || 1,
          title:this.data.title,
          type:this.selectTab,
        };
        // console.log(data)
        // return
        R.ExamQuestion.Update(data).then(resp => {
          HeyUI.$Message.success('编辑成功');
          this.$emit('success');
        });
      }
    },
    add() {
      //添加选项
      let tab = this.data,
        key = tab.choicesData.length + 1,
        flag = String.fromCharCode(64 + parseInt(key));

      if (this.selectTab == 'fill') {
        tab.fillData.push('');
      } else {
        tab.choicesData.push('');
        tab.choicesKey.push(flag);
      }
      tab.fill_count = key;
    },
    remove(index) {
      //删除输入框
      if(this.selectTab == "fill"){
        this.data.fillData.splice(index, 1);
      }else{
        this.data.choicesData.splice(index, 1);
        this.data.choicesKey.splice(index, 1);
      }
    },
  }
};
</script>