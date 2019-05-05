<template>
    <div style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;" ref="container">
      <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="22"><p>变价监控信息</p></Col>
                <Col span="2"><Button type="primary" @click="exportCsv">导出csv</Button></Col>
            </Row>
          </div>
          <div>
            <Row type="flex" justify="center" align="middle">
                <Col span="8">
                  <span>所有价签: </span>
                  <span style="width:30px;display:inline-block">{{currentTimeTagData.length}}</span>
                  <Button style="margin-left:10px" type="primary" size="small" @click="getTagTableData(pageNum, countPerPage,0)">查看</Button>
                </Col>
                <Col span="8">
                  <span>启用价签: </span>
                  <span style="width:30px;display:inline-block">{{currentTimeTagData.filter((item)=>{return item.forbidState===1}).length}}</span>
                  <Button style="margin-left:10px" type="primary" size="small" @click="getTagTableData(pageNum, countPerPage,1)">查看</Button>
                </Col>
                <Col span="8">
                  <span>禁用价签: </span>
                  <span style="width:30px;display:inline-block">{{currentTimeTagData.filter((item)=>{return item.forbidState===0}).length}}</span>
                  <Button style="margin-left:10px" type="primary" size="small" @click="getTagTableData(pageNum, countPerPage,2)">查看</Button>
                </Col>
            </Row>
            <Row style="margin-top:10px" type="flex" justify="center" align="middle">
                <Col span="8">
                  <span>等待变价: </span>
                  <span style="width:30px;display:inline-block">{{currentTimeTagData.filter((item)=>{return item.waitUpdate===0}).length}}</span>
                  <Button style="margin-left:10px" type="primary" size="small" @click="getTagTableData(pageNum, countPerPage,3)">查看</Button>
                </Col>
                <Col span="8">
                  <span>变价超时: </span>
                  <span style="width:30px;display:inline-block">{{overTimeTags.length}}</span>
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
                <Col span="2"><Button v-if="hasSubmitAccess" type="primary" @click="submitUpdate">一键改价</Button></Col>
            </Row>
          </div>
          <Table border :loading='isTableLoading' :columns="tableColumns" :data="tagDataPage">
          </Table>
          <div style="float: right;margin:6px;">
              <Page :total="tagData.length" :page-size="countPerPage" :current="pageNum+1" @on-change="changePage"></Page>
          </div>

        </Card>
    </div>
</template>
<script>
import { getAllTag, getOvertimeTag, gjTag, gjTags } from '@/api/tag'
import tagExpand from '@/components/table/tag-expand.vue'
import store from '@/store'
import { setInterval, clearInterval } from 'timers'
const { Parser } = require('json2csv')
const fields = ['id',
  'power',
  'tagRssi',
  'apRssi',
  'state',
  'hardwareVersion',
  'softwareVersion',
  'forbidState',
  'waitUpdate',
  'execTime',
  'completeTime',
  'barCode',
  'tagAddress',
  'screenType',
  'resolutionWidth',
  'resolutionHeight',
  'isWorking',
  'goodId',
  'styleId',
  'routerId']
