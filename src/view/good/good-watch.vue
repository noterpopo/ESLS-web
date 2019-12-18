<template>
    <div style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;" ref="container">
      <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="22"><p>变价监控信息</p></Col>
                <Col span="2"><Button v-if="hasGjAccess" type="primary" @click="exportCsv">导出变价超时数据</Button></Col>
            </Row>
          </div>
          <div>
            <Row type="flex" justify="center" align="middle">
                <Col span="8">
                  <span>所有价签: </span>
                  <span style="width:30px;display:inline-block">{{allTagNum}}</span>
                  <Button style="margin-left:10px" type="primary" size="small" @click="getTagTableData(pageNum, countPerPage,0)">查看</Button>
                </Col>
                <Col span="8">
                  <span>启用价签: </span>
                  <span style="width:30px;display:inline-block">{{usableTagNum}}</span>
                  <Button style="margin-left:10px" type="primary" size="small" @click="getTagTableData(pageNum, countPerPage,1)">查看</Button>
                </Col>
                <Col span="8">
                  <span>禁用价签: </span>
                  <span style="width:30px;display:inline-block">{{unusableTagNum}}</span>
                  <Button style="margin-left:10px" type="primary" size="small" @click="getTagTableData(pageNum, countPerPage,2)">查看</Button>
                </Col>
            </Row>
            <Row style="margin-top:10px" type="flex" justify="center" align="middle">
                <Col span="8">
                  <span>已经变价/变价总数: </span>
                  <span style="width:50px;display:inline-block">{{submitSuccessNum+'/'+submitNum}}</span>
                  <Button style="margin-left:10px" type="primary" size="small" @click="getTagTableData(pageNum, countPerPage,3)">查看</Button>
                </Col>
                <Col span="8">
                  <span>变价超时: </span>
                  <span style="width:30px;display:inline-block">{{overTimeTagNum}}</span>
                  <Button style="margin-left:10px" type="primary" size="small" @click="getTagTableData(pageNum, countPerPage,4)">查看</Button>
                </Col>
                <Col span="8">
                  <span>成功率: </span>
                  <span style="width:30px;display:inline-block">{{successRate+'%'}}</span>
                </Col>
            </Row>
          </div>

        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px' ,marginTop:'10px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="22"><p>等待变价列表</p></Col>
                <Col span="2"><Button v-if="hasGjAccess" type="primary" @click="submitUpdate">一键改价</Button></Col>
            </Row>
          </div>
          <Table v-if="rendertable" border :loading='isTableLoading' :columns="tableColumns" :data="tagData">
          </Table>
          <div style="float: right;margin:6px;">
              <Page :total="tableAllNum" :page-size="countPerPage" :current="pageNum+1" @on-change="changePage"></Page>
          </div>

        </Card>
    </div>
