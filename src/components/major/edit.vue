<template>
  <div class="h-panel w-800">
    <div class="h-panel-bar">
      <span class="h-panel-title">编辑</span>
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
          <Cell :width="24">
            <FormItem>
              <Button color="primary" @click="update">编辑</Button>
            </FormItem>
          </Cell>
        </Row>
      </Form>
    </div>
  </div>
</template>
<script>
import Major from 'model/Major';
export default {
  props: ['major_id'],
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
    this.init();
  },
  methods: {
    init() {
      R.Major.Edit({ id: this.major_id }).then(res => {
        this.major = res.data;
      });
    },
    update() {
      this.$emit('success', this.major);
    }
  }
};
</script>
