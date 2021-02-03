<style lang="less" scoped>
.base-info {
  width: 100%;
  height: auto;
  float: left;
  line-height: 36px;
}
</style>
<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title">考试设置</span>
    </div>
    <div class="h-panel-body">
      <Row class="base-info mb-10" v-if="test_info">
        <Cell width="6">
          ID：
          <copytext :copytext="test_info.test_id" />
        </Cell>
        <Cell width="6">
          考试名称:
          <copytext :copytext="test_info.title" />
        </Cell>
        <Cell width="24" class="mt-10 mb-10">
          <p-button glass="h-btn h-btn-s h-btn-primary" permission="member.credit1.change" text="添加考生" @click="addTestUser()"></p-button>
        </Cell>
      </Row>

      <Row class="mb-10">
        <Cell width="24">
          <Tabs :datas="tabs" v-model="selectTab" @change="tabChange"></Tabs>
        </Cell>
      </Row>

      <Row v-show="selectTab === 'test_user'">
        <Cell width="24">
          <Table :datas="test_user" class="mb-10">
            <TableItem :width="200" title="学员姓名">
              <template slot-scope="{ data }">
                <span v-if="data.user">{{ data.user.nick_name }}</span>
                <span class="red" v-else>已删除</span>
              </template>
            </TableItem>
            <TableItem :width="100" prop="course_id" title="所属院校"></TableItem>
            <TableItem :width="150" prop="course_code" title="所属班级"></TableItem>
            <TableItem :width='80' title="完成状态">
                <template slot-scope="{data}">
                  <span class="greed" v-if="data.finish_course==1">已完成</span>
                  <span class="red" v-else>未完成</span>
                </template>
            </TableItem>
            <TableItem title="操作" align="center" :width="240">
                <template slot-scope="{ data }">
                    <p-del-button glass="h-btn h-btn-s" permission="course.edit" text="删除" @click="delTestUser(data.utest_id)"></p-del-button>
                </template>
          </TableItem>

          </Table>
          <Pagination align="right" v-model="paginate.test_user" @change="paginateChange('test_user')" />
        </Cell>
      </Row>
     
    </div>
  </div>
</template>
<script>
export default {
  props: ['test_id','test_info'],
  data() {
    return {
      tabs: {
        test_user: '考试统计',
        video_history: '推送记录',
        attach_history: '试题分析',
      },
      selectTab: 'test_user',
      paginate: {
        test_user: {
          page: 1,
          size: 10,
          total: 0
        },
        video_history: {
          page: 1,
          size: 10,
          total: 0
        },
        attach_history: {
          page: 1,
          size: 10,
          total: 0
        }
      },
      user_video_History: [],
      user_video_HistoryMap: [],
      user_attach_History: [],
      user_attach_HistoryMap: [],
      test_user: [],
      test_userMap: [],
    };
  },
  mounted() {
    this.get_test_user();
  },
  methods: {
    addTestUser(){
       this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./testUserAdd'], resolve);
          },
          datas: {
            test_id: this.test_id
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            HeyUI.$Message.success('成功');
            this.get_test_user();
            
          }
        }
      });
    },
    delTestUser(id) {
        R.TestUser.Delete({utest_id:id}).then(res => {
            this.get_test_user();
        });
    },
    tabChange(data) {
        let key = data.key;
      if (key === 'video_history') {
        this.get_video_History(true);
      } else if (key === 'attach_history') {
        this.get_attach_History(true);
      } else if (key === 'test_user') {
        this.get_test_user(true);
      }
    },
    get_test_user(reset = false) {
      if (reset === true) {
        this.paginate.test_user.page = 1;
      }
      let data = this.paginate;
      data.test_id = this.test_id;
      R.TestUser.List(data).then(res => {
        this.test_user = res.data.data;
        this.paginate.test_user.total = res.data.total;
      });
    },
 
    paginateChange(t) {
      this.get_video_History();
    }
  },
  filters: {

  }
};
</script>
