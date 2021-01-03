<template>

  <el-container class="home-container">
<!--    头部区域-->
    <el-header>
      <div>
        <img src="~assets/bimviz.png" alt="">
        <i>后台管理系统</i>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
<!--    页面主体区域-->
    <el-container>
<!--      侧边栏-->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle-buuton" @click="toggleCollapse">|||</div>
          <el-menu class="el-menu-vertical-demo"
              background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true"
                   :collapse="iscollapse" :collapse-transition="false" :router="true" :default-active="activePath">
            <el-submenu v-for="menu in menulist" :key="menu.id" :index="menu.id + ''">
              <template slot="title">
                <i :class="iconObjs[menu.id]"></i>
                <span>{{menu.authName}}</span>
              </template>
              <el-menu-item v-for="menuChildren in menu.children" :index="'/'+menuChildren.path + ''"
                            :key="menuChildren.id" @click="saveNavState('/'+menuChildren.path + '')">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{menuChildren.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
      </el-aside>
<!--      右侧内容主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>


</template>

<script>
import {getMenuList} from "network/getMenulist";

export default {
  name: "Home",
  async created(){
    var res = await getMenuList()
    this.menulist =  res.data
    this.activePath = window.sessionStorage.getItem("activePath")
  },
  data(){
    return {
      menulist:[],
      iconObjs:{
        "125":"iconfont icon-person",
        "103":"iconfont icon-quanxian",
        "101":"iconfont icon-shangpin",
        "102":"iconfont icon-danju",
        "145":"iconfont icon-shuju"
      },
      iscollapse:false,
      activePath:""

    }
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    toggleCollapse(){
      this.iscollapse = ! this.iscollapse
    },
    saveNavState(activePath){
      window.sessionStorage.setItem("activePath",activePath)
      this.activePath = activePath
    }
  }

}
</script>

<style scoped lang="less">
.home-container{
  height: 100%;
}
.el-header{
  background-color:#373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  color: #F7F7F7;
  div{
    display: flex;
    align-items: center;
    img{
      margin: 20px 30px 20px 20px;
      width: 40px;
      height: 40px;
    };
  }

}

.el-aside{
  background-color:#333744;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-buuton{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.2em
;

}
</style>