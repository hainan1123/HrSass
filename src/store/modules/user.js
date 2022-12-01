import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 状态
// 用户的数据
export default {
  namespaced: true,
  state: {
    // token 持久化，除了存储到vueX中还要做数据持久化
    // 每次刷新页面的时候，都应该从本地存储中取值，如果没有值，再去设置为空
    token: getToken() || '' // 设置token为共享状态，初始化vueX的时候，就先从缓存中读取
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
    }
  },

  actions: {
    async login(context, data) {
      // 调用api的接口
      const res = await login(data)
      if (res.data.success) {
        // 如果为true，表示登录成功,成功之后把token传给mutation存起来再发个state
        context.commit('SET_TOKEN', res.data.data)
      }
    }
  }
}
