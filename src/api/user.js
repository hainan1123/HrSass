import request from '@/utils/request'

/**
 * 登录接口
 *@param {object} data 登录需要的数据 data中应该包含mobile 和 password
 *@returns promise
 */
export function login(data) {
  return request({
    url: 'post',
    method: '/sys/login',
    data: data
  })
}

export function getInfo(token) {}

export function logout() {}
