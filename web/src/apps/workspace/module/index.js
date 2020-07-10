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

const workspaceRequireComponent = require.context(
  // 其组件目录的相对路径
  './',
  // 是否查询其子目录
  true,
  /([a-z|A-Z])+\/index\.js$/
);


const workspaceRequireComponentVue = require.context(
  // 其组件目录的相对路径
  './',
  // 是否查询其子目录
  true,
  /([a-z|A-Z])+.vue$/
);

export {
  workspaceRequireComponent,
  workspaceRequireComponentVue
}