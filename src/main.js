import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI, {Message, MessageBox} from "element-ui"
import "assets/css/global.css"
import "element-ui/lib/theme-chalk/index.css"
import "./assets/font_icon/iconfont.css"
import TreeTable from "vue-table-with-tree-grid"

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
//全局注册组件
Vue.component("tree-table",TreeTable)

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
