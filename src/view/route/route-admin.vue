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
          <Button v-if="hasProAccess" type="primary" @click="onUploadClick">上传路由器升级文件</Button>
          <Modal v-model="isUploadShow" title="上传路由器升级文件" @on-ok="uploadFile">
            <div>
              <Upload
                  ref="upload"
                  style="margin-top:10px;"
                  multiple
                  :before-upload="handleBeforeUpload"
                  :on-success="onUploadSucess"
                  :on-error="onUploadFail"
                  :format="['bin']"
                  :show-upload-list="true"
                  :headers="headers"
                  type="drag"
                  :action="upLaodUrl">
                  <div style="padding: 20px 0;">
                      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                      <p>点击上传或者拖拽文件上传</p>
                  </div>
              </Upload>
              <p>{{'上传文件为：'+uploadFileName}}</p>
              </div>
            </Modal>
        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px',marginTop:'10px'}">
          <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="2"><p>价签信息</p></Col>
                    <Col span="22"><p>价签数量:{{tagDataNum}}</p></Col>
                </Row>
          </div>
          <super_table :pageSize="countPerPageTag" :current.sync="currentTagPage" :data="tagData" :columns="tagTableColumns" :isLoading="isTagTableLoading" :dataNum="tagDataNum"></super_table>
        </Card>
    </div>
