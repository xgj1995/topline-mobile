import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'
// import router from '@/router'
const request = axios.create({
  // baseURL: 'http://toutiao.course.itcast.cn'
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 处理后端返回数据超过安全整数范围
request.defaults.transformResponse = [function (data) {
  try {
    // 如果是 json 格式字符串，那就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着 data 不是 json 格式字符串，这里就直接原样返回给后续使用
    return data
  }
}]
// 发送请求
request.interceptors.request.use(function (config) {
  //  判断是否登录
  const user = store.state.user
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Do something with response data

  // 如果响应结果对象中有 data，则直接返回这个 data 数据
  // 如果响应结果对象中没有 data，则不作任何处理，直接原样返回这个数据
  return response.data.data || response.data
}, async function (error) {
  // Do something with response error
  // 判断token是否过期
  if (error.response && error.response.status === 401) {
    const { user } = store.state
    // 如果没有user
    // if(!user){
    // return  router.push({name:'login'})
    // }
    // 发送refreshtoken
    try {
      const { data } = await axios({
        method: 'PUT',
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 提交更新后的token保存到store中
      store.commit('setUser', {
        token: data.data.token,
        refresh_token: user.refresh_token
      })
      return request(error.config)
    } catch (err) {
      //  return  router.push({name:'login'})
    }
  }
  return Promise.reject(error)
})

export default request
