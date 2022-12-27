<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- 多选框组 -->
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <!-- 要显示 角色名称 储存 角色id label表示要储存的值 -->

    <!-- 分配角色 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- 定义footer插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting' // 获取角色列表
import { getUserDetailById } from '@/api/user' // 获取当前员工的角色
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 储存当前所有的角色id
      roleIds: [] // 储存当前用户拥有的角色id
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有的角色
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 }) // 默认支取

      this.list = rows
    },
    // 获取当前员工的角色
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOk() {
      // 给员工分配角色
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 关闭弹层
      this.$emit('update:showRoleDialog', false)
      this.$message.success('分配角色成功')
    },
    btnCancel() {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
