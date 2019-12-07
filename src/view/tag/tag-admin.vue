<template>
    <div class="container" ref="container">
        <div class="top">
            <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px' }">
                <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="22"><p>价签信息</p></Col>
                    <Col span="2"><Button type="primary" @click="tagReload">刷新</Button></Col>
                </Row>
                </div>
            <super_table @onClick="onTagTableClick" :customRowClassFunc="customRowClass" :pageSize="countPerPage" :current.sync="currentTagPage" @onDoubleClick="onTableClick" @onSearch="onTableSearch" :data="tagData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="tagDataCount"></super_table>
            <Modal @on-cancel='onBindGoodCancel' v-model="isBindGoodModalShow" title="绑定商品" width="1400" @on-ok="onBindGood">
              <super_table  key="3" ref="goodST" @onSearch="onModalGoodTableSearch" @onClick="onMoadlGoodTableClick" :data="goodData" :columns="tableModalGoodColumns" :isLoading="isModalGoodTableLoading" :pageSize="8" :current.sync="currentGoodPage" :dataNum="modalGoodDataCount"></super_table>
            </Modal>
            <Modal v-model="isActionModalShow" title="操作">
              <p>hhh</p>
            </Modal>
            </Card>
        </div>
        <div class="bottom" v-bind:style="{ width: windowWidth*0.98 + 'px' }">
            <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px' }">
                <div slot="title">
                <Row type="flex" justify="start" align="middle">
                    <Col span="22"><p>商品信息</p></Col>
                    <Col span="2"><Button type="primary" @click="goodReload">刷新</Button></Col>
                </Row>
                </div>
                <super_table :pageSize="countPerPage" @onSearch="onRightGoodTableSearch" @onClick="searchTag" :current.sync="currentRightGoodPage" :data="goodRightData" :columns="tableRightGoodColumns" :isLoading="isRightGoodTableLoading" :dataNum="rightGoodDataCount"></super_table>
            </Card>
        </div>

    </div>

