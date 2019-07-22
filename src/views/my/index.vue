<template>
    <div>
        <!-- 未登录 -->
        <un-login v-if=" !$store.state.user" />
         <!-- 未登录 -->
         <!-- 登录 -->
        <user-info v-else/>
         <!-- 登录 -->
         <van-cell-group>
             <van-grid :border='false'>
                <van-grid-item icon='star' text="我的收藏"></van-grid-item>
                <van-grid-item icon='chat' text="我的评论"></van-grid-item>
                <van-grid-item icon='like' text="我的点赞"></van-grid-item>
                <van-grid-item icon='browsing-history' text="浏览历史"></van-grid-item>
             </van-grid>
         </van-cell-group>
         <van-cell-group>
            <van-cell title="消息通知" is-link url="//youzan.github.io/vant/mobile.html" />
            <van-cell title="用户反馈" is-link to="index" />
            <van-cell title="小智同学" is-link to="index" />
            <van-cell title="系统设置" is-link to="index" />
         </van-cell-group>
    <app-tabbar></app-tabbar>
    </div>
</template>

<script>
import UnLogin from './components/un-login'
import UserInfo from './components/user-info'
export default {
  name: 'MyIndex',
  components: {
    UnLogin,
    UserInfo
  },
  data () {
    return {

    }
  },
  created () {

  }
}
</script>

<style scpoed lang='less'>

</style>
