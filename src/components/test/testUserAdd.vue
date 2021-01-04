<style lang="less"></style>
<template>
  <div class="h-panel w-800">
    <div class="h-panel-bar">
      <span class="h-panel-title">添加考生</span>
    </div>
    <div class="h-panel-body">
      <Form
        mode="block"
        ref="form"
        :validOnChange="true"
        :showErrorTip="true"
        :labelWidth="110"
        :model="testUser"
      >
      
        <FormItem label="所属院校" prop="school_id">
                <Select
                v-model="testUser.school_id"
                :datas="school_list"
                keyName="school_id"
                titleName="school_name"
                :filterable="true" 
                @change="getUser()"
                ></Select>
            </FormItem>
        <FormItem label="考生列表" prop="user_id">
          <Transfer v-model="value" :datas="user_list" keyName="id" :option="option"></Transfer>
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
  props: ['test_id'],
  data() {
    return {
      testUser: {
        school_id:null,
      },
      school_list:{},
      option: {
        ltHeadText: '学员列表',
        rtHeadText: '考生列表',
        filterable: true,
        placeholder: '输入姓名搜索',
        render: function (op) {
          return `${op.nick_name}`;
        }
      },
      value:[],
      user_list:[ ],
      param: []
    };
  },
  methods: {
    create() {
      if(this.value.length == 0){
          HeyUI.$Message.error('考试信息不能为空');
      }
      let data = {
        user_id:this.value,
        test_id:this.test_id
      };
      R.TestUser.Store(data).then(res => {
        this.$emit('success', data);
      });
    },
   getSchool() {
        R.School.List().then(res => {
          this.school_list = res.data.data;
        });
    },
    getUser() {
      if(this.testUser.school_id){
        R.Member.List({school_id:this.testUser.school_id,size:233}).then(res => {
          this.user_list = res.data.data.data;
        })
      }
    }
  },
   mounted() {
    this.getSchool();
  }
};
</script>
