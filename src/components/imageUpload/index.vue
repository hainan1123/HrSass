<template>
  <!-- 图像的上传（头像）
        -->
  <!-- 给action一个#号就不会报错了 -->
  <!-- file-list 是上传的文件列表 可以绑定上传组件上，让上传组件来显示 -->
  <!--
    limit 表示一次只能上传一张图片
    action 属性 上传的一些行为
  -->
  <div>
    <!-- on-preview 预览大图，当预览大图的时候就会触发 -->
    <!-- on-remove 删除的时候，会触发 -->
    <!-- on-change 文件上传成功，修改，失败的时候 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-change="changeFile"
      :on-preview="preview"
      :file-list="fileList"
      :class="{ disable: fileComputed }"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 放置进度条 -->
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px"></el-progress>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%; max-height: 400px; object-fit: contain" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// 引入sdk 设置cos的id和key
// 引入腾讯云 的sdk
import Cos from 'cos-js-sdk-v5'
// 引入之后，将cos进行实例化
const cos = new Cos({
  SecretId: 'AKIDCC5sY6Sdnt0ynUzWt60mS2VtIXn6FGTa',
  SecretKey: '3va6yqw15zjFZuyokaMySqlcN1e5IKEo'
})

export default {
  data() {
    return {
      // 要上传的图片列表
      // list-->file-list属性 -->代表上传成功
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: '',
      percent: 0, // 当前的百分比
      showPercent: false // 是否显示进度条
    }
  },
  computed: {
    // 如果他为true 表示就不应该显示＋号上传了
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览放大镜效果
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 删除
    handleRemove(file, fileList) {
      // file 参数表示的点击垃圾桶图标要删除的图片
      // fileList 表示的是删除之后的数组

      // 将当前的删除文件排除在外
      // this.fileList = this.fileList.filter((item) => item.uid !== file.uid)
      this.fileList = fileList
    },
    // 上传文件(不能用push因为这个钩子执行两次)
    changeFile(file, fileList) {
      // file 是当前的文件 fileList是当前最新的数组 this.fileList
      // 如果
      this.fileList = fileList.map((item) => item)
      // 这里为何暂时不成功呢？因为现在还没有上传 所以第二次进来的数据 一定是一个空的
      // 如果上传成功了 第一次进入和第二次进入的fileList的长度应该都是1 应该都有数据
      // 上传成功 => 数据才进来 =>腾讯云cos
    },
    beforeUpload(file) {
      // 上传之前的检查操作
      // 1.检查上传文件的文件类型
      // 1.1设置支持的文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // 1.2判断用户上传的文件是否在支持的文件类型中
      if (!types.includes(file.type)) {
        // 用户上传的类型不在types数组中
        this.$message.error('上传图片只能是 JPG.GIF.BMP.PNG 格式！')
        return false // 一旦 return false一执行，函数就会停止
      }
      // 2，检查上传文件的大小
      // 2.1 设置一个要求的文件大小，也就是说用户上传的文件不能超过设置文件的大小
      const maxSize = 5 * 1024 * 1024
      // 检查文件的大小
      if (maxSize < file.size) {
        // 用户上传文件的大小超过了限制
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 存储一下当前的uid
      //   已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      // 3，如果用户在上诉的两个判断中，都通过了，那么最终，要在函数的最后，返回true，如果不返回true程序将终止上传
      // 展示进度条
      this.showPercent = true
      return true
    },
    // 上传操作
    upload(params) {
      // 1.判断文件是否存在
      if (params.file) {
        // 2.如果文件存在，再来进行后续的操作=>配置腾讯云
        cos.putObject(
          {
            // 3. 设置存储桶的基本信息
            Bucket: 'bjhr-1315925688', // 存储桶名称
            Region: 'ap-beijing', // 存储桶地域
            Key: params.file.name, // 文件名作为key
            StorageClass: 'STANDARD', // 此类写死
            Body: params.file, // 将本地的文件赋值给腾讯云配置
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            // 获取上传的进度
            onProgress: (params) => {
              this.percent = params.percent * 100
            }
          },
          // 回调函数
          (err, data) => {
            // data 返回数据之后 应该如何处理
            // console.log(data)

            if (err) {
              console.log('出错了,', err)
            } else if (data.statusCode === 200) {
              // 如果状态码为200，就表示图片上传成功了
              // 判断一下当前上传的图片是否是fileList中的图片

              this.fileList = this.fileList.map((item) => {
                if ((item.uid = this.currentFileUid)) {
                  // upload 为true表示，该图片已经成功上传到了服务器，地址已经是腾讯云地址了 就不可以执行保存了
                  return { url: 'http://' + data.Location, upload: true } // 将本地的地址换成腾讯云的地址
                }
                return item
                // 关闭进度条
                // 重置百分比
              })
              setTimeout(() => {
                this.showPercent = false // 隐藏进度条
                this.percent = 0 // 进度归0
              }, 2000)

              // 将腾讯云地址写入到fileList上 ，保存的时候 就可以从fileList中直接获取图片地址

              // 此时注意，我们应该记住 当前上传的是哪个图片  上传成功之后，将图片的地址赋值回去
            }
          }
        )
      }
    }
  }
}
</script>

<style>
/* 如果家里scoped,就代表当前组织要和其他组织产生一个隔离，隔离一旦产生，那么当前组件的样式
将不会影响其他组件 */
/* 如果一边想要设置scoped样式隔离，一边还想让自己的样式代码影响其他组件，可以使用：：v-deep */
/* 如果disable这个类名存在，那么下面的这个选择器就是成立的那么+就不会出现 */
/* 反之，disable不存在，那么下面的这个选择器就不成立，+就会出现 */
.disable .el-upload--picture-card {
  display: none;
}
</style>
