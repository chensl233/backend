<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">教学进度管理</span>
    </div>
    <div class="h-panel-body">
      <div class="mb-10">
      </div>
      <Table :loading="loading" :datas="datas" @sort="sortEvt">
        <TableItem prop="course_id" title="CID" :sort="true" :width="80"></TableItem>
        <TableItem :width='350' title="课程">
            <template slot-scope="{data}">
                {{data.course.title}}
            </template>
        </TableItem>
        <TableItem title="课程代码" :width="120">
            <template slot-scope="{data}">
                {{data.course.course_code}}
            </template>
        </TableItem>
        

        <TableItem title="操作" align="center" :width="350">
          <template slot-scope="{ data }">
            <p-button glass="h-btn h-btn-s" permission="course.watchRecords" text="查看进度" @click="checkPlan(data)"></p-button>
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
      categories: [],
      major_level:[
        {id:1,name:'专科'},
        {id:2,name:'本科'},
        {id:3,name:'研究生'},
      ],
    };
  },
  mounted() {
    this.getData(true);
  },
  filters:{
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
    getData(reload = false) {
      if (reload) {
        this.pagination.page = 1;
      }
      this.loading = true;
      let cond = Object.assign(this.cond, this.pagination);
      R.CoursePlan.List(cond).then(resp => {
        this.datas = resp.data.data;
        this.pagination.total = resp.data.total;
        this.loading = false;
      });
    },
    checkPlan(item) {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['../course/course_plan'], resolve);
          },
          datas: {
            id: item.course_id
          }
        }
      });
    },
  }
};
</script>
