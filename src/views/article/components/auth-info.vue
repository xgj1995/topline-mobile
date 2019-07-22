<template>
    <div class="auth-info">
        <div class="base-info">
            <img class="avatar" :src="article.aut_photo" alt="">
            <div>
                <p>{{ article.aut_name }}</p>
                <p>{{ article.pubdate | relativeTime }}</p>
            </div>
        </div>
        <div>
             <van-button
             :type="article.is_followed?'default':'danger'"
             @click="handleFocus"
             :loading="isloading"
             :disabled='isloading'
             round
             >{{article.is_followed?'取消关注':'关注'}}</van-button>
        </div>
    </div>
</template>

<script>
import { focusUser, unFocusUser } from '@/api/user'
export default {
  name: 'authInfo',
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isloading: false
    }
  },
  created () {

  },
  methods: {
    async handleFocus () {
      // 关注，取消关注
      try {
        this.isloading = true
        const userId = this.article.aut_id
        if (this.article.is_followed) {
          await unFocusUser(userId)
          this.article.is_followed = false
        } else {
          await focusUser(userId)
          this.article.is_followed = true
        }
      } catch (err) {
        // 判断是否登录
        console.log(err)
        if (err.response.status === 401) {
          this.$checkLogin()
        }
      }
      this.isloading = false
    }
  }
}
</script>

<style scoped lang="less">
 .auth-info {
     display: flex;
     justify-content: space-between;
     align-items: center;
    .base-info{
        display: flex;
        font-size: 25px;
        align-items: center;
         .avatar{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-right: 20px;
        padding-left: 10px;
    }
    }
 }

</style>
