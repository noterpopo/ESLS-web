<template>
    <div class="container" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>价签信息</p></Col>
            </Row>
          </div>
          <super_table @onClick="onTagTableClick" :pageSize="countPerPage" :current.sync="currentTagPage" @onSearch="onTableSearch" :data="tagData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="tagDataCount"></super_table>
        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px',marginTop:'10px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>设置面板</p></Col>
            </Row>
          </div>
          <div>
            <Row type="flex" justify="start" align="middle" class="Row" style="marginBottom:4px">
                <Col span="2"><p>刷新：</p></Col>
                <Col span="4">
                  <Select v-model="flushMode" style="width:220px">
                      <Option :value="0" >对标签刷新</Option>
                      <Option :value="1" >为对指定路由器的所有标签刷新</Option>
                      <Option :value="2" >对标签定期刷新</Option>
                      <Option :value="3" >对路由器下所有标签定期刷新</Option>
                  </Select>
                </Col>
                <Col span="6">
                <Input type="text" v-model="flushQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="flushQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
                </Input></Col>
                <Col span="7">
                <Input  v-model="flushCronExp" placeholder="输入cron表达式" style="width: 360px" >
                  <Button slot="append" @click="isFlushCronModalShow=true">选择时间</Button>
                </Input></Col>
                <Col span="1"><Button type="primary" @click="onFlush">刷新</Button></Col>

            </Row>
          </div>

          <div>
            <Row type="flex" justify="start" align="middle" class="Row" style="marginBottom:4px">
                <Col span="2"><p>闪灯：</p></Col>
                <Col span="4">
                  <Select v-model="lightMode" style="width:220px">
                      <Option :value="0" >对标签</Option>
                      <Option :value="1" >对路由器下所有标签</Option>
                  </Select>
                </Col>
                <Col span="6">
                <Input type="text" v-model="lightQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="lightQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
                </Input></Col>
                <Col span="2">
                  <Select v-model="isLight" style="width: 100px">
                      <Option :value="0">结束闪灯</Option>
                      <Option :value="1">闪灯</Option>
                  </Select>
                </Col>
                <Col span="1"><Button type="primary" @click="onLight">闪灯</Button></Col>

            </Row>
          </div>
          <div>
            <Row type="flex" justify="start" align="middle" class="Row" style="marginBottom:4px">
                <Col span="2"><p>移除：</p></Col>
                <Col span="4">
                  <Select v-model="removeMode" style="width:220px">
                      <Option :value="0" >对标签</Option>
                      <Option :value="1" >对路由器下所有标签</Option>
                  </Select>
                </Col>
                <Col span="6">
                <Input type="text" v-model="removeQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="removeQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
                </Input></Col>
                <Col span="1"><Button type="primary" @click="onRemove">移除</Button></Col>

            </Row>
          </div>
          <div>
            <Row type="flex" justify="start" align="middle" class="Row" style="marginBottom:4px">
                <Col span="2"><p>巡检：</p></Col>
                <Col span="4">
                  <Select v-model="scanMode" style="width:220px">
                      <Option :value="0" >对标签巡检</Option>
                      <Option :value="1" >为对指定路由器的所有标签巡检</Option>
                      <Option :value="2" >对标签定期巡检</Option>
                      <Option :value="3" >对路由器下所有标签定期巡检</Option>
                  </Select>
                </Col>
                <Col span="6">
                <Input type="text" v-model="scanQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="scanQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
                </Input></Col>
                <Col span="7">
                <Input  v-model="scanCronExp" placeholder="输入cron表达式" style="width: 360px" >
                  <Button slot="append" @click="isScanCronModalShow=true">选择时间</Button>
                </Input></Col>
                <Col span="1"><Button type="primary" @click="onScan">巡检</Button></Col>
                <Col span="1"><Button type="primary" @click="onScanAll">对所有标签巡检</Button></Col>

            </Row>
          </div>
          <div>
            <Row type="flex" justify="start" align="middle" class="Row" style="marginBottom:4px">
                <Col span="2"><p>状态：</p></Col>
                <Col span="4">
                  <Select v-model="statusMode" style="width:220px">
                      <Option :value="0" >对标签</Option>
                      <Option :value="1" >对路由器</Option>
                  </Select>
                </Col>
                <Col span="6">
                <Input type="text" v-model="statusQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="statusQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
                </Input></Col>
                <Col span="2">
                  <Select v-model="isStatus" style="width: 100px">
                      <Option :value="0">禁用</Option>
                      <Option :value="1">启用</Option>
                  </Select>
                </Col>
                <Col span="1"><Button type="primary" @click="onStatus">修改</Button></Col>

            </Row>
          </div>
          <corn-selector :isModalShow="isFlushCronModalShow" @onOk="onFlushCron" @onIsShow="onFlushIsShow"></corn-selector>
          <corn-selector :isModalShow="isScanCronModalShow" @onOk="onScanCron" @onIsShow="onScanIsShow"></corn-selector>
        </Card>
    </div>