export default {
  components: {
    tagExpand
  },
  data () {
    return {
      windowWidth: 0,
      intervalid: 0,
      successRate: 0,
      isTableLoading: false,
      tagData: [],
      tagDataPage: [],
      currentTimeTagData: [],
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
            if (params.row.screenType.indexOf('三色')) {
              type = '三色'
            } else {
              type = '黑白'
            }
            return h('p', size + type + '屏幕')
          }
        },
        {
          title: '店铺',
          render: (h, params) => {
            let result = null
            $.ajax({
              url: 'http://39.108.106.167:8086/router/' + params.row.routerId,
              async: false,
              headers: {
                ESLS: store.getters.token
              },
              type: 'get',
              success: (res) => {
                result = res.data[0].name
              }
            })
            return h('p', result)
          }
        },
        {
          title: 'AP/信道',
          width: '140',
          render: (h, params) => {
            let result = null
            $.ajax({
              url: 'http://39.108.106.167:8086/router/' + params.row.routerId,
              async: false,
              headers: {
                ESLS: store.getters.token
              },
              type: 'get',
              success: (res) => {
                result = res.data[0].barCode + '/' + res.data[0].channelId
              }
            })
            return h('p', result)
          }
        },
        {
          title: '商品条码/名称',
          width: '200',
          render: (h, params) => {
            let result = null
            $.ajax({
              url: 'http://39.108.106.167:8086/goods/' + params.row.goodId,
              async: false,
              headers: {
                ESLS: store.getters.token
              },
              type: 'get',
              success: (res) => {
                result = res.data[0]
              }
            })
            return h('p', result.barCode + '/' + result.name)
          }
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
          width: '65',
          filter: {
            type: 'Input'
          }
        },
        {
          title: 'Tag RSSI',
          key: 'tagRssi',
          width: '65',
          filter: {
            type: 'Input'
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
            let isWorking = row.execTime === null && row.completeTime === null
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
                disabled: params.row.waitUpdate === 1,
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
                  let temp = this.currentTimeTagData.find(function (item) { return item.barCode === params.row.barCode })
                  this.submitTag(temp)
                }
              }
            }, '变价')
          }
        }
      ],
      overTimeTags: [],
      updateSum: 1,
      currentUpdate: 0,
      updateStatus: 'active',
      selectid: [],
      pageNum: 0,
      countPerPage: 10

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
    getOvertimeTag().then(r => {
      this.overTimeTags = r.data.data
      this.changePage(1)
    })
    this.getTagTableData(this.pageNum, this.countPerPage, 3)
  },
  destroyed () {
    clearInterval(this.intervalid)
  },
  computed: {
    hasSubmitAccess: () => {
      return store.getters.access.indexOf(20) !== -1
    }
  },
  methods: {
    exportCsv () {
      const json2csvParser = new Parser({ fields })
      let csv = json2csvParser.parse(this.overTimeTags)
      let date = new Date()
      let timestamp = date.toLocaleString()
      let fileName = timestamp + '.csv'
      console.log(csv)
      var alink = document.createElement('a')
      alink.id = 'linkDwnldLink'
      alink.href = this.getDownloadUrl(csv)
      document.body.appendChild(alink)
      var linkDom = document.getElementById('linkDwnldLink')
      linkDom.setAttribute('download', fileName)
      linkDom.click()
      document.body.removeChild(linkDom)
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
      var that = this
      that.isTableLoading = true
      getAllTag({}).then(res => {
        const data = res.data.data
        that.currentTimeTagData = data
        if (mode === 0) {
          this.tagData = this.currentTimeTagData
          this.changePage(1)
        } else if (mode === 1) {
          this.tagData = this.currentTimeTagData.filter((item) => {
            return item.forbidState === 1
          })
          this.changePage(1)
        } else if (mode === 2) {
          this.tagData = this.currentTimeTagData.filter((item) => {
            return item.forbidState === 0
          })
          this.changePage(1)
        } else if (mode === 3) {
          this.tagData = this.currentTimeTagData.filter((item) => {
            return item.waitUpdate === 0
          })
          this.changePage(1)
        } else if (mode === 4) {
          getOvertimeTag().then(r => {
            this.tagData = r.data.data
            this.overTimeTags = r.data.data
            this.changePage(1)
          })
        }
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
        this.getTagTableData(this.pageNum, this.countPerPage, 3)
      })
    },
    submitUpdate () {
      // TODO 批量改价
      let temp = this.currentTimeTagData.filter((item) => {
        return item.waitUpdate === 0
      })
      let submitNum = temp.length

      let flag = true
      gjTags().then(() => {
        flag = false
      }).catch(() => {
        clearInterval(this.intervalid)
      })
      this.intervalid = setInterval(() => {
        getAllTag({}).then(res => {
          this.currentTimeTagData = res.data.data
          this.tagData = this.currentTimeTagData.filter((item) => {
            for (let i = 0; i < temp.length; ++i) {
              if (temp[i].id === item.id) {
                return true
              }
            }
            return false
          })
          this.changePage(1)
        })
        let currentTemp = this.tagData.filter((item) => {
          return item.waitUpdate === 0
        })
        let cNum = currentTemp.length
        this.successRate = (submitNum - cNum) / submitNum * 100
        if (!flag) {
          clearInterval(this.intervalid)
        }
      }, 2000)
    },
    changePage (page) {
      this.pageNum = page - 1
      this.tagDataPage = this.tagData.slice(this.pageNum * this.countPerPage, (this.pageNum + 1) * this.countPerPage)
    }
  }

}
</script>
