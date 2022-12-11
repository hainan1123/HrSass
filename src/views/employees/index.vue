<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>员工</h2>
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <!-- 前插槽 显示总记录条数 -->
        <span slot="before">共{{ page.total }}条数据</span>
        <!-- 后插槽 excel导出 导出 新增员工 -->
        <template #after>
          <el-button size="small" type="warning">excel导入</el-button>
          <el-button size="small" type="danger">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 sortable排序 -->
      <el-card>
        <el-table border :data="list">
          <!-- 表格中如何显示序号 -->
          <el-table-column align="center" type="index" label="序号" sortable="" />
          <el-table-column align="center" prop="username" label="姓名" sortable="" />
          <el-table-column align="center" prop="workNumber" label="工号" sortable="" />
          <!-- :formatter="formatEmployment" 重置单元格内容 -->
          <el-table-column
            align="center"
            prop="formOfEmployment"
            sortable=""
            label="聘用形式"
            :formatter="formatEmployment"
          />
          <el-table-column align="center" prop="departmentName" label="部门" sortable="" />
          <el-table-column align="center" prop="timeOfEntry" label="入职时间" sortable="">
            <!-- 作用域插槽加过滤器 -->
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="enableState" label="账户状态" sortable="">
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 弹层 -->
    <add-employee :show-dialog.sync="showDialog"></add-employee>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import AddEmployee from './component/add-employee.vue'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举数据
export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      showDialog: false, // 控制弹层
      list: [], // 接收数据
      page: {
        page: 1, // 当前页码
        size: 20,
        total: 0
      },
      loading: false
    }
  },
  created() {
    this.getEmployeeList() // 获取员工的综合列表数据
  },
  methods: {
    // 获取员工的综合列表数据
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)

      this.list = rows
      this.page.total = total
      this.loading = false
    },
    // newPage 是最新的页码
    changePage(newPage) {
      this.page.page = newPage
      // 重新获取数据
      this.getEmployeeList()
    },
    // 格式化聘用形式ele cellValue是单元格中的值
    formatEmployment(row, column, cellValue, index) {
      // 返回数据为1和2，通过查找枚举数据等于我单元格的值是否相等
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      // 相等就返回正式和非正式 不等就是未知
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style></style>