</template>
<script>
import super_table from '@/components/table/supertable.vue'
import cronSelector from '@/components/corn-selector/corn-selector.vue'
import { getAllTag, flushTag, lightTag, removeTag, scanTag, statusTag, scanAll } from '@/api/tag'
export default {
  components: {
    super_table,
    'corn-selector': cronSelector
  },
  data () {
    return {
      isTableLoading: false,
      countPerPage: 6,
      currentTagPage: 1,
      tagDataCount: 0,
      tagData: [],
      tableColumns: [
        {
          title: '价签id',
          key: 'barCode',
          width: '200',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '价签类型',
          key: 'screenType',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '执行时间',
          key: 'execTime',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '完成时间',
          key: 'completeTime',
          filter: {
            type: 'Input'
          }
        },
        {
          title: 'AP RSSI',
          key: 'apRssi',
          filter: {
            type: 'Input'
          }
        },
        {
          title: 'Tag RSSI',
          key: 'tagRssi',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '电量',
          key: 'power',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '是否工作',
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
          title: '等待变价',
          key: 'waitUpdate',
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
          },
          filter: {
            type: 'Input'
          }
        }
      ],
      windowWidth: 0,
      flushCronExp: '',
      flushQueryStr: '',
      flushQuery: 'barCode',
      flushMode: 0,
      lightQueryStr: '',
      lightQuery: 'barCode',
      lightMode: 0,
      isLight: 0,
      removeQueryStr: '',
      removeQuery: 'barCode',
      removeMode: 0,
      scanCronExp: '',
      scanQueryStr: '',
      scanQuery: 'barCode',
      scanMode: 0,
      statusQueryStr: '',
      statusQuery: 'barCode',
      statusMode: 0,
      isStatus: 0,
      isFlushCronModalShow: false,
      isScanCronModalShow: false
    }
  },
  created () {
    this.getTagTableData({ page: 0, count: this.countPerPage })
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
  watch: {
    currentTagPage () {
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
    }
  },
  methods: {
    getTagTableData ({ page, count, queryId, queryString }) {
      var that = this
      that.isTableLoading = true
      getAllTag({ page: page, count: count, queryId: queryId, queryString: queryString }).then(res => {
        const data = res.data.data
        that.tagDataCount = res.data.code
        that.tagData = data
        that.isTableLoading = false
      })
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getTagTableData({ page: 0, count: this.countPerPage })
        this.currentTagPage = 1
        return
      }
      var value = search[key[0]]
      this.getTagTableData({ queryId: key[0], queryString: value })
    },
    onTagTableClick (currentRow) {
      this.flushQueryStr = currentRow.barCode
      this.statusQueryStr = currentRow.barCode
      this.scanQueryStr = currentRow.barCode
      this.lightQueryStr = currentRow.barCode
      this.removeQueryStr = currentRow.barCode
    },
    onFlushCron (data) {
      this.flushCronExp = data
    },
    onFlushIsShow (val) {
      this.isFlushCronModalShow = val
    },
    onScanCron (data) {
      this.scanCronExp = data
    },
    onScanIsShow (val) {
      this.isScanCronModalShow = val
    },
    onFlush () {
      let data = {}
      let params = {}
      let items = []
      this.$set(params, 'cron', this.flushCronExp)
      this.$set(params, 'query', this.flushQuery)
      this.$set(params, 'queryString', this.flushQueryStr)
      items.push(params)
      this.$set(data, 'items', items)
      flushTag(data, this.flushMode)
    },
    onLight () {
      let data = {}
      let params = {}
      let items = []
      this.$set(params, 'query', this.lightQuery)
      this.$set(params, 'queryString', this.lightQueryStr)
      items.push(params)
      this.$set(data, 'items', items)
      lightTag(data, this.isLight, this.lightMode)
    },
    onRemove () {
      let data = {}
      let params = {}
      let items = []
      this.$set(params, 'query', this.removeQuery)
      this.$set(params, 'queryString', this.removeQueryStr)
      items.push(params)
      this.$set(data, 'items', items)
      removeTag(data, this.removeMode)
    },
    onScan () {
      let data = {}
      let params = {}
      let items = []
      this.$set(params, 'cron', this.scanCronExp)
      this.$set(params, 'query', this.scanQuery)
      this.$set(params, 'queryString', this.scanQueryStr)
      items.push(params)
      this.$set(data, 'items', items)
      scanTag(data, this.scanMode)
    },
    onScanAll () {
      scanAll()
    },
    onStatus () {
      let data = {}
      let params = {}
      let items = []
      this.$set(params, 'query', this.statusQuery)
      this.$set(params, 'queryString', this.statusQueryStr)
      items.push(params)
      this.$set(data, 'items', items)
      statusTag(data, this.statusMode)
    }
  }

}
</script>
<style>
.container{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
}
</style>
