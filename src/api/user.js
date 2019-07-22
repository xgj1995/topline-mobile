import request from '@/utils/request'
// 登录
export const login = ({ mobile, code }) => request({
  method: 'POST',
  url: '/app/v1_0/authorizations',
  data: {
    mobile,
    code
  }
})
// 拉黑作者
export const addBlacklist = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/blacklists',
    data: {
      target: userId
    }
  })
}
// 关注用户
export const focusUser = userId => {
  return request({
    method: 'POST',
    url: 'app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}
// 取消关注用户
export const unFocusUser = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`,
    data: {
      target: userId
    }
  })
}
// 获取用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}
// 获取用户个人资料
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}
// 编辑个人资料
export const editUserProfile = ({
  name = null,
  photo = null,
  gender = null,
  birthday = null,
  realName = null,
  idNumber = null,
  idCardFront = null,
  idCardBack = null,
  idCardHandheld = null,
  intro = null
}) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data: {
      name,
      photo,
      gender,
      birthday,
      realName,
      idNumber,
      idCardFront,
      idCardBack,
      idCardHandheld,
      intro
    }
  })
}
// 上传用户图片
export const editUserPhoto = formData => {
  return request({
    method: 'PATCH',
    url: `/app/v1_0/user/photo`,
    data: formData
  })
}
