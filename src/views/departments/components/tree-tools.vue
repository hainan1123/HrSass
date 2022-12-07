<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <!-- 左侧 el-col 是列 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 只有一级根的时候，treeNode.manager。其余都有值 -->
        <el-col>{{ treeNode.manager ? treeNode.manager : '负责人' }}</el-col>
        <el-col>
          <!-- 下拉列表 -->
          <el-dropdown @command="operateDept">
            <span>操作<i class="el-icon-arrow-down"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del"> 删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 操作节点调用的方法
    async operateDept(type) {
      if (type === 'add') {
        // 添加子部门的操作 this.treeNode 就是添加当前部门的子部门
        // 为何传出treeNode 因为是添加子部门 需要当前部门的数据需要知道从哪里添加
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        //  编辑部门的操作-触发自定义事件点击谁编辑谁
        this.$emit('editDept', this.treeNode)
      } else {
        //  删除操作
        try {
          await this.$confirm('你确定要删除吗？是否继续', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          // 如果用户点击了确认，那么就会向下执行
          // 发个父组件，让父组件调接口删数据
          console.log(this)
          this.$emit('del-dept', this.treeNode.id)
        } catch (error) {
          console.log('取消了')
        }
      }
    }
  }
}
</script>

<style></style>
