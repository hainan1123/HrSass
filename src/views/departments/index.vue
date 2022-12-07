<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>组织架构</h2>
      <!-- 组织架构头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 el-row是行 align='middle'纵向居中-->
        <TreeTools
          :tree-node="company"
          :is-root="true"
          @addDept="addDept"
        ></TreeTools>
        <!-- 树型组件 -->
        <!--
          常用参数
          data 树型组件展示需要用到的数据
          props 设置的是树型组件展示数距到时候参考的对象字段
        -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容  会循环多次，有多少节点 就循环多少次-->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- slot-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <!-- @addDept="addDept" 父组件接受，子组件点击添加就需要弹层 -->
          <TreeTools
            slot-scope="{ data }"
            :tree-node="data"
            @editDept="editDept"
            @del-dept="del"
            @addDept="addDept"
          ></TreeTools>
        </el-tree>
      </el-card>
    </div>
    <!-- 弹层 -->
    <!--:show-dialog="showDialog" 给子组件传控制弹层的值  -->
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDept="getDepartments"
    ></add-dept>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'

import { getDepartments, delDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      showDialog: false, // 控制弹层的显示
      node: null, // 记录当前点击的节点
      defaultProps: {
        label: 'name'
      }
    }
  },
  // 我们随时可能碰到重新请求数据的请求，放在钩子函数来不能重新请求数据除非组件销毁
  created() {
    this.getDepartments()
  },
  methods: {
    // 请求组织架构数据
    async getDepartments() {
      const result = await getDepartments()
      // console.log(result)
      this.company = {
        name: result.companyName,
        manager: result.companyManage,
        id: ''
      }
      this.departs = tranListToTreeData(result.depts, '')
    },
    async del(id) {
      try {
        // 给服务器发删除请求（携带id告诉后端删的是哪个）
        await delDepartments(id)
        // 重新调接口渲染
        this.getDepartments()
        // 提示用户删除成功
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 添加显示弹层并把点击的部门存起来
    addDept(node) {
      this.showDialog = true // 点击添加显示弹层
      // 因为node是当前的点击的部门，此时这个部门应该记录下来
      this.node = node
    },
    // 点击编辑弹层弹出
    editDept(node) {
      // 打开弹层
      this.showDialog = true
      // 赋值操作节点
      this.node = node
      // 我们需要在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
