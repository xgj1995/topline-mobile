import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import 'vant/lib/index.css'
import 'amfe-flexible'
import store from './store'
import zhCN from 'vee-validate/dist/locale/zh_CN'
// 底部导航
import AppTbabar from './components/app-tabbar'
// 表单验证
import VeeValidate, { Validator } from 'vee-validate'
// 注册一个全局过滤器：处理相对时间
import relativeTime from './filters/relative-time'
// 图片懒加载
import Vant, { Lazyload } from 'vant'
// 登录确认
import checkLogin from '@/utils/check-login'
Vue.use(Lazyload)
Vue.filter('relativeTime', relativeTime)
Vue.use(VeeValidate, {
  events: ''
})
Vue.component('app-tabbar', AppTbabar)
Validator.localize('zh_CN', zhCN)

Vue.use(Vant)

Vue.config.productionTip = false

Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(resolve, time)
  })
}
Vue.prototype.$checkLogin = checkLogin

// 时间格式处理
Vue.prototype.$Format = (data, fmt) => {
  var o = {
    'M+': data.getMonth() + 1, // 月份
    'd+': data.getDate(), // 日
    'H+': data.getHours(), // 小时
    'm+': data.getMinutes(), // 分
    's+': data.getSeconds(), // 秒
    'q+': Math.floor((data.getMonth() + 3) / 3), // 季度
    'S': data.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
