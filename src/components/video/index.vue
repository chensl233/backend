<style lang="less" scoped>
.course-title {
  color: #aaaaaa;
}
</style>
<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">全部视频</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="4">
              <FormItem label="视频ID">
                <input type="text" v-model="cond.id" placeholder="视频ID" />
              </FormItem>
            </Cell>
            <Cell :width="4">
              <FormItem label="搜索">
                <input type="text" v-model="cond.keywords" placeholder="视频标题模糊搜索" />
              </FormItem>
            </Cell>
            <Cell :width="10">
              <FormItem label="课程">
                <template v-slot:label>课程</template>
                <Select v-model="cond.course_id" :filterable="true" :datas="courses" keyName="id" titleName="title"></Select>
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem>
                <Button color="primary" @click="getData(true)">搜索</Button>
                <Button class="h-btn" @click="reset">重置</Button>
              </FormItem>
            </Cell>
          </Row>
        </Form>
      </div>
      <div class="flaot-box mb-10">
        <p-del-button permission="video.destroy.multi" text="批量删除" @click="deleteSubmit()"></p-del-button>
        <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="video.store" text="添加" @click="create()"></p-button>

        <p-button glass="h-btn h-btn-primary h-btn-s" permission="video.aliyun_hls.list" text="阿里云视频HLS转码" @click="showHlsPage()"></p-button>
        <p-button
          glass="h-btn h-btn-primary h-btn-s"
          permission="addons.TencentCloudHls.videos"
          text="腾讯云视频HLS转码"
          @click="showTencentHlsPage()"
        ></p-button>

        <p-button glass="h-btn h-btn-primary h-btn-s" permission="video.import" text="视频批量导入" @click="showVideosImport()"></p-button>
      </div>
      <div class="float-box mb-10">
        <Table :loading="loading" :checkbox="true" :datas="datas" ref="table" @sort="sortEvt">
          <TableItem prop="id" title="VID" :sort="true" :width="80"></TableItem>
          <TableItem title="视频">
            <template slot-scope="{ data }">
              <span class="course-title">{{ data.course.title }}</span>
              /
              <span class="video-title">{{ data.title }}</span>
            </template>
          </TableItem>
          <TableItem title="时长" :width="90">
            <template slot-scope="{ data }">
              <duration-text :seconds="data.duration" />
            </template>
          </TableItem>
          <TableItem title="操作" align="center" :width="200">
            <template slot-scope="{ data }">
              <p-button glass="h-btn h-btn-s h-btn-primary" permission="video.edit" text="编辑" @click="edit(data)"></p-button>
              <!-- <p-button glass="h-btn h-btn-s" permission="video.subscribes" text="订阅" @click="showSubscribePage(data)"></p-button> -->
              <p-button glass="h-btn h-btn-s" permission="video.watch.records" text="观看记录" @click="showWatchRecords(data)"></p-button>
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
import DurationText from '@/components/common/duration-text';

export default {
  components: {
    DurationText
  },
  data() {
    return {
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      cond: {
        keywords: '',
        sort: 'created_at',
        order: 'desc',
        course_id: null,
        id: null
      },
      datas: [],
      loading: false,
      courses: []
    };
  },
  mounted() {
    this.getData(true);
  },
  methods: {
    changePage() {
      this.getData();
    },
    reset() {
      this.cond.keywords = '';
      this.cond.course_id = null;
      this.cond.id = null;
      this.getData(true);
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
      let data = this.pagination;
      Object.assign(data, this.cond);
      R.Video.List(data).then(resp => {
        this.datas = resp.data.videos.data;
        this.pagination.total = resp.data.videos.total;
        this.loading = false;
        this.courses = resp.data.courses;
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
            R.Video.Store(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData(true);
            });
          }
        }
      });
    },
    deleteSubmit() {
      let items = this.$refs.table.getSelection();
      if (items.length === 0) {
        this.$Message.error('请选择需要删除的视频');
        return;
      }
      this.loading = true;
      let ids = [];
      for (let i = 0; i < items.length; i++) {
        ids.push(items[i].id);
      }
      R.Video.MultiDelete({ ids: ids }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData();
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
            R.Video.Update(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData();
            });
          }
        }
      });
    },
    showHlsPage() {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['../extentions/aliyunHls/video/index'], resolve);
          }
        }
      });
    },
    showTencentHlsPage() {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['@/components/extentions/tencentCloudHls/video/index'], resolve);
          }
        }
      });
    },
    showVideosImport() {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./import'], resolve);
          }
        }
      });
    },
    showSubscribePage(item) {
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
    }
  }
};
</script>
