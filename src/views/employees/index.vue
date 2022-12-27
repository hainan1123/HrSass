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
          <el-button size="small" type="warning" @click="$router.push('/import')"
            >excel导入</el-button
          >
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 sortable排序 -->
      <el-card>
        <el-table border :data="list">
          <!-- 表格中如何显示序号 -->
          <el-table-column align="center" type="index" label="序号" sortable="" />
          <el-table-column width="120px" label="头像" align="center">
            <template v-slot="{ row }">
              <img
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              />
            </template>
          </el-table-column>
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
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
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
    <!-- 放置组件弹层 -->
    <add-employee :show-dialog.sync="showDialog"></add-employee>
    <!-- 二维码 -->
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      @opened="showQrCode"
      @close="imgUrl = ''"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 放置分配角色组件 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import AddEmployee from './component/add-employee.vue'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举数据
import QrCode from 'qrcode'
import AssignRole from './component/assign-role.vue'
// 引入过滤器
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      userId: '',
      showRoleDialog: false, // 分配角色
      showCodeDialog: false,
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
    },
    // 导出excel
    exportData() {
      const headers = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async (excel) => {
        // 调接口
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // 带英文keys的数据
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })
        // 获取所有的数据

        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
      })
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{username:'张三'}，{}，{}] =>[['张三'],[],[]]
      return rows.map((item) => {
        // item是对象  => 转化成只有值的数组 => 数组值的顺序依赖headers  {username: '张三'  }
        return Object.keys(headers).map((key) => {
          // Object.keys(headers)  => ["姓名", "手机号",...]
          // 判断字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return this.formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 根据枚举查找，区分出正式非正式
            const en = EmployeeEnum.hireType.find((obj) => obj.id === item[headers[key]])

            return en ? en.value : '未知'
          }

          return item[headers[key]] //
          // 得到 ['张三'，’129‘，’dd‘,'dd']
        })
      })
    },
    // 二维码
    showQrCode(url) {
      // url存在才弹出层
      if (url) {
        this.showCodeDialog = true
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 角色
    async editRole(id) {
      this.userId = id
      // 异步的需加await 数据请求到了才显示弹层
      await this.$refs.assignRole.getUserDetailById(id) // 子组件调用父组件方法
      this.showRoleDialog = true
    }
  },

  // 当excel中有日期格式的时候，实际转化的值为一个数字，我们需要一个方法进行转化
  formatDate(numb, format) {
    const time = new Date((numb - 1) * 24 * 3600000 + 1)
    time.setYear(time.getFullYear() - 70)
    const year = time.getFullYear() + ''
    const month = time.getMonth() + 1 + ''
    const date = time.getDate() - 1 + ''
    if (format && format.length === 1) {
      return year + format + month + format + date
    }
    return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
  }
  // 点击头像弹二维码
}
</script>

<style></style>
