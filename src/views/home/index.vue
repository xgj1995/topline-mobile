<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar
      fixed
      title="首页"
    >
    </van-nav-bar>
    <!-- <van-search
    placeholder="请输入搜索关键词"
    @click=" $router.push({name:'search'})" -->

    />
    <!-- 频道标签 -->
    <van-tabs v-model="activeChannelIndex" class="channel_tabs">
      <!-- 弹出频道管理 -->
      <div slot="nav-right" @click="isChannelShow = true" class="wap-nav">
        <van-icon name="wap-nav" />
      </div>
      <van-tab
      v-for="channelItem in channels"
      :key="channelItem.id"
      :title="channelItem.name">
        <van-pull-refresh
        v-model="channelItem.pullLoading"
        @refresh="onRefresh"
        :success-text="channelItem.pullSuccessText"
        >
          <van-list
              v-model="channelItem.loading"
              :finished="channelItem.finished"
              item.finishedText="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="item in channelItem.articles"
                :key="item.art_id.toString()"
                :title="item.title"
                @click="$router.push({name:'articles',params:{ articleId:item.art_id.toString() }})"
              >
                <div slot="label">
                  <van-grid :border="false" :column-num="3">
                    <van-grid-item
                    v-for="(img,index) in item.cover.images"
                    :key=index>
                      <van-image
                      :src="img"
                      lazy-load
                      />
                    </van-grid-item>
                  </van-grid>
                  <!-- 阻止事件传播 -->
                  <p @click.stop="">
                     <span>作者:{{item.aut_name}}</span>
                  &nbsp;
                  &nbsp;
                  <span>{{item.comm_count}}评论</span>
                  &nbsp;
                  &nbsp;
                     <span>{{ item.pubdate|relativeTime}}</span>
                  <van-icon class="close" name='close' @click="handleMoreAction(item)"></van-icon>
                  </p>
                </div>
              </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 底部导航 -->
    <app-tabbar></app-tabbar>
    <!-- 反馈组件 -->
    <couple-back
    v-model="isBackShow"
    :select-article='currentArticle'
    :user-articles.sync='activeChannel'
    ></couple-back>
    <!-- 反馈组件 -->

    <!-- 频道组件 -->
    <!-- .sync 修饰符会自动监听一个事件：
      @update:user-channels="channels = $event"
      简单来说，给 props 数组加 .sync 其实就是 v-model 的作用
      只不过一个组件只能有一个 v-model -->
    <home-channel
    v-model="isChannelShow"
    :user-channels.sync='channels'
    :active-index.sync='activeChannelIndex'
    ></home-channel>
    <!-- 频道组件 -->
  </div>
</template>

<script>
import { getUserChannel } from '@/api/channel'
import { getArticles } from '@/api/article'
import HomeChannel from './compoments/channel'
import CoupleBack from './compoments/couple-back'
export default {
  name: 'homeIndex',
  components: {
    HomeChannel,
    CoupleBack
  },
  data () {
    return {
      list: [],
      loading: false, // 加载状态
      finished: false, // 是否完成加载

      pullLoading: false, // 下拉状态
      activeChannelIndex: 0, // 选中频道
      channels: [], // 频道数据
      isChannelShow: false, // 频道弹出层
      isBackShow: false, // 反馈弹出层
      currentArticle: null// 操作当前文章
    }
  },
  computed: {
    // activeChannel () {
    //   return this.channels[this.activeChannelIndex]
    // },
    // 练习
    activeChannel: {
      get () {
        return this.channels[this.activeChannelIndex]
      },
      set (val) {
        this.channels[this.activeChannelIndex] = val
      }
    }
    // activeChannelArticles () {
    //   return this.channels[this.activeChannelIndex].articles
    // }//无法获取初始状态里面时无数据的得不到articles
  },
  watch: {
    // 监视容器中user变化,重新加载列表频道不能使用缓存的
    // 只要是this的就能被监视
    async '$store.state.user' () {
      await this.loadChannel()
      // 开启加载状态，触发加载事件
      this.activeChannel.loading = true
      this.onLoad()
    }
  },
  async created () {
    await this.loadChannel()
  },
  methods: {
    // 获取频道
    async loadChannel () {
      try {
        let channels = []
        const { user } = this.$store.state
        // 判断是否登录
        if (user) {
          channels = (await getUserChannel()).channels
        } else {
          const localChannels = JSON.parse(window.localStorage.getItem('channels'))
          // 判断本地是否有频道数据
          if (localChannels) {
            channels = localChannels
          } else {
            channels = (await getUserChannel()).channels
          }
        }

        // 对频道中的数据进行统一处理
        channels.forEach(item => {
          item.articles = []
          item.timestamp = Date.now()
          item.finished = false // 该频道的上拉加载是否完成
          item.loading = false // 控制该频道的上拉刷新状态
          item.pullLoading = false // 控制频道的下拉刷新状态
          item.pullSuccessText = '' // 控制该频道下拉刷新成功提示文字
        })
        this.channels = channels
      } catch (err) {
        console.log(err)
      }
    },
    // 获取文章列表
    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId,
        timestamp,
        withTop: 1
      })
      // console.log(data)
      if (data.pre_timestamp && data.results.length === 0) {
        // 将最近的推荐数据请求的时间戳更新到频道中
        this.activeChannel.timestamp = data.pre_timestamp
        return this.loadArticles()
      }
      if (data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        return data.results
      }
    },
    async onLoad () {
      // 异步更新数据
      // const articles =  (await this.loadArticles())
      // console.log(articles)
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.channels.articles.push(articles.length + 1);
      //   }
      //   // 加载状态结束
      //   this.loading = false;

      //   // 数据全部加载完成
      //   if (this.channels.articles.length >= 40) {
      //     this.channels.finished = true;
      //   }
      // }, 1000);

      // 自设定时器
      // onload开始会自动调用一次，当请求数据不够一屏幕时会自己再次调用
      await this.$sleep(800)

      const articles = await this.loadArticles()

      // 将请求得到的数据放入频道文章列表中
      this.activeChannel.articles.push(...articles)

      // 数据加载好以后，让 loading 结束
      this.activeChannel.loading = false
    },
    // 下拉加载新数据
    async  onRefresh () {
      const { id: channelId } = this.activeChannel
      const data = await getArticles({
        channelId: channelId,
        // timestamp:'1556789000004',
        timestamp: Date.now(),
        withTop: 1
      })
      if (data.results.length) {
        this.activeChannel.articles.unshift(...data.results)
        this.activeChannel.pullSuccessText = '更新完成'
      } else {
        this.activeChannel.pullSuccessText = '没有可更新的新闻'
      }
      this.activeChannel.pullLoading = false
    },
    handleMoreAction (item) {
      // console.log(item.art_id,item.art_id.toString())
      this.currentArticle = item
      this.isBackShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.channel_tabs {
  margin-bottom: 100px;
}

// // 深度处理
.channel_tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}
.channel_tabs /deep/ .van-tabs__content {
  margin-top: 92px;
}
// 频道图标样式
.channel_tabs .wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  opacity: .6;

}
.close{
  float: right;
}
</style>
