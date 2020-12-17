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
      <span class="h-panel-title">成绩列表</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="搜索">
                <input type="text" v-model="cond.student_sn" placeholder="姓名/学号" />
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
          <TableItem title="姓名" :width="140">
            <template slot-scope="{ data }">
              <copytext :copytext="data.nick_name" />
            </template>
          </TableItem>
          <TableItem title="学号" :width="120">
            <template slot-scope="{ data }">
              <copytext :copytext="data.student_sn" />
            </template>
          </TableItem>
          <TableItem title="年级" :width="100">
            <template slot-scope="{ data }">
              {{data.student_grade}}
            </template>
          </TableItem>
          <TableItem title="教育层次" align="center" :width="100">
            <template slot-scope="{ data }">
              <copytext  :copytext="data.major_level|level" />
            </template>
          </TableItem>
          <TableItem title="专业" :width="180">
            <template slot-scope="{ data }">
              <copytext :copytext="data.major_name" />
            </template>
          </TableItem>
          <TableItem title="课程" :width="180">
            <template slot-scope="{ data }">
              <copytext :copytext="data.class_name" />
            </template>
          </TableItem>
          <TableItem title="学期" :width="100">
            <template slot-scope="{ data }">
              第{{data.term}}学期
            </template>
          </TableItem>
          <TableItem title="平时成绩" :width="80">
            <template slot-scope="{ data }">
              <copytext  :copytext="data.score1" />
            </template>
          </TableItem>
          <TableItem title="期末成绩" :width="80">
            <template slot-scope="{ data }">
              <copytext  :copytext="data.score2" />
            </template>
          </TableItem>
          <TableItem title="学期总评" :width="80">
            <template slot-scope="{ data }">
              <copytext  :copytext="data.score3" />
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
        student_sn: '',
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
      if (reload) {
        this.pagination.page = 1;
      }
      this.loading = true;
      let data = this.pagination;
      Object.assign(data, this.cond);
      R.Grade.List(data).then(resp => {
        this.datas = resp.data.data;
        this.pagination.total = resp.data.total;
        this.loading = false;
        this.roles = resp.data.roles;
        this.tags = resp.data.tags;
      });
    },
    remove(item) {

    },
    edit(item) {

    },
    create() {

    },
  }
};
</script>
