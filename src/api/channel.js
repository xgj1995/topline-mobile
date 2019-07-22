import request from '@/utils/request'
// 已经登录的携带token
export const getUserChannel = () => request({
  method: 'GET',
  url: '/app/v1_0/user/channels'
})
// 获取所有频道
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
// 添加用户频道
export const updateUserChannel = (channels) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}
// 删除用户频道
export const deleteUserChannel = (channelId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
