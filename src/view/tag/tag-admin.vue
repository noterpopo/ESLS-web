<template>
    <div class="container" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>价签信息</p></Col>
            </Row>
          </div>
          <super_table  @onSearch="onTableSearch" @onClick="onTableClick" :data="tagData" :columns="tableColumns" :isLoading="isTableLoading" :pageNum="pageNum"></super_table>
        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px', marginTop:'10px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>设置面板</p></Col>
            </Row>
          </div>
          <div>
            <Row type="flex" justify="start" align="middle" class="Row">
                <Col span="2"><p>定期刷新：</p></Col>
                <Col span="4">
                  <Select v-model="flushMode" style="width:220px">
                      <Option :value="0" >对标签刷新</Option>
                      <Option :value="1" >为对指定路由器的所有标签刷新</Option>
                      <Option :value="3" >对标签定期刷新</Option>
                      <Option :value="4" >对路由器定期刷新</Option>
                  </Select>
                </Col>
                <Col span="6">
                <Input type="text" v-model="flushQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="flushQuery" slot="prepend" style="width: 100px">
                      <Option value="id">id</Option>
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
            <Row type="flex" justify="start" align="middle" class="Row">
                <Col span="2"><p>闪灯：</p></Col>
                <Col span="4">
                  <Select v-model="lightMode" style="width:220px">
                      <Option :value="0" >对标签</Option>
                      <Option :value="1" >对路由器</Option>
                  </Select>
                </Col>
                <Col span="6">
                <Input type="text" v-model="lightQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="lightQuery" slot="prepend" style="width: 100px">
                      <Option value="id">id</Option>
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
            <Row type="flex" justify="start" align="middle" class="Row">
                <Col span="2"><p>移除：</p></Col>
                <Col span="4">
                  <Select v-model="removeMode" style="width:220px">
                      <Option :value="0" >对标签</Option>
                      <Option :value="1" >对路由器</Option>
                  </Select>
                </Col>
                <Col span="6">
                <Input type="text" v-model="removeQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="removeQuery" slot="prepend" style="width: 100px">
                      <Option value="id">id</Option>
                  </Select>
                </Input></Col>
                <Col span="1"><Button type="primary" @click="onLight">移除</Button></Col>

            </Row>
          </div>
          <div>
            <Row type="flex" justify="start" align="middle" class="Row">
                <Col span="2"><p>定期巡检：</p></Col>
                <Col span="4">
                  <Select v-model="scanMode" style="width:220px">
                      <Option :value="0" >对标签巡检</Option>
                      <Option :value="1" >为对指定路由器的所有标签巡检</Option>
                      <Option :value="3" >对标签定期巡检</Option>
                      <Option :value="4" >对路由器定期巡检</Option>
                  </Select>
                </Col>
                <Col span="6">
                <Input type="text" v-model="scanQueryStr"  placeholder="筛选条件" style="width: 300px" >
                  <Select v-model="scanQuery" slot="prepend" style="width: 100px">
                      <Option value="id">id</Option>
                  </Select>
                </Input></Col>
                <Col span="7">
                <Input  v-model="scanCronExp" placeholder="输入cron表达式" style="width: 360px" >
                  <Button slot="append" @click="isScanCronModalShow=true">选择时间</Button>
                </Input></Col>
                <Col span="1"><Button type="primary" @click="onFlush">巡检</Button></Col>

            </Row>
          </div>
          <div>
            <Row type="flex" justify="start" align="middle" class="Row">
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
                      <Option value="id">id</Option>
                  </Select>
                </Input></Col>
                <Col span="2">
                  <Select v-model="isStatus" style="width: 100px">
                      <Option :value="0">禁用</Option>
                      <Option :value="1">启用</Option>
                  </Select>
                </Col>
                <Col span="1"><Button type="primary" @click="onLight">修改</Button></Col>

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
import { getAllTag } from '@/api/tag'
export default {
  components: {
    super_table,
    'corn-selector': cronSelector
  },
  data () {
    return {
      windowWidth: 0,
      isTableLoading: false,
      pageNum: 0,
      countPerPage: 10,
      tagData: [],
      tableColumns: [
        {
          title: 'id',
          key: 'id',
          width: '100',
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
          title: '硬件版本',
          key: 'hardwareVersion',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '软件版本',
          key: 'softwareVersion',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '地址',
          key: 'tagAddress',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '宽',
          key: 'resolutionWidth',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '高',
          key: 'resolutionHeight',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '工作状态',
          key: 'isWorking',
          width: '140',
          render: (h, params) => {
            const row = params.row
            const color = row.isWorking === 1 ? 'primary' : 'error'
            const text = row.isWorking === 1 ? '工作中' : '发生错误'

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
          title: '绑定商品',
          key: 'goodId',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '绑定样式',
          key: 'styleId',
          width: '70',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '路由器',
          key: 'routerId',

          filter: {
            type: 'Input'
          }
        },
        {
          title: '状态',
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
                    this.editStyle(params.row.id, params.row.width, params.row.height)
                  }
                }
              }, '绑定'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  margin: '2px'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    this.remove(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      flushCronExp: '',
      flushQueryStr: '',
      flushQuery: 'id',
      flushMode: 0,
      lightQueryStr: '',
      lightQuery: 'id',
      lightMode: 0,
      isLight: 0,
      removeQueryStr: '',
      removeQuery: 'id',
      removeMode: 0,
      scanCronExp: '',
      scanQueryStr: '',
      scanQuery: 'id',
      scanMode: 0,
      statusQueryStr: '',
      statusQuery: 'id',
      statusMode: 0,
      isStatus: 0,
      isFlushCronModalShow: false,
      isScanCronModalShow: false

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
    this.getTagTableData({ page: this.pageNum, count: this.countPerPage })
  },
  methods: {
    getTagTableData (page, count) {
      var that = this
      that.isTableLoading = true
      getAllTag(page, count).then(res => {
        const data = res.data.data
        that.tagData = data
        that.isTableLoading = false
      })
    },
    onTableClick () {
      this.settingModal = true
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      var value = search[key]
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
    }
  }

}
</script>
<style>
.container{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: stretch;
    align-content: center;
}
</style>
