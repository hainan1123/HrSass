// 管理所有的自定义指令

export const imageerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // dom对应el，options对应的是binging
    // dom 表示当前指令作用的dom对象
    // dom 认为此时就是img
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    // 在JS原生语法中，onerror这个时间的触发时机，是资源加载失败
    //   图片异常的逻辑
    //  监听img标签的错误事件  因为图片加载失败 会触发  onerror事件
    dom.src = dom.src || options.value // 初始化是时候 如果有值 则赋值 如果没值 则需要进行默认值赋值
    dom.onerror = function () {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value
    }
  },
  // 该函数是一个钩子函数
  componentUpdated(dom, options) {
    // 该钩子函数会在当前指令作用的组件 更新数据完毕之后 执行
    // inserted 只会执行一次
    // 组件初始化 一旦更新就会再进入 inserted函数 会进去 componentUpdated
    dom.src = dom.src || options.value
  }
}
