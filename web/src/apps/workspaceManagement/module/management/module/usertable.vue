<template>
  <div class="user-serchbar-box">
    <h3>{{$t('message.userTable.userManagement')}}</h3>
    <formserch
      @click-serach="search"
      @click-creater="creater"
      :searchBar="searchBar"
      :optionType="optionType"
    ></formserch>
    <Table
      border
      highlight-row
      align="center"
      :columns="data.columns"
      :data="data.datalist"
    >
      <template slot-scope="{ row }" slot="role">
        <span>{{ rolelist(row) }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click="remove(row, index)"
        >{{$t('message.userTable.delete')}}</Button
        >
        <Button
          type="primary"
          size="small"
          style="margin-left: 10px"
          @click="edit(row, index)"
        >{{$t('message.userTable.editor')}}</Button
        >
      </template>
    </Table>
    <div class="user-table-page">
      <Page
        :total="pageSetting.total"
        :page-size="pageSetting.pageSize"
        :current="pageSetting.current"
        size="small"
        show-total
        show-elevator
        @on-change="changePage"
      />
    </div>
    <Modal v-model="delshow" width="360" class-name="delete-modal">
      <p slot="header" class="delete-modal-header">
        <Icon type="ios-information-circle" />
        <span>{{ $t("message.deleteDialog.waring") }}</span>
      </p>
      <div>
        <div>
          {{$t('message.userTable.deleteHintMsg')}}
        </div>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">{{$t('message.userTable.comfirmDelete')}}</Button>
      </div>
    </Modal>
    <Modal class-name="adduser-box" :closable="false" v-model="creatershow" :title="$t('message.userTable.addUser')">
      <Form ref="addUser" :model="useradd" :rules="addrule" :label-width="80">
        <FormItem :label="$t('message.userTable.user')" prop="name">
          <Row>
            <Col span="12" style="width: 196px" size="small">
            <Select
              v-model="useradd.name"
              filterable
              remote
              :remote-method="remoteMethod1"
              :loading="loading1">
              <Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
            </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('message.userTable.role')" prop="role">
          <CheckboxGroup v-model="useradd.role">
            <Checkbox
              v-for="item in workspaceRoles"
              :key="item.roleId"
              :label="item.roleId"
            >{{item.roleFrontName}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="Cancel">{{
          $t("message.newConst.cancel")
        }}</Button>
        <Button type="primary" size="large" @click="Ok('addUser')">{{
          $t("message.newConst.ok")
        }}</Button>
      </div>
    </Modal>
    <Modal :closable="false" v-model="editusershow" :title="$t('message.userTable.editUser')">
      <Form
        ref="editUser"
        :model="edituser"
        :rules="editrule"
        :label-width="80"
      >
        <FormItem :label="$t('message.userTable.role')" prop="role">
          <CheckboxGroup v-model="edituser.role">
            <Checkbox
              v-for="item in workspaceRoles"
              :key="item.roleId"
              :label="item.roleId"
            >{{item.roleFrontName}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="Cancel">{{
          $t("message.newConst.cancel")
        }}</Button>
        <Button type="primary" size="large" @click="Ok('editUser')">{{
          $t("message.newConst.ok")
        }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import storage from "@/common/helper/storage";
import api from "@/common/service/api";
import moment from 'moment';
import formserch from "../component/formsechbar";
export default {
  components: {
    formserch
  },
  data() {
    return {
      delshow: false,
      creatershow: false,
      editusershow: false,
      loading: true,
      row: '',
      loading1: false,
      usernamelist: [],
      options: [],
      pageSetting: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
      workspaceRoles: [],
      data: {
        columns: [],
        datalist: []
      },
      useradd: {},
      edituser: {},
      editrule: {
        role: [{ required: true, type: 'array', min: 1, message: this.$t('message.userTable.selectRoleMsg'), trigger: 'change' }]
      },
      addrule: {
        name: [
          { required: true, message: this.$t('message.userTable.addruleMsg'), trigger: "blur" },
        ],
        role: [
          { required: true, type: 'array', min: 1, message: this.$t('message.userTable.selectRoleMsg'), trigger: 'change' },
        ]
      },
      searchBar: {
        title: this.$t('message.userTable.umAccount'),
        searchText: "",
        engine: 0,
        status: 0
      },
      optionType: {
        title: this.$t('message.userTable.role') + ':',
        status: [],
      },
    };
  },

  created(){
    this.workspaceId =parseInt(this.$route.query.workspaceId);
  },
  mounted() {
    this.username()
    this.init();
  },
  methods: {
    remoteMethod1(query) {
      if (query !== "") {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          const list = this.usernamelist.map(item => {
            return {
              value: item,
              label: item
            };
          });
          this.options = list.filter(
            item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          );
        }, 200);
      } else {
        this.options = [];
      }
    },
    init() {
      api.fetch('/dss/getWorkspaceRoles',{
        workspaceId: this.workspaceId,
      },'get').then((rst)=>{
        this.workspaceRoles =  rst.workspaceRoles;
        this.optionType.status = this.statuslist(rst.workspaceRoles)
      })
      // api.fetch('/dss/listDepartments',{
      //   workspaceId: this.workspaceId,
      // },'get').then((rst)=>{
      //   this.optionType.engine = this.departmentlist(rst.departments)
      // })
      this.search()
    },
    search() {
      const params = this.getParams();
      this.data.columns  = this.getColumns();
      api.fetch('/dss/getWorkspaceUsers', params, 'get').then((rst) => {
        this.pageSetting.total = rst.total;
        this.data.datalist = this.renderFormatTime(rst.workspaceUsers);
      }).catch(() => {

      });
    },
    username(){
      api.fetch('/dss/listAllUsers',{
      },'get').then((rst)=>{
        rst.users.forEach(item=>{
          this.usernamelist.push(item.username)
        })
      })
    },
    getColumns(){
      const column = [
        { title: this.$t('message.userTable.name'), key: "name", align: "center" },
        { title: this.$t('message.userTable.role'), slot: "role", align: "center",width: 250 },
        { title: this.$t('message.userTable.department'), key: "department", align: "center" },
        { title: this.$t('message.userTable.office'), key: "office", align: "center" },
        { title: this.$t('message.userTable.creator'), key: "creator", align: "center" },
        { title: this.$t('message.userTable.joinTime'), key: "joinTime", align: "center" },
        { title: this.$t('message.userTable.action'), slot: "action", width: 150, align: "center" }
      ];
      return column;
    },
    getParams(page){
      const params =  {
        workspaceId: this.workspaceId,
        username: this.searchBar.searchText,
        roleName: this.searchBar.status,
        department: this.searchBar.engine,
        pageNow: page || this.pageSetting.current,
        pageSize: 10
      }
      if(this.searchBar.searchText){
        delete params.roleName;
        delete params.status;
      }else{
        let {engine,status} = this.searchBar;
        if(status===0){
          delete params.roleName;
        }
        if(engine===0){
          delete params.department;
        }
        delete params.username;
      }
      return params
    },
    changePage(page){
      const params = this.getParams(page);
      this.column = this.getColumns();
      api.fetch('/dss/getWorkspaceUsers', params, 'get').then((rst) => {
        this.pageSetting.total = rst.total;
        this.data.datalist = this.renderFormatTime(rst.workspaceUsers);
      }).catch(() => {
      });
    },
    remove(row, index) {
      this.delshow = true;
      this.row = row;
    },
    del() {
      const userInfoName = storage.get("baseInfo");
      const username = userInfoName
      if(username === this.row.name){
        return this.$Message.error(this.$t('message.userTable.notDeleteMsg'));
      }
      this.delshow = false;
      const params = {
        workspaceId: this.workspaceId,
        username: this.row.name
      };
      api.fetch("/dss/deleteWorkspaceUser", params).then(rst => {
        this.init()
        this.$Message.success(this.$t('message.userTable.deleteSuccess'));
      });
    },
    edit(row, index) {
      // 如果是当前用户修改自己的权限，提示用户不能修改
      if (this.getUserName() === row.name) return this.$Message.warning(this.$t("message.userTable.notsupported"));
      this.edituser = {
        role: [...row.roles]
      }
      this.row = row;
      this.editusershow = true;
    },
    creater() {
      this.useradd = {
        name: "",
        role: []
      }
      this.creatershow = true;
    },
    Ok(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if(name === 'addUser')  this.createuser()
          if(name === 'editUser') this.editrole()
        } else {
          this.$Message.warning(this.$t("message.newConst.failedNotice"));
        }
      });
    },
    Cancel() {
      this.creatershow = false;
      this.editusershow = false;
      this.options = [];
    },
    createuser(){
      let name = this.useradd.name
      const params = {
        roles: this.useradd.role,
        workspaceId: this.workspaceId,
        username: name,
      }
      api.fetch('/dss/addWorkspaceUser', params).then((res) => {
        this.init()
        this.$Message.success(this.$t('message.userTable.addSuccess'));
      }).catch((err) => {
        this.$Message.warning(this.$t('message.userTable.addFail'));
      });
      this.creatershow = false;
    },
    editrole(){
      let name = this.row.name
      const params = {
        roles: this.edituser.role,
        workspaceId: this.workspaceId,
        username: name,
      }
      api.fetch('/dss/updateWorkspaceUser', params).then((res) => {
        this.init()
        // 如果用户自己改了自己的权限，需要去更新左侧菜单栏
        if (name === this.getUserName()) {
          this.dispatch('WorkspaceHome:updateSidebar');
        }
        this.$Message.success(this.$t('message.userTable.updataSuccess'));
      }).catch((err) => {
        this.$Message.warning('');
      });
      this.editusershow = false;
    },
    renderFormatTime(data){
      data.forEach(item => {
        item.joinTime = moment.unix(item.joinTime / 1000).format('YYYY-MM-DD HH:mm:ss')
      });
      return data;
    },
    rolelist(data){
      let  str  = '';
      data.roles.forEach(element => {
        this.workspaceRoles.forEach(item => {
          if (item.roleId === element) {
            str += item.roleFrontName + "-"
          }
        })
      });
      str = str.substring(0, str.lastIndexOf('-'));
      return  str
    },
    statuslist(data){
      if (!data) return
      let arr = []
      let obj = {}
      data.forEach(item=>{
        obj={
          label: item.roleFrontName,
          value: item.roleName
        }
        arr.push(obj)
      })
      arr.unshift({label: this.$t('message.userTable.all'), value: 0})
      return arr
    },
    departmentlist(data){
      if (!data) return
      let arr = []
      let obj = {}
      data.forEach(item=>{
        obj={
          label: item.name,
          value: item.frontName
        }
        arr.push(obj)
      })
      arr.unshift({label: this.$t('message.userTable.all'), value: 0})
      return arr
    }
  }
};
</script>
<style lang="scss" scoped>
.user-serchbar-box {
  padding: 10px 15px;
  min-width: 1217px;
  .user-table-page {
    text-align: center;
    padding-top: 10px;
  }
}
</style>
