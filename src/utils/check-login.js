import { Dialog } from 'vant'
import router from '@/router'
import store from '@/store'

// 检查是否登录
export default () => {
  const { user } = store.state
  if (user) {
    return true
  }
  Dialog.confirm({
    title: '提示:该操作需要登录使用',
    message: '是否返回登录页'
  }).then(() => {
    router.push({
      name: 'login',
      query: {// 传递查询字符串
        redirect: router.currentRoute.fullPath
      }
    })
  }).catch(() => {
    // on cancel
  })
}
