const routes = [
  {
    path: 'newhome',
    name: 'Newhome',
    meta: {
      title: 'DataSphere Studio',
      publicPage: true,
    },
    component: () => import('./view/newhome/index.vue'),
  },
  {
    path: 'workspace',
    name: 'workspace',
    meta: {
      title: 'Workspace',
      publicPage: true,
    },
    component: () => import('./view/workspace/index.vue'),
  },
  // {
  //   path: 'workspace1',
  //   name: 'workspace1',
  //   meta: {
  //     title: 'Workspace1',
  //     publicPage: true,
  //   },
  //   component: () => import('./view/newhome/module/workspace/index.vue'),
  // }
]
export default routes;