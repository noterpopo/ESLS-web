<template>
    <div ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.6 + 'px' }">
            <Tabs :animated="false">
                <TabPane label="导出数据表">
                    <Button v-if="hasDBAccess" type="primary" @click="download">备份数据库</Button>
                </TabPane>
                <TabPane label="导入数据表">
                    <Upload style="margin-top:10px;"
                        multiple
                        :disabled="!hasDBAccess"
                        :on-success="onUploadSucess"
                        :on-error="onUploadFail"
                        :show-upload-list="false"
                        :headers="headers"
                        type="drag"
                        :action="config.baseUrl.dev+'/excel/excelImport?update=1'">
                        <div style="padding: 20px 0;">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>点击上传或者拖拽文件上传</p>
                        </div>
                    </Upload>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>

<script>
import super_table from '@/components/table/supertable.vue'
import store from '@/store'
import config from '@/config'
export default {
  components: {
    super_table
  },
  data () {
    return {
      headers: {
        ESLS: store.getters.token
      },
      uploadName: '',
      windowWidth: 0
    }
  },
  mounted () {
    var that = this
    this.$nextTick(() => {
      this.windowWidth = this.$refs.container.offsetWidth
    })
    window.onresize = function () {
      that.windowWidth = that.$refs.container.offsetWidth
    }
  },
  computed: {
    hasDBAccess: () => {
      return store.getters.access.indexOf(12) !== -1
    }
  },
  methods: {
    download () {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', config.baseUrl.dev + '/excel/excelExport')
      xhr.onload = function (a, b) {
        let blob = this.response
        let reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          var date = new Date()
          let timestamp = date.toLocaleString()
          let a = document.createElement('a')
          a.download = timestamp + '数据库备份.xlsx'
          a.href = e.target.result
          a.click()
        }
      }
      xhr.responseType = 'blob'
      xhr.setRequestHeader('ESLS', store.getters.token)
      xhr.send()
    },
    onUploadSucess () {
      this.$Message.info('备份文件上传成功')
    },
    onUploadFail () {
      this.$Message.info('备份文件上传失败')
    }
  }
}
</script>
