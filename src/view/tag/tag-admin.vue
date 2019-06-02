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
            <super_table @onClick="onTagTableClick" :pageSize="countPerPage" :current.sync="currentTagPage" @onDoubleClick="onTableClick" @onSearch="onTableSearch" :data="tagData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="tagDataCount"></super_table>
            <Modal @on-cancle='onBindGoodCancel' v-model="isBindGoodModalShow" title="绑定商品" width="1400" @on-ok="onBindGood">
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
import { getAllTag, bindStyle, bindGood, deleteTag, lightTag, flushTag, removeTag, scanTag, statusTag } from '@/api/tag'
import { getAllGood, getGood, getBindedTags } from '@/api/good'
import { getAllStyle, getStyle } from '@/api/style'
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
          title: '商品条码/名称',
          width: '200',
          render: (h, params) => {
            let result = null
            if (params.row.goodId === 0 || params.row.goodId === null) {
              return h('p', '')
            }
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
            return h('p', result.barCode + '_' + result.name)
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
                result = res.data[0].barCode + '_' + res.data[0].channelId
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
          title: '绑定样式',
          key: 'styleId',
          width: '180',
          render: (h, params) => {
            let styleFiltters = []
            let data = {
              items: [
                {
                  'query': 'id',
                  'queryString': params.row.id
                }
              ]
            }
            $.ajax({
              url: 'http://39.108.106.167:8086/tag/styles',
              contentType: 'application/json;charset=utf-8',
              dataType: 'json',
              data: JSON.stringify(data),
              async: false,
              headers: {
                ESLS: store.getters.token
              },
              type: 'post',
              success: (res) => {
                if (params.row.goodId === 0) {
                  styleFiltters = res.data.filter((item) => {
                    return item.isPromote === 0
                  })
                } else {
                  $.ajax({
                    url: 'http://39.108.106.167:8086/style/' + params.row.styleId,
                    async: false,
                    headers: {
                      ESLS: store.getters.token
                    },
                    type: 'get',
                    success: (r) => {
                      let isPromote = r.data[0].isPromote
                      styleFiltters = res.data.filter((item) => {
                        return item.isPromote === isPromote
                      })
                    }
                  })
                }
              }
            })
            return h('Select', {
              props: {
                value: params.row.styleId,
                transfer: true
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
                  label: item.styleType
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
          width: '110',
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
                    size: 'small'
                  }
                }, '操作'),
                h('DropdownMenu', {
                  slot: 'list'
                }, [
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        this.onBind(temp.id)
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
                            removeTag(data, 0).then(res => { that.getTagTableData({ page: that.currentTagPage - 1, count: that.countPerPage }) }).catch(e => { this.tagReload() })
                          }
                        })
                      }
                    }
                  }, '移除')
                ])
              ]),
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
      filterStyleData: []
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
    this.currentTagPage = 1
    this.currentRightGoodPage = 1
    this.currentGoodPage = 1
    this.currentStylePage = 1
    this.getRightGoodTableData({ page: this.currentRightGoodPage - 1, count: this.countPerPage })
    this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
    this.getGoodTableData({ page: this.currentGoodPage - 1, count: 8 })
    getAllStyle({ page: 0, count: 1 }).then(res => {
      this.getStyleTableData({ page: this.currentStylePage - 1, count: res.data.code })
    })
  },
  watch: {
    currentTagPage () {
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
    },
    currentGoodPage () {
      this.getGoodTableData({ page: this.currentGoodPage - 1, count: 8 })
    },
    currentStylePage () {
      this.getStyleTableData({ page: this.currentStylePage - 1, count: 13 })
    },
    currentRightGoodPage () {
      this.getRightGoodTableData({ page: this.currentRightGoodPage - 1, count: this.countPerPage })
    }
  },
  computed: {
  },
  methods: {
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
          that.getTagTableData({ page: that.currentTagPage - 1, count: that.countPerPage })
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
            that.getTagTableData({ page: that.currentTagPage - 1, count: that.countPerPage })
          })
        }
      })
    },
    onTableSearch (search) {
      this.searchData = search
      var key = Object.keys(search)
      if (key.length === 0) {
        this.searchState = 0
        this.getTagTableData({ page: 0, count: this.countPerPage })
        this.currentTagPage = 1
        return
      }
      var value = search[key[0]]
      this.getTagTableData({ queryId: key[0], queryString: value })
      this.searchState = 1
    },
    onRightGoodTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.currentRightGoodPage = 1
        this.getRightGoodTableData({ page: 0, count: this.countPerPage })
        return
      }
      var value = search[key[0]]
      this.getRightGoodTableData({ queryId: key[0], queryString: value })
    },
    onBind (id) {
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
      getAllGood({ page: page, count: count, queryId: queryId, queryString: queryString }).then(res => {
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
      this.getRightGoodTableData({ page: this.currentGoodPage - 1, count: this.countPerPage })
    },
    tagReload () {
      console.log(this.searchState)
      if (this.searchState === 0) {
        this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
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
        console.log('errpr')
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
