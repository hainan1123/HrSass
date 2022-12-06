<template>
  <!-- 放置弹层 -->
  <el-dialog title="新增部门" :visible="showDialog" @close="cancelBtn">
    <!-- TODO -->
    <!-- 表单数据 -->
    <el-form label-width="120px">
      <el-form-item label="部门名称">
        <el-input style="width: 80%" placeholder="1-50个字符"></el-input>
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input style="width: 80%" placeholder="1-50个字符"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-input style="width: 80%" placeholder="1-50个字符"></el-input>
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input style="width: 80%" placeholder="1-300个字符" type="textarea" :rows="3"></el-input>
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small" @click="cancelBtn">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 父组件传给子组件控制显示隐藏
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 发给父组件关闭请求
    cancelBtn() {
      this.$emit('close')
    }
  }
}
</script>

<style></style>
