const routes = [
  {
    path: 'home',
    name: 'Home',
    meta: {
      title: 'Scriptis',
      keepAlive: true, // 缓存导致页面有多个编辑器，广播事件会触发报错
      publicPage: true, // 权限公开
    },
    component: () => import('./view/home/index.vue'),
  },
  {
    path: 'project',
    name: 'Project',
    meta: {
      title: 'DataSphere Studio',
      publicPage: true,
    },
    component: () => import('./view/project/index.vue'),
  },
  {
    path: 'workflow',
    name: 'Workflow',
    meta: {
      title: 'My Workflow',
      publicPage: true,
      parent: 'Project',
    },
    component: () => import('./view/workflow/index.vue'),
  },

  {
    path: 'commonIframe',
    name: 'commonIframe',
    meta: {
      title: 'DSS Component',
      publicPage: true,
    },
    component: () => import('./view/commonIframe/index.vue'),
  },
  {
    path: 'console',
    name: 'Console',
    meta: {
      title: 'linkis console',
      publicPage: true,
    },
    component: () => import('./view/console/index.vue'),
    children: [{
      name: 'globalHistory',
      path: 'globalHistory',
      component: () => import('./module/globalHistory/index.vue'),
      meta: {
        title: 'Global History',
        publicPage: true,
      },
    }, {
      name: 'resource',
      path: 'resource',
      component: () => import('./module/resource/resource.vue'),
      meta: {
        title: 'resource',
        publicPage: true,
      },
    }, {
      name: 'setting',
      path: 'setting',
      component: () => import('./module/setting/setting.vue'),
      meta: {
        title: 'setting',
        publicPage: true,
      },
    }, {
      name: 'globalValiable',
      path: 'globalValiable',
      component: () => import('./module/globalValiable/index.vue'),
      meta: {
        title: 'Global Valiable',
        publicPage: true,
      },
    }, {
      name: 'FAQ',
      path: 'FAQ',
      component: () => import('./module/FAQ/index.vue'),
      meta: {
        title: 'FAQ',
        publicPage: true,
      },
    }],
  }
]
export default routes;