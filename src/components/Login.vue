<template>
  <div class="login-container">
    <div class="log-box">
<!--      头像区域-->
      <div class="avatar_box">
        <img src="~assets/Login.jpg" alt="">
      </div>
<!--      登录表单区域-->
      <el-form label-width="0px" class="login-form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
<!--        用户名-->
        <el-form-item label="" prop="username">
          <el-input prefix-icon="iconfont icon-person" v-model="loginForm.username"></el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item label="" prop="password">
          <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
<!--        按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import {Login} from "network/login.js"
export default {
  name: "Login",
  data(){
    return {
      loginForm:{
        username:"admin",
        password:"123456",
      },
      //表单得验证规则对象
      loginFormRules:{
        //用户名验证规则
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        //密码验证规则
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate(result=>{
        if(!result){
          return
        }else{
          Login(this.loginForm.username,this.loginForm.password).then(res=>{
            if(res.meta.status === 200){
              this.$message.success("登录成功")
              //将登录成功之后的token保存到客户端的sessionStorage中
              //1.项目中出现了登录之外的API接口，必须登录之后才能访问
              //2.token只应在网站打开期间生效，所以将token保存在sessionStorage中
              window.sessionStorage.setItem("token",res.data.token)
              //路由跳转
              this.$router.push("/home")
            }else{
              this.$message.error("登录失败")
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped >
.login-container{
  background-color: #2b4b6b;
  height: 100%;
}
.log-box{
  width:450px;
  height:300px;
  background-color: #fff;
  border-radius:3px;
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);

  .avatar_box{
    height: 130px;
    width: 130px;
    border:1px solid #eee;
    border-radius:50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left:50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width: 100%;
      height:100%;
      background-color:#fff;
      border-radius: 50%;
    }
  }
}
.login-form{
  width: 100%;
  padding: 0 20px;
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content: flex-end;
}
</style>