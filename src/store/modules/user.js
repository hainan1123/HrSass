import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
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
    },
    // 获取用户信息
    async getUserInfo(context) {
      // 获取返回值
      const result = await getUserInfo()
      context.commit('SET_USER_INFO', result) // 将整个的个人信息设置到用户的vueX数据中
      return result
    }
  }
}
