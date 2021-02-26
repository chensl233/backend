<template>
  <div class="table-basic-vue frame-page h-panel w-900">
    <div class="h-panel-bar">
      <span class="h-panel-title">试题管理</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="搜索">
                <input type="text" v-model="pagination.title" placeholder="试题名称" />
              </FormItem>
            </Cell>

            <Cell :width="6">
              <FormItem>
                <Button color="primary" @click="getData(true)">搜索</Button>
                <!-- <Button @click="reset">重置</Button> -->
              </FormItem>
            </Cell>
          </Row>
        </Form>
      </div>
      <div class="float-box mb-10">
        <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="examQuestion.store" text="添加试题" @click="create()"></p-button>
      </div>
      <div class="float-box mb-10">
         <Table :datas="test_list" >
            <TableItem align="center" title="试题名称" :width='200' prop="title"></TableItem>
            <TableItem align="center" title="试题类型" :width='150'>
              <template slot-scope="{ data }">
                {{data.type|typeToStr}}
              </template>
            </TableItem>
            <TableItem align="center" title="创建时间" :width='150' prop="created_at"></TableItem>
            <div slot="empty">暂时无数据</div>
            <TableItem title="操作" align="center" :width="240">
                <template slot-scope="{ data }">
                    <p-button glass="h-btn h-btn-s" permission="examQuestion.edit" text="编辑" @click="edit(data)"></p-button>
                    <p-del-button glass="h-btn h-btn-s" permission="examQuestion.delete" text="删除" @click="remove(data)"></p-del-button>
                </template>
          </TableItem>
        </Table>
      </div>
      <div class="float-box mb-10">
        <Pagination v-if="pagination.total > 0" align="right" v-model="pagination" @change="changePage" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item'],
  data() {
    return {
        test_list:[],
        pagination:{},
        cond:{},
    };
  },
  mounted() {
      this.pagination = this.item;
      this.getData();
  },
  methods: {
    getData(){
        let data = this.pagination;
        data.lib_id = this.item.lib_id;
        R.ExamQuestion.List(data).then((res)=>{
            this.test_list = res.data.data;
            this.pagination.total = res.data.total;
        });
    },
    changePage() {
      this.getData();
    },
    create() {
       this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./create'], resolve);
          },
          datas:{
            lib_id:this.item.lib_id
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            this.getData();
          }
        }
      });
    },
    edit(item) {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./edit'], resolve);
          },
          datas:{
            item
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            this.getData();
          }
        }
      });
    },
    remove(item){
      R.ExamQuestion.Delete({ question_id: item.question_id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData(true);
      });
    }
  },
  filters:{
    typeToStr:(v)=>{
      switch (v) {
        case 'single':
            return '单选题';
        case 'multiple':
            return '多选题';
        case 'fill':
            return '填空题';
        case 'open':
            return '主观题';
        case 'judgement':
            return '判断题';
        default:
            return '单选题';
      }
    }
  }
};
</script>
