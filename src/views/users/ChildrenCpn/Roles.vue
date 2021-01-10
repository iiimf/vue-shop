<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
<!--      按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
<!--      角色列表-->
      <el-table :data="roleslist" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(role1,index) in scope.row.children" :class="['vcenter','bdbottom',index === 0 ? 'bdtop' :'']">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,role1.id)">{{role1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(role2,index2) in role1.children" :class="['vcenter',index2 === 0 ? '' : 'bdtop']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,role2.id)">{{role2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
<!--                  三级权限-->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(role3,index2) in role2.children" :key="role3.id"
                            closable @close="removeRightById(scope.row,role3.id)">
                      {{role3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
<!--        索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="ShowRightdialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
    <el-dialog title="分配权限" :visible.sync="RightdialogVisible" width="50%" @close="RightdialogClose">
<!--      树形控件-->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox
               node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="RightdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRolesList,deleteRolesRightsById,DistributeRights} from "network/Roles"
import {getRightsListTree} from "network/Rights"
export default {
  name: "Roles",
  created(){
    this.getRolesLists()
  },
  data(){
    return {
      roleslist:[],
      //所有权限的数据
      rightslist:[],
      //树形控件的属性绑定对象
      treeProps:{
        label:"authName",
        children:"children"
      },
      RightdialogVisible:false,
      defKeys:[],
      DisstributeroleId:"",
      loading:true
    }
  },
  methods:{
    async getRolesLists(){
      const res = await getRolesList()
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.roleslist = res.data
      this.loading = false
    },
    async removeRightById(role,rightid){
      const confirmResult = await this.$confirm("此操作将永久删除该权限，是否继续？","提示",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).catch(err=>err)

      if(confirmResult !== "confirm"){
        return this.$message.info("取消删除")
      }
      const result = await deleteRolesRightsById(role.id,rightid)
      if(result.meta.status !== 200){
        return this.$message.error(result.meta.msg)
      }
      this.$message.success(result.meta.msg)

      // this.getRolesLists()  //防止页面刷新
      role.children = result.data
    },
    async ShowRightdialog(role){
      const res = await getRightsListTree()
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      //将获取的数据保存到data属性中
      this.rightslist = res.data

      //递归获取三级节点
      this.getRoleRight3(role)
      this.DisstributeroleId = role.id
      this.RightdialogVisible = true
    },
    getRoleRight3(node) {
      if (!node.children) {
        return this.defKeys.push(node.id)
      }
      node.children.forEach(item => {
        this.getRoleRight3(item)
      })
    },
    RightdialogClose(){
      this.defKeys = []
    },
    async allotRights(){
      const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(",")
      const res = await DistributeRights(this.DisstributeroleId,idStr)
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesLists()
      this.RightdialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top:1px solid #eee
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display:flex;
  align-items:center
}
</style>