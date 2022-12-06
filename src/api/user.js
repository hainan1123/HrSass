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
 *获取用户基本资料接口
 *
 * **/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/**
 *获取员工的基本信息(为了显示头像)
 *method默认类型就是get(token已经注入)
 * @export
 */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {}
