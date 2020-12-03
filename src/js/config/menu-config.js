const fullMenus = [{
  title: '首页',
  key: 'Home',
  icon: 'icon-monitor'
},
{
  title: '运营',
  key: 'operator',
  icon: 'icon-grid-2',
  children: [{
    title: '公告',
    key: 'Announcement'
  },
  {
    title: 'VIP会员',
    key: 'Role'
  },
  {
    title: '友情链接',
    key: 'Link'
  },
  {
    title: '幻灯片',
    key: 'Slider'
  },
  {
    title: '首页推荐',
    key: 'IndexBanner'
  },
  {
    title: '推广链接',
    key: 'AdFrom'
  },
  {
    title: '课程评论',
    key: 'CourseComment'
  },
  {
    title: '视频评论',
    key: 'VideoComment'
  },
  {
    title: '统计工具',
    key: 'Statistic'
  }
  ]
},
{
  title: '财务',
  key: 'finance',
  icon: 'icon-paper',
  children: [{
    title: '订单列表',
    key: 'Order'
  }, {
    title: '优惠码',
    key: 'PromoCode'
  }, {
    title: '邀请余额提现',
    key: 'InviteBalanceWithdrawOrders'
  }]
},
{
  title: '用户',
  key: 'members',
  icon: 'icon-head',
  children: [{
    title: '用户',
    key: 'Member'
  }]
},
{
  title: '视频',
  key: 'videomanage',
  icon: 'icon-video',
  children: [{
    title: '分类',
    key: 'CourseCategory'
  }, {
    title: '课程',
    key: 'Course'
  }, {
    title: '视频',
    key: 'Video'
  }]
},
{
  title: '系统',
  key: 'system',
  icon: 'icon-cog',
  children: [{
    title: '配置',
    key: 'Setting'
  }, {
    title: '管理员',
    key: 'Administrator'
  },
  {
    title: '首页导航',
    key: 'Nav'
  },
  {
    title: '插件',
    key: 'Addons'
  },
    // {
    //     title: '角色',
    //     key: 'AdministratorRole'
    // }, {
    //     title: '权限',
    //     key: 'AdministratorPermission'
    // },
  ]
}
];

const getMenus = function (menuIdList = []) {
  return getAuthMenu(fullMenus, menuIdList);
};

let getAuthMenu = (menus, menuIdList) => {
  let configMenu = [];
  for (let menu of menus) {
    let m = Utils.copy(menu);
    if (menuIdList.indexOf(m.key) > -1) {
      configMenu.push(m);
    }
    if (menu.children && menu.children.length) {
      m.children = getAuthMenu(menu.children, menuIdList);
    }
  }
  return configMenu;
};

const getKeys = function (menus) {
  let keys = [];
  for (let menu of menus) {
    keys.push(menu.key);
    if (menu.children && menu.children.length) {
      keys.push(...getKeys(menu.children));
    }
  }
  return keys;
};

let fullMenuKeys = getKeys(fullMenus);

const isAuthPage = function (name) {
  return true;
};

export { getMenus, fullMenus, fullMenuKeys, isAuthPage };
