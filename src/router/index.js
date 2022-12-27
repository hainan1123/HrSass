import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 引入多个模块的规则
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'
import user from './modules/user'
/* Layout */
import Layout from '@/layout'
// 静态路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 首页当做一个容器
  {
    path: '/',
    component: Layout,
    // 重定向到首页
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        // name: '首页',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),

        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  // 导入excel页面
  {
    path: '/import',
    component: Layout,
    hidden: true, // 隐藏在左侧菜单中
    children: [
      {
        path: '', // 二级路由path什么都不写 表示二级默认路由

        component: () => import('@/views/import')
      }
    ]
  },
  user,
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

// 动态路由
export const asyncRoutes = [
  approvalsRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  attendancesRouter,
  salarysRouter,
  settingRouter,
  socialRouter
]
const createRouter = () =>
  new Router({
    mode: 'history', // require service support(需要后端支持)
    base: '/hr/', // 配置项目的基础地址
    scrollBehavior: () => ({ y: 0 }), // 管理滚动行为 如果出现滚动 切换就让 让页面回到顶部
    routes: [...constantRoutes] // 静态路由和动态路由的临时合并 两个数组合并concat或者展开运算符...
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由的方法
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router重新设置路由的可匹配路径
}

export default router
