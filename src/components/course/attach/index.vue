<template>
  <div class="h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">课程附件</span>
    </div>
    <div class="h-panel-body">
      <div class="mb-10">
        <p-button
          glass="h-btn h-btn-primary"
          icon="h-icon-plus"
          permission="course_attach.store"
          text="添加"
          @click="create()"
        ></p-button>
      </div>
      <Table :loading="loading" :datas="datas">
        <TableItem prop="id" title="ID"></TableItem>
        <TableItem prop="name" title="附件名"></TableItem>
        <TableItem prop="path" title="路径"></TableItem>
        <TableItem prop="download_times" title="观看次数"></TableItem>
        <TableItem title="操作" align="center" :width="200">
          <template slot-scope="{ data }">
            <p-del-button permission="course_attach.destroy" @click="remove(datas, data)"></p-del-button>
          </template>
        </TableItem>
      </Table>
    </div>
  </div>
</template>
<script>
export default {
  props: ['cid'],
  data() {
    return {
      datas: [],
      course: {},
      loading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getData(true);
    },
    getData(reload = false) {
      this.loading = true;
      R.CourseAttach.List({ course_id: this.cid }).then(resp => {
        this.loading = false;
        this.datas = resp.data.data;
        this.course = resp.data.course;
      });
    },
    create() {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./create'], resolve);
          },
          datas: {
            cid: this.course.id
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            R.CourseAttach.Store(data).then(resp => {
              HeyUI.$Message.success('成功');
              this.getData(true);
            });
          }
        }
      });
    },
    remove(data, item) {
      R.CourseAttach.Delete({ id: item.id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData(true);
      });
    }
  }
};
</script>
