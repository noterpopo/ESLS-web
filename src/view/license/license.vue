<template>
    <div ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.6 + 'px' }">
            <Tabs :animated="false">
                <TabPane label="查看证书">
                  <Row style="margin-bottom:10px;">
                      <Col span="8"><p>证书信息</p></Col>
                      <Col span="8"><p>有效期起始</p></Col>
                      <Col span="8"><p>有效期结束</p></Col>
                    </Row>
                    <Row>
                      <Col span="8"><p>{{licenseData.info}}</p></Col>
                      <Col span="8"><p>{{licenseData.notBefore}}</p></Col>
                      <Col span="8"><p>{{licenseData.notAfter}}</p></Col>
                    </Row>
                </TabPane>
                <TabPane label="导入证书">
                    <Upload style="margin-top:10px;"
                        multiple
                        :on-success="onUploadSucess"
                        :on-error="onUploadFail"
                        :show-upload-list="false"
                        :headers="headers"
                        type="drag"
                        :action="'http://39.108.106.167:8086/license/installLicense'">
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
import { getLicense } from '@/api/license'
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
      windowWidth: 0,
      licenseData: {}
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
  created () {
    getLicense().then(res => {
      this.licenseData = res.data.data
    })
  },
  computed: {

  },
  methods: {
    onUploadSucess () {
      this.$Message.info('备份文件上传成功')
    },
    onUploadFail () {
      this.$Message.info('备份文件上传失败')
    }
  }
}
</script>
