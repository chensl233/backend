<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title">教学进度设置</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
          <RichTextEditor  v-model="plan"></RichTextEditor >
          <Button color="primary" @click="save">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>
import RichTextEditor  from '../common/wangEditor';

export default {
  props: ['id'],
  components: { RichTextEditor  },
  data() {
    return {
      plan:null,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    save(){
      let data = {
        course_id:this.id,
        plan:this.plan
      };
      R.CoursePlan.Save(data).then(res=>{
        HeyUI.$Message.success('编辑成功');
        this.getData();
      })
    },
    getData(){
      R.CoursePlan.List({course_id:this.id}).then(res => {
        if(res.data.total > 0){
          this.plan = res.data.data[0].plan;
        }
      });
    }
  }
};
</script>
