<style lang="less"></style>
<template>
  <div class>
    <div class="h-panel w-1200">
      <div class="h-panel-bar">
        <span class="h-panel-title">编辑</span>
      </div>
      <div class="h-panel-body">
        <Form ref="form" mode="block" :validOnChange="true" :showErrorTip="true" :rules="rules" :model="video">
          <Row :space="10">
            <Cell :width="5">
              <FormItem label="所属课程" prop="course_id">
                <Select v-model="video.course_id" :datas="courses" keyName="id" titleName="title" :filterable="true" @change="selectCourse"></Select>
              </FormItem>
            </Cell>
            <Cell :width="4">
              <FormItem label="章节" prop="chapter_id">
                <Select v-model="video.chapter_id" :datas="chapters" keyName="id" titleName="title" :filterable="true"></Select>
              </FormItem>
            </Cell>
            <Cell :width="3">
              <FormItem label="显示" prop="is_show">
                <h-switch v-model="video.is_show" :trueValue="1" :falseValue="0"></h-switch>
              </FormItem>
            </Cell>
            <Cell :width="3">
              <FormItem label="禁止快进" prop="ban_drag">
                <template v-slot:label>禁止快进</template>
                <h-switch v-model="video.ban_drag" :trueValue="1" :falseValue="0"></h-switch>
              </FormItem>
            </Cell>
          </Row>

          <Row :space="10">
            <Cell :width="18">
              <FormItem label="视频名" prop="title">
                <input type="text" v-model="video.title" />
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem label="上架时间" prop="published_at">
                <DatePicker v-model="video.published_at" type="datetime"></DatePicker>
              </FormItem>
            </Cell>
          </Row>

          <FormItem label="Slug" prop="slug">
            <input type="text" v-model="video.slug" placeholder="不清楚可不填写" />
          </FormItem>

          <Row :space="10">
            <Cell :width="24">
              <FormItem label="简短介绍" prop="short_description">
                <template v-slot:label>简短介绍</template>
                <textarea v-model="video.short_description"></textarea>
              </FormItem>
            </Cell>
            <Cell :width="24">
              <FormItem label="详细介绍" prop="description">
                <template v-slot:label>详细介绍</template>
                <tinymce-editor v-model="video.original_desc"></tinymce-editor>
              </FormItem>
            </Cell>
          </Row>

          <FormItem label="上传视频">
            <template v-slot:label>上传视频</template>
            <Tabs :datas="tabs" v-model="tab"></Tabs>
          </FormItem>

          <FormItem label="阿里云视频ID" prop="aliyun_video_id" v-show="tab === '阿里云'">
            <template v-slot:label>阿里云视频ID</template>
            <aliyun-video v-model="video.aliyun_video_id"></aliyun-video>
          </FormItem>
          <FormItem label="腾讯云视频ID" prop="tencent_video_id" v-show="tab === '腾讯云'">
            <template v-slot:label>腾讯云视频ID</template>
            <tencent-video v-model="video.tencent_video_id"></tencent-video>
          </FormItem>
          <FormItem label="视频URL地址（以mp4,m3u8等格式结尾的链接）" prop="url" v-show="tab === '直链'">
            <template v-slot:label>视频URL地址（以mp4,m3u8等格式结尾的链接）</template>
            <input type="text" v-model="video.url" />
          </FormItem>

          <FormItem label="视频时长" prop="duration">
            <template v-slot:label>视频时长</template>
            <input-duration v-model="video.duration"></input-duration>
          </FormItem>

          <FormItem label="试看时长" prop="free_seconds">
            <template v-slot:label>试看时长</template>
            <input-duration v-model="video.free_seconds"></input-duration>
          </FormItem>

          <Row :space="10">
            <Cell :width="6">
              <FormItem label="Web播放器" prop="player_pc">
                <template v-slot:label>Web播放器</template>
                <Select v-model="video.player_pc" :datas="playerPc"></Select>
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem label="手机播放器" prop="player_h5">
                <template v-slot:label>手机播放器</template>
                <Select v-model="video.player_h5" :datas="playerH5"></Select>
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem label="评论开关" prop="comment_status">
                <template v-slot:label>评论开关</template>
                <Select v-model="video.comment_status" :datas="commentStatus"></Select>
              </FormItem>
            </Cell>
          </Row>

          <Row :space="10">
            <Cell :width="12">
              <FormItem label="SEO描述" prop="seo_description">
                <textarea v-model="video.seo_description" rows="2" placeholder="seo描述"></textarea>
              </FormItem>
            </Cell>
            <Cell :width="12">
              <FormItem label="SEO关键字" prop="seo_keywords">
                <textarea v-model="video.seo_keywords" rows="2" placeholder="seo关键字"></textarea>
              </FormItem>
            </Cell>
          </Row>

          <FormItem>
            <Button color="primary" @click="create">保存</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import TinymceEditor from '../common/tinymce';
import AliyunVideo from '../common/video/aliyun/aliyun';
import TencentVideo from '../common/video/tencent/tencent';

import Video from 'model/Video';

export default {
  props: ['id'],
  components: {
    TinymceEditor,
    AliyunVideo,
    TencentVideo
  },
  data() {
    return {
      video: Video.parse({}),
      courses: [],
      chapters: [],
      tabs: ['阿里云', '腾讯云', '直链'],
      tab: '阿里云',
      commentStatus: [
        {
          title: '禁止评论',
          key: 0
        },
        {
          title: '所有人',
          key: 1
        },
        {
          title: '仅订阅',
          key: 2
        }
      ],
      playerPc: [
        {
          title: '默认',
          key: 'xg'
        },
        {
          title: '腾讯云',
          key: 'tencent'
        },
        {
          title: '阿里云',
          key: 'aliyun'
        }
      ],
      playerH5: [
        {
          title: '默认',
          key: 'xg'
        },
        {
          title: '腾讯云',
          key: 'tencent'
        },
        {
          title: '阿里云',
          key: 'aliyun'
        }
      ],
      rules: {
        required: [
          'course_id',
          'title',
          'short_description',
          'published_at',
          'ban_drag',
          'player_pc',
          'duration',
          'player_h5',
          'free_seconds',
          'comment_status'
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    tabActive() {
      if (this.video.aliyun_video_id) {
        this.tab = '阿里云';
      }
      if (this.video.tencent_video_id) {
        this.tab = '腾讯云';
      }
      if (this.video.url) {
        this.tab = '直链';
      }
    },
    init() {
      this.video.is_show = 0;
      this.video.is_ban_sell = 0;
      this.video.ban_drag = 0;
      this.video.comment_status = 0;
      this.video.player_pc = 'xg';
      this.video.player_h5 = 'xg';

      R.Video.Edit({ id: this.id }).then(res => {
        this.video = res.data.video;
        this.tabActive();
        this.selectCourse({ id: this.video.course_id });
      });

      // 读取创建所需要的参数
      R.Video.Create().then(resp => {
        this.courses = resp.data.courses;
      });
    },
    back() {
      this.$router.push({ name: 'Video' });
    },
    create() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.video.render_desc = this.video.original_desc;
        this.$emit('success', this.video);
      }
    },
    selectCourse(course) {
      R.CourseChapter.List({ course_id: course.id }).then(resp => {
        this.chapters = resp.data.chapters;
      });
    }
  }
};
</script>
