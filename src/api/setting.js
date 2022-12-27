import request from '@/utils/request'
/**
 * 获取所有角色列表
 * **/
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
/**
 * 获取公司信息的接口
 *
 * **/
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
/**
 * 删除角色的接口
 * **/
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
/** *
 * 修改角色
 * ***/
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
/** *
 * 新增角色
 * ***/
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
