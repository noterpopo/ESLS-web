<template>
    <div class="container" ref="container">
        <div class="top">
          <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
            <div slot="title">
              <Row type="flex" justify="start" align="middle">
                  <Col span="21"><p>商品信息</p></Col>
                  <Col span="1"><Button type="primary" @click="goodReload">刷新</Button></Col>
                  <Col span="2"><Button type="primary" @click="addGood">添加商品</Button></Col>
              </Row>
            </div>
            <super_table :pageSize="countPerPage" @onSearch="onTableSearch" @onClick="searchTag" @onDoubleClick="onTableClick" :current.sync="currentPage" :data="goodData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="dataNum"></super_table>
            <Button type="primary" @click="isUploadShow=true">上传文件</Button>
            <Modal v-model="isUploadShow" title="上传商品信息文件">
              <div>
                <Select v-model="uploadMode">
                  <Option :value="-1">商品基本数据</Option>
                  <Option :value="-2">商品变价数据</Option>
                </Select>
                <Upload style="margin-top:10px;"
                    multiple
                    :headers="headers"
                    type="drag"
                    action="http://39.108.106.167:8086/good/upload">
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
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>自定义字段1：</p></Col>
                    <Col span="21"><Input type="text" v-model="currentSelectedRow.rfu01" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>自定义字段2：</p></Col>
                    <Col span="21"><Input type="text" v-model="currentSelectedRow.rfu02" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>自定义字段3：</p></Col>
                    <Col span="21"><Input type="text" v-model="currentSelectedRow.rfus01" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>自定义字段4：</p></Col>
                    <Col span="21"><Input type="text" v-model="currentSelectedRow.rfus02" /></Col>
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
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>自定义字段1：</p></Col>
                    <Col span="21"><Input type="text" v-model="addGooddata.rfu01" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>自定义字段2：</p></Col>
                    <Col span="21"><Input type="text" v-model="addGooddata.rfu02" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>自定义字段3：</p></Col>
                    <Col span="21"><Input type="text" v-model="addGooddata.rfus01" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="3"><p>自定义字段4：</p></Col>
                    <Col span="21"><Input type="text" v-model="addGooddata.rfus02" /></Col>
                </Row>
              </div>
            </Modal>
          </Card>
        </div>
        <div class="bottom" v-bind:style="{ marginTop:'10px'}">
          <div v-bind:style="{ width: windowWidth*0.9 + 'px',display:'flex',justifyContent: 'space-between'}">
            <Card :bordered="false" v-bind:style="{ width: windowWidth*0.6 + 'px'}">
              <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="22"><p>价签信息</p></Col>
                    <Col span="2"><Button type="primary" @click="tagReload">刷新</Button></Col>
                </Row>
              </div>
              <super_table :pageSize="countPerPage" @onClick="onTagTableClick" :current.sync="currentTagPage" :data="tagData" :columns="tagTableColumns" :isLoading="isTagTableLoading" :dataNum="tagDataNum"></super_table>
            </Card>
            <Card :bordered="false" >
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
              <e_label v-bind="item" ref="label_canvas" v-bind:style="{ width:'400px',height:'300px'}" >
              </e_label>
            </Card>
          </div>
        </div>
    </div>
</template>
<script>
import super_table from '@/components/table/supertable.vue'
import { getAllGood, updateGood, deleteGood, getBindedTags, getGood } from '@/api/good'
import { getAllTag, getTag } from '@/api/tag'
import e_label from '@/components/e-label/e-lable.vue'
import { getStyle } from '@/api/style'
import store from '@/store'
export default {
  components: {
    e_label,
    super_table
  },
  data () {
    return {
      headers: {
        ESLS: store.getters.token
      },
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
      countPerPage: 5,
      goodData: [],
      tagData: [],
      tableColumns: [
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
          title: '导入时间',
          key: 'importTime',
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
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
          title: '价签id',
          key: 'barCode',
          width: '160',
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
          title: '禁用',
          width: '120',
          key: 'isWorking',
          render: (h, params) => {
            const row = params.row
            const color = row.isWorking === 1 ? 'primary' : 'error'
            const text = row.isWorking === 1 ? '启用' : '禁用'

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
        labelStyle: '1'
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
    this.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPage })
    this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
  },
  watch: {
    currentPage () {
      this.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPage })
    },
    currentTagPage () {
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPage })
    }
  },
  methods: {
    goodReload () {
      this.canShowData = []
      this.showId = 0
      this.$refs.label_canvas.initData(null, 0, 0)
      this.getGoodTableData({ page: 0, count: this.countPerPage })
    },
    tagReload () {
      this.getTagTableData({ page: 0, count: this.countPerPage })
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
      var value = search[key]
      this.getGoodTableData({ queryId: key[0], queryString: value })
    },
    onTableClick (currentRow) {
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
        that.canShowData = data.filter(function (item) { return item.styleId !== 0 })
        that.isTagTableLoading = false
        if (that.canShowData.length === 0) {
          that.showId = 0
          this.$refs.label_canvas.initData(null, 0, 0)
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
          deleteGood(dId).then(res => { that.getGoodTableData({ page: that.currentPage - 1, count: that.countPerPage }) })
        }
      })
    },
    asyncEditOK () {
      this.getLabelData(this.showId)
      var that = this
      updateGood(that.currentSelectedRow).then(res => { that.editModal = false; that.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPage }) })
    },
    addGood () {
      this.addModal = true
    },
    asyncAddOK () {
      var that = this
      updateGood(that.addGooddata).then(res => { that.addModal = false; that.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPage }) })
    },
    getLabelData (tid) {
      var that = this
      let goodInfo = that.goodData.filter(function (item) { return item.barCode === that.currentSelectedRow.barCode })
      console.log(goodInfo)
      that.item.itemName = goodInfo[0].name
      that.item.itemUnit = goodInfo[0].unit
      that.item.itemNorm = goodInfo[0].spec
      that.item.itemCategory = goodInfo[0].category
      that.item.itemOrigin = goodInfo[0].origin
      that.item.itemNo = goodInfo[0].shelfNumber
      that.item.itemQRCode = goodInfo[0].qrCode
      that.item.itemBarCode = goodInfo[0].barCode
      that.item.itemPrice = goodInfo[0].price + ''
      that.itemOnSalePrice = goodInfo[0].promotePrice + ''
      getTag(tid).then(res => {
        const tempTag = res.data.data
        console.log(tempTag)
        getStyle(tempTag[0].styleId).then(res => {
          const dispData = res.data.data
          that.$refs.label_canvas.initData(dispData, tempTag[0].resolutionWidth, tempTag[0].resolutionHeight)
        })
      })
    },
    onShowIdChange () {
      this.getLabelData(this.showId)
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
