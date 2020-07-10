<template>
  <div class="workspace-home">
    <div class="mune-bar">
      <h3 class="workspace-title"></h3>
      <div class="overview-box">
        <span class="overview-text">{{$t('message.workspaceManagemnet.title')}}</span>
      </div>
      <Sider collapsible breakpoint="lg" :collapsed-width="0" v-model="isCollapsed">
        <Menu :class="menuitemClasses" class="left-mune" width="auto" :active-name="manageMenus[0].path" theme="light" @on-select="checkout">
          <MenuItem class="left-menuItem" v-for="(item, index) in manageMenus" :key="index" :name="item.path">
            <span>{{item.name}}</span>
          </MenuItem>
        </Menu>
      </Sider>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import api from '@/common/service/api';
import i18n from '@/common/i18n';
const manageMenus = [
  {
    icon: 'icon-shengchanzhongxin',
    name: i18n.t('message.workspaceManagemnet.baseInfo'),
    path: 'productsettings',
    children: [],
  },
  {
    icon: 'icon-kaifazhongxinmorenzhuangtai',
    name: i18n.t('message.workspaceManagemnet.userInfo'),
    path: 'usertable',
    children: [],
  },
  {
    icon: 'icon-fenxizhongxin',
    name: i18n.t('message.workspaceManagemnet.authInfo'),
    path: 'jurisdiction',
    children: [],
  },
];
export default {
  data() {
    return {
      mode: '',
      manageMenus,
      isCollapsed: false
    }
  },
  created() {

  },
  computed: {
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  methods: {
    checkout(item) {
      if (item) {
        this.$router.push({name: item, query: {
          workspaceId: this.$route.query.workspaceId
        }})
      } else {
        this.$Message.warning(this.$t('message.GLY.ZWKF'))
      }
    }
  }
}
</script>
<style lang="scss" scoped src="./index.scss"></style>
