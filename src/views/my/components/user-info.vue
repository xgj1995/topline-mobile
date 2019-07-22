<template>
    <div class="user-info">
        <van-cell
        class="base-info"
        is-link
        to="/user-setting"
        >
            <div slot="title" class="self-info">
                <img :src="userInfo.photo" alt="">
                <span class="title">{{ userInfo.name }}</span>
            </div>
        </van-cell>
        <van-grid :border="false" :column-num="3">
            <!-- <van-grid-item>
                <span class="count">1</span>
                <span class="text">头条</span>
            </van-grid-item> -->
            <van-grid-item>
                <span class="count">{{  userInfo.follow_count }}</span>
                <span class="text">关注</span>
            </van-grid-item>
            <van-grid-item>
                <span class="count">{{ userInfo.fans_count }}</span>
                <span class="text">粉丝</span>
            </van-grid-item>
              <van-grid-item>
                <span class="count">{{  userInfo.like_count }}</span>
                <span class="text">获赞</span>
            </van-grid-item>
        </van-grid>
    </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
export default {
  name: 'UserInfo',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    async  loadUserInfo () {
      const data = await getUserInfo()
      console.log(data)
      this.userInfo = data
    }
  }
}
</script>

<style lang="less" scoped>
    .user-info{
        padding: 0 10px;
        font-size: 30px;
        .base-info{
            .self-info{
                display: flex;
                align-items: center;
                img{
                width: 100px;
                height: 100px;
                border-radius: 50%;
                margin-right: 30px;
                }
            }
        }
    }
</style>
