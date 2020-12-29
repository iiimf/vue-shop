import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = ()=>import("components/Login")
const Home = ()=>import("components/Home")

Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:"/login"
  },
  {
    path:"/login",
    component:Login
  },
  {
    path:"/home",
    component:Home,
  }
]

const router = new VueRouter({
  routes,
  mode:"history"
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if(!tokenStr){
    return next("/login")
  }else{
    //直接放行
    return next()
  }
})

export default router
