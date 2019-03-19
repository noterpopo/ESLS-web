<template>
    <div ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
            <Tabs :animated="false">
                <TabPane label="导出数据表">
                    <super_table :data="tableData" :columns="tableColumns" :isLoading="isTableLoading"></super_table>
                </TabPane>
                <TabPane label="导入数据表">
                    <Select v-model="uploadName" :transfer="true">
                        <Option v-for="(item) in tableData" :key="item.keyName" :value="item.keyName">{{translate[item.keyName]}}</Option>
                    </Select>
                    <Upload style="margin-top:10px;"
                        multiple
                        :on-success="onUploadSucess"
                        :on-error="onUploadFail"
                        :show-upload-list="false"
                        :headers="headers"
                        type="drag"
                        :action="'http://39.108.106.167:8086/common/database/importCsvDataFile?tableName='+uploadName">
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
import { getAllTable } from '@/api/backup'
import super_table from '@/components/table/supertable.vue'
import store from '@/store'
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
      isTableLoading: false,
      tableData: [],
      tableColumns: [
        {
          title: '表名',
          key: 'keyName',
          render: (h, params) => {
            return h('p', this.translate[params.row.keyName])
          },
          filter: {
            type: 'Input'
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: '150',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: '2px'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    this.download(params.row.keyName)
                  }
                }
              }, '导出')
            ])
          }
        }
      ],
      translate: {
        admin: '系统管理',
        balance: '电子秤',
        batch_job_execution: 'batch_job_execution',
        batch_job_execution_context: 'batch_job_execution_context',
        batch_job_execution_params: 'batch_job_execution_params',
        batch_job_execution_seq: 'batch_job_execution_seq',
        batch_job_instance: 'batch_job_instance',
        batch_job_seq: 'batch_job_seq',
        batch_step_execution: 'batch_step_execution',
        batch_step_execution_context: 'batch_step_execution_context',
        batch_step_execution_seq: 'batch_step_execution_seq',
        cyclejobs: '定期任务',
        dispms: '小样式',
        goods: '商品',
        logs: '日志',
        permission: '权限',
        role: '角色',
        role_permission: '角色权限',
        routers: '路由器',
        scans: '巡检',
        shops: '店铺',
        styles: '价签样式',
        systemversion: '系统版本',
        tags: '价签',
        user_role: '用户角色',
        users: '用户'
      }
    }
  },
  created () {
    this.getTableData()
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
  methods: {
    getTableData () {
      this.isTableLoading = true
      getAllTable().then(res => {
        this.isTableLoading = false
        this.tableData = res.data.data
      })
    },
    download (tableName) {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', 'http://39.108.106.167:8086/common/database/exportCsvDataFile?tableName=' + tableName)
      xhr.onload = function (a, b) {
        let blob = this.response
        let reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          let a = document.createElement('a')
          a.download = tableName + '.csv'
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
