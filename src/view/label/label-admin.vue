<template>
  <div class="container" ref="container">
      <div class="left">
        <Card :bordered="false" class="e-lable-table-card card" v-bind:style="{ width: windowWidth*0.6 + 'px' }">
            <p slot="title">价签样式列表</p>
            <super_table :pageSize="countPerPage" :current.sync="currentPage" :dataNum="dataNum" class="e-label-table" @onSearch="onTableSearch" @onClick="onTableClick" :data="styleData" :columns="tableColumns" :isLoading="isTableLoading" :pageNum="pageNum"></super_table>
        </Card>
      </div>
      <div class="right">
        <Card :bordered="false" class="e-lable-card card">
          <p slot="title">价签样式预览</p>
          <div>
            <e_label class="e-label" v-bind="item" ref="label_canvas" >
                <Spin size="large" fix v-if="isLabelLoading"></Spin>
            </e_label>
          </div>
        </Card>
        <Card :bordered="false" class="card input-card">
          <div slot="title">
              <Row type="flex" justify="start" align="middle">
                  <Col span="21"><p>信息修改</p></Col>
                  <Col span="3"><Button type="primary">保存</Button></Col>
              </Row>
          </div>
          <div>
            <Input type="text" v-model="item.itemName" />
            <Input type="text" v-model="item.itemUnit" />
            <Input type="text" v-model="item.itemNorm" />
            <Input type="text" v-model="item.itemCategory" />
            <Input type="text" v-model="item.itemOrigin" />
            <Input type="text" v-model="item.itemNo" />
            <Input type="text" v-model="item.itemQRCode" />
            <Input type="text" v-model="item.itemBarCode" />
            <Input type="text" v-model="item.itemStock" />
            <Input type="text" v-model="item.itemPrice" />
            <Input type="text" v-model="item.itemOnSalePrice" />
          </div>
        </Card>
      </div>
      <Modal
        v-model="isModal"
        @on-ok="onUpdate"
        width="auto"
        title="样式编辑器"
        class-name="modal-style-designer">
        <modal_style_designer ref="designer"></modal_style_designer>
    </Modal>
      <!--
    <Input type="text" v-model="item.itemName" />
    <Input type="text" v-model="item.itemUnit" />
    <Input type="text" v-model="item.itemNorm" />
    <Input type="text" v-model="item.itemCategory" />
    <Input type="text" v-model="item.itemOrigin" />
    <Input type="text" v-model="item.itemNo" />
    <Input type="text" v-model="item.itemQRCode" />
    <Input type="text" v-model="item.itemBarCode" />
    <Input type="text" v-model="item.itemStock" />
    <Input type="text" v-model="item.itemPrice" />
    <Input type="text" v-model="item.itemOnSalePrice" />
    <i-switch v-model="item.itemisOnSale"  />
    <Select v-model="item.labelStyle">
      <Option v-for="num in styleList" :value="num" :key="num">{{num}}</Option>
    </Select>
    <Button type="primary" @click="getLabelData(10)">Primary</Button>
    -->
  </div>
</template>

<script>
import e_label from '@/components/e-label/e-lable.vue'
import super_table from '@/components/table/supertable.vue'
import modal_style_designer from '@/components/modal/modal-style-designer.vue'
import { getStyle, getAllStyle, deleteStyle } from '@/api/style'
export default {
  components: {
    e_label,
    super_table,
    modal_style_designer
  },
  data () {
    return {
      windowWidth: 0,
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
      styleList: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6'
      ],
      isLabelLoading: false,
      isTableLoading: false,
      isModal: false,
      dataNum: 0,
      currentPage: 1,
      countPerPage: 10,
      styleData: [],
      tableColumns: [
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
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
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
              }, '修改'),
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
      currentStyleID: 0
    }
  },
  created () {
    this.getStyleTableData({ page: this.currentPage - 1, count: this.countPerPage })
  },
  watch: {
    currentPage () {
      this.getStyleTableData({ page: this.currentPage - 1, count: this.countPerPage })
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
  methods: {
    getLabelData (id, w, h) {
      var that = this
      that.isLabelLoading = true
      getStyle(id).then(res => {
        const dispData = res.data.data
        var len = dispData.length // 循环变量
        console.log(dispData)
        for (var i = 0; i < len; ++i) {
          if (dispData[i].sourceColumn === 'name') {
            that.item.itemName = dispData[i].text
          } else if (dispData[i].sourceColumn === 'price') {
            that.item.itemPrice = dispData[i].text
          } else if (dispData[i].sourceColumn === 'promotePrice') {
            that.item.itemOnSalePrice = dispData[i].text
          } else if (dispData[i].sourceColumn === 'spec') {
            that.item.itemNorm = dispData[i].text
          } else if (dispData[i].sourceColumn === 'class') {
            that.item.itemCategory = dispData[i].text
          } else if (dispData[i].sourceColumn === 'unit') {
            that.item.itemUnit = dispData[i].text
          } else if (dispData[i].sourceColumn === 'origin') {
            that.item.itemOrigin = dispData[i].text
          } else if (dispData[i].sourceColumn === 'shelfNumber') {
            that.item.itemNo = dispData[i].text
          } else if (dispData[i].sourceColumn === 'qrCode') {
            that.item.itemQRCode = dispData[i].text
          } else if (dispData[i].sourceColumn === 'barCode') {
            that.item.itemBarCode = dispData[i].text
          } else if (dispData[i].sourceColumn === 'stock') {
            that.item.itemStock = dispData[i].text
          } else {

          }
        }
        that.isLabelLoading = false
        that.$refs.label_canvas.initData(dispData, w, h)
      })
    },
    getStyleTableData (page, count) {
      var that = this
      that.isTableLoading = true
      getAllStyle(page, count).then(res => {
        const data = res.data.data
        that.dataNum = res.data.code
        that.styleData = data
        that.isTableLoading = false
      })
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      var value = search[key]
      this.getStyleTableData({ queryId: key[0], queryString: value })
    },
    onTableClick (currentRow) {
      this.getLabelData(currentRow.id, currentRow.width, currentRow.height)
    },
    remove (id) {
      deleteStyle(id)
        .then(() => {
          this.getStyleTableData({ page: this.currentPage - 1, count: this.countPerPage })
        })
    },
    editStyle (styleid, w, h) {
      this.currentStyleID = styleid
      this.isModal = true
      this.$refs.designer.getStyleData(styleid, w, h)
    },
    onUpdate () {
      this.$refs.designer.update(this.currentStyleID)
    }
  }
}
</script>

<style lang="less">
Input{
  margin: 2px
}
.card{
  margin: 10px;
}
.container{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: stretch;
    align-content: center;

}
.left{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.right{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.e-label{
  width: 100%;
  height: auto;
}
.e-label-table{
  width: 100%;
}
.e-lable-card{
    width: auto;
    height: auto;
}
.e-lable-table-card{
    height: auto;
}
.input-card{
  width: 432px;
  height: auto;
}
.modal-style-designer{
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal{
      top: 0;
  }
}
</style>
