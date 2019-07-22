<template>
    <div class="action">
        <van-button
        icon="star-o"
        class="btn"
        round
        :loading='isLikeLoading'
        :disabled="isLikeLoading"
        :type="isLike?'danger':'default'"
        @click="handleLike"
        >{{isLike?'取消点赞':'点赞'}}</van-button>
        <van-button
        icon="delete"
        class="btn"
        round
        :disabled="isDislikeLoading"
        :loading='isDislikeLoading'
        :type="isDislike?'danger':'default'"
        @click="handleDislike"
        >{{isDislike?'取消不喜欢':'不喜欢'}}
        </van-button>
    </div>
</template>

<script>
import { likeArticle, unLikeArticle, dislikeArticle, unDislikeArticle } from '@/api/article'
export default {
  name: 'MoreAction',
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    isLike () {
      return this.article.attitude === 1
    },
    isDislike () {
      return this.article.attitude === 0
    }
  },
  data () {
    return {
      isLikeLoading: false,
      isDislikeLoading: false
    }
  },
  methods: {
    // 手动点赞
    async  handleLike () {
      const articleId = this.article.art_id.toString()
      //   console.log(articleId)
      try {
        this.isLikeLoading = true
        if (this.isLike) {
          // 取消点赞
          await unLikeArticle(articleId)
          // 不刷新手动更改
          this.article.attitude = -1
        } else {
          // 点赞
          await likeArticle(articleId)
          this.article.attitude = 1
        }
      } catch (err) {
        if (err.response.status === 401) {
          this.$checkLogin()
        }
      }

      this.isLikeLoading = false
    },
    // 手动喜欢不喜欢
    async handleDislike () {
      const articleId = this.article.art_id.toString()
      try {
        this.isDislikeLoading = true
        if (this.isDislike) {
          // 取消不喜欢
          await unDislikeArticle(articleId)
          // 不刷新手动更改
          this.article.attitude = -1
        } else {
          // 不喜欢
          await dislikeArticle(articleId)
          this.article.attitude = 0
        }
      } catch (err) {
        if (err.response.status === 401) {
          this.$checkLogin()
        }
      }
      this.isDislikeLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
    .action {
        display: flex;
        justify-content: space-around;
    }

</style>
