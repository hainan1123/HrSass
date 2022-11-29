// 快捷访问this.$store.getters.device就访问到了
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device
}
export default getters
