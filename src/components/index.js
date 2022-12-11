// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
export default {
  // vue中规定，凡是需要通过Vue.use()注册的插件，都需要具备install方法

  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
  }
}
