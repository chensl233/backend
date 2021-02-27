<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">教学计划</span>
    </div>
    <div class="h-panel-body">
      <div class="mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="8">
              <FormItem label="院校">
                <Select
                v-model="cond.school_id"
                :datas="school_list"
                keyName="school_id"
                titleName="school_name"
                :filterable="true" 
                ></Select>
              </FormItem>
            </Cell>
            <Cell :width="8">
              <FormItem label="搜索">
                <input type="text" v-model="cond.mould_name" placeholder="计划标题" />
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
      <div class="mb-10">
        <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="course.store" text="添加计划" @click="create()"></p-button>
        <p-button glass="h-btn h-btn-primary h-btn-s" icon="h-icon-plus" permission="member.store" text="批量导入" @click="coureMouldImport()"></p-button>

      </div>
      <Table :loading="loading" :datas="datas" @sort="sortEvt">
        <TableItem prop="mould_id" title="计划ID"  :width="80"></TableItem>
        <TableItem prop="mould_name" :width="300" title="计划名称"></TableItem>
        <TableItem :width="200" title="适用院校">
            <template slot-scope="{ data }">
              {{data.school_name|nullToStr}}
            </template>
        </TableItem>
        <TableItem :width="100" title="适用层次">
            <template slot-scope="{ data }">
              {{data.major_level|intToType}}
            </template>
        </TableItem>
        <TableItem :width="180" title="适用专业">
            <template slot-scope="{ data }">
              {{data.major_name|nullToStr}}
            </template>
        </TableItem>
        <TableItem :width="80" title="课程数量">
            <template slot-scope="{ data }">
              {{data.course_mould_count}}
            </template>
        </TableItem>
        <TableItem prop="created_at" :width="150" title="创建时间"></TableItem>
        
        <TableItem title="操作" align="center" :width="350">
          <template slot-scope="{ data }">
            <p-del-button permission="course.destroy" @click="remove(datas, data)"></p-del-button>
            <p-button glass="h-btn h-btn-s h-btn-primary" permission="course.edit" text="编辑" @click="edit(data)"></p-button>
            <p-button glass="h-btn h-btn-s" permission="course.watchRecords" text="查看课程" @click="showMouldCourse(data)"></p-button>
          </template>
        </TableItem>
      </Table>
      <p></p>
      <Pagination v-if="pagination.total > 0" align="right" v-model="pagination" @change="changePage" />
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
        mould_name: '',
        cid: null,
        sort: 'created_at',
        order: 'desc',
        id: null
      },
      datas: [],
      school_list:{},
      loading: false,
    };
  },
  mounted() {
    this.getData(true);
    this.getSchool();
  },
  filters:{
      nullToStr : (value)=>{
        return value!=null?value:'通用';
      },
      intToType : (value)=>{
        switch (value) {
          case 1:
            return '大专';
        case 2:
            return '本科';
        case 3:
            return '研究生';
          default:
            return '大专';
        }
      }
  },
  methods: {
    changePage() {
      this.getData();
    },
    sortEvt(sort) {
      this.cond.sort = sort.prop;
      this.cond.order = sort.type;
      this.getData();
    },
    reset() {
      this.cond.mould_name = null;
      this.cond.cid = null;
      this.cond.id = null;
      this.getData(true);
    },
    getSchool() {
      R.School.List().then(res => {
        this.school_list = res.data.data;
        this.school_list.unshift({school_id:0,school_name:'全部'});
      });
    },
    getData(reload = false) {
      if (reload) {
        this.pagination.page = 1;
      }
      this.loading = true;
      let cond = Object.assign(this.cond, this.pagination);
      R.CourseMould.List(cond).then(resp => {
        this.datas = resp.data.data;
        this.pagination.total = resp.data.total;
        this.loading = false;
      });
    },
    showMouldCourse(item){
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: true,
        component: {
          vue: resolve => {
            require(['./mould_course'], resolve);
          },
          datas: {
            mould_info: item
          }
        }
      });
    },
    remove(data, item) {
      R.CourseMould.Delete({ mould_id: item.mould_id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData();
      });
    },
    create() {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./create'], resolve);
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            HeyUI.$Message.success('成功');
            this.getData(true);
          }
        }
      });
    },
    edit(item) {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./edit'], resolve);
          },
          datas: {
            mould_id: item.mould_id
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            HeyUI.$Message.success('成功');
            this.getData(true);
          }
        }
      });
    },
    coureMouldImport(){
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./import'], resolve);
          },
        },
        events: {
          success: (modal, data) => {
            modal.close();
            HeyUI.$Message.success('导入成功');
            this.getData(true);
          }
        }
      });
    }
    
  }
};
</script>
