// 快捷访问this.$store.getters.device就访问到了
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token, // 建立token的快捷访问
  name: (state) => state.user.userinfo.username,
  userId: (state) => state.user.userinfo.userId,
  staffPhoto: (state) => state.user.userinfo.staffPhoto, // 建立头像的快捷访问
  companyId: (state) => state.user.userinfo.companyId // 建立公司id的快捷访问
}
export default getters
