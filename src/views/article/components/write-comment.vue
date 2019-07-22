<template>
    <van-cell-group>
        <van-field v-model="content" placeholder="请输入评论">
        <div slot="right-icon">
            <van-button icon="star-o" type='danger' size='mini' round/>
        </div>
        <van-button slot="button" size="small" type="primary" @click.prevent="handleComment">发送</van-button>
        </van-field>
    </van-cell-group>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'WriteComment',
  inject: ['articleId'],
  props: {
    target: {
      type: [Number, String],
      required: true
    }
    // articleId:{
    //     type:[Number,String],
    //     required:true
    // }
  },
  data () {
    return {
      content: ''
    }
  },
  methods: {
    async handleComment () {
      console.log(1)
      try {
        // 对文章评论
        const data = await addComment({
          target: this.target,
          content: this.content,
          articleId: this.articleId
        })
        console.log(data)
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
