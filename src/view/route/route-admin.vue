<template>
    <div  ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                    <Col span="22"><p>路由器信息</p></Col>
                    <Col span="2"><Button type="primary" @click="routeReload">刷新</Button></Col>
              </Row>
          </div>
          <super_table @onSelectionChange="handleSelectionChange" @onClick="onTableClick" :pageSize="countPerPage" :current.sync="currentPage" @onSearch="onTableSearch" :data="routeData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="routeDataCount"></super_table>
        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px',marginTop:'10px'}">
            <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="24"><p>IP设置</p></Col>
                </Row>
            </div>
            <div>
                <Select v-model="ipMode" :style="{width:'160px'}">
                    <Option :value="0">自动分配</Option>
                    <Option :value="1">手动设置</Option>
                </Select>
                <InputNumber  :style="{marginLeft:'10px'}" :disabled="ipMode===0" :max="255" :min="1" v-model="from"></InputNumber>
                <span :style="{marginLeft:'4px',marginRight:'4px'}">~</span>
                <InputNumber  :disabled="ipMode===0" :max="255" :min="1" v-model="to"></InputNumber>
                <Button style="margin-left:10px;" type="primary" @click="setIp">确定</Button>
            </div>
        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px',marginTop:'10px'}">
          <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="24"><p>路由器设置</p></Col>
                </Row>
          </div>
          <div style="display:flex; align-items:center;">
            <span>指定属性更换路由器</span>
            <Input style="margin-left:8px;width: 300px" type="text" v-model="tagQueryString"  placeholder="筛选条件" >
                  <Select v-model="tagQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
            </Input>
            <Input type="text" style="margin-left:8px;width: 300px" v-model="routeQueryString"  placeholder="目的条件" >
                  <Select v-model="routeQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
            </Input>
            <Button style="margin-left:10px;" type="primary" @click="changeRoute">确定</Button>

          </div>
          <div style="display:flex; align-items:center;margin-top:10px;">
            <span>巡检</span>
            <Select style="margin-left:8px;width: 200px" v-model="scanMode">
                      <Option value="0">指定路由器</Option>
                      <Option value="1">定期巡检</Option>
            </Select>
            <Input type="text" style="margin-left:8px;width: 300px" v-model="scanQueryString"  placeholder="条件" >
                  <Select v-model="scanQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
            </Input>
            <Input  v-model="scanCronExp" placeholder="输入cron表达式" style="margin-left:8px;width: 300px">
                  <Button slot="append" @click="isScanCronModalShow=true">选择时间</Button>
            </Input>
            <Button style="margin-left:10px;" type="primary" @click="onScan">开始</Button>
            <Button style="margin-left:10px;" type="primary" @click="onAllScan">对全部路由器巡检</Button>
          </div>
           <div style="display:flex; align-items:center;margin-top:10px;">
            <span>设置路由器</span>
            <Input type="text" style="margin-left:8px;width: 300px" v-model="settingQueryString"  placeholder="条件" >
                  <Select v-model="settingQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
            </Input>
            <Input type="text" style="margin-left:8px;width: 300px" v-model="setConfigValue" >
                  <Select v-model="setConfig" slot="prepend" style="width: 100px">
                      <Option value="channelId">信道</Option>
                  </Select>
            </Input>
            <Button style="margin-left:10px;" type="primary" @click="onSetting">设置</Button>
          </div>
          <div style="display:flex; align-items:center;margin-top:10px;">
            <span>AP测试</span>
            <Select style="margin-left:8px;width: 200px" v-model="testMode">
                      <Option value="0">信息写入</Option>
                      <Option value="1">AP信息读取</Option>
                      <Option value="2">AP发送无线帧</Option>
                      <Option value="3">AP停止发送无线帧 </Option>
                      <Option value="4">AP接收无线帧</Option>
                      <Option value="5">AP停止接收无线帧</Option>
                      <Option value="9">获取接收无线帧RSSI</Option>
            </Select>
            <Input type="text" style="margin-left:8px;width: 300px" v-model="testQueryString"  placeholder="条件" >
                  <Select v-model="testQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
            </Input>
            <Input v-if="testMode==0" v-model="testBarCode" placeholder="输入条码" style="margin-left:8px;width: 240px"></Input>
            <Input v-model="testChannelId" placeholder="输入信道" style="margin-left:8px;width: 240px"></Input>
            <Input v-if="testMode==0" v-model="testHardVersion" placeholder="输入硬件版本" style="margin-left:8px;width: 240px"></Input>
            <Button style="margin-left:10px;" type="primary" @click="onTest">开始</Button>
          </div>
          <div style="display:flex; align-items:center;margin-top:10px;">
            <span>AP测试</span>
            <Select style="margin-left:8px;width: 200px" v-model="testMode">
                      <Option value="6">设置目标服务器IP </Option>
                      <Option value="7">删除当前历史连接IP记录</Option>
                      <Option value="8">查询历史连接IP列表</Option>
            </Select>
            <Input type="text" style="margin-left:8px;width: 300px" v-model="testQueryString"  placeholder="条件" >
                  <Select v-model="testQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
            </Input>
            <Input v-if="testMode===0" v-model="testBarCode" placeholder="输入条码" style="margin-left:8px;width: 240px"></Input>
            <Input v-model="testChannelId" placeholder="输入信道" style="margin-left:8px;width: 240px"></Input>
            <Input v-if="testMode===0" v-model="testHardVersion" placeholder="输入硬件版本" style="margin-left:8px;width: 240px"></Input>
            <Button style="margin-left:10px;" type="primary" @click="onTest">开始</Button>
          </div>
          <corn-selector :isModalShow="isScanCronModalShow" @onOk="onScanCron" @onIsShow="onScanIsShow"></corn-selector>
        </Card>
    </div>
