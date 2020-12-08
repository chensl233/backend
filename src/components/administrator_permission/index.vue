<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar"><span class="h-panel-title">权限</span></div>
    <div class="h-panel-body">
      <p>
        <Button class="h-btn h-btn-primary" icon="h-icon-plus" @click="create()">添加</Button>
      </p>
      <Table :loading="loading" :datas="datas">
        <TableItem prop="display_name" title="权限名"></TableItem>
        <TableItem prop="slug" title="Slug"></TableItem>
        <TableItem prop="description" title="描述"></TableItem>
        <TableItem prop="method" title="Method"></TableItem>
        <TableItem prop="url" title="URL"></TableItem>
        <TableItem prop="created_at" title="创建时间"></TableItem>
        <TableItem title="操作" align="center" :width="80">
          <template slot-scope="{ data }">
            <Poptip content="确认删除？" @confirm="remove(datas, data)">
              <button class="h-btn h-btn-s h-btn-red">删除</button>
            </Poptip>
            <button class="h-btn h-btn-s h-btn-primary" @click="edit(data)">编辑</button>
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
        size: 20,
        total: 0
      },
      datas: [],
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
    changePage() {
      this.getData();
    },
    getData(reload = false) {
      if (reload) {
        this.pagination.page = 1;
      }
      this.loading = true;
      R.AdministratorPermission.List(this.pagination).then(resp => {
        this.datas = resp.data.data;
        this.pagination.total = resp.data.total;
        this.pagination.page = resp.data.current_page;
        this.pagination.size = resp.data.per_page;
        this.loading = false;
      });
    },
    create() {
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
              HeyUI.$Message.success('成功');
              this.getData(true);
          }
        }
      });
    },
    remove(data, item) {
      R.AdministratorPermission.Delete({ id: item.id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData(true);
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
          datas: {
            id: item.id
          }
        },
        events: {
          success: (modal, data) => {
            R.Administrator.Update(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData();
            });
          }
        }
      });
    }
  }
};
</script>
