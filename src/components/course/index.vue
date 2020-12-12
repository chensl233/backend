<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">课程</span>
    </div>
    <div class="h-panel-body">
      <div class="mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="4">
              <FormItem label="课程ID">
                <input type="text" v-model="cond.id" placeholder="课程ID" />
              </FormItem>
            </Cell>
            <Cell :width="4">
              <FormItem label="课程代码">
                <input type="text" v-model="cond.course_code" placeholder="课程代码" />
              </FormItem>
            </Cell>
            <Cell :width="4">
              <FormItem label="课程标题">
                <input type="text" v-model="cond.keywords" placeholder="课程标题" />
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem label="分类">
                <template v-slot:label>分类</template>
                <Select v-model="cond.cid" :filterable="true" :datas="categories" keyName="id" titleName="name"></Select>
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
        <p-button glass="h-btn h-btn-primary" icon="h-icon-plus" permission="course.store" text="添加" @click="create()"></p-button>
        <p-button glass="h-btn h-btn-primary" icon="h-icon-plus" permission="member.store" text="批量导入" @click="courseImport()"></p-button>

      </div>
      <Table :loading="loading" :datas="datas" @sort="sortEvt">
        <TableItem prop="id" title="CID" :sort="true" :width="80"></TableItem>
        <TableItem prop="title" title="课程"></TableItem>
        <TableItem prop="course_code" title="课程代码"></TableItem>
        <TableItem prop="course_hour" title="课程学时"></TableItem>
        <TableItem prop="study_score" title="课程学分"></TableItem>
        <TableItem title="课程类型">
            <template slot-scope="{ data }">
              {{data.course_type|intToType}}
            </template>
        </TableItem>
        <TableItem title="网络课">
            <template slot-scope="{ data }">
              {{data.is_network|intToStr}}
            </template>
        </TableItem>
        <TableItem title="毕业课">
            <template slot-scope="{ data }">
              {{data.is_graduate|intToStr}}
            </template>
        </TableItem>
        

        <TableItem title="操作" align="center" :width="350">
          <template slot-scope="{ data }">
            <p-del-button permission="course.destroy" @click="remove(datas, data)"></p-del-button>
            <p-button glass="h-btn h-btn-s h-btn-primary" permission="course.edit" text="编辑" @click="edit(data)"></p-button>
            <p-button glass="h-btn h-btn-s" permission="course_chapter" text="章节" @click="goChapter(data)"></p-button>
            <p-button glass="h-btn h-btn-s" permission="course_attach" text="课件" @click="goCourseAttach(data)"></p-button>
            <p-button glass="h-btn h-btn-s" permission="course.watchRecords" text="观看记录" @click="showWatchRecords(data)"></p-button>
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
      categories: []
    };
  },
  mounted() {
    this.getData(true);
  },
  filters:{
      intToStr : (value)=>{
        switch(value){
          case 1:
            return '是';
            break;
          default:
            return '否';
            break;
        }
      },
      intToType: (value)=>{
        switch(value){
          case 1:
            return '必修';
            break;
          case 2:
            return '选修';
            break;
        }
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
      R.Course.List(cond).then(resp => {
        this.datas = resp.data.courses.data;
        this.pagination.total = resp.data.courses.total;
        this.loading = false;
        this.categories = resp.data.categories;
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
            this.getData(true);
          }
        }
      });
    },
    remove(data, item) {
      R.Course.Delete({ id: item.id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData();
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
            id: item.id
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
    goChapter(item) {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./chapter/index'], resolve);
          },
          datas: {
            cid: item.id
          }
        }
      });
    },
    goCourseAttach(item) {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./attach/index'], resolve);
          },
          datas: {
            cid: item.id
          }
        }
      });
    },
    showWatchRecords(item) {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./watch_records'], resolve);
          },
          datas: {
            id: item.id
          }
        }
      });
    },
    showSubscribesPage(item) {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./subscribe/index'], resolve);
          },
          datas: {
            id: item.id
          }
        }
      });
    },
    courseImport() {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./import'], resolve);
          }
        },
        events: {
          success: (modal, data) => {
              modal.close();
              this.getData(true);
          }
        }
      });
    },
  }
};
</script>
