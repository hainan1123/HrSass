// 多语言实例化文件

// 指的是当前的语言包
import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的包
import Cookie from 'js-cookie' // 引入cookie包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包
Vue.use(VueI18n) // 全局注册国际化包
export default new VueI18n({
  // locale 决定当前的多语言类型 假设要切换多语言 只需要设置该属性就可以了
  locale: Cookie.get('language') || 'zh', // 指的是当前的多语言类型 随意定义的字符串 中文 zh/英文 en
  messages: {
    en: {
      ...elementEN, // 将饿了么的英文语言包引入
      ...customEN
    },
    zh: {
      ...elementZH, // 将饿了么的中文语言包引入
      ...customZH
    }
  }
})
