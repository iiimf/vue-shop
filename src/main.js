import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI, {Message} from "element-ui"
import "assets/css/global.css"
import "element-ui/lib/theme-chalk/index.css"
import "./assets/font_icon/iconfont.css"

Vue.prototype.$message = Message

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
