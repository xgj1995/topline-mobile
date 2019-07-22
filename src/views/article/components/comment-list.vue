<template>
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    >
    <van-cell
        v-for="item in comments"
        :key="item.com_id.toString()"
        :title="item"
    >
        <div slot="icon" style="margin-right:10px;">
            <img :src="item.aut_photo" alt="" style="width:30px;border-radius:50%">
        </div>
        <div slot="title">
            <span>{{ item.aut_name }}</span>
        </div>
        <div slot="default">
            <van-button
            :icon="item.is_liking ? 'like' : 'like-o'"
            size="mini"
            round
            @click="handleLike(item)"
            >{{ item.like_count}}</van-button>
        </div>
        <div slot="label">
            <p>
                {{item.content}}
            </p>
            <p>
                <span>{{ item.pubdate |relativeTime }}</span>
                &nbsp;
                &nbsp;
                <span @click="$emit('is-replaylist-show',item.com_id.toString())">回复{{item.reply_count}}</span>
            </p>
        </div>
    </van-cell>
    </van-list>
</template>

<script>
import { getComments, likings, disLikings } from '@/api/comment'
export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String],
      required: true
    },
    isArticle: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      comments: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  created () {
    console.log(this.article)
  },
  methods: {
    // 获取评论
    async onLoad () {
    //   异步更新数据
      this.$sleep(500)
      const data = await getComments({
        isArticle: this.isArticle,
        sourceId: this.source,
        offset: this.offset,
        limit: this.limit
      })
      this.offset = data.last_id// 下一页的起始
      console.log(data)
      this.comments.push(...data.results)
      // 加载状态结束
      this.loading = false

      if (!data.results.length) {
        this.finished = true
      }
    },
    // 手动点赞
    async handleLike (item) {
      try {
        const id = item.com_id.toString()
        console.log(item.is_liking)
        if (item.is_liking) {
          // 取消
          await disLikings(id)
          item.is_liking = false
          console.log(item.is_liking)
        } else {
          await likings(id)
          item.is_liking = true
        }
      } catch (err) {
        if (err.response.status === 401) {
          this.$checkLogin()
        }
      }
    }
  }
}

</script>

<style>

</style>
