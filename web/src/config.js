import { merge } from 'lodash'
import workflowAndScriptisRoutes from './apps/workflowAndScriptis/router'
import workspaceRoutes from './apps/workspace/router'
import workspaceManagementRoutes from './apps/workspaceManagement/router'
import routes from "./dss/router";
const apps = {
  workflowAndScriptis: {
    routes: workflowAndScriptisRoutes,
    i18n: {
      'en': require('./apps/workflowAndScriptis/i18n/common/en.json'),
      'zh-CN': require('./apps/workflowAndScriptis/i18n/common/zh.json')
    }
  },
  workspaceManagement: {
    routes: workspaceManagementRoutes,
    i18n: {
      'en': require('./apps/workspaceManagement/i18n/en.json'),
      'zh-CN': require('./apps/workspaceManagement/i18n/zh.json')
    }
  },
  workspace: {
    routes: workspaceRoutes
  }
}

const i18n = {}
let tempRoutes = []
Object.keys(apps).forEach(key => {
  if (Array.isArray(apps[key].routes)) {
    tempRoutes = tempRoutes.concat(apps[key].routes)
  }
  if (apps[key].i18n) {
    merge(i18n, apps[key].i18n)
  }
})
routes[0].children = tempRoutes;
export {
  routes,
  i18n
}