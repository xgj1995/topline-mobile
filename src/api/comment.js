import request from '@/utils/request'
// 获取评论或回复
export const getComments = ({ isArticle, sourceId, offset, limit }) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params: {
      type: isArticle ? 'a' : 'c',
      source: sourceId,
      offset,
      limit
    }
  })
}
// 对评论点赞
export const likings = (id) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target: id
    }
  })
}
// 取消对评论点赞
export const disLikings = (id) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${id}`
  })
}
// 评论文章
export const addComment = ({ content, target, articleId }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data: {
      content,
      target,
      art_id: articleId
    }
  })
}
