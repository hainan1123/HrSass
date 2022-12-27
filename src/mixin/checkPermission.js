import store from '@/store'
// 做一个混入对象
export default {
  methods: {
    // 混入对象是组件的选项对象
    checkPermission(key) {
      // 去用户的信息里面找 points中有没有key 如果有key 则认为有权限 如果没有key则认为不能点击
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some((item) => item === key)
      }
      return false // 如果没进去说明没权限
    }
  }
}
