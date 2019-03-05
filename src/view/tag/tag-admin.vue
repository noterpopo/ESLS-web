<template>
    <div class="container" ref="container">
        <div class="left">
            <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
                <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="22"><p>价签信息</p></Col>
                    <Col span="2"><Button type="primary" @click="tagReload">刷新</Button></Col>
                </Row>
                </div>
            <super_table @onClick="onTagTableClick" :pageSize="countPerPage" :current.sync="currentTagPage" @onDoubleClick="onTableClick" @onSearch="onTableSearch" :data="tagData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="tagDataCount"></super_table>
            <Modal @on-cancel="currentStep=0" v-model="isBindModalShow" title="绑定" width="1400" @on-ok="currentStep=0">
                <Steps :current="currentStep"  style="marginBottom:16px;">
                    <Step  title="绑定商品" content="这一步绑定显示在价签上的商品">
                    </Step>
                    <Step title="绑定样式" content="这一步绑定显示在价签上的样式"></Step>
                    <Step title="预览价签" content="预览选择继续修改或完成"></Step>
                </Steps>
                <super_table  key="1" v-if="currentStep===0" @onSearch="onModalGoodTableSearch" @onClick="onMoadlGoodTableClick" :data="goodData" :columns="tableModalGoodColumns" :isLoading="isModalGoodTableLoading" :pageSize="8" :current.sync="currentGoodPage" :dataNum="modalGoodDataCount"></super_table>
                <super_table key="2" v-if="currentStep===1" @onSearch="onModalStyleTableSearch" @onClick="onMoadlStyleTableClick" :data="styleData" :columns="tableModalStyleColumns" :isLoading="isModalStyleTableLoading" :pageSize="8" :current.sync="currentStylePage" :dataNum="modalStyleDataCount"></super_table>
                <div v-if="currentStep===2" style="display: flex;justify-content:center;align-items:Center;">
                    <e_label v-bind="item" ref="label_canvas" >
                    </e_label>
                </div>
                <Button v-if="currentStep===2" @click="onPreStep">上一步</Button>
                <Button style="position:absolute; top:540px;" v-if="currentStep===0" @click="onNextStep">下一步</Button>
                <Button style="position:absolute; top:540px;left:100px;" v-if="currentStep===1" @click="onNextStep">下一步</Button>
                <Button style="position:absolute; top:540px;" v-if="currentStep===1" @click="onPreStep">上一步</Button>
            </Modal>
            <Modal v-model="infoModal" title="标签信息">
            <div>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>id：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.id"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>电量：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.power"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>标签信号：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.tagRssi"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>路由信号：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.apRssi"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>硬件版本：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.hardwareVersion"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>软件版本：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.softwareVersion"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>运行时间：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.execTime"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>更新时间：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.completeTime"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>条码：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.barCode"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>地址：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.tagAddress"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>宽：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.resolutionWidth"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>高：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.resolutionHeight"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>绑定商品：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.goodId"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>绑定样式：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.styleId"/></Col>
                </Row>
                <Row style="margin-bottom:4px;" type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>路由：</p></Col>
                    <Col span="21"><Input type="text" v-model="selectedData.routerId"/></Col>
                </Row>
            </div>
            </Modal>
            </Card>
        </div>
        <div class="right">
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
import super_table from '@/components/table/supertable.vue'
import cronSelector from '@/components/corn-selector/corn-selector.vue'
import e_label from '@/components/e-label/e-lable.vue'
import { getAllTag } from '@/api/tag'
import { getAllGood, getGood, getBindedTags } from '@/api/good'
import { getAllStyle, getStyle } from '@/api/style'
export default {
  components: {
    e_label,
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
          title: '条码',
          key: 'barCode',
          width: '200',
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
          width: '110',
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
                    let temp = this.tagData.find(function (item) { return item.barCode === params.row.barCode })
                    this.onBind(temp.id)
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
        }
      ],
      goodData: [],
      tableModalGoodColumns: [
        {
          title: '条码',
          key: 'barCode',
          width: '70',
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
      currentRightGoodPage: 1
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
    this.getRightGoodTableData({ page: this.currentRightGoodPage - 1, count: this.countPerPage })
    this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
  },
  watch: {
    currentTagPage () {
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
    },
    currentGoodPage () {
      this.getGoodTableData({ page: this.currentGoodPage - 1, count: 8 })
    },
    currentStylePage () {
      this.getStyleTableData({ page: this.currentStylePage - 1, count: 8 })
    },
    currentRightGoodPage () {
      this.getRightGoodTableData({ page: this.currentRightGoodPage - 1, count: this.countPerPage })
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
      this.isBindModalShow = true
      this.getGoodTableData({ page: this.currentGoodPage - 1, count: 8 })
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
        this.getStyleTableData({ page: 0, count: 8 })
        this.currentStylePage = 1
        return
      }
      var value = search[key]
      this.getStyleTableData({ page: this.currentStylePage - 1, count: 8, queryId: key[0], queryString: value })
    },
    onMoadlStyleTableClick (rowData) {
      this.bindStyleSelectId = rowData.id
    },
    getLabelData (gid, sid) {
      var that = this
      that.isLabelLoading = true
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
          that.isLabelLoading = false
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
          this.getStyleTableData({ page: this.currentStylePage - 1, count: 8 })
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
      getGood(currentRow.goodId).then(res => {
        that.rightGoodDataCount = res.data.code
        const data = res.data.data
        that.goodRightData = data
        that.isRightGoodTableLoading = false
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
.lett{
  flex-shrink: 1;
}
.right{
  flex-shrink: 1;
}
</style>
