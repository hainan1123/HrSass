import request from '@/utils/request'

/**
 * 登录接口
 *@param {object} data 登录需要的数据 data中应该包含mobile 和 password
 *@returns promise
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
/**
 *获取用户基本信息接口
 *
 * **/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function logout() {}
