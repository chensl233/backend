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
      <span class="h-panel-title">全部专业</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="搜索">
                <input type="text" v-model="cond.keywords" placeholder="专业名称/专业代码" />
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
          <TableItem title="专业名称" :width="240">
            <template slot-scope="{ data }">
              <copytext :copytext="data.major_name" />
            </template>
          </TableItem>
          <TableItem title="教育层次" :width="240">
            <template slot-scope="{ data }">
              <copytext  :copytext="data.major_level|level" />
            </template>
          </TableItem>
          <TableItem title="专业代码" :width="240">
            <template slot-scope="{ data }">
              <copytext :copytext="data.major_code" />
            </template>
          </TableItem>
          <TableItem prop="created_at" title="创建时间" :sort="true" :width="120"></TableItem>

          <TableItem title="操作" align="center" :width="240">
            <template slot-scope="{ data }">
              <p-button glass="h-btn h-btn-s h-btn-primary" permission="member.edit" text="编辑" @click="edit(data)"></p-button>
              <p-del-button glass="h-btn h-btn-s" permission="member.tags" text="删除" @click="remove(data)"></p-del-button>
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
        keywords: '',
        role_id: null,
        sort: 'created_at',
        order: 'desc',
        tag_id: null
      },
      datas: [],
      loading: false,
    };
  },
  mounted() {
    this.getData(true);
  },
  filters:{
      level : (value)=>{
        switch(value){
          case 1:
            return '专科';
            break;
          case 2:
            return '本科';
            break;
          case 3:
            return '研究生';
            break;
        }
      }
  },
  methods: {
    changePage() {
      this.getData();
    },
    reset() {
      this.cond.keywords = '';
      this.cond.role_id = null;
      this.cond.tag_id = null;
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
      R.Major.List(data).then(resp => {
        this.datas = resp.data.data;
        this.pagination.total = resp.data.total;
        this.loading = false;
        this.roles = resp.data.roles;
        this.tags = resp.data.tags;
        this.userRemarks = resp.data.user_remarks;
      });
    },
    remove(item) {
      R.Major.Delete({ id: item.major_id }).then(resp => {
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
            major_id: item.major_id
          }
        },
        events: {
          success: (modal, data) => {
            R.Major.Update(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData();
            });
          }
        }
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
            R.Major.Store(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData(true);
            });
          }
        }
      });
    },
  }
};
</script>
