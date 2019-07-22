<template>
    <van-dialog
  :value='value'
  @input="$emit('input',$event)"
  show-cancel-button
  :showConfirmButton='false'
  :showCancelButton='false'
  closeOnClickOverlay
>
    <van-cell-group v-if="isShow">
      <van-cell value="不感兴趣" icon="close" @click="handleDislike" />
      <van-cell value="反馈垃圾内容" is-link @click="isShow = false" icon="warning-o"/>
      <van-cell value="拉黑作者" icon="delete" @click="handleAddBlacklist" />
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isShow = true" />
      <van-cell
      v-for='item in content'
      :key='item.id'
      :value="item.title"
      @click="handleReportArticle(item)"
      />
    </van-cell-group>
</van-dialog>
</template>

<script>
import { dislikeArticle, reportArticle } from '@/api/article'
import { addBlacklist } from '@/api/user'
export default {
  name: 'coupleBack',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selectArticle: {
      type: Object
    },
    userArticles: {
      type: Object
    }// 用户所选频道
  },
  data () {
    return {
      isShow: true,
      content: [
        { title: '标题夸张', id: 1 },
        { title: '低俗色情', id: 2 },
        { title: '错别字多', id: 3 },
        { title: '旧闻重复', id: 4 },
        { title: '其他问题', id: 0 }
      ]
    }
  },
  methods: {
    // 不喜欢该文章
    async handleDislike () {
      try {
        const id = this.selectArticle.art_id.toString()
        const res = await dislikeArticle(id)
        console.log(res)
        this.$toast.success('操作成功')
        this.$emit('input', false)
        // 页面客户端删除该文章
        const channels = {}
        Object.assign(channels, this.userArticles)
        const articles = channels.articles
        const delIndex = articles.findIndex(item => item.art_id.toString() === id)
        articles.splice(delIndex, 1)
        this.$emit('update:user-articles', channels)
      } catch (err) {
        if (err.response.status === 401) {
          this.$checkLogin()
        }
      }
    },
    // 拉黑作者
    async handleAddBlacklist () {
      try {
        const id = this.selectArticle.aut_id
        await addBlacklist(id)
        this.$toast.success('拉黑成功')
        this.$emit('input', false)
      } catch (err) {
        console.log(err)
        if (err.response.status === 401) {
          this.$checkLogin()
        }
      }
    },
    // 举报文章
    async handleReportArticle (item) {
      try {
        const articleId = this.selectArticle.art_id.toString()
        const title = item.id
        const res = await reportArticle({ articleId, title })
        console.log(res)
        this.$toast.success('举报成功')
        this.isShow = true
        this.$emit('input', false)
      } catch (err) {
        if (err.response.status === 409) {
          this.$toast.fail('文章已被举报')
        }
        if (err.response.status === 401) {
          this.$checkLogin()
        }
      }
    }
  }

}
</script>

<style scoped>

</style>
