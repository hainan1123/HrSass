import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router'
// 状态
// 用户的数据
export default {
  namespaced: true,
  state: {
    // token 持久化，除了存储到vueX中还要做数据持久化
    // 每次刷新页面的时候，都应该从本地存储中取值，如果没有值，再去设置为空
    token: getToken() || '', // 设置token为共享状态，初始化vueX的时候，就先从缓存中读取
    // 存储登录用户的信息，之所以设置为空对象，目的是在getters的时候防止报错
    userinfo: {}
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token // 将数据设置给vueX
      // 同步给缓存
      setToken(token)
    },
    REMOVE_TOKEN(state) {
      state.token = null // 将vueX的数据置空
      // 先清除 vueX 再清除本地缓存 vueX和 缓存数据的同步
      removeToken()
    },
    // 给userinfo进行赋值 --result需要一个值
    SET_USER_INFO(state, result) {
      state.userinfo = result
    },
    REMOVE_USER_INFO(state) {
      state.userinfo = {}
    }
  },

  actions: {
    // 获取token
    async login(context, data) {
      // 调用api的接口（拿到token）
      const res = await login(data)
      // 能执行到这步，已经登录成功,成功之后把token传给mutation存起来再发个state
      // async 标记的是一个promise对象
      context.commit('SET_TOKEN', res) // 设置token
      // 拿到token说明登陆成功存时间戳
      setTimeStamp() // 设置当前的时间戳
    },
    // 获取用户基本资料
    async getUserInfo(context) {
      // 获取返回值
      const result = await getUserInfo()
      // 获取员工的详情 用户的详情数据
      const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
      const obj = { ...result, ...baseInfo } // 将两个接口结果合并
      // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
      context.commit('SET_USER_INFO', obj) // 将整个的个人信息设置到用户的vueX数据中
      return result
    },
    // 登出功能，删除token，清除cookie，清除用户信息
    logout(context) {
      // 删除token
      context.commit('REMOVE_TOKEN')
      // 删除用户资料
      context.commit('REMOVE_USER_INFO')
      // 重置路由
      resetRouter()
      // user模块下调用permission里的方法
      // mutations名称 载荷 payload 第三个参数 {root：true} 调用根级的mutations或者action
      context.commit('permission/SET_ROUTES', [], { root: true })
      // 去设置权限模块下路由为初始状态
      // 在没加锁的情况下随意调用，不加命名空间的情况下 所有的mutations和action都是挂在全局上 所以可以直接调用
      // 加了命名空间的context指的不是全局的context
    }
  }
}
