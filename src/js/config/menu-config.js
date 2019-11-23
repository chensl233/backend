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
            }
        ]
    },
    {
        title: '财务',
        key: 'finance',
        icon: 'icon-paper',
        children: [{
            title: '订单列表',
            key: 'order'
        }]
    },
    {
        title: '会员',
        key: 'members',
        icon: 'icon-head',
        children: [{
            title: '会员',
            key: 'member'
        }]
    },
    {
        title: '视频',
        key: 'videomanage',
        icon: 'icon-video',
        children: [{
            title: '课程',
            key: 'course'
        }, {
            title: '视频',
            key: 'video'
        }]
    },
    {
        title: '系统',
        key: 'system',
        icon: 'icon-cog',
        children: [{
            title: '配置',
            key: 'setting'
        }, {
            title: '管理员',
            key: 'administrator'
        }, {
            title: '角色',
            key: 'administrator_roles'
        }, {
            title: '权限',
            key: 'administrator_permission'
        }, {
            title: '首页导航',
            key: 'nav'
        }]
    }
];

const getMenus = function(menuIdList = []) {
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

const getKeys = function(menus) {
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

const isAuthPage = function(name) {
    let menus = G.get('SYS_MENUS') || [];
    if (fullMenuKeys.indexOf(name) > -1 && menus.indexOf(name) == -1) {
        return false;
    }
    return true;
};

export { getMenus, fullMenus, fullMenuKeys, isAuthPage };