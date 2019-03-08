<template>
    <div class="container" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>路由器列表</p></Col>
            </Row>
          </div>
          <super_table @onClick="onTableClick" :pageSize="countPerPage" :current.sync="currentPage" @onSearch="onTableSearch" :data="routeData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="routeDataCount"></super_table>
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
                      <Option value="4">AP停止接收无线帧</Option>
            </Select>
            <Input type="text" style="margin-left:8px;width: 300px" v-model="testQueryString"  placeholder="条件" >
                  <Select v-model="testQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
            </Input>
            <Input  v-model="testBarCode" placeholder="输入条码" style="margin-left:8px;width: 240px"></Input>
            <Input  v-model="testChannelId" placeholder="输入通道" style="margin-left:8px;width: 240px"></Input>
            <Input  v-model="testHardVersion" placeholder="输入硬件版本" style="margin-left:8px;width: 240px"></Input>
            <Button style="margin-left:10px;" type="primary" @click="onTest">开始</Button>
          </div>
          <corn-selector :isModalShow="isScanCronModalShow" @onOk="onScanCron" @onIsShow="onScanIsShow"></corn-selector>
        </Card>
    </div>
</template>
<script>
import { getAllRoute, changeRoute, scanRoute, scanAll, settingRoute, testRouter } from '@/api/route'
import super_table from '@/components/table/supertable.vue'
import cronSelector from '@/components/corn-selector/corn-selector.vue'
export default {
  components: {
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
          title: '通道',
          key: 'channelId',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '创建时间',
          key: 'execTime',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '更新时间',
          key: 'completeTime',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '状态',
          key: 'isWorking',
          render: (h, params) => {
            const row = params.row
            const color = row.isWorking === 1 ? 'primary' : 'error'
            const text = row.isWorking === 1 ? '工作中' : '禁用'

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
          title: '硬件版本',
          key: 'hardVersion',
          filter: {
            type: 'Input'
          }
        }
      ],
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
      testMode: '0'
    }
  },
  created () {
    this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
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
      this.routeQueryString = currentRow.barCode
      this.scanQueryString = currentRow.barCode
      this.settingQueryString = currentRow.barCode
      this.testQueryString = currentRow.barCode
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
      scanRoute({ cron: this.scanCronExp, query: this.scanQuery, queryString: this.scanQueryString, mode: this.scanMode }).then(res => {
        this.getRouteTableData({ page: 0, count: this.countPerPage })
      })
    },
    onAllScan () {
      scanAll().then(res => {
        this.getRouteTableData({ page: 0, count: this.countPerPage })
      })
    },
    onSetting () {
      settingRoute(this.settingQuery, this.settingQueryString)
    },
    onTest () {
      testRouter(this.testQuery, this.testQueryString, this.testBarCode, this.testChannelId, this.testHardVersion, this.testMode)
    }
  }
}
</script>
