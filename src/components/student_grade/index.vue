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
      <span class="h-panel-title">班级管理</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="院校">
                <Select
                v-model="cond.school_id"
                :datas="school_list"
                keyName="school_id"
                titleName="school_name"
                :filterable="true" 
                @change="getSchoolMajor()"
                ></Select>
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem label="专业">
                <Select
                v-model="cond.major_id"
                :datas="major_list"
                keyName="major_id"
                titleName="major_name"
                :filterable="true" 
                ></Select>
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem label="年级">
                <input type="text" v-model="cond.major" />
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
        <!-- <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="school.store" text="添加" @click="create()"></p-button> -->
      </div>
      <div class="float-box mb-10">
        <Table :datas="datas" @sort="sortEvt">
          <TableItem prop="grade_id" title="序号" :sort="true" :width="80"></TableItem>

          <TableItem title="所属院校" :width="180">
            <template slot-scope="{ data }">
              {{data.school.school_name}}
            </template>
          </TableItem>
          <TableItem title="层次" :width="80">
            <template slot-scope="{ data }">
              {{data.major.major_level|level}}
            </template>
          </TableItem>
          <TableItem title="专业" :width="200">
            <template slot-scope="{ data }">
              {{data.major.major_name}}
            </template>
          </TableItem>
          <TableItem prop="grade_name" title="年级" :sort="true" :width="100"></TableItem>
          <TableItem prop="user_count" title="在校人数" :sort="true" :width="150"></TableItem>
          <TableItem title="课程方案" :width="180">
            <template slot-scope="{ data }">
                <span v-if="data.school_mould">{{data.school_mould.mould_name}}</span>
                <span class="red" v-else>未分配</span>
            </template>
          </TableItem>
          <TableItem title="学期" :width="100">
            <template slot-scope="{ data }">
              第{{data.term}}学期
            </template>
          </TableItem>
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
        grade: '',
        school_id: null,
        sort: 'grade_id',
        order: 'desc',
        major_id:null
      },
      datas: [],
      loading: false,
      school_list:{},
      major_list:{},
    };
  },
  mounted() {
    this.getData(true);
    this.getSchool();
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
      this.cond.student_sn = '';
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
      if (reload) this.pagination.page = 1;
      this.loading = true;
      let data = this.pagination;
      Object.assign(data, this.cond);
      R.studentGrade.List(data).then(resp => {
        this.datas = resp.data.data;
        this.pagination.total = resp.data.total;
      });
    },
    remove(item) {

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
            grade_id: item.grade_id
          }
        },
        events: {
          success: (modal, data) => {
            R.studentGrade.Update(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData();
            });
          }
        }
      });
    },
    create() {

    },
    getSchool() {
      R.School.List().then(res => {
        this.school_list = res.data.data;
        this.school_list.unshift({school_id:0,school_name:'通用'});
      });
    },
    getSchoolMajor() {
      if(!this.cond.school_id) return;
      R.School.SchoolMajor({school_id:this.cond.school_id}).then((res)=>{
        this.major_list = res.data.data;
      });
    }
  }
};
</script>
