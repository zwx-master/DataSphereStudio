/*
 * Copyright 2019 WeBank
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import VueRouter from 'vue-router';
import { routes } from './config';
// 解决重复点击路由跳转报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
window.console.log(routes, 'routes')
const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  if (to.meta) {
    if (to.meta.publicPage) {
      // 公共页面不需要权限控制（404，500）
      next();
    } else {
      next('/');
    }
  }
  // 直接进入某个工程
  // const query = from.query;
  // if (query && query.projectID && query.projectTaxonomyID && query.projectVersionID && (to.name === 'Kanban' || to.name === 'Home' || to.name === 'Workflow')) {
  //   next({
  //     path: to.path,
  //     query,
  //   })
  //   return;
  // }
  // if (to.name === 'Workflow' && !query.projectID && from.name !== 'Project') {
  //   next({
  //     path: '/project',
  //   })
  //   return;
  // }
});
router.afterEach((to) => {
  if (to.meta) {
    document.title = to.meta.title || 'DataSphere Studio';
  }
});

export default router
;
