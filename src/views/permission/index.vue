<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>权限管理</h2>
      <page-tools>
        <template #after>
          <el-button size="small" type="primary" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <!-- 渲染树型数据的时候必须要指定row.id，指定id为唯一属性的标识 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <!--添加按钮只在 访问权的层级显示 当type === 1时才显示添加按钮  -->
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑权限弹层 -->
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog :title="showText" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 当值为1时激活，值为0时不激活  -->
  </div>
</template>

<script>
import {
  addPermission,
  getPermissionDetail,
  delPermission,
  getPermissionList,
  updatePermission
} from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑特权' : '新增特权'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取权限并渲染（el-table转化成树型必须要加 row-key='id'）
    async getPermissionList() {
      // 转化成树型结构并存起来
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    // 删除
    async delPermission(id) {
      try {
        await this.$confirm('确定删除吗?')
        // 调用删除接口
        await delPermission(id)
        this.$message.success('删除成功')
        // 重新渲染数据
        this.getPermissionList()
      } catch (error) {
        console.log(error)
      }
    },
    // 新增权限
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 确定
    async btnOK() {
      try {
        // 整体校验表单
        await this.$refs.perForm.validate()
        if (this.formData.id) {
          // 有id是编辑
          await updatePermission(this.formData)
          this.$message.success('编辑成功')
        } else {
          // 调用新增接口
          await addPermission(this.formData)
          this.$message.success('新增成功')
        }

        // 重新渲染数据
        this.getPermissionList()
        // 关闭弹层
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 关闭
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      // 关闭校验
      this.$refs.perForm.resetFields()
      // 关闭弹层
      this.showDialog = false
    },
    // 编辑
    async editPermission(id) {
      // 根据id获取详情并回写
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style></style>
