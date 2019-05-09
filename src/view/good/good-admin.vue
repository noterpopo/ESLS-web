<template>
    <div class="container" ref="container">
        <div class="top">
          <Card :bordered="false" v-bind:style="{ width: windowWidth*0.99 + 'px' }">
            <div slot="title">
              <Row type="flex" justify="start" align="middle">
                  <Col span="21"><p>商品信息</p></Col>
                  <Col span="1"><Button type="primary" @click="goodReload">刷新</Button></Col>
                  <Col span="2" v-if="hasEditAccess"><Button type="primary" @click="addGood">添加商品</Button></Col>
              </Row>
            </div>
            <super_table :pageSize="countPerPageGood" @onSearch="onTableSearch" @onClick="searchTag" @onDoubleClick="onTableClick" :current.sync="currentPage" :data="goodData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="dataNum"></super_table>
            <Button v-if="hasFileAccess" type="primary" @click="isUploadShow=true">导入文件</Button>
            <Button type="primary" style="margin-left:10px;" @click="downloadGoodsData">导出文件</Button>
            <Modal v-model="isUploadShow" title="上传商品信息文件">
              <div>
                <Select v-model="uploadMode">
                  <Option :value="-1">商品基本数据</Option>
                  <Option :value="-2">商品变价数据</Option>
                </Select>
                <Upload style="margin-top:10px;"
                    multiple
                    :on-success="onUploadSucess"
                    :on-error="onUploadFail"
                    :show-upload-list="false"
                    :headers="headers"
                    type="drag"
                    :action="upLaodUrl">
                    <div style="padding: 20px 0;">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击上传或者拖拽文件上传</p>
                    </div>
                </Upload>
              </div>
            </Modal>
            <Modal :width="1040" v-model="editModal" title="修改商品信息" :loading="editOkLoading" @on-ok="asyncEditOK">
              <div>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>名称：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.name"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">产地：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.origin" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>规格：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.spec" /></Col>
                    <Col span="1"><p style="position:relative;left:10px;">类别：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.category" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >供应商：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.provider" /></Col>
                    <Col span="1"><p style="position:relative;left:10px;">单位：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.unit" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>操作员：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.operator" /></Col>
                    <Col span="1"><p style="position:relative;left:10px;">货号：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.shelfNumber" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>促销价：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.promotePrice" /></Col>
                    <Col span="1"><p style="position:relative;left:10px;">价格：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.price" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>条形码：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.barCode" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">二维码：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.qrCode" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>促销理由：</p></Col>
                    <Col span="22"><Input type="text" v-model="currentSelectedRow.promotionReason" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>图片链接：</p></Col>
                    <Col span="22"><Input type="text" v-model="currentSelectedRow.imageUrl" /></Col>
                </Row>
              </div>
            </Modal>
            <Modal :width="1040" v-model="addModal" title="添加商品" :loading="addOkLoading" @on-ok="asyncAddOK">
              <div>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>名称：</p></Col>
                    <Col span="11"><Input type="text" v-model="addGooddata.name"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">产地：</p></Col>
                    <Col span="11"><Input type="text" v-model="addGooddata.origin" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>规格：</p></Col>
                    <Col span="11"><Input type="text" v-model="addGooddata.spec" /></Col>
                    <Col span="1"><p style="position:relative;left:10px;">类别：</p></Col>
                    <Col span="11"><Input type="text" v-model="addGooddata.category" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >供应商：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.provider" /></Col>
                    <Col span="1"><p style="position:relative;left:10px;">单位：</p></Col>
                    <Col span="11"><Input type="text" v-model="addGooddata.unit" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>操作员：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.operator" /></Col>
                    <Col span="1"><p style="position:relative;left:10px;">货号：</p></Col>
                    <Col span="11"><Input type="text" v-model="addGooddata.shelfNumber" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>促销价：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.promotePrice" /></Col>
                    <Col span="1"><p style="position:relative;left:10px;">价格：</p></Col>
                    <Col span="11"><Input type="text" v-model="addGooddata.price" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>条形码：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.barCode" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">二维码：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.qrCode" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>促销理由：</p></Col>
                    <Col span="22"><Input type="text" v-model="addGooddata.promotionReason" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>图片链接：</p></Col>
                    <Col span="22"><Input type="text" v-model="addGooddata.imageUrl" /></Col>
                </Row>
              </div>
            </Modal>
          </Card>
        </div>
        <div class="bottom" v-bind:style="{ marginTop:'10px'}">
          <div v-bind:style="{ width: windowWidth*0.99 + 'px',display:'flex',justifyContent: 'space-between',flexWrap:'wrap'}">
            <Card :bordered="false" v-bind:style="{ width: windowWidth*0.71 + 'px'}">
              <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="22"><p>价签信息</p></Col>
                    <Col span="2"><Button type="primary" @click="tagReload">刷新</Button></Col>
                </Row>
              </div>
              <super_table :pageSize="countPerPageTag" @onClick="onTagTableClick" :current.sync="currentTagPage" :data="tagData" :columns="tagTableColumns" :isLoading="isTagTableLoading" :dataNum="tagDataNum"></super_table>
            </Card>
            <Card :bordered="false" style="width:432px">
              <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="10"><p>预览</p></Col>
                    <Col span="14">
                      <Select @on-change="onShowIdChange" v-model="showId" style="width:200px">
                        <Option v-for="item in canShowData" :value="item.id" :key="item.id">{{item.barCode}}</Option>
                      </Select>
                    </Col>
                </Row>
              </div>
              <e_label v-bind="item" ref="label_canvas" ></e_label>
            </Card>
          </div>
        </div>
    </div>
