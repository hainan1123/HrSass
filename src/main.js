import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets 解决标签在不同浏览器当中显示的差异性

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n饿了么语言包

import '@/styles/index.scss' // global 全局css

import App from './App'
import store from './store'
import router from './router'
// 整体注册通用性组件
import Component from '@/components'
Vue.use(Component) // 注册自己的插件
// 过滤器(遍历所有的导出的指令对象)
import * as filters from '@/filters'
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

import '@/icons' // icon
import '@/permission' // permission control路由守卫
// 批量注册自定义指令 以directives传入对象的方式
import * as directives from '@/directives' // 引入所有的自定义指令
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
// console.log(Object.keys(directives)) 所有自定义指令的keys
Object.keys(directives).forEach((key) => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
