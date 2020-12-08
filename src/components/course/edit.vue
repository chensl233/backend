<style lang="less"></style>
<template>
  <div class="table-basic-vue frame-page h-panel h-panel-margin-0 w-1000">
    <div class="h-panel-bar">
      <span class="h-panel-title">编辑</span>
    </div>
    <div class="h-panel-body">
      <Form ref="form" mode="block" :validOnChange="true" :showErrorTip="true" :labelWidth="110" :rules="rules" :model="course">
        <Row :space="10">
          <Cell :width="16">
            <FormItem label="课程名" prop="title">
              <input type="text" v-model="course.title" />
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="分类" prop="category_id">
              <Select v-model="course.category_id" :datas="courseCategories" keyName="id" titleName="name"></Select>
            </FormItem>
          </Cell>
        </Row>
        <Row :space="10">
          <Cell :width="8">
            <FormItem label="课程代码" prop="course_code">
              <input type="text" v-model="course.course_code" />
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="课程学时" prop="course_hour">
              <input type="number" step="1" min="0" v-model="course.course_hour" />
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="学分" prop="title">
              <input type="number" step="0.5" min="0" v-model="course.study_score" />
            </FormItem>
          </Cell>
        </Row>

        <Row :space="10">
          <Cell :width="8">
            <FormItem label="评论开关" prop="comment_status">
              <Select v-model="course.comment_status" :datas="commentStatus"></Select>
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="课程类型" prop="course_type">
              <Select v-model="course.course_type" :datas="courseType"></Select>
            </FormItem>
          </Cell>
          <Cell :width="4">
            <FormItem label="是否网络课" prop="is_network">
              <h-switch v-model="course.is_network" :trueValue="1" :falseValue="0"></h-switch>
            </FormItem>
          </Cell>
          <Cell :width="4">
            <FormItem label="是否毕业课" prop="is_graduate">
              <h-switch v-model="course.is_graduate" :trueValue="1" :falseValue="0"></h-switch>
            </FormItem>
          </Cell>
        </Row>

        <FormItem label="Slug" prop="slug">
          <input type="text" v-model="course.slug" placeholder="不清楚可不填写" />
        </FormItem>
        <FormItem label="Slug" prop="slug">
          <input type="text" v-model="course.slug" placeholder="不清楚可不填写" />
        </FormItem>

        <FormItem label="课程封面" prop="thumb">
          <image-upload v-model="course.thumb" name="课程封面"></image-upload>
        </FormItem>

        <FormItem label="简短介绍" prop="short_description">
          <textarea v-model="course.short_description" rows="2"></textarea>
        </FormItem>

        <FormItem label="详细介绍" prop="original_desc">
          <tinymce-editor v-model="course.original_desc"></tinymce-editor>
        </FormItem>

        <FormItem label="SEO描述" prop="seo_description">
          <textarea v-model="course.seo_description" rows="2"></textarea>
        </FormItem>
        <FormItem label="SEO关键字" prop="seo_keywords">
          <textarea v-model="course.seo_keywords" rows="1"></textarea>
        </FormItem>

        <FormItem>
          <Button color="primary" @click="create">保存</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import TinymceEditor from '../common/tinymce';

import Course from 'model/Course';

export default {
  props: ['id'],
  components: { TinymceEditor },
  data() {
    return {
      course: Course.parse({}),
      rules: {
        required: [
          'category_id',
          'thumb',
          'title',
          'charge',
          'short_description',
          'published_at',
          'is_show',
          'is_rec',
          'comment_status',
          'original_desc',
          'course_code',
          'course_type'
        ]
      },
      courseCategories: [],
      commentStatus: [
        {
          title: '关闭评论',
          key: 0
        },
        {
          title: '所有人均可评论',
          key: 1
        },
        {
          title: '订阅后可评论',
          key: 2
        }
      ],
      courseType: [
        {
          title: '必修',
          key: 1
        },
        {
          title: '选修',
          key: 2
        }
      ]
    };
  },
  mounted() {
    this.init();
    this.getCourseCategories();
  },
  methods: {
    getCourseCategories() {
      R.Course.CreateParams().then(resp => {
        this.courseCategories = resp.data.categories;
      });
    },
    init() {
      R.Course.Edit({ id: this.id }).then(resp => {
        this.course = resp.data;
      });
    },
    create() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.course.render_desc = this.course.original_desc;
        R.Course.Update(this.course).then(resp => {
          HeyUI.$Message.success('成功');
          this.$emit('success');
        });
      }
    }
  }
};
</script>
