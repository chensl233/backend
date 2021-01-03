<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">考试管理</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="搜索">
                <input type="text" v-model="cond.title" placeholder="考试名称" />
              </FormItem>
            </Cell>

            <Cell :width="6">
              <FormItem>
                <Button color="primary" @click="getData(true)">搜索</Button>
                <!-- <Button @click="reset">重置</Button> -->
              </FormItem>
            </Cell>
          </Row>
        </Form>
      </div>
      <div class="float-box mb-10">
        <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="school.store" text="添加" @click="create()"></p-button>
      </div>
      <div class="float-box mb-10">
         <Table :datas="test_list" >
            <TableItem align="center" title="考试名称" :width='200' prop="title"></TableItem>
            <TableItem align="center" title="考试方式" :width='120'>
                <template slot-scope="{ data }">
                  {{data.type|testType}}
                </template>
            </TableItem>
            <TableItem align="center" :width='180' title="适用院校" >
                <template slot-scope="{ data }">
                  <span v-if="data.school_id!=0">{{data.school.school_name}}</span>
                  <span v-else>通用</span>
                </template>
            </TableItem>
            <TableItem align="center" :width='180' title="适用学期" >
                <template slot-scope="{ data }">
                  {{data.term}}
                </template>
            </TableItem>
            <TableItem align="center" title="考试人数" :width='120' prop="user_test_count"></TableItem>
            <TableItem align="center" title="开始时间" :width='150' prop="start_time"></TableItem>
            <TableItem align="center" title="结束时间" :width='150' prop="end_time"></TableItem>
            <TableItem align="center" title="创建人" :width='150' prop="admin_id"></TableItem>
            <TableItem align="center" title="创建时间" :width='150' prop="created_at"></TableItem>
            <TableItem align="center" title="状态" :width='90'>
                <template slot-scope="{ data }">
                    {{data.status|testStatus}}
                </template>
            </TableItem>
            <div slot="empty">暂时无数据</div>
            <TableItem title="操作" align="center" :width="240">
                <template slot-scope="{ data }">
                    <p-button glass="h-btn h-btn-s h-btn-primary" permission="course.edit" text="编辑" @click="edit(data)"></p-button>
                    <p-button glass="h-btn h-btn-s" permission="course.edit" text="考试设置" @click="detail(data)"></p-button>
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
        test_list:[],
        pagination:{},
        cond:{},
    };
  },
  mounted() {
      this.getData();
  },
  methods: {
    getData(){
        let data = this.pagination;
        data.title = this.cond.title;
        R.Test.List(data).then((res)=>{
            this.test_list = res.data.data;
            this.pagination.total = res.data.total;
        });
    },
    changePage() {
      this.getData();
    },
    create(){
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
            this.getData();
          }
        }
      });
    },
    edit(item){
        this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./edit'], resolve);
          },
          datas: {
            test_id: item.test_id,
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
    detail(item){
        this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./detail'], resolve);
          },
          datas: {
            test_id: item.test_id,
            test_info: item
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
      testType : (value)=>{
        switch(value){
          case 1:
            return '线上';
            break;
          case 2:
            return '线下';
            break;
        }
      },
      testStatus: function (value) {
      switch(value){
          case 1:
            return '发布中';
            break;
          case 2:
            return '待考';
            break;
          case 3:
            return '进行中';
            break;
          case 4:
            return '已结束';
            break;
        }
      return time;
      }
  }
};
</script>