</template>
<script>
import tagExpand from '@/components/table/tag-expand.vue'
import super_table from '@/components/table/supertable.vue'
import e_label from '@/components/e-label/e-lable.vue'
import { updateTagComp, getAllTag, bindStyle, bindGood, deleteTag, lightTag, flushTag, removeTag, scanTag, statusTag } from '@/api/tag'
import { getSystemArgs } from '@/api/systemsetting'
import { getAllGood, getGood, getBindedTags, searchGood } from '@/api/good'
import { getAllStyle, getStyle } from '@/api/style'
import { balance } from '@/api/eweigher'
import { coppyArray } from '@/libs/util'
import store from '@/store'
export default {
  components: {
    e_label,
    tagExpand,
    super_table
  },
  data () {
    return {
      shopNumber: '',
      searchState: 0,
      searchData: {},
      currentActionId: '',
      isActionModalShow: false,
      windowWidth: 0,
      isTableLoading: false,
      isRightGoodTableLoading: false,
      isModalGoodTableLoading: false,
      isModalStyleTableLoading: false,
      tagDataCount: 0,
      rightGoodDataCount: 0,
      modalGoodDataCount: 0,
      modalStyleDataCount: 0,
      countPerPage: 5,
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
          width: 40,
          align: 'center',
          indexMethod: (row) => {
            return row._index + 1 + (this.currentTagPage - 1) * this.countPerPage
          }
        },
        {
          title: '价签条码',
          key: 'barCode',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '价签类型',
          width: '118',
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
            return h('p', size + type + '屏幕')
          }
        },
        {
          title: '店铺',
          key: 'shopNameAndShopNumber'
        },
        {
          title: '商品条码/名称',
          width: '200',
          key: 'goodBarCodeAndName'
        },
        {
          title: '商品数量',
          key: 'goodNumber',
          width: '50',
          render: (h, params) => {
            return h('InputNumber', {
              attrs: {
                style: 'width: 48px'
              },
              props: {
                size: 'small',
                value: params.row.goodNumber,
                disabled: !this.hasBaseTagAccess,
                activeChange: false,
                readonly: this.isOpenEBlance === 1,
                min: 0
              },
              on: {
                'on-change': (val) => {
                  let data = {}
                  let tparams = {}
                  let items = []
                  tparams = {}
                  this.$set(tparams, 'query', 'id')
                  this.$set(tparams, 'queryString', params.row.id)
                  items.push(tparams)
                  this.$set(data, 'items', items)
                  updateTagComp(data, val).then(res => {
                    this.$Message.info('修改数量成功')
                  }).catch(e => {
                    this.$Message.error('修改失败')
                    this.tagReload()
                  })
                }
              }
            })
          }
        },
        {
          title: 'AP/信道',
          width: '140',
          key: 'routerBarCodeAndChannelId'
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
          title: '绑定样式',
          key: 'styleId',
          width: '180',
          render: (h, params) => {
            let styleFiltters = []
            if (params.row.goodId === 0 || params.row.styleId === 0) {
              styleFiltters = params.row.styles.filter((item) => {
                return item.isPromote === 0
              })
            } else {
              let isPromote = params.row.style.isPromote
              styleFiltters = params.row.styles.filter((item) => {
                return item.isPromote === isPromote
              })
            }
            return h('Select', {
              props: {
                value: params.row.styleId,
                transfer: true,
                disabled: !this.hasBindTagAccess
              },
              attrs: {
                style: 'padding-left:10px;padding-right:10px;text-align:left;'
              },
              on: {
                'on-change': (val) => {
                  this.onBindStyle(params.row.id, val)
                }
              }
            },
            styleFiltters.map((item) => {
              return h('Option', {
                props: {
                  value: item.id,
                  label: item.name
                }
              })
              // if(that.isStyleContain(item,that.filterStyleData)){
              //   return h('Option', {
              //     props: {
              //       value: item.id,
              //       label: item.styleType
              //     }
              //   })
              // }else{
              //   return
              // }
            })
            )
          }
        },
        {
          title: '通讯状态',
          key: 'isWorking',
          width: '100',
          render: (h, params) => {
            let row = params.row
            let isWorking = row.execTime === '' && row.completeTime === ''
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
          width: '100',
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
          width: '170',
          align: 'center',
          render: (h, params) => {
            let isCalOpen = false
            if (params.row.goodId !== 0 && params.row.goodId !== null) {
              isCalOpen = params.row.goodIsComputeOpen === 1
            }
            let temp = this.tagData.find(function (item) { return item.barCode === params.row.barCode })
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
                    this.onBind(temp.id, temp.shopNameAndShopNumber)
                  }
                }
              }, '绑定'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送解绑命令')
                    this.onUnBind(temp)
                  }
                }
              }, '解绑'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送闪灯命令')
                    lightTag(data, 1, 0).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '闪灯'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送熄灯命令')
                    lightTag(data, 0, 0).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '熄灯'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送刷屏命令')
                    flushTag(data, 0).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '刷屏'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送巡检命令')
                    scanTag(data, 0).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '巡检'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送禁用命令')
                    statusTag(data, 0).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '禁用'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送启用命令')
                    statusTag(data, 1).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '启用'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    var that = this
                    this.$Modal.confirm({
                      title: '警告',
                      content: '确定移除该价签吗？',
                      onOk: function () {
                        removeTag(data, 0).then(res => { that.getTagTableData({ page: that.currentTagPage - 1, count: that.countPerPage, queryId: this.tagQueryId, queryString: this.tagQueryString }) }).catch(e => { this.tagReload() })
                      }
                    })
                  }
                }
              }, '移除')
            ]
            let dzcListItem = [
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送获取计量数据命令')
                    balance(0, data).then(res => this.tagReload())
                  }
                }
              }, '获取计量数据'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送获取电子秤电量命令')
                    balance(3, data).then(res => this.tagReload())
                  }
                }
              }, '获取电子秤电量')
            ]
            if (this.hasBindTagAccess) {
              if (this.hasBaseTagAccess) {
                if (this.hasHighTagAccess) {
                } else {
                  listitem.splice(6, 3)
                }
              } else {
                listitem.splice(2, 4)
                if (this.hasHighTagAccess) {
                } else {
                  listitem.splice(2, 3)
                }
              }
            } else {
              listitem.splice(0, 2)
              if (this.hasBaseTagAccess) {
                if (this.hasHighTagAccess) {
                } else {
                  listitem.splice(3, 3)
                }
              } else {
                listitem.splice(0, 4)
                if (this.hasHighTagAccess) {
                } else {
                  listitem.splice(0, 3)
                }
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
                    size: 'small',
                    disabled: listitem.length === 0
                  },
                  style: {
                    margin: '2px'
                  }
                }, '操作'),
                h('DropdownMenu', {
                  slot: 'list'
                }, listitem)
              ]),
              h('Dropdown', {
                props: {
                  trigger: 'click',
                  transfer: true
                }
              }, [
                h('Button', {
                  style: {
                    marginRight: '5px',
                    display: this.isOpenEBlance === 1 || this.isOpenEBlance === 2 ? 'inline-block' : 'none'
                  },
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: !this.hasHighTagAccess || !isCalOpen
                  }
                }, '计量'),
                h('DropdownMenu', {
                  slot: 'list'
                }, dzcListItem)
              ]),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: !this.hasHighTagAccess
                },
                style: {
                  margin: '2px'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    let temp = this.tagData.find(function (item) { return item.barCode === params.row.barCode })
                    this.remove(temp.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      goodRightData: [],
      tableRightGoodColumns: [
        {
          title: '商品名称',
          key: 'name',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '商品条码',
          key: 'barCode',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '原价',
          key: 'price',
          render: (h, params) => {
            let t = params.row.price.toString()
            if (t.indexOf('.') === -1) {
              t = t + '.00'
            } else {
              if (t.split('.')[1].length < 2) {
                t = t + '0'
              }
            }
            return h('span', {}, t)
          }
        },
        {
          title: '价格',
          key: 'promotePrice',
          render: (h, params) => {
            let t = params.row.promotePrice.toString()
            if (t.indexOf('.') === -1) {
              t = t + '.00'
            } else {
              if (t.split('.')[1].length < 2) {
                t = t + '0'
              }
            }
            return h('span', {}, t)
          }
        },
        {
          title: '促销原因',
          key: 'promotionReason'
        },
        {
          title: '货号',
          key: 'shelfNumber',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '价签数量',
          render: (h, params) => {
            return h('p', params.row.tagIdList.length)
          }
        }
      ],
      goodData: [],
      tableModalGoodColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          indexMethod: (row) => {
            return row._index + 1 + (this.currentGoodPage - 1) * 8
          }
        },
        {
          title: '条码',
          key: 'barCode',
          width: '200',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '名称',
          key: 'name',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '产地',
          key: 'origin',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '供货商',
          key: 'provider',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '单位',
          key: 'unit',
          width: '70',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '原价',
          key: 'price',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '价格',
          key: 'promotePrice',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '货号',
          key: 'shelfNumber',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '规格',
          key: 'spec',
          width: '70',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '类别',
          key: 'category',

          filter: {
            type: 'Input'
          }
        },
        {
          title: '状态',
          key: 'waitUpdate',
          width: '180',
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
      styleData: [],
      tableModalStyleColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '样式id',
          key: 'id',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '样式名称',
          key: 'styleType',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '宽度',
          key: 'width',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '高度',
          key: 'height',
          filter: {
            type: 'Input'
          }
        }
      ],
      isBindModalShow: false,
      isBindGoodModalShow: false,
      currentStep: 0,
      bindGoodSelectId: 0,
      bindStyleSelectId: 0,
      bindTagId: 0,
      item: {
        itemName: '测试商品名称1',
        itemUnit: '罐',
        itemNorm: '205g',
        itemCategory: '衣物',
        itemOrigin: '北京',
        itemNo: '00012',
        itemQRCode: '692226641428',
        itemBarCode: '692226641428',
        itemStock: '110',
        itemisOnSale: true,
        itemPrice: '10.19',
        itemOnSalePrice: '444.44',
        labelStyle: '1'
      },
      selectedData: {},
      infoModal: false,
      currentTagPage: 1,
      currentGoodPage: 1,
      currentStylePage: 1,
      currentRightGoodPage: 1,
      filterStyleData: [],
      isOpenEBlance: -1,
      tagQueryId: null,
      tagQueryString: null,
      shopQueryId: null,
      shopQueryString: null
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
    getSystemArgs().then(res => {
      this.isOpenEBlance = res.data.data[0].computeType
    })
  },
  created () {
    this.currentTagPage = 1
    this.currentRightGoodPage = 1
    this.currentGoodPage = 1
    this.currentStylePage = 1
    this.getRightGoodTableData({ page: this.currentRightGoodPage - 1, count: this.countPerPage, queryId: this.shopQueryId, queryString: this.shopQueryString })
    this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage, queryId: this.tagQueryId, queryString: this.tagQueryString })
    // this.getGoodTableData({ page: this.currentGoodPage - 1, count: 8 })
    // getAllStyle({ page: 0, count: 1 }).then(res => {
    //   this.getStyleTableData({ page: this.currentStylePage - 1, count: res.data.code })
    // })
  },
  watch: {
    currentTagPage () {
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage, queryId: this.tagQueryId, queryString: this.tagQueryString })
    },
    currentGoodPage () {
      this.getGoodTableData({ page: this.currentGoodPage - 1, count: 8, queryId: 'shopNumber', queryString: this.shopNumber })
    },
    currentStylePage () {
      this.getStyleTableData({ page: this.currentStylePage - 1, count: 13 })
    },
    currentRightGoodPage () {
      this.getRightGoodTableData({ page: this.currentRightGoodPage - 1, count: this.countPerPage, queryId: this.shopQueryId, queryString: this.shopQueryString })
    }
  },
  computed: {
    hasBaseTagAccess: () => {
      return store.getters.access.indexOf(3) !== -1
    },
    hasBindTagAccess: () => {
      return store.getters.access.indexOf(4) !== -1
    },
    hasHighTagAccess: () => {
      return store.getters.access.indexOf(5) !== -1
    }
  },
  methods: {
    customRowClass (row, index) {
      if (!store.getters.isWar) {
        return ''
      } else {
        let isReplenish = false
        if (row.isReplenish != null && row.isReplenish === 1) {
          isReplenish = true
        }
        if (isReplenish) {
          return 'replenish-class'
        } else {
          return ''
        }
      }
    },
    onClickAction (id) {
      this.isActionModalShow = true
      this.currentActionId = id
    },
    getTagTableData (page, count) {
      this.searchState = 0
      var that = this
      that.isTableLoading = true
      getAllTag(page, count).then(res => {
        const data = res.data.data
        if (data.length === 0 && that.currentTagPage > 1) {
          console.log('hhh')
          that.currentTagPage = that.currentTagPage - 1
          that.getTagTableData({ page: that.currentTagPage - 1, count: that.countPerPage, queryId: this.tagQueryId, queryString: this.tagQueryString })
          return
        }
        that.tagDataCount = res.data.code
        that.tagData = data
        that.isTableLoading = false
      })
    },
    remove (id) {
      var that = this
      let dId = id
      console.log(id)
      this.$Modal.confirm({
        title: '警告',
        content: '该操作会导致价签数据永远从数据库移除，确定删除该价签吗？（非专业人员和维护人员请勿执行此操作）',
        onOk: function () {
          deleteTag(dId).then(res => {
            that.getTagTableData({ page: that.currentTagPage - 1, count: that.countPerPage, queryId: this.tagQueryId, queryString: this.tagQueryString })
          })
        }
      })
    },
    onTableSearch (search) {
      this.searchData = search
      var key = Object.keys(search)
      if (key.length === 0) {
        this.searchState = 0
        this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
        this.tagQueryId = null
        this.tagQueryString = null
        return
      }
      var value = search[key[0]]
      this.tagQueryId = key[0]
      this.tagQueryString = value
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage, queryId: this.tagQueryId, queryString: this.tagQueryString })
      this.searchState = 1
    },
    onRightGoodTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getRightGoodTableData({ page: this.currentRightGoodPage - 1, count: this.countPerPage })
        this.shopQueryId = null
        this.shopQueryString = null
        return
      }
      var value = search[key[0]]
      this.shopQueryId = key[0]
      this.shopQueryString = value
      this.getRightGoodTableData({ page: this.currentRightGoodPage - 1, count: this.countPerPage, queryId: this.shopQueryId, queryString: this.shopQueryString })
    },
    onBind (id, shopNumber) {
      this.shopNumber = ''
      if (shopNumber.indexOf('_') !== -1) {
        this.shopNumber = shopNumber.split('_')[1]
      }
      this.getGoodTableData({ page: 0, count: 8, queryId: 'shopNumber', queryString: this.shopNumber })
      this.bindTagId = id
      this.isBindGoodModalShow = true
    },
    getRightGoodTableData ({ page, count, queryId, queryString }) {
      var that = this
      that.isRightGoodTableLoading = true
      getAllGood({ page: page, count: count, queryId: queryId, queryString: queryString }).then(res => {
        const data = res.data.data
        that.rightGoodDataCount = res.data.code
        that.goodRightData = data
        that.isRightGoodTableLoading = false
      })
    },
    getGoodTableData ({ page, count, queryId, queryString }) {
      var that = this
      that.isModalGoodTableLoading = true
      let data = {}
      let tparams = {}
      let items = []
      tparams = {}
      this.$set(tparams, 'query', queryId)
      this.$set(tparams, 'queryString', queryString)
      items.push(tparams)
      this.$set(data, 'items', items)
      searchGood(data, page, count).then(res => {
        const data = res.data.data
        that.modalGoodDataCount = res.data.code
        that.goodData = data
        that.isModalGoodTableLoading = false
      })
    },
    getStyleTableData ({ page, count, queryId, queryString }) {
      var that = this
      that.isModalStyleTableLoading = true
      getAllStyle({ page: page, count: count, queryId: queryId, queryString: queryString }).then(res => {
        const data = res.data.data
        that.modalStyleDataCount = res.data.code
        that.filterStyleData = coppyArray(data)
        that.styleData = data
        that.isModalStyleTableLoading = false
      })
    },
    onModalGoodTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getGoodTableData({ page: 0, count: 8 })
        this.currentGoodPage = 1
        return
      }
      var value = search[key[0]]
      this.getGoodTableData({ page: this.currentGoodPage - 1, count: 8, queryId: key[0], queryString: value })
    },
    onMoadlGoodTableClick (rowData) {
      this.bindGoodSelectId = rowData.id
    },
    onModalStyleTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getStyleTableData({ page: 0, count: 13 })
        this.currentStylePage = 1
        return
      }
      var value = search[key]
      this.getStyleTableData({ page: this.currentStylePage - 1, count: 13, queryId: key[0], queryString: value })
    },
    onMoadlStyleTableClick (rowData) {
      this.bindStyleSelectId = rowData.id
    },
    getLabelData (gid, sid) {
      var that = this
      getStyle(sid).then(res => {
        const dispData = res.data.data
        getGood(gid).then(res => {
          const goodInfo = res.data.data[0]
          that.item.itemName = goodInfo.name
          that.item.itemUnit = goodInfo.unit
          that.item.itemNorm = goodInfo.spec
          that.item.itemCategory = goodInfo.category
          that.item.itemOrigin = goodInfo.origin
          that.item.itemNo = goodInfo.shelfNumber
          that.item.itemQRCode = goodInfo.qrCode
          that.item.itemBarCode = goodInfo.barCode
          that.item.itemPrice = goodInfo.price + ''
          that.itemOnSalePrice = goodInfo.promotePrice + ''
          let id = that.bindTagId
          let currentSelectTag = that.tagData.find(function (item) { return item.id === id })

          that.$refs.label_canvas.initData(dispData, currentSelectTag.resolutionWidth, currentSelectTag.resolutionHeight, null)
        })
      })
    },
    onNextStep () {
      if (this.currentStep === 1) {
        if (this.bindStyleSelectId === 0) {
          this.$Modal.error({
            title: '错误',
            content: '请选择绑定的样式'
          })
        } else {
          this.getLabelData(this.bindGoodSelectId, this.bindStyleSelectId)
          this.currentStep = this.currentStep + 1
        }
      } else if (this.currentStep === 0) {
        if (this.bindGoodSelectId === 0) {
          this.$Modal.error({
            title: '错误',
            content: '请选择绑定的商品'
          })
        } else {
          this.currentStep = this.currentStep + 1
        }
      }
    },
    onPreStep () {
      this.currentStep--
    },
    onTableClick (currentRow) {
      this.infoModal = true
      this.selectedData = this.tagData.find(function (item) { return item.id === currentRow.id })
    },
    searchTag (currentRow) {
      var that = this
      that.isTableLoading = true
      getBindedTags({ queryId: 'barCode', queryString: currentRow.barCode }).then(res => {
        that.tagDataCount = res.data.code
        const data = res.data.data
        that.tagData = data
        that.isTableLoading = false
      })
    },
    goodReload () {
      this.getRightGoodTableData({ page: this.currentGoodPage - 1, count: this.countPerPage, queryId: this.shopQueryId, queryString: this.shopQueryString })
    },
    tagReload () {
      console.log(this.searchState)
      if (this.searchState === 0) {
        this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage, queryId: this.tagQueryId, queryString: this.tagQueryString })
      } else {
        this.onTableSearch(this.searchData)
      }
    },
    onTagTableClick (currentRow) {
      var that = this
      that.isRightGoodTableLoading = true
      if (currentRow.goodId === '' || currentRow.goodId === 0) {
        that.goodRightData = []
        that.isRightGoodTableLoading = false
        return
      }
      getGood(currentRow.goodId).then(res => {
        that.rightGoodDataCount = res.data.code
        const data = res.data.data
        that.goodRightData = data
        that.isRightGoodTableLoading = false
      })
    },
    onBindStyle (tid, sid) {
      var that = this
      if (sid) {
        bindStyle(tid, sid).then(res => {
          that.tagReload()
          that.$Modal.success({
            title: '消息',
            content: '成功绑定样式'
          })
        }).catch(e => {
          this.tagReload()
        })
      }
      // let temp = this.tagData.find(function (item) { return item.id === tid })
      // if (temp.goodId !== 0) {
      //   getGood(temp.goodId).then(res => {
      //     let goodTemp = res.data.data
      //     if (sid % 2 === 0) {
      //       goodTemp.isPromote = 0
      //     } else {
      //       goodTemp.isPromote = 1
      //     }
      //     updateGood(goodTemp)
      //   })
      // }
    },
    onBindGoodCancel () {
      this.currentGoodPage = 1
      this.bindGoodSelectId = 0
    },
    onBindGood () {
      var that = this
      let mode = '1'
      this.currentGoodPage = 1
      if (that.bindGoodSelectId === 0) {
        that.$Modal.error({
          title: '错误',
          content: '请选择商品'
        })
        return
      }
      let temp = that.tagData.filter((item) => { return item.id === that.bindTagId })
      if (temp[0].goodId !== 0 && temp[0].goodId !== null) {
        mode = '2'
      }
      this.$Message.info('发送绑定命令')
      bindGood('id', that.bindGoodSelectId, 'id', that.bindTagId, mode).then(res => {
        that.tagReload()
        that.$Modal.success({
          title: '消息',
          content: '成功绑定商品'
        })
        that.isRightGoodTableLoading = true
        getGood(that.bindGoodSelectId).then(res => {
          that.rightGoodDataCount = res.data.code
          const data = res.data.data
          that.goodRightData = data
          that.isRightGoodTableLoading = false
          that.$refs.goodST.clearHighlight()
          that.bindGoodSelectId = 0
        })
      }).catch(e => {
        that.tagReload()
      })
    },
    isStyleContain (data, arr) {
      for (let i = 0; i < arr.length; ++i) {
        if (data.id === arr[i].id) {
          return true
        }
      }
      return false
    },
    onUnBind (data) {
      if (data.goodId === null || data.goodId === 0) {
        this.$Message.error('该标签未绑定商品')
        return
      }
      bindGood('id', data.goodId, 'id', data.id, '0').then(res => {
        this.$Message.info('解绑成功')
        this.goodRightData = []
        this.tagReload()
      }).catch(e => {
        this.tagReload()
      })
    }
  }

}
</script>
<style>
.container{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.top{
  flex-shrink: 1;
  display: flex;
}
.bottom{
  margin-top: 20px;
  flex-shrink: 1;
  display: flex;
}
</style>
