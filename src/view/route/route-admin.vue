<template>
    <div  ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                    <Col span="22"><p>路由器信息</p></Col>
                    <Col span="2"><Button type="primary" @click="routeReload">刷新</Button></Col>
              </Row>
          </div>
          <super_table @onSelectionChange="handleSelectionChange" @onClick="onTableClick" :pageSize="countPerPage" :current.sync="currentPage" @onSearch="onTableSearch" :data="routeData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="routeDataCount"></super_table>
        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px',marginTop:'10px'}">
          <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="24"><p>路由器设置</p></Col>
                </Row>
          </div>
          <div v-if="hasChangeAccess" style="display:flex; align-items:center;">
            <span>指定属性更换路由器</span>
            <Input style="margin-left:8px;width: 300px" type="text" v-model="tagQueryString"  placeholder="筛选条件" >
                  <Select v-model="tagQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">源条码</Option>
                  </Select>
            </Input>
            <Input type="text" style="margin-left:8px;width: 300px" v-model="routeQueryString"  placeholder="目的条件" >
                  <Select v-model="routeQuery" slot="prepend" style="width: 100px">
                      <Option value="barCode">目的条码</Option>
                  </Select>
            </Input>
            <Button style="margin-left:10px;" type="primary" @click="changeRoute">确定</Button>
          </div>
        </Card>
    </div>
</template>
<script>
import { getAllRoute, changeRoute, scanRoute, scanAll, settingRoute, updateRouter } from '@/api/route'
import super_table from '@/components/table/supertable.vue'
import routerExpand from '@/components/table/router-expand.vue'
import { flushTag, scanTag } from '@/api/tag'
import store from '@/store'
import { getAllShop } from '@/api/shop'
export default {
  components: {
    routerExpand,
    super_table
  },
  data () {
    return {
      channel: '',
      ip: '',
      windowWidth: 0,
      isTableLoading: false,
      countPerPage: 6,
      currentPage: 1,
      routeDataCount: 0,
      shopData: [],
      routeData: [],
      tableColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          indexMethod: (row) => {
            return row._index + 1 + (this.currentPage - 1) * this.countPerPage
          }
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
          title: 'AP条码',
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
          title: '店铺',
          width: '200',
          render: (h, params) => {
            let isDisable = store.getters.access.indexOf(2) === -1
            return h('Select', {
              props: {
                value: params.row.shopId,
                disabled: isDisable
              },
              on: {
                'on-change': (val) => {
                  this.onUpdateShop(params.row, val)
                }
              }
            }, this.shopData.map((item) => {
              return h('Option', {
                props: {
                  value: item.id,
                  label: item.name
                }
              })
            })
            )
          }
        },
        {
          title: '状态',
          key: 'isWorking',
          width: 140,
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
          },
          filter: {
            type: 'Input'
          }
        },
        {
          title: '是否启用',
          key: 'state',
          render: (h, params) => {
            let StatusAccess = store.getters.access.indexOf(12) === -1
            const row = params.row
            const isUsable = row.state === 1
            return h('i-switch', {
              props: {
                value: isUsable,
                size: 'large',
                disabled: StatusAccess
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
          title: '操作',
          key: 'action',
          width: '80',
          align: 'center',
          render: (h, params) => {
            let temp = this.routeData.find(function (item) { return item.barCode === params.row.barCode })
            let data = {}
            let tparams = {}
            let items = []
            tparams = {}
            this.$set(tparams, 'query', 'id')
            this.$set(tparams, 'queryString', temp.id)
            items.push(tparams)
            this.$set(data, 'items', items)
            // let hasBindGoodAccess = store.getters.access.indexOf(3) === -1
            return h('div', [
              h('Dropdown', {
                props: {
                  trigger: 'click'
                }
              }, [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  }
                }, '操作'),
                h('DropdownMenu', {
                  slot: 'list'
                }, [
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        this.$Modal.confirm({
                          title: '设置IP',
                          render: (h, params) => {
                            return h('Input', {
                              props: {
                                placeholder: '输入IP',
                                value: temp.outNetIp
                              },
                              on: {
                                'on-change': (event) => {
                                  temp.outNetIp = event.target.value
                                }
                              }
                            })
                          },
                          onOk: () => {
                            updateRouter(temp).then(res => {
                              settingRoute(data).then(res => {
                                this.$Message.info('设置成功')
                              })
                            })
                          }
                        })
                      }
                    }
                  }, 'IP设置'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        this.$Modal.confirm({
                          title: '设置信道',
                          render: (h, params) => {
                            return h('Input', {
                              props: {
                                placeholder: '输入信道',
                                value: temp.channelId
                              },
                              on: {
                                'on-change': (event) => {
                                  temp.channelId = event.target.value
                                }
                              }
                            })
                          },
                          onOk: () => {
                            updateRouter(temp).then(res => {
                              settingRoute(data).then(res => {
                                this.$Message.info('设置成功')
                              })
                            })
                          }
                        })
                      }
                    }
                  }, '信道设置'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        scanRoute(data, 0).then(res => {
                          this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
                        })
                      }
                    }
                  }, '读取AP信息'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        scanTag(data, 1)
                      }
                    }
                  }, '标签巡检'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        flushTag(data, 1)
                      }
                    }
                  }, '标签刷屏')
                ])
              ])
            ])
          }
        }
      ],
      currentSelectRow: {},
      tagQuery: 'barCode',
      tagQueryString: '',
      routeQuery: 'barCode',
      routeQueryString: ''
    }
  },
  created () {
    this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
    getAllShop({ page: 0, count: 100 }).then(res => {
      this.shopData = res.data.data
    })
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
  computed: {
    hasEditAccess: () => {
      return store.getters.access.indexOf(2) !== -1
    },
    hasSettingAccess: () => {
      return store.getters.access.indexOf(25) !== -1
    },
    hasChangeAccess: () => {
      return store.getters.access.indexOf(26) !== -1
    },
    hasScanAccess: () => {
      return store.getters.access.indexOf(27) !== -1
    },
    hasRemoveAccess: () => {
      return store.getters.access.indexOf(37) !== -1
    }
  },
  methods: {
    onUpdateShop (row, shopId) {
      row.shopId = shopId
      updateRouter(row).then(res => {
        this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
      })
    },
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
    changeRoute () {
      changeRoute(this.tagQuery, this.tagQueryString, this.routeQuery, this.routeQueryString)
    },
    onAllScan () {
      scanAll().then(res => {
        this.getRouteTableData({ page: 0, count: this.countPerPage })
      })
    },
    routeReload () {
      this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
    },
    handleSelectionChange (selection) {

    }
  }
}
</script>