</template>
<script>
import { getAllRoute, changeRoute, scanRoute, scanAll, settingRoute, updateRouter } from '@/api/route'
import super_table from '@/components/table/supertable.vue'
import routerExpand from '@/components/table/router-expand.vue'
import { flushTag, scanTag, lightTag, testInkScreen, searchTag } from '@/api/tag'
import store from '@/store'
import { getAllShop } from '@/api/shop'
import goodTagExpand from '@/components/table/good-tag-expand.vue'
import config from '@/config'
export default {
  components: {
    routerExpand,
    super_table
  },
  data () {
    return {
      headers: {
        ESLS: store.getters.token
      },
      uploadID: '',
      isUploadShow: false,
      currentTagPage: 1,
      countPerPageTag: 8,
      tagData: [],
      tagTableColumns: [
        {
          type: 'expand',
          width: 30,
          render: (h, params) => {
            return h(goodTagExpand, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          type: 'index',
          width: 60,
          align: 'center',
          indexMethod: (row) => {
            return row._index + 1 + (this.currentTagPage - 1) * this.countPerPageTag
          }
        },
        {
          title: '价签条码',
          key: 'barCode',
          width: '120'
        },
        {
          title: '价签类型',
          width: '110',
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
          render: (h, params) => {
            let result = null
            $.ajax({
              url: getUrl() + '/router/' + params.row.routerId,
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
          title: '电量',
          key: 'power',
          width: '70'
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
          title: '通讯状态',
          width: '116',
          key: 'isWorking',
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
          width: '116',
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
          title: '操作',
          key: 'action',
          width: '70',
          align: 'center',
          render: (h, params) => {
            let temp = this.tagData.find(function (item) { return item.barCode === params.row.barCode })
            let data = {}
            let tparams = {}
            let items = []
            tparams = {}
            this.$set(tparams, 'query', 'id')
            this.$set(tparams, 'queryString', temp.id)
            items.push(tparams)
            this.$set(data, 'items', items)
            return h('div', [
              h('Dropdown', {
                props: {
                  trigger: 'click',
                  transfer: true
                }
              }, [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: !this.hasBaseTagAccess
                  }
                }, '操作'),
                h('DropdownMenu', {
                  slot: 'list'
                }, [
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        lightTag(data, 1, 0).then((res) => {
                          this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag, queryId: 'routerId', queryString: currentRow.id })
                        }).catch(e => {
                          this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag, queryId: 'routerId', queryString: currentRow.id })
                        })
                      }
                    }
                  }, '闪灯'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        lightTag(data, 0, 0).then((res) => {
                          this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag, queryId: 'routerId', queryString: currentRow.id })
                        }).catch(e => {
                          this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag, queryId: 'routerId', queryString: currentRow.id })
                        })
                      }
                    }
                  }, '熄灯'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        flushTag(data, 0).then((res) => {
                          this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag, queryId: 'routerId', queryString: currentRow.id })
                        }).catch(e => {
                          this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag, queryId: 'routerId', queryString: currentRow.id })
                        })
                      }
                    }
                  }, '刷屏'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        scanTag(data, 0).then((res) => {
                          this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag, queryId: 'routerId', queryString: currentRow.id })
                        }).catch(e => {
                          this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag, queryId: 'routerId', queryString: currentRow.id })
                        })
                      }
                    }
                  }, '巡检')
                ])
              ])
            ])
          }
        }
      ],
      isTagTableLoading: false,
      tagDataNum: 0,
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
          width: '60',
          key: 'channelId',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '店铺',
          width: '220',
          render: (h, params) => {
            return h('Select', {
              props: {
                transfer: true,
                value: params.row.shopId,
                disabled: !this.hasHighRouteAccess
              },
              attrs: {
                style: 'padding-left:10px;padding-right:10px;text-align:left;'
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
                size: 'large',
                disabled: !this.hasHighRouteAccess
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
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '80',
          align: 'center',
          render: (h, params) => {
            let newID = ''
            let temp = this.routeData.find(function (item) { return item.barCode === params.row.barCode })
            let data = {}
            let tparams = {}
            let items = []
            tparams = {}
            this.$set(tparams, 'query', 'id')
            this.$set(tparams, 'queryString', temp.id)
            items.push(tparams)
            this.$set(data, 'items', items)
            let listitem = [
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
                    this.$Modal.confirm({
                      title: '新路由条码',
                      render: (h, params) => {
                        return h('Input', {
                          props: {
                            placeholder: '输入条码',
                            value: newID
                          },
                          on: {
                            'on-change': (event) => {
                              newID = event.target.value
                            }
                          }
                        })
                      },
                      onOk: () => {
                        this.changeRoute(params.row.barCode, newID)
                      }
                    })
                  }
                }
              }, '更换AP'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    scanRoute(data, 0).then(res => {
                      this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
                    })
                  }
                }
              }, '读取AP信息'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    lightTag(data, 1, 1)
                  }
                }
              }, '广播闪灯'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    lightTag(data, 0, 1)
                  }
                }
              }, '广播熄灯'),
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
              }, '标签刷屏'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    testInkScreen(data, 1, 1)
                  }
                }
              }, '墨水屏测试1'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    testInkScreen(data, 1, 2)
                  }
                }
              }, '墨水屏测试2'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    testInkScreen(data, 1, 3)
                  }
                }
              }, '墨水屏测试3'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    testInkScreen(data, 1, 4)
                  }
                }
              }, '墨水屏测试4'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    testInkScreen(data, 1, 5)
                  }
                }
              }, '墨水屏测试5')
            ]
            if (this.hasHighRouteAccess) {
              if (this.hasBaseRouteAccess) {
              } else {
                listitem.splice(4, 4)
              }
            } else {
              listitem.splice(0, 4)
              if (this.hasBaseRouteAccess) {
              } else {
                listitem.splice(0, 4)
              }
            }
            return h('div', [
              h('Dropdown', {
                props: {
                  trigger: 'click',
                  transfer: true
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
                }, listitem)
              ])
            ])
          }
        }
      ],
      currentSelectRow: {},
      tagQuery: 'barCode',
      tagQueryString: '',
      routeQuery: 'barCode',
      routeQueryString: '',
      readyFiles: [],
      uploadFileName: '',
      queryId: null,
      queryString: null
    }
  },
  created () {
    this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
    getAllShop({ page: 0, count: 100 }).then(res => {
      this.shopData = res.data.data
    })
  },
  watch: {
    currentPage () {
      this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
    },
    currentTagPage () {
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag, queryId: 'routerId', queryString: currentSelectRow.id })
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
    upLaodUrl: function () {
      return config.baseUrl.dev + '/router/upload'
    },
    hasBaseTagAccess: () => {
      return store.getters.access.indexOf(3) !== -1
    },
    hasBaseRouteAccess: () => {
      return store.getters.access.indexOf(8) !== -1
    },
    hasHighRouteAccess: () => {
      return store.getters.access.indexOf(9) !== -1
    },
    hasProAccess: () => {
      return store.getters.access.indexOf(15) !== -1
    }
  },
  methods: {
    onUploadClick () {
      this.isUploadShow = true
      this.uploadFileName = ''
    },
    getUrl () {
      return config.baseUrl.dev
    },
    uploadFile () {
      console.log('11')
      for (let i = 0; i < this.readyFiles.length; i++) {
        let file = this.readyFiles[i]
        this.$refs.upload.post(file)
      }
    },
    handleBeforeUpload (file) {
      this.readyFiles = []
      if (file.name.indexOf('.bin') !== -1) {
        this.readyFiles.push(file)
        this.uploadFileName = file.name
      } else {
        this.$Message.error('上传文件格式错误')
      }
      return false
    },
    onUploadSucess () {
      this.isUploadShow = false
      this.$Message.info('上传成功')
    },
    onUploadFail () {
      this.isUploadShow = false
      this.$Message.error('上传失败')
    },
    getTagTableData ({ page, count, queryId, queryString }) {
      this.isTagTableLoading = true
      let data = {}
      let items = []
      let tparams = {}
      this.$set(tparams, 'query', queryId)
      this.$set(tparams, 'queryString', queryString)
      items.push(tparams)
      this.$set(data, 'items', items)

      searchTag(data, '=', count, page).then(res => {
        this.tagData = res.data.data
        this.tagDataNum = res.data.code
        this.isTagTableLoading = false
      })
    },
    onUpdateShop (row, shopId) {
      row.shopId = shopId
      updateRouter(row).then(res => {
        this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
      })
    },
    onTableClick (currentRow) {
      this.currentSelectRow = currentRow
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag, queryId: 'routerId', queryString: currentRow.id })
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
        this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
        this.queryId = null
        this.queryString = null
        return
      }
      var value = search[key[0]]
      this.queryId = key[0]
      this.queryString = value
      this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
    },
    changeRoute (sorId, tarID) {
      changeRoute(this.tagQuery, sorId, this.routeQuery, tarID).then(r => {
        let temp = this.routeData.find(function (item) { return item.barCode === sorId })
        temp.state = 0
        updateRouter(temp).then(res => {
          this.$Message.info('交换完成')
        })
      })
    },
    onAllScan () {
      scanAll().then(res => {
        this.getRouteTableData({ page: 0, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
      })
    },
    routeReload () {
      this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
    },
    handleSelectionChange (selection) {

    }
  }
}
</script>
