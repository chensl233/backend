<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">课程模板</span>
    </div>
    <div class="h-panel-body">
      <div class="mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="8">
              <FormItem label="搜索">
                <input type="text" v-model="cond.school_name" placeholder="院校名称" />
              </FormItem>
            </Cell>
            <Cell :width="8">
              <FormItem label="搜索">
                <input type="text" v-model="cond.keywords" placeholder="模板标题" />
              </FormItem>
            </Cell>

            <Cell :width="6">
              <FormItem>
                <Button class="h-btn h-btn-primary" @click="getData(true)">搜索</Button>
                <Button class="h-btn" @click="reset()">重置</Button>
              </FormItem>
            </Cell>
          </Row>
        </Form>
      </div>
      <div class="mb-10">
        <p-button glass="h-btn h-btn-primary" icon="h-icon-plus" permission="course.store" text="添加模板" @click="create()"></p-button>
      </div>
      <Table :loading="loading" :datas="datas" @sort="sortEvt">
        <TableItem prop="mould_id" title="模板ID"  :width="80"></TableItem>
        <TableItem prop="mould_name" :width="300" title="模板名称"></TableItem>
        <TableItem title="适用院校">
            <template slot-scope="{ data }">
              {{data.school_name|nullToStr}}
            </template>
        </TableItem>
        <TableItem title="适用专业">
            <template slot-scope="{ data }">
              {{data.major_name|nullToStr}}
            </template>
        </TableItem>
        <TableItem title="适用学期">
            <template slot-scope="{ data }">
              第{{data.term}}学期
            </template>
        </TableItem>
        <TableItem prop="created_at" :width="110" title="创建时间"></TableItem>
        
        <TableItem title="操作" align="center" :width="350">
          <template slot-scope="{ data }">
            <p-del-button permission="course.destroy" @click="remove(datas, data)"></p-del-button>
            <p-button glass="h-btn h-btn-s h-btn-primary" permission="course.edit" text="编辑" @click="edit(data)"></p-button>
            <p-button glass="h-btn h-btn-s" permission="course.watchRecords" text="查看课程" @click="showCourseMould(data)"></p-button>
          </template>
        </TableItem>
      </Table>
      <p></p>
      <Pagination v-if="pagination.total > 0" align="right" v-model="pagination" @change="changePage" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      cond: {
        keywords: '',
        cid: null,
        sort: 'created_at',
        order: 'desc',
        id: null
      },
      datas: [],
      loading: false,
    };
  },
  mounted() {
    this.getData(true);
  },
  filters:{
      nullToStr : (value)=>{
        return value!=null?value:'通用';
      }
  },
  methods: {
    changePage() {
      this.getData();
    },
    sortEvt(sort) {
      this.cond.sort = sort.prop;
      this.cond.order = sort.type;
      this.getData();
    },
    reset() {
      this.cond.keywords = null;
      this.cond.cid = null;
      this.cond.id = null;
      this.getData(true);
    },
    getData(reload = false) {
      if (reload) {
        this.pagination.page = 1;
      }
      this.loading = true;
      let cond = Object.assign(this.cond, this.pagination);
      R.CourseMoudle.List(cond).then(resp => {
        this.datas = resp.data.data;
        this.pagination.total = resp.data.total;
        this.loading = false;
      });
    },
    showCourseMould(item){
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./show_course_mould'], resolve);
          },
          datas: {
            mould_id: item.mould_id
          }
        }
      });
    },
    remove(data, item) {
      R.CourseMoudle.Delete({ mould_id: item.mould_id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData();
      });
    },
    create() {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./create'], resolve);
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            HeyUI.$Message.success('成功');
            this.getData(true);
          }
        }
      });
    },
    edit(item) {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./edit'], resolve);
          },
          datas: {
            mould_id: item.mould_id
          }
        },
        
        events: {
          success: (modal, data) => {
            modal.close();
            HeyUI.$Message.success('成功');
            this.getData(true);
          }
        }
      });
    },
    
  }
};
</script>
