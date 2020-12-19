<style lang="less" scoped>
.tag-item {
  padding: 3px 5px;
  background-color: @primary-color;
  color: white;
  border-radius: 3px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.grey {
  color: rgba(0, 0, 0, 0.2);
}
</style>
<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">登录日志</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="12">
              <FormItem label="搜索">
                <input type="text" v-model="cond.admin_name" placeholder="用户名" />
              </FormItem>
            </Cell>

            <Cell :width="8">
              <FormItem>
                <Button color="primary" @click="getData(true)">搜索</Button>
                <Button @click="reset">重置</Button>
              </FormItem>
            </Cell>
          </Row>
        </Form>
      </div>
      <div class="float-box mb-10">
        <Table :datas="datas" @sort="sortEvt">
          <TableItem prop="id" :width="100" title="序号"></TableItem>
          <TableItem title="用户名" :width="240">
            <template slot-scope="{ data }">
              {{data.administrator.name}}
            </template>
          </TableItem>
          <TableItem prop="created_at" :width='180' title="登录时间"></TableItem>
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
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      cond: { },
      datas: [],
    };
  },
  mounted() {
    this.getData(true);
  },
  methods: {
    reset() {
      this.cond.admin_name = null;
      this.getData(true);
    },
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
      let data = this.pagination;
      Object.assign(data, this.cond);
      R.Log.loginDetail(data).then(resp => {
        this.datas = resp.data.data;
        this.pagination.total = resp.data.total;
        this.roles = resp.data.roles;
        this.tags = resp.data.tags;
      });
    }
  }
};
</script>
