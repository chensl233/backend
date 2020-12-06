<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title">观看记录</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="UID">
                <user-filter v-model="filter.user_id"></user-filter>
              </FormItem>
            </Cell>
            <Cell :width="10">
              <FormItem label="看完时间">
                <DateRangePicker v-model="dateRange" format="YYYY-MM-DD"></DateRangePicker>
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
      <div class="float-box mb-10">
        <Button class="h-btn h-btn-s h-btn-primary" @click="exportExcel()">导出excel</Button>
      </div>
      <div class="float-box mb-10">
        <Table :loading="loading" :datas="list">
          <TableItem title="CID" prop="course_id" :width="80"></TableItem>
          <TableItem title="UID" prop="user_id" :width="80"></TableItem>
          <TableItem title="用户" :width="120">
            <template slot-scope="{ data }">
              <span v-if="typeof users[data.user_id] !== 'undefined'">{{ users[data.user_id].nick_name }}</span>
              <span v-else class="red">已删除</span>
            </template>
          </TableItem>
          <TableItem title="手机号" :width="120">
            <template slot-scope="{ data }">
              <span v-if="typeof users[data.user_id] !== 'undefined'">{{ users[data.user_id].mobile }}</span>
              <span v-else class="red">已删除</span>
            </template>
          </TableItem>
          <TableItem title="观看进度">
            <template slot-scope="{ data }">
              <span>{{ data.progress }}%</span>
            </template>
          </TableItem>
          <TableItem title="开始时间">
            <template slot-scope="{ data }">
              <span>{{ data.created_at }}</span>
            </template>
          </TableItem>
          <TableItem title="看完时间">
            <template slot-scope="{ data }">
              <span>{{ data.watched_at }}</span>
            </template>
          </TableItem>
          <TableItem title="订阅">
            <template slot-scope="{ data }">
              <span v-if="typeof subscribeRecords[data.user_id] !== 'undefined'">是</span>
              <span v-else class="red">否</span>
            </template>
          </TableItem>
          <TableItem title="订阅">
            <template slot-scope="{ data }">
              <Button class="h-btn h-btn-s h-btn-primary" @click="showDesc(data)">详情</Button>
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
  props: ['mould_id'],
  data() {
    return {
      list: [],
      users: [],
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      subscribeRecords: [],
      filter: {
        user_id: null,
        watched_start_at: null,
        watched_end_at: null
      },
      dateRange: {}
    };
  },
  mounted() {
    this.getData(true);
  },
  watch: {
    dateRange() {
      this.filter.watched_start_at = this.dateRange.start;
      this.filter.watched_end_at = this.dateRange.end;
    }
  },
  methods: {
    reset() {
      this.filter.user_id = null;
      this.filter.watched_start_at = null;
      this.filter.watched_end_at = null;
      this.dateRange = {};
      this.getData(true);
    },
    getData(reset = false) {
      if (reset) {
        this.pagination.page = 1;
      }

      this.loading = true;
      let data = this.pagination;
      data.mould_id = this.mould_id;
      Object.assign(data, this.filter);
      R.Course.Show(data).then(res => {

      });
    },
    changePage() {
      this.getData();
    },
   
    exportExcel() {
      let data = {
        video_id: 0,
        export: 1,
        course_id: this.id
      };
      R.Video.WatchRecords(data).then(res => {
        if (res.data.data.length === 1) {
          HeyUI.$Message.warn('数据为空');
          return;
        }
        let date = new Date();
        let filename = '课程观看记录|' + date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate() + '日.xlsx';
        let sheetName = '默认';

        Utils.exportExcel(res.data.data, filename, sheetName);
      });
    }
  }
};
</script>