</template>
<script>
import { getAllTag, getOvertimeTag, gjTag, gjTags, getTagNum } from '@/api/tag'
import tagExpand from '@/components/table/tag-expand.vue'
import store from '@/store'
import config from '@/config'
export default {
  components: {
    tagExpand
  },
  data () {
    return {
      rendertable: true,
      windowWidth: 0,
      intervalid: null,
      successRate: 0,
      isTableLoading: false,
      tagData: [],
      tableColumns: [
        {
          type: 'expand',
          width: 40,
          render: (h, params) => {
            return h(tagExpand, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          type: 'index',
          width: 54,
          align: 'center',
          indexMethod: (row) => {
            return row._index + 1 + (this.pageNum) * this.countPerPage
          }
        },
        {
          title: '价签条码',
          key: 'barCode',
          width: '140',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '价签类型',
          width: '128',
          render: (h, params) => {
            let size = ''
            let type = ''
            if (params.row.resolutionWidth === '212' || params.row.resolutionWidth === '250') {
              size = '2.13寸'
            } else if (params.row.resolutionWidth === '400') {
              size = '4.2寸'
            } else if (params.row.resolutionWidth === '296') {
              size = '2.9寸'
            }
            if (params.row.screenType.indexOf('三色') !== -1) {
              type = '三色'
            } else {
              type = '黑白'
            }
            return h('p', size + type + '屏')
          }
        },
        {
          title: '店铺',
          key: 'shopNameAndShopNumber'
        },
        {
          title: 'AP/信道',
          width: '140',
          key: 'routerBarCodeAndChannelId'
        },
        {
          title: '商品条码/名称',
          width: '200',
          key: 'goodBarCodeAndName'
        },
        {
          title: '电量',
          key: 'power',
          width: '70',
          filter: {
            type: 'Input'
          }
        },

        {
          title: 'AP RSSI',
          key: 'apRssi',
          width: '70',
          render: (h, params) => {
            let color = '#515a6e'
            if (params.row.apRssi < -70) {
              color = 'red'
            }
            return h('div', {
              attrs: {
                style: 'color: ' + color
              }
            }, params.row.apRssi)
          }
        },
        {
          title: 'Tag RSSI',
          key: 'tagRssi',
          width: '70',
          render: (h, params) => {
            let color = '#515a6e'
            if (params.row.tagRssi < -70) {
              color = 'red'
            }
            return h('div', {
              attrs: {
                style: 'color: ' + color
              }
            }, params.row.tagRssi)
          }
        },
        {
          title: '更新状态',
          key: 'waitUpdate',
          width: '140',
          render: (h, params) => {
            let row = params.row
            let color = row.waitUpdate === 1 ? 'primary' : 'error'
            let text = row.waitUpdate === 1 ? '已经更新' : '等待更新'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '通讯状态',
          key: 'isWorking',
          width: '140',
          render: (h, params) => {
            let row = params.row
            let isWorking = row.execTime === '' || row.completeTime === ''
            let color = !isWorking ? 'primary' : 'error'
            let text = !isWorking ? '正常' : '超时'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },

        {
          title: '使用状态',
          key: 'forbidState',
          width: '120',
          render: (h, params) => {
            const row = params.row
            const color = row.forbidState === 1 ? 'primary' : 'error'
            const text = row.forbidState === 1 ? '启用' : '禁用'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '100',
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                disabled: params.row.waitUpdate === 1 || !this.hasGjAccess,
                icon: 'md-refresh',
                type: 'primary',
                size: 'small'
              },
              attrs: {
                id: 'btn' + params.row._index
              },
              on: {
                'click': (event) => {
                  event.stopPropagation()
                  let temp = this.tagData.find(function (item) { return item.barCode === params.row.barCode })
                  this.submitTag(temp)
                }
              }
            }, '变价')
          }
        }
      ],
      updateSum: 1,
      currentUpdate: 0,
      allTagNum: 0,
      usableTagNum: 0,
      unusableTagNum: 0,
      submitSuccessNum: 0,
      overTimeTagNum: 0,
      submitNum: 0,
      updateStatus: 'active',
      selectid: [],
      pageNum: 0,
      countPerPage: 10,
      mode: 0,
      tableAllNum: 0,
      websocket: null
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
    this.getTagTableData(this.pageNum, this.countPerPage, 3)
    getTagNum().then(res => {
      this.allTagNum = res.data.data.allSize
      this.usableTagNum = res.data.data.normalTagSize
      this.unusableTagNum = res.data.data.forbidTagSize
      this.overTimeTagNum = res.data.data.overTimeTagSize
      this.submitNum = res.data.data.waitUpdateTagSize
    })
  },
  destroyed () {
    if (this.websocket != null) {
      this.websocket.close()
      this.websocket = null
    }
  },
  computed: {
    hasGjAccess: () => {
      return store.getters.access.indexOf(6) !== -1
    }
  },
  methods: {
    exportCsv () {
      let xhr = new XMLHttpRequest()
      xhr.open('POST', config.baseUrl.dev + '/tags/exportOvertime')
      xhr.onload = function (a, b) {
        let blob = this.response
        let reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          let a = document.createElement('a')
          a.download = 'overTime.csv'
          a.href = e.target.result
          a.click()
        }
      }
      xhr.responseType = 'blob'
      xhr.setRequestHeader('ESLS', store.getters.token)
      xhr.send()
    },
    getDownloadUrl (csv) {
      var _utf = '\uFEFF' // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
      if (window.Blob && window.URL && window.URL.createObjectURL) {
        var csvData = new Blob([_utf + csv], {
          type: 'text/csv'
        })
        return URL.createObjectURL(csvData)
      }
    },
    getTagTableData (page, count, mode) {
      this.mode = mode
      var that = this
      that.isTableLoading = true
      let params = { page: page, count: count, queryId: '', queryString: '' }
      if (mode === 0) {
      } else if (mode === 1) {
        params.queryId = 'forbidState'
        params.queryString = '1'
      } else if (mode === 2) {
        params.queryId = 'forbidState'
        params.queryString = '0'
      } else if (mode === 3) {
        params.queryId = 'waitUpdate'
        params.queryString = '0'
      } else if (mode === 4) {
        getOvertimeTag(page, count).then(r => {
          this.tableAllNum = r.data.code
          this.tagData = r.data.data
          that.isTableLoading = false
        }).catch(e => {
          this.tagData = []
          that.isTableLoading = false
        })
      }
      if (mode === 4) {
        return
      }
      getAllTag(params).then(res => {
        this.tableAllNum = res.data.code
        this.tagData = res.data.data
        that.isTableLoading = false
      })
    },
    submitTag (item) {
      let data = {}
      let tparams = {}
      let items = []
      this.$set(tparams, 'query', 'id')
      this.$set(tparams, 'queryString', item.id)
      items.push(tparams)
      this.$set(data, 'items', items)
      gjTag(data).then(res => {
        if (res.data.data.error === false) {
          this.submitNum--
        } else {
          this.$Modal.error({
            title: '错误',
            content: '变价错误'
          })
        }
        this.getTagTableData(0, this.countPerPage, 3)
      })
    },
    submitUpdate () {
      // TODO 批量改价
      getAllTag({ page: 0, count: 1, queryId: 'waitUpdate', queryString: '0' }).then(res => {
        this.submitNum = res.data.code
      })
      this.initWebSocket()
      gjTags().then((res) => {
        if (res.data.data.error === false) {
          this.$Modal.info({
            title: '消息',
            content: '变价完成'
          })
        } else {
          this.$Modal.error({
            title: '错误',
            content: '变价错误'
          })
        }
        if (this.websocket != null) {
          this.websocket.close()
          this.websocket = null
        }
      }).catch(() => {
      })
    },
    changePage (page) {
      this.pageNum = page - 1
      this.getTagTableData(this.pageNum, this.countPerPage, this.mode)
    },
    closeWebSocket () {
      console.log('websocket关闭')
      this.websocket = null
    },
    webSocketOnOpen () {
      console.log('WebSocket连接成功')
    },
    errorWebSocket (e) {
      console.log('WebSocket连接发生错误')
    },
    onWebSocketMessage (msg) {
      console.log('WebSocket收到消息' + msg.data)
      let pat = /[\d]+/g
      console.log(msg.data.match(pat))
      let tagId = msg.data.match(pat)[0]
      this.overTimeTagNum = msg.data.match(pat)[1]
      console.log(msg.data.match(pat)[1])
      if (msg.data.indexOf('成功') !== -1) {
        this.submitSuccessNum++
        this.successRate = (this.submitSuccessNum / this.submitNum * 100).toFixed(2)
        this.tagData.forEach(item => {
          if (item.barCode === tagId) {
            console.log('灰' + tagId)
            item.waitUpdate = 1
            this.rendertable = false
            this.$nextTick(() => {
              this.rendertable = true
            })
          }
        })
      }
    },
    initWebSocket () {
      let ws = config.baseUrl.pro.replace('http://', 'ws://') + '/websocket?token=' + store.getters.token
      console.log(ws)
      if (this.websocket === null) {
        this.websocket = new WebSocket(ws)
        this.websocket.onopen = this.webSocketOnOpen
        this.websocket.onerror = this.errorWebSocket
        this.websocket.onmessage = this.onWebSocketMessage
        this.websocket.onclose = this.closeWebSocket
      }
    }
  }

}
</script>
