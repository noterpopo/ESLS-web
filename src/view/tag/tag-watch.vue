<template>
    <div class="container" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="22"><p>价签信息</p></Col>
                <Col span="2"><Button type="primary" @click="tagReload">刷新</Button></Col>
            </Row>
          </div>
          <super_table @onSelectionChange="handleSelectionChange" :pageSize="countPerPage" :current.sync="currentTagPage" @onSearch="onTableSearch" :data="tagData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="tagDataCount"></super_table>
        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px',marginTop:'10px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>设置面板</p></Col>
            </Row>
          </div>
          <div v-if="hasFlushAccess">
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
                <Col v-if="this.flushMode==0||this.flushMode==2" span="6">
                  <Input type="text" v-model="flushQueryStr"  placeholder="筛选条件" style="width: 300px" >
                    <Select v-model="flushQuery" slot="prepend" style="width: 100px">
                        <Option value="barCode">条码</Option>
                    </Select>
                  </Input>
                </Col>
                <Col v-if="this.flushMode==1||this.flushMode==3" span="6">
                  <Select v-model="flushQueryStr" style="width: 300px">
                    <Option v-for="(item) in routeData" :key="item.id" :value="item.barCode">{{item.barCode}}</Option>
                  </Select>
                </Col>
                <Col span="7">
                <Input  v-model="flushCronExp" placeholder="输入cron表达式" style="width: 360px" >
                  <Button slot="append" @click="isFlushCronModalShow=true">选择时间</Button>
                </Input></Col>
                <Col span="1"><Button type="primary" @click="onFlush">刷新</Button></Col>

            </Row>
          </div>

          <div v-if="isHasLightAccess">
            <Row type="flex" justify="start" align="middle" class="Row" style="marginBottom:4px">
                <Col span="2"><p>闪灯：</p></Col>
                <Col span="4">
                  <Select v-model="lightMode" style="width:220px">
                      <Option :value="0" >对标签</Option>
                      <Option :value="1" >对路由器下所有标签</Option>
                  </Select>
                </Col>
                <Col span="6" v-if="lightMode==0">
                <Input type="text" v-model="lightQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="lightQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
                </Input></Col>
                <Col span="6" v-if="lightMode==1">
                  <Select v-model="lightQueryStr" style="width: 300px">
                    <Option v-for="(item) in routeData" :key="item.id" :value="item.barCode">{{item.barCode}}</Option>
                  </Select>
                </Col>
                <Col span="1"><Button type="primary" @click="onLight">闪灯</Button></Col>
                <Col span="1"><Button type="primary" @click="onLightOff">结束闪灯</Button></Col>
            </Row>
          </div>
          <div v-if="hasRemoveAccess">
            <Row type="flex" justify="start" align="middle" class="Row" style="marginBottom:4px">
                <Col span="2"><p>移除：</p></Col>
                <Col span="4">
                  <Select v-model="removeMode" style="width:220px">
                      <Option :value="0" >对标签</Option>
                      <!-- <Option :value="1" >对路由器下所有标签</Option> -->
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
          <div v-if="hasScanAccess">
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
                <Col span="6" v-if="scanMode==0||scanMode==2">
                <Input type="text" v-model="scanQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="scanQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
                </Input></Col>
                <Col v-if="this.scanMode==1||this.scanMode==3" span="6">
                  <Select v-model="scanQueryStr" style="width: 300px">
                    <Option v-for="(item) in routeData" :key="item.id" :value="item.barCode">{{item.barCode}}</Option>
                  </Select>
                </Col>
                <Col span="7">
                <Input  v-model="scanCronExp" placeholder="输入cron表达式" style="width: 360px" >
                  <Button slot="append" @click="isScanCronModalShow=true">选择时间</Button>
                </Input></Col>
                <Col span="1"><Button type="primary" @click="onScan">巡检</Button></Col>
                <Col span="1"><Button type="primary" @click="onScanAll">对所有标签巡检</Button></Col>

            </Row>
          </div>
          <div v-if="hasEditAccess&&hasStatusAccess">
            <Row type="flex" justify="start" align="middle" class="Row" style="marginBottom:4px">
                <Col span="2"><p>状态：</p></Col>
                <Col span="4">
                  <Select v-model="statusMode" style="width:220px">
                      <Option :value="0" >对标签</Option>
                      <Option :value="1" >对路由器</Option>
                  </Select>
                </Col>
                <Col span="6" v-if="this.statusMode==0">
                <Input type="text" v-model="statusQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="statusQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">条码</Option>
                  </Select>
                </Input></Col>
                <Col v-if="this.statusMode==1" span="6">
                  <Select v-model="statusQueryStr" style="width: 300px">
                    <Option v-for="(item) in routeData" :key="item.id" :value="item.barCode">{{item.barCode}}</Option>
                  </Select>
                </Col>
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
// TODO 翻页选择缓存
import super_table from '@/components/table/supertable.vue'
import cronSelector from '@/components/corn-selector/corn-selector.vue'
import { getAllTag, flushTag, lightTag, removeTag, scanTag, statusTag, scanAll } from '@/api/tag'
import { getAllRoute } from '@/api/route'
import store from '@/store'
export default {
  components: {
    super_table,
    'corn-selector': cronSelector
  },
  data () {
    return {
      routeData: [],
      isTableLoading: false,
      countPerPage: 6,
      currentTagPage: 1,
      tagDataCount: 0,
      tagData: [],
      tableColumns: [
        {
          type: 'selection',
          width: '50'
        },
        {
          title: '价签id',
          key: 'barCode',
          width: '150',
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
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: 'Tag RSSI',
          key: 'tagRssi',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '电量',
          key: 'power',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '通讯状态',
          key: 'isWorking',
          width: '120',
          render: (h, params) => {
            const row = params.row
            const color = row.isWorking === 1 ? 'primary' : 'error'
            const text = row.isWorking === 1 ? '在线' : '离线'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '绑定状态',
          width: '120',
          render: (h, params) => {
            let isBind = true
            if (params.row.goodId === '' || params.row.goodId === 0) {
              isBind = false
            }
            const color = isBind ? 'primary' : 'error'
            const text = isBind ? '已绑' : '未绑'

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
    getAllRoute({ page: 0, count: 100 }).then(res => {
      this.routeData = res.data.data
    })
  },
  computed: {
    isHasLightAccess: () => {
      return store.getters.access.indexOf(1) !== -1
    },
    hasEditAccess: () => {
      return store.getters.access.indexOf(2) !== -1
    },
    hasStatusAccess: () => {
      return store.getters.access.indexOf(12) !== -1
    },
    hasFlushAccess: () => {
      return store.getters.access.indexOf(14) !== -1
    },
    hasScanAccess: () => {
      return store.getters.access.indexOf(15) !== -1
    },
    hasRemoveAccess: () => {
      return store.getters.access.indexOf(17) !== -1
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
      let idArray = this.flushQueryStr.split(',')
      for (let i = 0; i < idArray.length; ++i) {
        params = {}
        this.$set(params, 'cron', this.flushCronExp)
        this.$set(params, 'query', this.flushQuery)
        this.$set(params, 'queryString', idArray[i])
        items.push(params)
      }
      this.$set(data, 'items', items)
      flushTag(data, this.flushMode)
    },
    onLight () {
      let data = {}
      let params = {}
      let items = []
      let idArray = this.lightQueryStr.split(',')
      for (let i = 0; i < idArray.length; ++i) {
        params = {}
        this.$set(params, 'query', this.lightQuery)
        this.$set(params, 'queryString', idArray[i])
        items.push(params)
      }
      this.$set(data, 'items', items)
      lightTag(data, 1, this.lightMode)
    },
    onLightOff () {
      let data = {}
      let params = {}
      let items = []
      let idArray = this.lightQueryStr.split(',')
      for (let i = 0; i < idArray.length; ++i) {
        params = {}
        this.$set(params, 'query', this.lightQuery)
        this.$set(params, 'queryString', idArray[i])
        items.push(params)
      }
      this.$set(data, 'items', items)
      lightTag(data, 0, this.lightMode)
    },
    onRemove () {
      let data = {}
      let params = {}
      let items = []
      let idArray = this.removeQueryStr.split(',')
      for (let i = 0; i < idArray.length; ++i) {
        params = {}
        this.$set(params, 'query', this.removeQuery)
        this.$set(params, 'queryString', idArray[i])
        items.push(params)
      }
      this.$set(data, 'items', items)
      removeTag(data, this.removeMode)
    },
    onScan () {
      let data = {}
      let params = {}
      let items = []
      let idArray = this.scanQueryStr.split(',')
      for (let i = 0; i < idArray.length; ++i) {
        params = {}
        this.$set(params, 'cron', this.scanCronExp)
        this.$set(params, 'query', this.scanQuery)
        this.$set(params, 'queryString', idArray[i])
        items.push(params)
      }
      this.$set(data, 'items', items)
      scanTag(data, this.scanMode).then(res => {
        this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
      })
    },
    onScanAll () {
      scanAll().then(res => {
        this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
      })
    },
    onStatus () {
      let data = {}
      let params = {}
      let items = []
      let idArray = this.statusQueryStr.split(',')
      for (let i = 0; i < idArray.length; ++i) {
        params = {}
        this.$set(params, 'query', this.statusQuery)
        this.$set(params, 'queryString', idArray[i])
        items.push(params)
      }
      this.$set(data, 'items', items)
      statusTag(data, this.statusMode)
    },
    handleSelectionChange (selection) {
      let temp = ''
      for (let i = 0; i < selection.length - 1; ++i) {
        temp = temp + selection[i].barCode + ','
      }
      if (selection.length > 0) {
        temp = temp + selection[selection.length - 1].barCode
        this.flushQueryStr = temp
        this.statusQueryStr = temp
        this.scanQueryStr = temp
        this.lightQueryStr = temp
        this.removeQueryStr = temp
      } else {
        this.flushQueryStr = ''
        this.statusQueryStr = ''
        this.scanQueryStr = ''
        this.lightQueryStr = ''
        this.removeQueryStr = ''
      }
    },
    tagReload () {
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
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
