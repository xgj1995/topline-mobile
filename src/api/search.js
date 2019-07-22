import request from '@/utils/request'

// 获取联想
export const getSuggestion = (key) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q: key
    }
  })
}
// 获取搜索结果
export const getSearchResult = ({ page, perPage, q }) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}
