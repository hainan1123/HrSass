<!-- import导入 -->
<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  data() {
    return {
      type: this.$route.query.type
    }
  },
  methods: {
    async success({ header, results }) {
      console.log(header)
      // header中的数据，是中文 results中的数据也是中文
      // 新增员工的属性是一致的
      if (this.type === 'user') {
        const userRelations = {
          入职日期: 'timeOfEntry',
          手机号: 'mobile',
          姓名: 'username',
          转正日期: 'correctionTime',
          工号: 'workNumber'
        }
        // 将上传的excel中的中文key转成英文传给后端接口
        var arr = []
        results.forEach((item) => {
          const userInfo = {}
          // item ==>excel {姓名：xxx..入职事件：xxx}[姓名，入职时间。。。]
          Object.keys(item).forEach((key) => {
            // 如果是表格里有日期，需要调用日期格式化方法转换格式
            if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
              userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
              return
            } else {
              userInfo[userRelations[key]] = item[key] // 将原来中文对应的值，赋值给原来英文对应的值
            }
          })
          arr.push(userInfo)
        })
        // 将上传的excel传给后端
        await importEmployee(arr)
        this.$message.success('批量导入成功')
      }
      this.$router.back() // 跳回员工页
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
  }
}
</script>

<style></style>
