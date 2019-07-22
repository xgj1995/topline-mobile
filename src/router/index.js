import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    },
    {
      name: 'home',
      path: '/',
      component: () => import('@/views/home')
    },
    {
      name: 'search',
      path: '/search',
      component: () => import('@/views/search')
    },
    {
      name: 'search-result',
      path: '/search/:q',
      component: () => import('@/views/search-result')
    },
    {
      name: 'articles',
      path: '/article/:articleId',
      component: () => import('@/views/article')
    },
    {
      name: 'my',
      path: '/my',
      component: () => import('@/views/my')
    },
    {
      name: 'user-setting',
      path: '/user-setting',
      component: () => import('@/views/user-setting')
    }
  ]
})
