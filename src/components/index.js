// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './imageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import lang from './lang'
import TagsView from './TagsView'
export default {
  // vue中规定，凡是需要通过Vue.use()注册的插件，都需要具备install方法

  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.use(Print) // 打印插件
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入excel组件
    Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
    Vue.component('ThemePicker', ThemePicker) // 更好主题组件
    Vue.component('lang', lang) // 切换语言的组件
    Vue.component('TagsView', TagsView)
  }
}
// 注册
