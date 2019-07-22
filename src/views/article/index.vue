<template>
    <div class='article-warp'>
       <van-nav-bar
        title="文章"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"
        />
        <AuthInfor
        class="auth-info"
        :article="article"
        />
        <div v-html="article.content"></div>
        <MoreAction :article='article' />
        <CommentList
        :source='articleId'
        @is-replaylist-show='handleIsReplayListShow'/>

         <ReplyList
         v-model="isReplayListShow"
         :comment-id="commentId"
         :article-id='articleId'
         />
         <WriteComment
         :target='articleId'/>
    </div>
</template>

<script>
import AuthInfor from './components/auth-info'
import CommentList from './components/comment-list'
import MoreAction from './components/more-action'
import ReplyList from './components/reply-list'
import WriteComment from './components/write-comment'
import { getArticleDetail } from '@/api/article'
export default {
  name: 'articles',
  components: {
    AuthInfor,
    CommentList,
    MoreAction,
    ReplyList,
    WriteComment
  },
  data () {
    return {
      article: {},
      isReplayListShow: false,
      commentId: null// 评论id
    }
  },
  created () {
    this.loadArticleDetail()
  },
  deactivated () {
    this.$destroy()
    // this.article = {}
  },

  provide: function () {
    return {
      articleId: this.$route.params.articleId
    }
  },
  computed: {
    articleId () {
      return this.$route.params.articleId.toString()
    }
  },
  methods: {
    async loadArticleDetail () {
      // console.log(articleId)
      const data = await getArticleDetail(this.articleId)
      this.article = data
      console.log(data)
    },
    handleIsReplayListShow (id) {
      this.isReplayListShow = true
      this.commentId = id
    }
  }
}
</script>

<style lang="less" scoped>
.article-warp{
    padding: 20px;
    .auth-info{
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 99;
}

}
</style>
