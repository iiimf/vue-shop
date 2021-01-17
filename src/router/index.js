import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = ()=>import("components/Login")
const Home = ()=>import("components/Home")
const Welcom = ()=>import("views/Welcom")
const User = () => import("views/users/User")
const Rights = () => import("views/users/ChildrenCpn/Rights")
const Roles = () => import("views/users/ChildrenCpn/Roles")
const Categories = () => import("views/goods/Categories")
const Params = ()=>import("views/goods/Params")
const GoodList = () => import("views/goods/GoodsList")
const AddGoods = () => import("views/goods/AddGoods")
const Order = ()=>import("views/order/Order")
const Report = ()=>import("views/report/Report")

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
    redirect:"/welcom",
    children:[
      {
        path:"/welcom",
        component:Welcom
      },
      {
        path:"/users",
        component:User
      },
      {
        path:"/rights",
        component:Rights
      },
      {
        path:"/roles",
        component:Roles
      },
      {
        path:"/categories",
        component:Categories
      },
      {
        path:"/params",
        component:Params
      },
      {
        path:"/goods",
        component:GoodList
      },
      {
        path:"/goods/add",
        component:AddGoods
      },
      {
        path:"/orders",
        component:Order
      },
      {
        path:"/reports",
        component:Report
      }
    ]
  },
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
