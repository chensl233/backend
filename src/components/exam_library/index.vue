<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">题库管理</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="搜索">
                <input type="text" v-model="cond.title" placeholder="题库名称" />
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
        <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="examLibrary.store" text="添加题库" @click="create()"></p-button>
      </div>
      <div class="float-box mb-10">
         <Table :datas="test_list" >
            <TableItem align="center" title="题库名称" :width='200' prop="title"></TableItem>
            <TableItem align="center" title="试题数量" :width='80' prop="question_count"></TableItem>
            <TableItem align="center" title="单选题" :width='50' prop="single_count"></TableItem>
            <TableItem align="center" title="多选题" :width='50' prop="multiple_count"></TableItem>
            <TableItem align="center" title="判断题" :width='50' prop="judgement_count"></TableItem>
            <TableItem align="center" title="填空题" :width='50' prop="fill_count"></TableItem>
            <TableItem align="center" title="主观题" :width='50' prop="open_count"></TableItem>
            <TableItem align="center" title="创建人" :width='150'>
              <template slot-scope="{ data }">
                {{data.admin.name}}
              </template>
            </TableItem>
            <TableItem align="center" title="创建时间" :width='150' prop="created_at"></TableItem>
            <div slot="empty">暂时无数据</div>
            <TableItem title="操作" align="center" :width="240">
                <template slot-scope="{ data }">
                    <p-button glass="h-btn h-btn-s h-btn-primary" permission="examLibrary.edit" text="编辑" @click="edit(data)"></p-button>
                    <p-del-button glass="h-btn h-btn-s" permission="examLibrary.delete" text="删除" @click="remove(data)"></p-del-button>
                    <p-button glass="h-btn h-btn-s" permission="examQuestion" text="试题管理" @click="examQuestion(data)"></p-button>
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
  data() {
    return {
        test_list:[],
        pagination:{},
        cond:{},
    };
  },
  mounted() {
      this.getData();
  },
  methods: {
    getData(){
        let data = this.pagination;
        data.title = this.cond.title;
        R.ExamLibrary.List(data).then((res)=>{
            this.test_list = res.data.data;
            this.pagination.total = res.data.total;
        });
    },
    changePage() {
      this.getData();
    },
    create(){
        this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./create'], resolve);
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
    edit(item){
        this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./edit'], resolve);
          },
          datas: {
            item: {
              title:item.title,
              lib_id:item.lib_id,
            },
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
    examQuestion(item){
        this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./exam_question/index'], resolve);
          },
          datas: {
            item: {
              lib_id:item.lib_id,
            },
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
      R.ExamLibrary.Delete({ lib_id: item.lib_id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData(true);
      });
    }
  },
  filters:{

  }
};
</script>
