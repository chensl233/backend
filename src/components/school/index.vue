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
      <span class="h-panel-title">全部院校</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="搜索">
                <input type="text" v-model="cond.school_code" placeholder="院校名称/院校代码" />
              </FormItem>
            </Cell>

            <Cell :width="6">
              <FormItem>
                <Button color="primary" @click="getData(true)">搜索</Button>
                <Button @click="reset">重置</Button>
              </FormItem>
            </Cell>
          </Row>
        </Form>
      </div>
      <div class="float-box mb-10">
        <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="school.store" text="添加" @click="create()"></p-button>
      </div>
      <div class="float-box mb-10">
        <Table :loading="loading" :datas="datas" @sort="sortEvt">
          <TableItem title="院校名称" :width="240">
            <template slot-scope="{ data }">
              <copytext :copytext="data.school_name" />
            </template>
          </TableItem>
          <TableItem title="院校代码" :width="150">
            <template slot-scope="{ data }">
              <copytext :copytext="data.school_code" />
            </template>
          </TableItem>
          <TableItem title="负责人" :width="150">
            <template slot-scope="{ data }">
              <copytext :copytext="data.school_master" />
            </template>
          </TableItem>
          <TableItem title="负责人联系方式" :width="200">
            <template slot-scope="{ data }">
              <copytext :copytext="data.school_master_tel" />
            </template>
          </TableItem>
          <TableItem prop="major_count" title="专业数量" :width="100"></TableItem>
          <TableItem prop="created_at" title="创建时间" :width="150"></TableItem>

          <TableItem title="操作" align="center" :width="240">
            <template slot-scope="{ data }">
              <p-button glass="h-btn h-btn-s h-btn-primary" permission="member.edit" text="编辑" @click="edit(data)"></p-button>
              <p-del-button glass="h-btn h-btn-s" permission="member.tags" text="删除" @click="remove(data)"></p-del-button>
              <p-button glass="h-btn h-btn-s" permission="member.detail" text="专业详情" @click="schoolMajor(data)"></p-button>

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
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      cond: {
        // school_name:'',
        school_code:'',
        sort:'',
      },
      datas: [],
      loading: false,
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
      this.cond.school_code = null;
      this.getData(true);
    },
    remove(item) {
      R.School.Delete({ school_id: item.school_id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData(true);
      });
    },
    sortEvt(sort) {
      this.cond.sort = sort.prop;
      this.getData();
    },
    getData(reload = false) {
      if (reload) {
        this.pagination.page = 1;
      }
      this.loading = true;
      let data = this.pagination;
      Object.assign(data, this.cond);
      R.School.List(data).then(resp => {
        this.datas = resp.data.data;
        this.pagination.total = resp.data.total;
        this.loading = false;
        this.roles = resp.data.roles;
        this.tags = resp.data.tags;
        this.userRemarks = resp.data.user_remarks;
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
            R.School.Store(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData(true);
            });
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
          datas: {
            school_id: item.school_id
          }
        },
        events: {
          success: (modal, data) => {
            R.School.Update(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData();
            });
          }
        }
      });
    },
    schoolMajor(item){
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./schoolMajor'], resolve);
          },
          datas: {
            school_id: item.school_id
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            this.getData();
          }
        }
      });
    }
  
  }
};
</script>
