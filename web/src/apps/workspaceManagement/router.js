const routes = [
  {
    path: '/workspaceManagement',
    name: 'workspaceManagement',
    redirect: '/workspaceManagement/productsettings',
    meta: {
      title: 'DataSphere Studio',
      publicPage: true,
    },
    component: () =>
      import('./view/management/index.vue'),
    children: [{
      path: 'productsettings',
      name: 'productsettings',
      meta: {
        title: 'DataSphere Studio',
        publicPage: true
      },
      component: () =>
        import('./module/management/module/productsettings.vue'),
    },
    {
      path: 'usertable',
      name: 'usertable',
      meta: {
        title: 'DataSphere Studio',
        publicPage: true
      },
      component: () =>
        import('./module/management/module/usertable.vue'),
    },
    {
      path: 'jurisdiction',
      name: 'jurisdiction',
      meta: {
        title: 'DataSphere Studio',
        publicPage: true
      },
      component: () =>
        import('./module/management/module/jurisdiction.vue'),
    }]
  },
]
export default routes;