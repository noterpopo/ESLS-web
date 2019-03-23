<template>
    <div class="container" ref="container">
        <div class="top">
            <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
                <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="22"><p>价签信息</p></Col>
                    <Col span="2"><Button type="primary" @click="tagReload">刷新</Button></Col>
                </Row>
                </div>
            <super_table @onClick="onTagTableClick" :pageSize="countPerPage" :current.sync="currentTagPage" @onDoubleClick="onTableClick" @onSearch="onTableSearch" :data="tagData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="tagDataCount"></super_table>
            <Modal @on-cancle='onBindGoodCancel' v-model="isBindGoodModalShow" title="绑定商品" width="1400" @on-ok="onBindGood">
              <super_table  key="3" @onSearch="onModalGoodTableSearch" @onClick="onMoadlGoodTableClick" :data="goodData" :columns="tableModalGoodColumns" :isLoading="isModalGoodTableLoading" :pageSize="8" :current.sync="currentGoodPage" :dataNum="modalGoodDataCount"></super_table>
            </Modal>
            </Card>
        </div>
        <div class="bottom" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
            <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
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
import cronSelector from '@/components/corn-selector/corn-selector.vue'
import e_label from '@/components/e-label/e-lable.vue'
import { getAllTag, bindStyle, bindGood } from '@/api/tag'
import { getAllGood, getGood, getBindedTags } from '@/api/good'
import { getAllStyle, getStyle } from '@/api/style'
import { coppyArray } from '@/libs/util'
import store from '@/store'
export default {
  components: {
    e_label,
    tagExpand,
    super_table,
    'corn-selector': cronSelector
  },
  data () {
    return {
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
          title: '价签id',
          key: 'barCode',
          width: '140',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '价签类型',
          key: 'screenType',
          width: '80',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '电量',
          key: 'power',
          width: '70',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '宽/高',
          width: '82',
          render: (h, params) => {
            return h('p', params.row.resolutionWidth + '/' + params.row.resolutionHeight)
          }
        },
        {
          title: 'AP RSSI',
          key: 'apRssi',
          width: '65',
          filter: {
            type: 'Input'
          }
        },
        {
          title: 'Tag RSSI',
          key: 'tagRssi',
          width: '65',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '绑定样式',
          key: 'styleId',
          width: '180',
          render: (h, params) => {
            let styleFiltters = []
            let isDiable = (store.getters.access.indexOf(2) === -1) || (store.getters.access.indexOf(13) === -1)
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
                styleFiltters = res.data
              }
            })
            return h('Select', {
              props: {
                value: params.row.styleId,
                disabled: isDiable
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
          width: '180',
          render: (h, params) => {
            let hasBindGoodAccess = store.getters.access.indexOf(3) === -1
            let DeleteAccess = store.getters.access.indexOf(10) === -1
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
                    let temp = this.tagData.find(function (item) { return item.barCode === params.row.barCode })
                    this.onBind(temp.id)
                  }
                }
              }, '绑定'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: '2px',
                  display: hasBindGoodAccess ? 'none' : 'inline-block'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    let temp = this.tagData.find(function (item) { return item.barCode === params.row.barCode })
                    this.onUnBind(temp)
                  }
                }
              }, '解绑'),
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
          title: '名称',
          key: 'name',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '条形码',
          key: 'barCode',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '价格',
          key: 'price',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '促销价',
          key: 'promotePrice',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '货号',
          key: 'shelfNumber',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '状态',
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
      goodData: [],
      tableModalGoodColumns: [
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
          title: '价格',
          key: 'price',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '促销价',
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
    hasEditAccess: () => {
      return store.getters.access.indexOf(2) !== -1
    }
  },
  methods: {
    getTagTableData (page, count) {
      var that = this
      that.isTableLoading = true
      getAllTag(page, count).then(res => {
        const data = res.data.data
        that.tagDataCount = res.data.code
        that.tagData = data
        that.isTableLoading = false
      })
    },
    remove (id) {

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

          that.$refs.label_canvas.initData(dispData, currentSelectTag.resolutionWidth, currentSelectTag.resolutionHeight)
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
      this.getRightGoodTableData({ page: 0, count: this.countPerPage })
    },
    tagReload () {
      this.getTagTableData({ page: 0, count: this.countPerPage })
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
      bindStyle(tid, sid).then(that.$Modal.success({
        title: '消息',
        content: '成功绑定样式'
      }))
    },
    onBindGoodCancel () {
      this.currentGoodPage = 1
      this.bindGoodSelectId = 0
    },
    onBindGood () {
      var that = this
      let mode = '0'
      this.currentGoodPage = 1
      let tagTemp = this.tagData.filter((item) => {
        return item.id === this.bindTagId
      })
      console.log(tagTemp[0].goodId)
      if (tagTemp[0].goodId === null || tagTemp[0].goodId === 0) {
        mode = '1'
      } else {
        mode = '2'
      }
      bindGood('id', that.bindGoodSelectId, 'id', that.bindTagId, mode).then(res => {
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
          that.bindGoodSelectId = 0
        })
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
