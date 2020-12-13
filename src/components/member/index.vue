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
      <span class="h-panel-title">全部学员</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="搜索">
                <input type="text" v-model="cond.keywords" placeholder="学员姓名/学号" />
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem label="搜索">
                <input type="text" v-model="cond.major" placeholder="专业名称/代码" />
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
        <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="member.store" text="添加" @click="create()"></p-button>
        <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="member.store" text="批量导入" @click="memberImport()"></p-button>
      </div>
      <div class="float-box mb-10">
        <Table :loading="loading" :datas="datas" @sort="sortEvt">
          <TableItem title="所属院校" :width="180">
              <template slot-scope="{ data }">
                <copytext  :copytext="data.school.school_name" />
              </template>
          </TableItem>

          <TableItem prop="nick_name" title="姓名" :width="120"></TableItem>
          <TableItem prop="idcard" title="证件号" :width="160"></TableItem>
          <TableItem prop="student_sn" title="学号" :width="130"></TableItem>
          <TableItem title="培养层次" :width="140">
            <template slot-scope="{ data }">
              <copytext  :copytext="data.major.major_level|level" />
            </template>
          </TableItem>
          <TableItem title="专业" :width="140">
            <template slot-scope="{ data }">
              <copytext  :copytext="data.major.major_name" />
            </template>
          </TableItem>
          <TableItem title="年级" :width="100"> 
            <template slot-scope="{ data }">
              <copytext  :copytext="data.student_grade" />
            </template>
          </TableItem>

          <TableItem prop="student_income" title="入学时间" :width="130"></TableItem>

          <!-- <TableItem prop="created_at" title="注册时间" :sort="true" :width="120"></TableItem> -->

          <TableItem title="操作" align="center" :width="240">
            <template slot-scope="{ data }">
              <p-button glass="h-btn h-btn-s h-btn-primary" permission="member.edit" text="编辑" @click="edit(data)"></p-button>
              <p-del-button glass="h-btn h-btn-s" permission="member.tags" text="删除" @click="remove(data)"></p-del-button>
              <p-button glass="h-btn h-btn-s" permission="member.detail" text="详情" @click="detail(data)"></p-button>
              <p-button glass="h-btn h-btn-s" permission="member.remark" text="备注" @click="showRemark(data)"></p-button>
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
      roles: [],
      tags: [],
      userRemarks: [],
      temp:'2020级',
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
      R.Member.List(data).then(resp => {
        this.datas = resp.data.data.data;
        this.pagination.total = resp.data.data.total;
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
            R.Member.Store(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData(true);
            });
          }
        }
      });
    },
    memberImport() {
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
            R.Member.Update(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData();
            });
          }
        }
      });
    },
    detail(item) {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./detail'], resolve);
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
    remove(item) {
      R.Member.Delete({ id: item.id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData(true);
      });
    },
    showRemark(item) {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./remark'], resolve);
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
    }
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
      },
  }
};
</script>
