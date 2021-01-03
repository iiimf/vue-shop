<template>
  <div>
<!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
<!--      搜素与添加区域-->
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserLists">
              <el-button slot="append" icon="el-icon-search" @click="getUserLists"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="adddialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
<!--      用户列表区域-->
      <el-table :data="userList" border stripe>
<!--        索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
<!--          <template v-slot="scope">-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="ShowEditdialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
<!--            带提示文字的按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!--      弹出添加用户对话框-->
    <el-dialog title="添加用户" :visible.sync="adddialogVisible" width="50%" @close="adddialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="adddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
<!--    修改用户对话框-->
    <el-dialog title="修改用户" :visible.sync="EditdialogVisible" width="50%" @close="EditdialogClose">
      <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="EditForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="EditForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="EditForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="EditdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="EditUserInfo">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
import {getUserList,ChangeUserState,addUser,getUserById,ChangeUserInfo,DeleteUserById} from "network/User";

export default {
  name: "User",
  data(){
    //自定义校验规则
    var checkEmail = (rule,value,cb)=>{
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error("请输入合法的邮箱"))
    };
    var checkMobile = (rule,value,cb)=>{
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regMobile.test(value)){
        return cb()
      }
      cb(new Error("请输入合法的手机号"))
    }
    return {
      queryInfo:{
        query:"",
        pagenum:1,
        pagesize:2
      },
      userList:[],
      total:0,
      //弹出添加用户对话框
      adddialogVisible:false,
      addForm:{
        username:"",
        password:"",
        email:"",
        mobile:""
      },
      addFormRules:{
        username:[
          {required:true,message:"请输入用户名",trigger:'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          {required:true,message:"请输入密码",trigger:'blur'},
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email:[
          {required:true,message:"请输入邮箱",trigger:'blur'},
          {validator:checkEmail,trigger: 'blur'}
        ],
        mobile:[
          {required:true,message:"请输入手机号码",trigger:'blur'},
          {validator:checkMobile,trigger: 'blur'}
        ]
      },

      //修改用户
      EditdialogVisible:false,
      //查询到的用户信息对象
      EditForm:{},
      EditFormRules:{
        email:[
          {required:true,message:"请输入邮箱",trigger:'blur'},
          {validator:checkEmail,trigger: 'blur'}
        ],
        mobile:[
          {required:true,message:"请输入手机号码",trigger:'blur'},
          {validator:checkMobile,trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getUserLists()
  },
  methods:{
    async getUserLists(){
      const result = await getUserList(this.queryInfo)
      if(result.meta.status === 200){
        this.userList = result.data.users
        this.total = result.data.total
      }else{
        return this.$message.error(result.meta.msg)
      }
    },
    //监听pagesize的变化
    handleSizeChange(newsize){
      this.queryInfo.pagesize = newsize
      this.getUserLists()
    },
    //监听页码值改变
    handleCurrentChange(newpage){
      this.queryInfo.pagenum = newpage
      this.getUserLists()
    },
    async userStateChanged(userinfo){
      var res = await ChangeUserState(userinfo.id,userinfo.mg_state)
      if(res.meta.status !== 200){
        userinfo.mg_state = ! userinfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    adddialogClose(){
      this.$refs.addFormRRef.resetFields()
    },
    addUser(){
      this.$refs.addFormRRef.validate( async valid=>{
        if(!valid) return
        //进行添加用户的网络请求
        const result =await addUser(this.addForm)
        if(result.meta.status !== 201){
          return this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        this.adddialogVisible = false
        this.getUserLists()
      })
    },
    async ShowEditdialog(id){
      var res = await getUserById(id)
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.EditForm = res.data

      this.EditdialogVisible = true
    },
    EditdialogClose(){
      this.$refs.EditFormRef.resetFields()
    },
    EditUserInfo(){
      this.$refs.EditFormRef.validate(async valid=>{
        if(!valid) return
        //发起修改用户的数据请求
        var res = await ChangeUserInfo(this.EditForm.id,this.EditForm.email,this.EditForm.mobile)
        if(res.meta.status !== 200){
          return this.$message.error(res.meta.msg)
        }
        this.EditdialogVisible = false
        this.getUserLists()
        this.$message.success(res.meta.msg)
      })
    },
    async removeUserById(id){
      console.log(id);
      await this.$confirm("此操作将永久删除用户,是否继续？","提示",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(()=>{
        DeleteUserById(id).then(res=>{
          if((res.meta.status !==  200)){
            return this.$message.error(res.meta.msg)
          }
          this.$message({
            type:"success",
            message:"删除成功"
          });
          this.getUserLists()
        })
      }).catch(()=>{
        this.$message({
          type:"info",
          message:"已取消删除"
        });
      })
    }

  }
}
</script>

<style scoped>

</style>