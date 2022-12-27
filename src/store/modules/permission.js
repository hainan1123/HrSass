// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router'

export default {
  namespaced: true,
  // 一开始 肯定拥有静态路由的权限
  // 路由表 当前用户所拥有的所有路由的数组
  state() {
    return {
      routes: constantRoutes // 所有人默认拥有静态路由
    }
  },
  mutations: {
    // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
    SET_ROUTES(state, newRouter) {
      // 动态路由和静态路由合并
      // 下面这么写不对 不是语法不对 是业务不对
      // state.routes = [...state.routes, ...newRoutes]
      // 有一种情况  张三 登录 获取了动态路由 追加到路由上  李四登录 4个动态路由
      // 应该是每次更新 都应该在静态路由的基础上进行追加
      state.routes = [...constantRoutes, ...newRouter]
    }
  },
  actions: {
    // 筛选权限路由actions
    // 第二个参数是当前用户的所拥有的菜单权限
    // menus 登陆时，获取的用户信息中携带的数组数据，里面存储的就是当前登录用户可以访问的菜单权限标识
    filterRoutes(context, menus) {
      const routes = [] // 用来存储过滤之后的数组
      // 筛选出 动态路由中和menus中能够对上的路由
      menus.forEach((key) => {
        // key 是标识
        // asyncRoutes 找 有没有对象中的name属性等于key的 如果找不到就没权限 如果找到了 要筛选出来
        routes.push(...asyncRoutes.filter((item) => item.name === key)) // 得到一个数组 有可能 有元素 也有可能是空数组
      })
      // 得到的routes是所有模块中满足权限要求的路由数组
      // routes就是当前用户所拥有的 动态路由的权限
      context.commit('SET_ROUTES', routes) // 将动态路由提交给mutations
      return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
    }
  }
}
