import Vue from 'vue';
import VueRouter from 'vue-router';
import { isAuthPage } from 'js/config/menu-config';
import { resolve } from 'core-js/fn/promise';

Vue.use(VueRouter);

const initRouter = () => {
  const routerParam = {
    routes: [{
      path: '/login',
      name: 'Login',
      component: (resolve) => require(['components/login/index'], resolve)
    }, {
      path: '/',
      component: (resolve) => require(['components/app/app-frame'], resolve),
      children: [{
        path: '',
        name: 'Home',
        component: (resolve) => require(['components/home/index'], resolve),
        meta: { title: '首页', icon: 'icon-monitor' }
      },
      {
        path: '/announcement',
        name: 'Announcement',
        component: (resolve) => require(['components/announcement/index'], resolve),
        meta: { title: '公告' }
      },
      {
        path: '/statistic',
        name: 'Statistic',
        component: (resolve) => require(['components/statistic/index'], resolve),
        meta: { title: '统计工具' }
      },
      {
        path: '/role',
        name: 'Role',
        component: (resolve) => require(['components/role/index'], resolve),
        meta: { title: 'VIP' }
      }, {
        path: '/slider',
        name: 'Slider',
        component: (resolve) => require(['components/slider/index'], resolve),
        meta: { title: '幻灯片' }
      }, {
        path: '/indexBanner',
        name: 'IndexBanner',
        component: (resolve) => require(['components/index_banner/index'], resolve),
        meta: { title: '首页推荐' }
      },
      {
        path: '/link',
        name: 'Link',
        component: (resolve) => require(['components/link/index'], resolve),
        meta: { title: '友情链接' }
      },
      {
        path: '/ad_from',
        name: 'AdFrom',
        component: (resolve) => require(['components/ad_from/index'], resolve),
        meta: { title: '推广链接' }
      },
      {
        path: '/course_comment',
        name: 'CourseComment',
        component: (resolve) => require(['components/course_comment/index'], resolve),
        meta: { title: '课程评论' }
      },
      {
        path: '/video_comment',
        name: 'VideoComment',
        component: (resolve) => require(['components/video_comment/index'], resolve),
        meta: { title: '视频评论' }
      },
      {
        path: '/order',
        name: 'Order',
        component: (resolve) => require(['components/order/index'], resolve),
        meta: { title: '订单列表' }
      },
      {
        path: '/member',
        name: 'Member',
        component: (resolve) => require(['components/member/index'], resolve),
        meta: { title: '学籍管理' }
      },
      {
        path: '/member/InviteBalanceWithdrawOrders',
        name: 'InviteBalanceWithdrawOrders',
        component: (resolve) => require(['components/member/inviteBalanceWithdrawOrders'], resolve),
        meta: { title: '邀请余额提现' }
      },
      {
        path: '/course',
        name: 'Course',
        component: (resolve) => require(['components/course/index'], resolve),
        meta: { title: '课程' }
      },
      {
        path: '/video',
        name: 'Video',
        component: (resolve) => require(['components/video/index'], resolve),
        meta: { title: '视频' }
      },
      {
        path: '/setting',
        name: 'Setting',
        component: (resolve) => require(['components/setting/index'], resolve),
        meta: { title: '系统配置' }
      },
      {
        path: '/administrator/password',
        name: 'AdministratorPassword',
        component: (resolve) => require(['components/administrator/password'], resolve),
        meta: { title: '修改密码' }
      },
      {
        path: '/administrator_permission',
        name: 'AdministratorPermission',
        component: (resolve) => require(['components/administrator_permission/index'], resolve),
        meta: { title: '权限' }
      },
      {
        path: '/administrator',
        name: 'Administrator',
        component: (resolve) => require(['components/administrator/index'], resolve),
        meta: { title: '管理员' }
      },
      {
        path: '/nav',
        name: 'Nav',
        component: (resolve) => require(['components/nav/index'], resolve),
        meta: { title: '首页导航' }
      },
      {
        path: '/promoCode',
        name: 'PromoCode',
        component: (resolve) => require(['components/promoCode/index'], resolve),
        meta: { title: '优惠码' }
      },
      {
        path: '/administrator_role',
        name: 'AdministratorRole',
        component: (resolve) => require(['components/administrator_role/index'], resolve),
        meta: { title: '角色' }
      },
      {
        path: '/addons',
        name: 'Addons',
        component: (resolve) => require(['components/addons/index'], resolve),
        meta: { title: '插件' },
        props: true
      },
      {
        path: '/courseCategory',
        name: 'CourseCategory',
        component: (resolve) => require(['components/courseCategory/index'], resolve),
        meta: { title: '课程分类' }
      }, {
        path: '/learningPaths',
        name: 'LearningPaths',
        component: (resolve) => require(['components/extentions/learningPaths/path/index'], resolve),
        meta: { title: '学历路径' }
      }, {
        path: '/LearningPathsSteps',
        name: 'LearningPathsSteps',
        component: (resolve) => require(['components/extentions/learningPaths/step/index'], resolve),
        meta: { title: '学历路径-步骤' }
      }, {
        path: '/MeeduBooks',
        name: 'MeeduBooks',
        component: (resolve) => require(['components/extentions/meeduBooks/book/index'], resolve),
        meta: { title: '电子书' }
      }, {
        path: '/MeeduTopics',
        name: 'MeeduTopics',
        component: (resolve) => require(['components/extentions/meeduTopics/topic/index'], resolve),
        meta: { title: '话题' }
      }, {
        path: '/MiaoSha',
        name: 'MiaoSha',
        component: (resolve) => require(['components/extentions/miaosha/goods/index'], resolve),
        meta: { title: '秒杀商品' }
      }, {
        path: '/MiaoShaOrders',
        name: 'MiaoShaOrders',
        component: (resolve) => require(['components/extentions/miaosha/orders/index'], resolve),
        meta: { title: '秒杀订单' }
      }, {
        path: '/Paper',
        name: 'Paper',
        component: (resolve) => require(['components/extentions/paper/paper/index'], resolve),
        meta: { title: '试卷' }
      }, {
        path: '/PaperQuestion',
        name: 'PaperQuestion',
        component: (resolve) => require(['components/extentions/paper/question/index'], resolve),
        meta: { title: '试题' }
      }, {
        path: '/PaperPractice',
        name: 'PaperPractice',
        component: (resolve) => require(['components/extentions/paper/practice/index'], resolve),
        meta: { title: '试题' }
      }, {
        path: '/SinglePage',
        name: 'SinglePage',
        component: (resolve) => require(['components/extentions/singlePage/page/index'], resolve),
        meta: { title: '单页' }
      }, {
        path: '/TemplateOneTag',
        name: 'TemplateOneTag',
        component: (resolve) => require(['components/extentions/templateOne/tag/index'], resolve),
        meta: { title: '立春模板标签' }
      }, {
        path: '/TemplateOneNav',
        name: 'TemplateOneNav',
        component: (resolve) => require(['components/extentions/templateOne/nav/index'], resolve),
        meta: { title: '立春模板导航栏' }
      }, {
        path: '/TuanGouGoods',
        name: 'TuanGouGoods',
        component: (resolve) => require(['components/extentions/tuangou/goods/index'], resolve),
        meta: { title: '团购商品' }
      }, {
        path: '/WendaQuestion',
        name: 'WendaQuestion',
        component: (resolve) => require(['components/extentions/wenda/question/index'], resolve),
        meta: { title: '全部问题' }
      }, {
        path: '/ZhiboCourse',
        name: 'ZhiboCourse',
        component: (resolve) => require(['components/extentions/zhibo/course/index'], resolve),
        meta: {
          title: '直播课程'
        }
      }, {
        path: '/ZhiboOpen',
        name: 'ZhiboOpen',
        component: (resolve) => require(['components/extentions/zhibo/zhibo/index'], resolve),
        meta: { title: '开播' }
      }, {
        path: '/K12/XiaoBanKe',
        name: 'XiaoBanKe',
        component: (resolve) => require(['components/extentions/xiaoBanKe/course/index'], resolve),
        meta: { title: '大小班' }
      }, {
        path: '/MultiLevelSharePoster',
        name: 'MultiLevelSharePoster',
        component: (resolve) => require(['components/extentions/multiLevelShare/poster/index'], resolve),
        meta: { title: '海报 - 三级分销' }
      }, {
        path: '/MultiLevelShareGoods',
        name: 'MultiLevelShareGoods',
        component: (resolve) => require(['components/extentions/multiLevelShare/goods/index'], resolve),
        meta: { title: '分销商品 - 三级分销' }
      }, {
        path: '/Snapshot/images',
        name: 'SnapshotImages',
        component: (resolve) => require(['components/extentions/snapshot/index'], resolve),
        meta: { title: '照片 - 随机拍照' }
      }, {
        path: '/mpWechatMessageReply',
        name: 'mpWechatMessageReply',
        component: (resolve) => require(['components/mp_wechat_message_reply/index'], resolve),
        meta: { title: '微信公众号消息回复' }
      }, {
        path: '/mpWechatMenu',
        name: 'mpWechatMenu',
        component: (resolve) => require(['components/mp_wechat/menu'], resolve),
        meta: { title: '微信公众号菜单' }
      }, {
        path: '/CodeExchangerGoods',
        name: 'CodeExchangerGoods',
        component: (resolve) => require(['components/extentions/codeExchanger/goods/index'], resolve),
        meta: { title: '兑换商品' }
      }, {
        path: '/system-error',
        name: 'SystemError',
        component: (resolve) => require(['components/error-pages/500'], resolve),
        meta: { title: '系统错误' }
      }, {
        path: '/permission-error',
        name: 'PermissionError',
        component: (resolve) => require(['components/error-pages/403'], resolve),
        meta: { title: '权限错误' }
      }, {
        path: '/School',
        name: 'School',
        component: (resolve) => require(['components/school/index'], resolve),
        meta: { title: '合作院校' }
      }, {
        path: '/Major',
        name: 'Major',
        component: (resolve) => require(['components/major/index'], resolve),
        meta: { title: '专业列表' }
      }, {
        path: '/CoursesTemplate',
        name: 'CoursesTemplate',
        component: (resolve) => require(['components/course_template/index'], resolve),
        meta: { title: '课程模板' }
      }, {
        path: '/GradeInfo',
        name: 'GradeInfo',
        component: (resolve) => require(['components/grade/index'], resolve),
        meta: { title: '成绩汇总' }
      }, {
        path: '/teachProgress',
        name: 'teachProgress',
        component: (resolve) => require(['components/teach_progress/index'], resolve),
        meta: { title: '学生进度管理' }
      }, {
        path: '/studentGrade',
        name: 'studentGrade',
        component: (resolve) => require(['components/student_grade/index'],resolve),
        meta: { title: '班级管理'}
      }, {
        path: '/loginDetail',
        name: 'loginDetail',
        component: (resolve) => require(['components/login_detail/index'],resolve),
        meta: { title: '登录日志'}
      }, {
        path: '/test',
        name: 'test',
        component: (resolve) => require(['components/test/index'],resolve),
        meta: { title: '考试管理'}
      }, {
        path: '/coursePlan',
        name: 'coursePlan',
        component: (resolve) => require(['components/course_plan/index'],resolve),
        meta: { title: '教学进度管理'}
      }, {
        path: '/examLibrary',
        name: 'examLibrary',
        component: (resolve) => require(['components/exam_library/index'],resolve),
        meta: { title: '题库管理'}
      }, {
        path: '/examPaper',
        name: 'examPaper',
        component: (resolve) => require(['components/exam_paper/index'],resolve),
        meta: { title: '试题管理'}
      },{
        path: '*',
        name: 'CommonNotfoundError',
        component: (resolve) => require(['components/error-pages/404'], resolve),
        meta: { title: '页面找不到' }
      }
      ]
    }]
  };

  let router = new VueRouter(routerParam);
  let isFirstRouter = true;

  router.beforeEach((to, from, next) => {
    if ( 0 === to.matched.length || to.name === 'root') {
      //404跳转
      next({ name: 'CommonNotfoundError' });
      return;
    }
    if (to.name !== 'Login' && !Utils.getLocal('token')) {
      next({ name: 'Login' });
      return;
    }
    if (!isFirstRouter && !isAuthPage(to.name)) {
      next({ name: 'PermissionError' });
      return;
    }
    HeyUI.$LoadingBar.start();
    if (to.meta && to.meta.title) {
      document.title = to.meta.title;
    }
    isFirstRouter = false;
    next();
  });
  router.afterEach(() => {
    HeyUI.$LoadingBar.success();
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    let layoutContent = document.querySelector('.h-layout-content');
    if (layoutContent) {
      layoutContent.scrollTop = 0;
    }
  });
  router.onError((error) => { //监听错误信息
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if (isChunkLoadFailed) {
      window.location.reload();
      // router.replace(router.history.pending.fullPath);
    }else{
      console.log(error)
    }
  });
  
  return router;
};

export default initRouter;
