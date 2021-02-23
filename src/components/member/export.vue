<template>
  <div>
    <!-- h-modal-header 将自带modal头部样式 -->
    <header class="h-modal-header">导出学员信息</header>
    <div class="h-panel-body">
      <Form
        mode="block"
        ref="form"
        :validOnChange="true"
        :showErrorTip="true"
        :labelWidth="300"
        :rules="rules"
        :model="member_info"
      >
        <Row :space="10">
           <Cell :width="8">
            <FormItem label="所属院校" prop="school_id">
                <Select
                v-model="member_info.school_id"
                :datas="school_list"
                keyName="school_id"
                titleName="school_name"
                :filterable="true" 
                @change="getMajor()"
                ></Select>
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="教育层次" prop="major_level">
                <Select
                v-model="member_info.major_level"
                :datas="major_level"
                keyName="id"
                titleName="name"
                @change="getMajor()"
                ></Select>
            </FormItem>
          </Cell>
          <Cell :width="8">
              <FormItem label="所属专业" prop="major_id">
                    <Select
                    v-model="member_info.major_id" 
                    :datas="major_list" 
                    :filterable="true" 
                    keyName='major_id'
                    titleName='major_name'>
                    </Select>
            </FormItem>
          </Cell>
        </Row>
         <FormItem>
      <Button class="h-btn h-btn-primary" color="primary" @click="exportExcel">导出</Button>
      <Button class="h-btn" @click="close">关闭</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      school_list: {},
      major_list: {},
      member_info: {},
      major_level:[
        {id:0,name:'全部'},
        {id:1,name:'大专'},
        {id:2,name:'本科'},
        {id:3,name:'研究生'},
      ],
      rules:{
           required: ['school_id']
      },
    };
  },
  methods: {
    exportExcel() {
      let validResult = this.$refs.form.valid();
      if(validResult.result){
          R.Member.Export(this.member_info).then(res => {
            if (res.data.length === 1) {
              HeyUI.$Message.warn('数据为空');
              return;
            }
            let date = new Date();
            let filename = '学员信息|' + date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate() + '日.xlsx';
            let sheetName = '默认';
            Utils.exportExcel(res.data, filename, sheetName);
          });
      }
    },
    close() {
      this.$emit('close');
    },
    getSchool() {
        R.School.List().then(res => {
          this.school_list = res.data.data;
        });
    },
    getMajor() {
      if(this.member_info.major_level != 0){
        this.member_info.major_id = null;
        R.School.SchoolMajor(this.member_info).then(res => {
            this.major_list = res.data.data;
            this.major_list.unshift({major_id:0,major_name:'全部'});
        });
      }else{
        this.major_list = {};
        this.major_list.unshift({major_id:0,major_name:'全部'});
      }
    },
  },
  mounted(){
      this.getSchool();
  },
};
</script>