<style lang="css" scoped>
.editor {
  width: 100%;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  height: 500px;
}
</style>
<template>
  <div class="editor">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text"></div>
  </div>
</template>
<script>
import E from 'wangeditor';
export default {
  name: 'Editorbar',
  data() {
    return {
      editor: null,
      info_: null
    };
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.seteditor();
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);

      this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
      this.editor.customConfig.uploadImgServer = '/backend/api/v1/upload/image/tinymce'; // 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = {
        Authorization: 'Bearer ' + Utils.getLocal('token')
      }; // 自定义 header
      this.editor.customConfig.uploadFileName = 'file'; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 1; // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 60 * 1000; // 设置超时时间

      // 配置菜单
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ];

      this.editor.customConfig.uploadImgHooks = {
        customInsert: (insertImg, result, editor) => {
          var url = result.location;
          insertImg(url);
        }
      };
      this.editor.customConfig.onchange = html => {
        this.info_ = html;
        this.$emit('change', this.info_);
      };
      this.editor.create();

      this.editor.txt.html(this.value);
    }
  },
   watch:{
      isClear(val){
        // 触发清除文本域内容
        if(val){
          this.editor.txt.clear();
          this.info = '';
        }
      },
      value(val){
        // 使用v-model时，设置初始值
        this.editor.txt.html(val);
      }
    }
};
</script>
