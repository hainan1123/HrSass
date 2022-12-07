<template>
  <!-- 放置弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="cancelBtn">
    <!-- 表单数据 -->
    <!-- 表单校验的4个 必备条件
          1，el-form配置：model和：rules属性
          2，el-form-item配置prop属性
          3，表单input进行v-model 双向数据绑定-->
    <el-form
      ref="deptForm"
      :model="FormData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item prop="name" label="部门名称">
        <el-input
          v-model="FormData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input
          v-model="FormData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select
          v-model="FormData.manager"
          style="width: 80%"
          placeholder="1-50个字符"
          @focus="getEmployees"
        >
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option
            v-for="item in people"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input
          v-model="FormData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="cancelBtn">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    // 父组件传给子组件控制显示隐藏
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },

  data() {
    // data 的函数体
    // 检查部门名称是否重复

    const checkNameRepeat = async (rule, value, callback) => {
      // value 是部门的名称 要去和同级部门下的部门去比较 有没有相同的 相同不通过/不相同通过
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点

      const isRepeat = depts
        .filter((item) => item.pid === this.treeNode.id)
        .some((item) => item.name === value)
      console.log(isRepeat)
      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback()
    }
    // 检查编码是否相同
    // 历史数据可能没有code 所以这里加一个强制性的条件 value 不能为空
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      const isRepeat = depts.some((item) => {
        item.code === value && value
      })
      console.log(isRepeat)
      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback()
    }
    return {
      FormData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 接收获取员工简单列表的数据
      people: [],
      // 校验规则 {key:[{}]}
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      }
    }
  },
  computed: {
    // 计算属性动态更改标题
    showTitle() {
      return this.FormData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    // 发给父组件关闭请求并清空重置数据和表单
    cancelBtn() {
      // 重置校验字段（只能重置表单上的数据）（resetFields是element提供的）
      this.FormData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      this.$refs.deptForm.resetFields()
    },
    // 下拉框获取员工姓名
    async getEmployees() {
      // 获取员工简单列表数据
      this.people = await getEmployeeSimple()
    },
    // 点击确定整体校验
    btnOk() {
      // 点击触发

      this.$refs.deptForm.validate(async (isOk) => {
        if (isOk) {
          // 校验完成调用接口把新增的数据传给后端
          await addDepartments({ ...this.FormData, pid: this.treeNode.id })
          // 告诉父组件添加
          this.$emit('addDept')
          // 点击确定修改showDialog的值控制关闭
          this.$emit('update:showDialog', false)
          this.$message.success('添加成功')
        }
      })
    },
    // 点击编辑调部门编辑接口
    async getDepartDetail(id) {
      // 会写
      this.FormData = await getDepartDetail(id)
    }
  }
}
</script>

<style></style>
