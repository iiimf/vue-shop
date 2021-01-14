import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI, {Message, MessageBox} from "element-ui"
import "assets/css/global.css"
import "element-ui/lib/theme-chalk/index.css"
import "./assets/font_icon/iconfont.css"
import TreeTable from "vue-table-with-tree-grid"
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.bubble.css"
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
//全局注册组件
Vue.component("tree-table",TreeTable)
Vue.use(VueQuillEditor)
//格式化时间
Vue.filter("dateFormat",function(originval){
  const dt = new Date(originval)

  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + "").padStart(2,"0")
  const day = (dt.getDate() + "").padStart(2,"0")
  const hour = (dt.getHours() + "").padStart(2,"0")
  const minute = (dt.getMinutes() + "").padStart(2,"0")
  const second = (dt.getSeconds() + "").padStart(2,"0")

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
