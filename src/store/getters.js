// 快捷访问this.$store.getters.device就访问到了
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token, // 建立token的快捷访问
  name: (state) => state.user.userinfo.username,
  userId: (state) => state.user.userinfo.userId
}
export default getters