</template>
<script>
import { getAllRoute, changeRoute, scanRoute, scanAll, settingRoute, testRouter, updateRouter } from '@/api/route'
import super_table from '@/components/table/supertable.vue'
import routerExpand from '@/components/table/router-expand.vue'
import cronSelector from '@/components/corn-selector/corn-selector.vue'
var rssiWorker = new Worker('@/worker/updateRSSI.js')
var RSSIID = ''
var RSSIDATA = ''
export default {
  components: {
    routerExpand,
    super_table,
    'corn-selector': cronSelector
  },
  data () {
    return {
      windowWidth: 0,
      isTableLoading: false,
      countPerPage: 6,
      currentPage: 1,
      routeDataCount: 0,
      routeData: [],
      tableColumns: [
        {
          type: 'selection',
          width: 50
        },
        {
          type: 'expand',
          width: 40,
          render: (h, params) => {
            return h(routerExpand, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '路由器条码',
          key: 'barCode',
          width: '200',
          filter: {
            type: 'Input'
          }

        },
        {
          title: 'MAC地址',
          key: 'mac',
          filter: {
            type: 'Input'
          }

        },
        {
          title: 'IP地址',
          key: 'ip',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '端口号',
          key: 'port',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '信道',
          key: 'channelId',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '商店',
          key: 'shop',
          width: '200',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '状态',
          key: 'isWorking',
          width: 140,
          render: (h, params) => {
            const row = params.row
            const color = row.isWorking === 1 ? 'primary' : 'error'
            const text = row.isWorking === 1 ? '工作中' : '通讯异常'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          },
          filter: {
            type: 'Input'
          }
        },
        {
          title: '是否启用',
          key: 'state',
          render: (h, params) => {
            const row = params.row
            const isUsable = row.state === 1
            return h('i-switch', {
              props: {
                value: isUsable,
                size: 'large'
              },
              on: {
                'on-change': (val) => {
                  if (val) {
                    params.row.state = 1
                  } else {
                    params.row.state = 0
                  }
                  updateRouter(params.row).then(res => {
                  })
                }
              }
            }, [
              h('span', {
                slot: 'open'
              }, '启用'),
              h('span', {
                slot: 'close'
              }, '禁用')
            ])
          },
          filter: {
            type: 'Input'
          }
        },
        {
          title: '硬件版本',
          key: 'hardVersion',
          filter: {
            type: 'Input'
          }
        }
      ],
      currentSelectRow: {},
      ipMode: 0,
      from: 0,
      to: 0,
      tagQuery: 'barCode',
      tagQueryString: '',
      routeQuery: 'barCode',
      routeQueryString: '',
      scanQuery: 'barCode',
      scanQueryString: '',
      scanCronExp: '',
      scanMode: 0,
      isScanCronModalShow: false,
      settingQuery: 'barCode',
      settingQueryString: '',
      testQuery: 'barCode',
      testQueryString: '',
      testBarCode: '',
      testChannelId: '',
      testHardVersion: '',
      testMode: '0',
      setConfig: 'channelId',
      setConfigValue: ''
    }
  },
  created () {
    this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
  },
  watch: {
    currentPage () {
      this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
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
  methods: {
    onTableClick (currentRow) {
      this.currentSelectRow = currentRow
    },
    getRouteTableData ({ page, count, queryId, queryString }) {
      var that = this
      that.isTableLoading = true
      getAllRoute({ page: page, count: count, queryId: queryId, queryString: queryString }).then(res => {
        const data = res.data.data
        that.routeDataCount = res.data.code
        that.routeData = data
        that.isTableLoading = false
      })
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getRouteTableData({ page: 0, count: this.countPerPage })
        this.currentTagPage = 1
        return
      }
      var value = search[key[0]]
      this.getRouteTableData({ queryId: key[0], queryString: value })
    },
    setIp () {

    },
    changeRoute () {
      changeRoute(this.tagQuery, this.tagQueryString, this.routeQuery, this.routeQueryString)
    },
    onScanCron (data) {
      this.scanCronExp = data
    },
    onScanIsShow (val) {
      this.isScanCronModalShow = val
    },
    onScan () {
      let data = {}
      let params = {}
      let items = []
      let idArray = this.scanQueryString.split(',')
      for (let i = 0; i < idArray.length; ++i) {
        params = {}
        this.$set(params, 'cron', this.scanCronExp)
        this.$set(params, 'query', this.scanQuery)
        this.$set(params, 'queryString', idArray[i])
        items.push(params)
      }
      this.$set(data, 'items', items)
      scanRoute(data, this.scanMode).then(res => {
        this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
      })
    },
    onAllScan () {
      scanAll().then(res => {
        this.getRouteTableData({ page: 0, count: this.countPerPage })
      })
    },
    onSetting () {
      let data = {}
      let params = {}
      let items = []
      let idArray = this.settingQueryString.split(',')
      for (let i = 0; i < idArray.length; ++i) {
        params = {}
        this.$set(params, 'query', this.settingQuery)
        this.$set(params, 'queryString', idArray[i])
        items.push(params)
      }
      this.$set(data, 'items', items)
      for (let j = 0; j < this.settingQueryString.split(',').length; ++j) {
        let updateRow = this.routeData.filter((item) => {
          console.log(item.barCode + ' ' + this.settingQueryString.split(',')[j])
          return item.barCode === this.settingQueryString.split(',')[j]
        })
        updateRow[0][this.setConfig] = this.setConfigValue
        updateRouter(updateRow[0]).then(res => {
          settingRoute(data).then(res => {
            this.$Message.info('设置成功')
          })
        })
      }
    },
    onTest () {
      let data = {}
      let params = {}
      let items = []
      let idArray = this.testQueryString.split(',')
      for (let i = 0; i < idArray.length; ++i) {
        params = {}
        this.$set(params, 'query', this.testQuery)
        this.$set(params, 'queryString', idArray[i])
        items.push(params)
      }
      this.$set(data, 'items', items)
      testRouter(data, this.testBarCode, this.testChannelId, this.testHardVersion, this.testMode)
      if (this.testMode === 4) {
        rssiWorker.postMessage(true)
        oW.onmessage = function (ev) {
          alert(ev.data)
        }
        this.$Modal.info({
          title: 'RSSi信息',
          render: (h, params) => {
            return h('span', [
              h('p', 'RSSID:' + RSSIID),
              h('p', 'RSSDATA:' + RSSIDATA)
            ])
          }
        })
      }
    },
    routeReload () {
      this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
    },
    handleSelectionChange (selection) {
      let temp = ''
      for (let i = 0; i < selection.length - 1; ++i) {
        temp = temp + selection[i].barCode + ','
      }
      if (selection.length > 0) {
        temp = temp + selection[selection.length - 1].barCode
        this.routeQueryString = temp.split(',')[0]
        this.scanQueryString = temp
        this.settingQueryString = temp
        this.testQueryString = temp
      } else {
        this.routeQueryString = ''
        this.scanQueryString = ''
        this.settingQueryString = ''
        this.testQueryString = ''
      }
    }
  }
}
</script>
