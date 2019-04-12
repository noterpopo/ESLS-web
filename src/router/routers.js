import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: 'ESLS注册页面',
      hideInMenu: true
    },
    component: () => import('@/view/register/register.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/good',
    name: 'good',
    meta: {
      icon: 'md-basket',
      title: '商品'
    },
    component: Main,
    children: [
      {
        path: 'good-admin',
        name: 'good-admin',
        meta: {
          icon: 'ios-albums',
          title: '商品管理'
        },
        component: () => import('@/view/good/good-admin.vue')
      }
    ]
  },
  {
    path: '/bj',
    name: 'bj',
    meta: {
      icon: 'ios-albums',
      title: '变价'
    },
    component: Main,
    children: [
      {
        path: 'good-watch',
        name: 'good-watch',
        meta: {
          icon: 'ios-albums',
          title: '变价监控'
        },
        component: () => import('@/view/good/good-watch.vue')
      }
    ]
  },
  {
    path: '/tag',
    name: 'tag',
    meta: {
      icon: 'ios-albums',
      title: '价签'
    },
    component: Main,
    children: [
      {
        path: 'tag_admin',
        name: 'tag_admin',
        meta: {
          icon: 'ios-albums',
          title: '价签管理'
        },
        component: () => import('@/view/tag/tag-admin.vue')
      }
    ]
  },
  {
    path: '/style',
    name: 'style',
    meta: {
      icon: 'ios-albums',
      title: '样式管理'
    },
    component: Main,
    children: [
      {
        path: 'style_admin',
        name: 'style_admin',
        meta: {
          icon: 'ios-albums',
          title: '样式管理'
        },
        component: () => import('@/view/label/label-admin.vue')
      }
    ]
  },
  {
    path: '/shop',
    name: 'shop',
    meta: {
      icon: 'ios-albums',
      title: '店铺'
    },
    component: Main,
    children: [
      {
        path: 'shop_admin',
        name: 'shop_admin',
        meta: {
          icon: 'ios-albums',
          title: '店铺管理'
        },
        component: () => import('@/view/shop/shop-admin.vue')
      }
    ]
  },
  {
    path: '/route',
    name: 'route',
    meta: {
      icon: 'ios-albums',
      title: '路由器'
    },
    component: Main,
    children: [
      {
        path: 'route_admin',
        name: 'route_admin',
        meta: {
          icon: 'ios-albums',
          title: '路由器管理'
        },
        component: () => import('@/view/route/route-admin.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'ios-albums',
      title: '用户'
    },
    component: Main,
    children: [
      {
        path: 'user_admin',
        name: 'user_admin',
        meta: {
          icon: 'ios-albums',
          title: '用户管理'
        },
        component: () => import('@/view/user/user-admin.vue')
      }
    ]
  },
  {
    path: '/cycylejob',
    name: 'cycylejob',
    meta: {
      icon: 'ios-albums',
      title: '定期任务'
    },
    component: Main,
    children: [
      {
        path: 'cycylejob_admin',
        name: 'cycylejob_admin',
        meta: {
          icon: 'ios-albums',
          title: '定期任务管理'
        },
        component: () => import('@/view/cycyleJob/cycyleJob-admin.vue')
      }
    ]
  },
  {
    path: '/backup',
    name: 'backup',
    meta: {
      icon: 'ios-albums',
      title: '数据备份与导入'
    },
    component: Main,
    children: [
      {
        path: 'backup_admin',
        name: 'backup_admin',
        meta: {
          icon: 'ios-albums',
          title: '数据备份与导入'
        },
        component: () => import('@/view/backup/backup.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
