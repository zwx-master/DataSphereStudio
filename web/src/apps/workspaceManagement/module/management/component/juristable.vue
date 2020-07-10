<template>
  <div>
    <div v-for="item in tablearr" :key="item.title">
      <h3 style="margin:20px 0px 10px;">{{item.title}}</h3>
      <div style="overflow: auto;">
        <Table :style="width(item.columns)" border highlight-row  :columns="item.columns" :data="item.datalist">
          <template style="color:#4ACA6D" slot-scope="{ row, index }" slot="action">
            <Button type="warning" size="small" @click="modify(row,index)">{{$t('message.userTable.editor')}}</Button>
          </template>
        </Table>
      </div>
    </div>
    <div  v-if="homepagedata && homepagedata.datalist.length" class="hoempage-table">
      <h3 style="margin:10px 0px;">{{$t('message.userTable.homeSetting')}}</h3>
      <Table border highlight-row :columns="homepagedata.column" :data="homepagedata.datalist">
        <template style="color:#4ACA6D"  slot="action">
          <Button type="warning" size="small" disabled>{{$t('message.userTable.editor')}}</Button>
        </template>
      </Table>
    </div>
    <Modal
      v-model="creatershow"
      :title="$t('message.userTable.addRole')">
      <Form ref="addUser" :model="useradd" :rules="addrule" :label-width="80">
        <FormItem :label="$t('message.userTable.roleName') + ': '" prop="roleName">
          <Input size="small" v-model="useradd.roleName" style="width: 200px"/>
        </FormItem>
        <FormItem :label="$t('message.userTable.menuPermissions')" :label-width="85">
          <Checkbox-group v-model="useradd.menuPrivs">
            <Checkbox v-for="item in workspaceMenu.menuPrivVOS" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
          </Checkbox-group>
        </FormItem>
        <FormItem v-if="workspaceMenu.componentPrivVOS.length" :label="$t('message.userTable.componentAccessPermissions')" :label-width="85">
          <Checkbox-group v-model="useradd.componentPrivs">
            <Checkbox  v-for="item in workspaceMenu.componentPrivVOS" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
          </Checkbox-group>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">{{
          $t("message.newConst.cancel")
        }}</Button>
        <Button type="primary" size="large" @click="roleadd">{{
          $t("message.newConst.ok")
        }}</Button>
      </div>
    </Modal>
    <Modal
      v-model="modifyshow"
      :title=titlename
      @on-ok="jurisdictionchange"
      @on-cancel="cancel">
      <div class="modify-model">
        <Checkbox v-for="item in userlist.namesign"
          :key="item" style="display:block"
          v-model="userlist[item]"
          :disabled="item==='admin'">
          {{username(item)}}
        </Checkbox>
      </div>
    </Modal>
  </div>
</template>
<script>
import api from "@/common/service/api";
export default {
  props: {
    workspaceMenu: Object,
    tablearr: Array
  },
  data() {
    return {
      modifyshow: false,
      creatershow: false,
      userlist: [],
      homepagedata: null,
      workspaceId: '',
      useradd: {
        roleName: '',
        menuPrivs: [],
        componentPrivs: []
      },
      originBusiness: {},
      addrule: {
        roleName: [
          { required: true, message: this.$t('message.userTable.addRoleMsg'), trigger: "blur" },
          { message: this.$t('message.userTable.nameLongMsg'), max: 8 },
          { type: 'string', pattern: /^[\w\u4e00-\u9fa5]+$/, message: this.$t('message.userTable.ruleMsg'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    titlename(){
      let title = `${this.$t('message.userTable.permissionsEditor')}·${this.userlist.name}`
      return title
    },
  },
  created(){
    this.workspaceId =parseInt(this.$route.query.workspaceId)
  },
  mounted() {
    this.gethomepagedata()
  },
  methods: {
    gethomepagedata(){
      api.fetch('/dss/getWorkspaceHomepageSettings', {
        workspaceId: this.workspaceId,
      }, 'get').then((rst) => {
        let data = rst.homepageSettings.roleHomepages
        this.homepagedata = this.gethomepagetable(data)
      })
    },
    gethomepagetable(data){
      let columns = [];
      let datas = [];
      let columobj = {};
      let dataobj = {};
      data.forEach(item=>{
        dataobj[item.roleName] = item.homepageName
        columobj = {
          title: item.roleFrontName,
          key: item.roleName,
          align: 'center'
        }
        columns.push(columobj)
      })
      datas.push(dataobj)
      columns.push({title: this.$t('message.userTable.action'), slot: "action", align: "center"})
      let obj ={}
      this.$set(obj, 'column', columns);
      this.$set(obj, 'datalist', datas);
      return obj;
    },
    modify(row,index){
      this.modifyshow = true;
      this.userlist = JSON.parse(JSON.stringify(row))
    },
    username(name){
      let strname = ''
      this.workspaceMenu.roleVOS.forEach(item=>{
        if(item.roleName === name){
          strname = item.roleFrontName
        }
      })
      return strname
    },
    createrchange(){
      this.creatershow = true;
    },
    width(v){
      return `min-width:${v.length*100}px`
    },
    jurisdictionchange() {
      let type = this.userlist.type;
      let url = type.substring(0, type.length - 1);
      url = url.charAt(0).toUpperCase() + url.slice(1)
      let id =type.replace("Privs","Id")
      let menuPrivs={}
      let menuId= this.userlist.id
      this.userlist.namesign.forEach((item)=>{
        menuPrivs[item]=this.userlist[item]
      })
      const params ={
        [id]: menuId,
        [type]: menuPrivs,
        workspaceId: this.workspaceId
      }
      api.fetch(`/dss/updateRole${url}`, params).then((res) => {
        this.$Message.success(this.$t('message.userTable.editorSuccess'));
        this.$parent.init()
      }).catch((err) => {
      });

    },
    cancel () {
      this.creatershow = false;
      this.useradd={};
    },
    roleadd(){
      let arr = []
      let name = this.useradd.roleName;
      this.workspaceMenu.roleVOS.forEach(item => {
        arr.push(item.roleFrontName)
      });
      let bool = arr.indexOf(name)> -1
      if(bool){return this.$Message.warning(this.$t('message.userTable.nameRepeat'))}
      this.$refs.addUser.validate(valid=>{
        if(valid){
          const params = {
            menuIds: this.useradd.menuPrivs,
            componentIds: this.useradd.componentPrivs,
            workspaceId: this.workspaceId,
            roleName: this.useradd.roleName
          }
          api.fetch('dss/addWorkspaceRole',params).then((res)=>{
            this.$Message.success(this.$t('message.userTable.addSuccess'));
            this.$parent.init()
            this.useradd={};
            this.creatershow = false;
          })
        }else{
          this.$Message.warning(this.$t("message.newConst.failedNotice"));
        }
      })
    },

  },
}
</script>
<style lang="scss" scoped>
  .modify-model{
    display: flex;
    flex-wrap: wrap;
    height: 64px;
    align-items: center;
    label{
      width: 100px
    }
  }
</style>
