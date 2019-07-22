<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    position="bottom"
    get-container="body"
    :style="{height: '95%'}"
  >
    <!-- 我的频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
            <div>
            <van-button
            type="danger"
            plain
            size="mini"
            @click=" isEdit = !isEdit"
          >{{ isEdit?'完成':'编辑'}}</van-button>
         </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
                <van-grid-item
                v-for="(item,index) in userChannels"
                :key="item.id"
                @click="handelUserStatus(item,index)"
                >
                <span
                class="text"
                :class="{ active: index === activeIndex && !isEdit }"
                >
                {{item.name}}
                </span>
                <van-icon class="close-icon" v-show="isEdit" name="close" />
                </van-grid-item >
        </van-grid>
    </div>
    <!-- 我的频道 -->
    <!-- 推荐频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
         v-for="item in recommendChannels"
          :key="item.id"
          @click="handleAddChannel(item)"
        >
        <span class="text"> {{item.name}} </span>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 推荐频道 -->
  </van-popup>
</template>

<script>
import { getAllChannels, updateUserChannel, deleteUserChannel } from '@/api/channel'
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    //   推荐的频道数据
    // 计算属性也有watch功能发现userChannels变化会重新计算执行
    recommendChannels () {
      //   遍历出y用户频道的所有的id
      const duolicate = this.userChannels.map(item => item.id)
      return this.allChannels.filter(item => !duolicate.includes(item.id))
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { channels } = await getAllChannels()
        //    将添加的频道数据格式要处理
        channels.forEach(item => {
          item.articles = [] // 频道的文章
          item.timestamp = Date.now() // 用于下一页频道数据的时间戳
          item.finished = false // 控制该频道上拉加载是否已加载完毕
          item.loading = false // 控制该频道的下拉刷新 loading
          item.pullLoading = false // 控制频道列表的下拉刷新状态
          item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
        })
        this.allChannels = channels
      } catch (err) {
        console.log(err)
      }
    },
    async handleAddChannel (item) {
    //    不要修改父组件传来的数据，通过事件发给父组件让父组件自己去修改
      const channels = this.userChannels.slice(0)
      channels.push(item)
      console.log(channels)
      this.$emit('update:user-channels', channels)
      const { user } = this.$store.state
      //  不是登录状态
      if (user) {
        await updateUserChannel([{
          id: item.id,
          seq: channels.length - 1
        }])
      } else {
        window.localStorage.setItem('channels', JSON.stringify(channels))
      }
    },
    // 修改用户频道
    async handelUserStatus (item, index) {
      // 判断是否为删除
      if (!this.isEdit) {
        this.$emit('update:active-index', index)
        // 关闭弹出层
        this.$emit('input', false)
      } else {
        // 是编辑状态
        const channels = this.userChannels.slice(0)
        channels.splice(index, 1)

        this.$emit('update:user-channels', channels)
        // 判断是否登录
        const { user } = this.$store.state
        if (user) {
          await deleteUserChannel(item.id)
        } else {
          // 数据存贮到本地
          window.localStorage.setItem('channels', JSON.stringify(channels))
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
    .channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
    .action {}
  }
  .channel-content {
    .text {
      font-size: 24px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 40px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
