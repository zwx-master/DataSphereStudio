export default [
  {
    path: '',
    name: 'layout',
    redirect: '/newhome',
    component: () =>
    import('./view/layout.vue'),
    meta: {
      title: 'DataSphere Studio',
      publicPage: true, // 权限公开
    },
    children: []
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login',
      publicPage: true,
    },
    component: () => import('./view/login/index.vue'),
  },
  // 公用页面，不受权限控制
  {
    path: '/500',
    name: 'serverErrorPage',
    meta: {
      title: '服务器错误',
      publicPage: true,
    },
    component: () => import('./view/500.vue'),
  },
  {
    path: '/404',
    name: 'pageNotFound',
    meta: {
      title: '404',
      publicPage: true,
    },
    component: () => import('./view/404.vue'),
  },
  {
    path: '/403',
    name: 'pageForbidden',
    meta: {
      title: '403',
      publicPage: true,
    },
    component: () => import('./view/403.vue'),
  },
  {
    path: '*',
    meta: {
      title: 'DataSphere Studio',
      publicPage: true,
    },
    component: () => import('./view/404.vue'),
  },
]