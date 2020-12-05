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
      <span class="h-panel-title">院校专业</span>
    </div>
    <div class="h-panel-body">
      <Row class="base-info mb-10" v-if="school">
        <Cell width="6">
          院校代码：
          <copytext :copytext="school.school_code" />
        </Cell>
        <Cell width="6">
          院校名称：
          <copytext :copytext="school.school_name" />
        </Cell>
        <Cell width="24" class="mt-10 mb-10">
          <p-button glass="h-btn h-btn-s h-btn-primary" permission="member.credit1.change" text="添加专业" @click="schoolMajorAdd()"></p-button>
        </Cell>
      </Row>

      <Row class="mb-10">
        <Cell width="24">
          <Tabs :datas="tabs" v-model="selectTab" @change="tabChange"></Tabs>
        </Cell>
      </Row>

      <Row v-show="selectTab === 'collect'">
        <Cell width="24">
          <Table :datas="schoolCollect" class="mb-10">
            <TableItem title="课程">
              <template slot-scope="{ data }">
                <span v-if="schoolCollectMap[data.course_id]">{{ schoolCollectMap[data.course_id].title }}</span>
                <span class="red" v-else>已删除</span>
              </template>
            </TableItem>
            <TableItem prop="created_at" title="时间"></TableItem>
          </Table>
          <Pagination align="right" v-model="paginate.collect" @change="paginateChange('collect')" />
        </Cell>
      </Row>

      <Row v-show="selectTab === 'majors'">
        <Cell width="24">
          <Table :datas="schoolMajor" class="mb-10">

            <TableItem prop="major_name" title="专业名称" ></TableItem>
            <TableItem prop="major_code" title="专业代码"></TableItem>
            <TableItem title="教育层次">
                <template slot-scope="{ data }">
                {{data.major_level|level}}
                </template>
            </TableItem>
            <TableItem prop="created_at" title="记录时间"></TableItem>
            <TableItem title="操作" align="center" :width="240">
              <template slot-scope="{ data }">
                <p-del-button glass="h-btn h-btn-s" permission="member.tags" text="删除" @click="schoolMajorDel(data)"></p-del-button>
              </template>
            </TableItem>
          </Table>
          <Pagination align="right" v-model="paginate.majors" @change="paginateChange('majors')" />
        </Cell>
      </Row>


    </div>
  </div>
</template>
<script>
export default {
  props: ['school_id'],
  data() {
    return {
      school: {},
      tabs: {
        majors: '专业列表',
        collect: '收藏'
      },
      selectTab: 'majors',
      paginate: {
        majors: {
          page: 1,
          size: 10,
          total: 0
        },
        collect: {
          page: 1,
          size: 10,
          total: 0
        }
      },
      schoolMajor: [],
      schoolMajorMap: [],
      schoolCollect: [],
      schoolCollectMap: []
    };
  },
  mounted() {
    this.getschool();
    this.getschoolMajor();
  },
  methods: {
    getschool() {
      R.School.Detail({ school_id: this.school_id }).then(res => {
        this.school = res.data.data;
      });
    },
    tabChange(data) {
      let key = data.key;
      if (key === 'majors') {
        this.getschoolMajor(true);
      } else if (key === 'collect') {
        this.getschoolCollect(true);
      }
    },
    getschoolMajor(reset = false) {
      if (reset === true) {
        this.paginate.majors.page = 1;
      }
      let data = this.paginate.majors;
      data.school_id = this.school_id;
      R.School.SchoolMajor(data).then(res => {
          this.schoolMajor = res.data.data;
      });
    },
    getschoolCollect(reset = false) {

    },
    paginateChange(t) {
      if (t === 'majors') {
        this.getschoolMajor();
      } else if (t === 'collect') {
        this.getschoolCollect();
      }
    },
    schoolMajorAdd() {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./schoolMajorAdd'], resolve);
          },
          datas: {
            school_id: this.school_id
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            R.School.SchoolMajorAdd(data).then(() => {
              HeyUI.$Message.success('成功');
              this.getschoolMajor();
            });
          }
        }
      });
    },
    schoolMajorDel(item) {
      let data = {};
      data.school_id = this.school_id;
      data.major_id = item.major_id;
      R.School.SchoolMajorDel(data).then(res => {
          HeyUI.$Message.success('删除成功');
          this.getschoolMajor();
      });
    }
  },filters:{
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
  }
};
</script>