</template>
<script>
// TODO: tag表格搜索
import super_table from '@/components/table/supertable.vue'
import { getAllGood, updateGood, deleteGood, getBindedTags, getGood, cronUpdate } from '@/api/good'
import { getAllTag, getTag, lightTag, flushTag, removeTag, scanTag, statusTag, bindStyleWithoutUpdate } from '@/api/tag'
import e_label from '@/components/e-label/e-lable.vue'
import { getStyleDisp, getStyleInfo, getStyle } from '@/api/style'
import store from '@/store'
import { VueContext } from 'vue-context'
import goodTagExpand from '@/components/table/good-tag-expand.vue'
export default {
  components: {
    e_label,
    super_table,
    goodTagExpand,
    VueContext
  },
  data () {
    return {
      headers: {
        ESLS: store.getters.token
      },
      cronExpr: '',
      cronMode: -1,
      isCronModalShow: false,
      cronFilePath: '',
      isCronSetShow: false,
      uploadMode: -1,
      isUploadShow: false,
      windowWidth: 0,
      isTableLoading: false,
      isTagTableLoading: false,
      editOkLoading: true,
      addOkLoading: true,
      addModal: false,
      dataNum: 0,
      tagDataNum: 0,
      countPerPageGood: 7,
      countPerPageTag: 3,
      goodData: [],
      tagData: [],
      tableColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          indexMethod: (row) => {
            return row._index + 1 + (this.currentPage - 1) * this.countPerPageGood
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
          title: '商品名称',
          key: 'name',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '价格',
          key: 'price',
          width: '80',
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
          title: '促销价',
          width: '80',
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
          title: '是否促销',
          width: '90',
          key: 'isPromote',
          render: (h, params) => {
            var that = this
            return h('i-switch', {
              props: {
                value: params.row.isPromote === 1
              },
              on: {
                'on-change': (val, $event) => {
                  event.stopPropagation()
                  if (val) {
                    params.row.isPromote = 1
                  } else {
                    params.row.isPromote = 0
                  }
                  updateGood(params.row).then(res => {
                    getBindedTags({ queryId: 'barCode', queryString: params.row.barCode }).then(res => {
                      that.tagData = res.data.data
                      that.canShowData = that.tagData.filter(function (item, index) {
                        if (item.styleId === 0) {
                          return false
                        }
                        if (params.row.isPromote === 0) {
                          getStyleInfo(item.styleId).then(res => {
                            getStyle(res.data.data[0].styleNumber, 0).then(r => {
                              item.styleId = r.data.data.id
                              bindStyleWithoutUpdate(item.id, item.styleId).then(res => {
                                if (that.canShowData.length === 0) {
                                  that.showId = 0
                                  this.$refs.label_canvas.initData(null, 0, 0, this.item)
                                } else {
                                  that.showId = that.canShowData[0].id
                                  that.getLabelData(that.showId)
                                }
                              })
                            })
                          })
                        } else {
                          getStyleInfo(item.styleId).then(res => {
                            getStyle(res.data.data[0].styleNumber, 1).then(r => {
                              item.styleId = r.data.data.id
                              bindStyleWithoutUpdate(item.id, item.styleId).then(res => {
                                if (that.canShowData.length === 0) {
                                  that.showId = 0
                                  this.$refs.label_canvas.initData(null, 0, 0, this.item)
                                } else {
                                  that.showId = that.canShowData[0].id
                                  that.getLabelData(that.showId)
                                }
                              })
                            })
                          })
                        }
                        return true
                      })
                    })
                  })
                }
              }
            })
          }
        },
        {
          title: '促销原因',
          key: 'promotionReason',
          render: (h, params) => {
            let t = params.row.promotionReason.toString()
            if (params.row.isPromote === 1) { return h('span', {}, t) } else { return h('span', {}, '') }
          }
        },
        {
          title: '货号',
          width: '100',
          key: 'shelfNumber',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '二维码',
          key: 'qrCode',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '导入时间',
          key: 'importTime',
          width: '140'
        },
        {
          title: '绑定状态',
          width: '120',
          render: (h, params) => {
            const row = params.row
            const color = row.tagIdList.length !== 0 ? 'primary' : 'error'
            const text = row.tagIdList.length !== 0 ? '已绑' : '未绑'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
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
          title: '操作',
          key: 'action',
          width: '80',
          align: 'center',
          render: (h, params) => {
            let DeleteAccess = store.getters.access.indexOf(10) === -1
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  margin: '2px',
                  display: DeleteAccess ? 'none' : 'inline-block'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    let temp = this.goodData.find(function (item) { return item.barCode === params.row.barCode })
                    this.remove(temp.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
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
          title: '价签条码',
          key: 'barCode',
          width: '120',
          filter: {
            type: 'Input'
          }
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
          width: '134',
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
            if (params.row.apRssi < -40) {
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
            if (params.row.tagRssi < -40) {
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
            // let hasBindGoodAccess = store.getters.access.indexOf(3) === -1
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
                        lightTag(data, 1, 0)
                      }
                    }
                  }, '闪灯'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        lightTag(data, 0, 0)
                      }
                    }
                  }, '熄灯'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        flushTag(data, 0)
                      }
                    }
                  }, '刷屏'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        scanTag(data, 0)
                      }
                    }
                  }, '巡检'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        statusTag(data, 0)
                      }
                    }
                  }, '禁用'),
                  h('DropdownItem', {
                    nativeOn: {
                      click: (name) => {
                        statusTag(data, 1)
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
                            removeTag(data, 0).then(res => { that.getTagTableData({ page: that.currentTagPage - 1, count: that.countPerPage }) })
                          }
                        })
                      }
                    }
                  }, '移除')
                ])
              ])
            ])
          }
        }

      ],
      editModal: false,
      currentSelectedRow: {},
      addGooddata: {
        barCode: '默认条形码',
        category: '默认种类',
        id: 0,
        imageUrl: '',
        name: '默认名字',
        operator: '默认操作员',
        origin: '默认产地',
        price: 0,
        promotePrice: 0,
        promotionReason: '默认促销理由',
        provider: '默认供应商',
        qrCode: '默认二维码',
        regionNames: '',
        rfu01: '',
        rfu02: '',
        rfus01: '',
        rfus02: '',
        shelfNumber: '默认货号',
        spec: '默认规格',
        status: 0,
        unit: '默认单位',
        stock: 0,
        waitUpdate: 0
      },
      currentPage: 1,
      currentTagPage: 1,
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
        itemProvider: '',
        itemImgUrl: ''
      },
      canShowData: [],
      showId: 0
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
    this.currentPage = 1
    this.currentTagPage = 1
    this.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood })
    this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag })
  },
  computed: {
    upLaodUrl: function () {
      return 'http://39.108.106.167:8086/good/upload?mode=' + this.uploadMode
    },
    hasEditAccess: () => {
      return store.getters.access.indexOf(2) !== -1
    },
    hasDeleteAccess: () => {
      return store.getters.access.indexOf(10) !== -1
    },
    hasUploadAccess: () => {
      return store.getters.access.indexOf(22) !== -1
    },
    hasFileAccess: () => {
      return store.getters.access.indexOf(23) !== -1
    }
  },
  watch: {
    currentPage () {
      this.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood })
    },
    currentTagPage () {
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag })
    }
  },
  methods: {
    downloadGoodsData () {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', 'http://39.108.106.167:8086/excel/excelExport?tableNames=goods')
      xhr.onload = function (a, b) {
        let blob = this.response
        let reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          let a = document.createElement('a')
          a.download = 'goodsData.csv'
          a.href = e.target.result
          a.click()
        }
      }
      xhr.responseType = 'blob'
      xhr.setRequestHeader('ESLS', store.getters.token)
      xhr.send()
    },
    onUploadSucess () {
      this.isUploadShow = false
      this.$Message.info('上传成功')
    },
    onUploadFail () {
      this.isUploadShow = false
      this.$Message.error('上传失败')
    },
    setCronUpdate () {
      cronUpdate(this.cronExpr, this.cronFilePath, this.cronMode).then(res => {
        this.$Message.info('设置成功')
      })
    },
    onCronIsShow (val) {
      this.isCronModalShow = val
    },
    onCron (data) {
      this.cronExpr = data
    },
    goodReload () {
      this.canShowData = []
      this.showId = 0
      this.$refs.label_canvas.initData(null, 0, 0, this.item)
      this.getGoodTableData({ page: 0, count: this.countPerPageGood })
    },
    tagReload () {
      this.getTagTableData({ page: 0, count: this.countPerPageTag })
    },
    getTagTableData (page, count) {
      var that = this
      that.isTagTableLoading = true
      getAllTag(page, count).then(res => {
        that.tagDataNum = res.data.code
        const data = res.data.data
        that.tagData = data
        that.isTagTableLoading = false
      })
    },
    getGoodTableData (page, count) {
      var that = this
      that.isTableLoading = true
      getAllGood(page, count).then(res => {
        that.dataNum = res.data.code
        const data = res.data.data
        that.goodData = data
        that.isTableLoading = false
      })
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getGoodTableData({ page: 0, count: this.countPerPageGood })
        this.currentTagPage = 1
        return
      }
      var value = search[key]
      if (search) { this.getGoodTableData({ queryId: key[0], queryString: value }) }
    },
    onTableClick (currentRow) {
      if (store.getters.access.indexOf(2) === -1) {
        return
      }
      this.currentSelectedRow = this.goodData.find(function (item) { return item.barCode === currentRow.barCode })
      this.editModal = true
    },
    searchTag (currentRow) {
      var that = this
      that.isTagTableLoading = true
      that.currentSelectedRow = currentRow
      getBindedTags({ queryId: 'barCode', queryString: currentRow.barCode }).then(res => {
        that.tagDataNum = res.data.code
        const data = res.data.data
        that.tagData = data
        that.canShowData = data.filter(function (item) {
          return item.styleId !== 0 && item.styleId !== 1
        })
        that.isTagTableLoading = false
        if (that.canShowData.length === 0) {
          that.showId = 0
          this.$refs.label_canvas.initData(null, 0, 0, this.item)
        } else {
          that.showId = that.canShowData[0].id

          that.getLabelData(that.showId)
        }
      })
    },
    onTagTableClick (currentRow) {
      var that = this
      that.isTableLoading = true
      if (currentRow.goodId === '' || currentRow.goodId === 0) {
        that.goodData = []
        that.isTableLoading = false
        return
      }
      getGood(currentRow.goodId).then(res => {
        that.dataNum = res.data.code
        const data = res.data.data
        that.goodData = data
        that.isTableLoading = false
      })
    },
    remove (id) {
      var that = this
      let dId = id
      console.log(id)
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除该商品吗？',
        onOk: function () {
          deleteGood(dId).then(res => { that.getGoodTableData({ page: that.currentPage - 1, count: that.countPerPageGood }) })
        }
      })
    },
    asyncEditOK () {
      var that = this
      let t = this.currentSelectedRow.price.toString()
      if (t.indexOf('.') === -1) {
        t = t + '.00'
      } else {
        if (t.split('.')[1].length < 2) {
          t = t + '0'
        }
      }
      this.currentSelectedRow.price = t
      let tp = this.currentSelectedRow.promotePrice.toString()
      if (tp.indexOf('.') === -1) {
        tp = tp + '.00'
      } else {
        if (tp.split('.')[1].length < 2) {
          tp = tp + '0'
        }
      }
      this.currentSelectedRow.promotePrice = tp
      this.getLabelData(this.showId)
      updateGood(that.currentSelectedRow).then(res => { that.editModal = false; that.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood }) })
    },
    addGood () {
      this.addModal = true
    },
    asyncAddOK () {
      var that = this
      let t = this.addGooddata.price.toString()
      if (t.indexOf('.') === -1) {
        t = t + '.00'
      } else {
        if (t.split('.')[1].length < 2) {
          t = t + '0'
        }
      }
      this.addGooddata.price = t
      let tp = this.addGooddata.promotePrice.toString()
      if (tp.indexOf('.') === -1) {
        tp = tp + '.00'
      } else {
        if (tp.split('.')[1].length < 2) {
          tp = tp + '0'
        }
      }
      this.addGooddata.promotePrice = tp
      updateGood(that.addGooddata).then(res => { that.addModal = false; that.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood }) })
    },
    getLabelData (tid) {
      var that = this
      let goodInfo = that.goodData.filter(function (item) { return item.barCode === that.currentSelectedRow.barCode })
      that.item.itemName = goodInfo[0].name
      that.item.itemUnit = goodInfo[0].unit
      that.item.itemNorm = goodInfo[0].spec
      that.item.itemCategory = goodInfo[0].category
      that.item.itemOrigin = goodInfo[0].origin
      that.item.itemNo = goodInfo[0].shelfNumber
      that.item.itemQRCode = goodInfo[0].qrCode
      that.item.itemBarCode = goodInfo[0].barCode
      that.item.itemPrice = goodInfo[0].price
      that.item.itemOnSalePrice = goodInfo[0].promotePrice
      that.item.itemStock = goodInfo[0].stock
      that.item.itemImgUrl = goodInfo[0].imageUrl
      that.item.itemProvider = goodInfo[0].provider

      if (tid === 0) {
        return
      }
      getTag(tid).then(res => {
        let tempTag = res.data.data
        getStyleDisp(tempTag[0].styleId).then(res => {
          const dispData = res.data.data
          that.$refs.label_canvas.initData(dispData, tempTag[0].resolutionWidth, tempTag[0].resolutionHeight, that.item)
        })
      })
    },
    onShowIdChange () {
      if (this.showId) {
        this.getLabelData(this.showId)
      }
    },
    onRightClick () {
      this.$Message.info('rbtn')
    }
  }

}
</script>
<style scoped>
.Row{
  margin-bottom: 6px;
}
</style>

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
}
.bottom{
  flex-shrink: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
</style>
