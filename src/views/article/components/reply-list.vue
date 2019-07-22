<template>
    <div>
        <van-popup
        :value='value'
        @input="$emit('input',$event)"
        position="bottom"
        :style="{ height: '95%' }"
        >
        <comment-list
        v-if='value'
        ref="comment-list"
        :source='commentId'
        :isArticle='false'
        ></comment-list>
        <write-comment
        :target='commentId'
        :articleId='articleId'
        />
        </van-popup>
    </div>
</template>

<script>
import CommentList from './comment-list'
import WriteComment from './write-comment'
export default {
  name: 'ReplyList',
  components: {
    CommentList,
    WriteComment
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    commentId: {
      type: [Number, String]
    },
    articleId: {
      type: [Number, String]
    }
  }
}
</script>

<style>

</style>
