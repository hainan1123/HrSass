<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 50%" placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 50%" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>

      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 50%" placeholder="请选择">
          <!-- 遍历只能遍历数组的数据 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 50%" placeholder="请输入工号" />
      </el-form-item>

      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <!-- 放置一个树型组件 -->
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          default-expand-all=""
          :props="{ label: 'name' }"
          @node-click="selectNode"
        ></el-tree>
      </el-form-item>

      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 v-slot:footer = #footer -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举数据
import { addEmployee } from '@/api/employees'
export default {
  // 父传子的数据
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 枚举数据
      // 表单数据
      treeData: [], // 定义数组接收存储树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取部门数据
    async getDepartments() {
      try {
        // 树型图显示
        this.showTree = true
        this.loading = true
        // dept是数组需要转换成tree格式才能显示
        const { depts } = await getDepartments()
        // 把dept转成树型结构
        this.treeData = tranListToTreeData(depts, '')
        this.loading = false
      } catch (err) {
        console.log(err)
      }
    },
    // tree节点被点击后回调
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async btnOk() {
      try {
        // 1.校验格式
        await this.$refs.formData.validate()
        // 2.如果格式校验通过，就直接调用方法
        await addEmployee(this.formData)
        // 3.重新获取数据 --子组件调用父组件实例的方法(相对的)
        this.$parent.getEmployeeList()
        // 4.提示成功
        this.$message.success('添加成功')
        // 5.关闭弹层
        this.$parent.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // 1.重置表单
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 2.将表单的校验规则重置
      this.$refs.formData.resetFields()
      // 3.sync 关闭弹窗
      // update:showDialog

      this.$emit('update:showDialog', false)
    }
  }
}
</script>
<style></style>
