<template>
    <div style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="22"><p>等待变价列表</p></Col>
                <Col span="2"><Button v-if="hasSubmitAccess" type="primary" @click="submitUpdate">一键改价</Button></Col>
            </Row>
          </div>
          <Table border :loading='isTableLoading' :columns="tableColumns" :data="tagDataPage">
          </Table>
          <div style="float: right;">
              <Page :total="tagData.length" :page-size="countPerPage" :current="pageNum+1" @on-change="changePage"></Page>
          </div>

        </Card>

        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px',marginTop:'10px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>变价监控信息</p></Col>
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
    </div>
</template>
<script>
import { getAllTag, getOvertimeTag } from '@/api/tag'
import tagExpand from '@/components/table/tag-expand.vue'
import store from '@/store'
import { setInterval, clearInterval } from 'timers'
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
          width: 50,
          align: 'center'
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
            if (params.row.resolutionWidth === '212') {
              size = '2.13寸'
            } else if (params.row.resolutionWidth === '400') {
              size = '4.2寸'
            } else if (params.row.resolutionWidth === '296') {
              size = '2.9寸'
            } else if (params.row.resolutionWidth === '250') {
              size = '2.5寸'
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
            const row = params.row
            const color = row.waitUpdate === 1 ? 'primary' : 'error'
            const text = row.waitUpdate === 1 ? '已经更新' : '等待更新'

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
            const row = params.row
            const color = row.isWorking === 1 ? 'primary' : 'error'
            const text = row.isWorking === 1 ? '正常' : '超时'

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
                icon: 'md-refresh',
                type: 'primary',
                size: 'small'
              },
              on: {
                'click': (event) => {
                  event.stopPropagation()
                  let temp = this.currentTimeTagData.find(function (item) { return item.barCode === params.row.barCode })
                  this.$Message.info(temp.barCode)
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
    this.getTagTableData(this.pageNum, this.countPerPage, 4)
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
    getTagTableData (page, count, mode) {
      var that = this
      that.isTableLoading = true
      getAllTag({ page: page, count: 100 }).then(res => {
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
    submitUpdate () {
      // TODO 批量改价
      let count = 0
      this.intervalid = setInterval(() => {
        this.getTagTableData(this.pageNum, this.countPerPage, 3)
        count = count + 1
        console.log(count)
        if (count > 5) {
          clearInterval(this.intervalid)
        }
      }, 1000
      )
    },
    changePage (page) {
      this.pageNum = page - 1
      this.tagDataPage = this.tagData.slice(this.pageNum * this.countPerPage, (this.pageNum + 1) * this.countPerPage)
    }
  }

}
</script>
