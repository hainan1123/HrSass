// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vueX store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
// 路由的前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度条
  //  首先判断有无token
  if (store.getters.token) {
    // 只要有token，才能获取用户资料
    //   如果有token 继续判断是不是去登录页
    if (to.path === '/login') {
      //  表示去的是登录页
      next('/') // 跳到主页 //有token 用处理吗 不用
    } else {
      // 只有放过的时候才去获取用户资料
      // 是每次都获取吗？
      // 如果当前vueX有用户的资料的id表示有资料了 不需要获取了 如果没有id才需要获取
      // 获取用户id --从vueX中user模块内的userInfo对象里获取userID
      if (!store.getters.userId) {
        // 如果没有拿到id，那么就表示并没有获取到用户信息
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成 同步
        // 筛选用户的可用路由
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
        // actions是做异步操作的
        // console.log('res:', roles)
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes 是筛选完得到的动态路由
        // 动态路由添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // console.log(routes)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表
        // 添加完动态路由之后
        // next(to.path) // 相当于跳到对应的地址 相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
        // 解决的问题是刷新页面 出现404的问题
        if (to.redirectedFrom) {
          router.replace(to.redirectedFrom)
        } else {
          next({ ...to })
        }
      }
      next() // 直接放行
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(function () {
  NProgress.done() // 关闭进度条
})
