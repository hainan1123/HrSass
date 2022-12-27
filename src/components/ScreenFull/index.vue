<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon
      icon-class="fullscreen"
      style="color: #fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>
</template>

<script>
// import ScreenFull from 'screenfull'
export default {
  methods: {
    changeScreen() {
      // if (!ScreenFull.isEnabled) {
      //   this.$message.success('此时全屏组件不可用')
      //   return
      // }
      document.documentElement.requestFullscreen() // 原生js调用
      //   如果可用 就可以全屏
      // ScreenFull.request() // 全屏方法，也可以退出全屏
    }
  }
}
</script>

<style></style>
