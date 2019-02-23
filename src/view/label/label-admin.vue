<template>
  <div class="container" ref="container">
      <div class="left">
        <Card :bordered="false" class="e-lable-table-card card" v-bind:style="{ width: windowWidth*2/3 + 'px' }">
            <p slot="title">价签样式列表</p>
            <super_table class="e-label-table" @onSearch="onTableSearch" @onClick="onTableClick" :data="styleData" :columns="tableColumns" :isLoading="isTableLoading" :pageNum="pageNum"></super_table>
        </Card>
      </div>
      <div class="right">
        <Card :bordered="false" class="e-lable-card card">
          <p slot="title">价签样式预览</p>
          <div>
            <e_label class="e-label" v-bind="item" ref="label_canvas" >
                <Spin size="large" fix v-if="isLabelLoading"></Spin>
            </e_label>
            <Button type="primary" @click="getLabelData(10)" style="margin: 10px; float: right;">刷新</Button>
          </div>
        </Card>
        <Card :bordered="false" class="card input-card">
          <p slot="title">信息修改</p>
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
            <i-switch v-model="item.itemisOnSale"  />
            <Select v-model="item.labelStyle">
              <Option v-for="num in styleList" :value="num" :key="num">{{num}}</Option>
            </Select>
          </div>
        </Card>
      </div>
      <Modal
        v-model="isModal"
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
import { getDispms, getStyle, getAllStyle } from '@/api/style'
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
      pageNum: 1,
      styleData: [],
      tableColumns: [
        {
          title: '样式id',
          key: 'styleid',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '尺寸(英寸)',
          key: 'size',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '价签绑定',
          key: 'bind_eLabel',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '小样式',
          key: 'dispms',
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
                    this.editStyle(params.row.styleid)
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
                    this.remove(params.row.styleid)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  created () {
    this.getStyleTableData()
  },
  mounted () {
    var that = this
    this.$nextTick(() => {
      this.windowWidth = this.$refs.container.offsetWidth
      console.info(this.windowWidth)
    })
    window.onresize = function () {
      that.windowWidth = that.$refs.container.offsetWidth
    }
  },
  methods: {
    getLabelData (id) {
      var that = this
      that.isLabelLoading = true
      getStyle(id).then(res => {
        const data = res.data.data
        var dispmsData = [] // 保存数据
        var priceLeft = ''
        var priceRight = ''
        var onSalePriceLeft = ''
        var onSalePriceRight = ''
        var len = data.dispms.length // 循环变量
        var flag = len - 1 // 保证循环后调用initData()
        for (var i = 0; i < len; ++i) {
          getDispms(data.dispms[i]).then(res => {
            const dispData = res.data.data
            if (dispData.sourceColumn === 'name') {
              that.item.itemName = dispData.text
            } else if (dispData.sourceColumn === 'price_left') {
              priceLeft = dispData.text + '.'
            } else if (dispData.sourceColumn === 'price_right') {
              priceRight = dispData.text
            } else if (dispData.sourceColumn === 'promotePriceLeft') {
              onSalePriceLeft = dispData.text + '.'
            } else if (dispData.sourceColumn === 'promotePriceRight') {
              onSalePriceRight = dispData.text
            } else if (dispData.sourceColumn === 'normal') {
              that.item.itemNorm = dispData.text
            } else if (dispData.sourceColumn === 'class') {
              that.item.itemCategory = dispData.text
            } else if (dispData.sourceColumn === 'unit') {
              that.item.itemUnit = dispData.text
            } else if (dispData.sourceColumn === 'origin') {
              that.item.itemOrigin = dispData.text
            } else if (dispData.sourceColumn === '货号') {
              that.item.itemNo = dispData.text
            } else if (dispData.sourceColumn === 'qrCode') {
              that.item.itemQRCode = dispData.text
            } else if (dispData.sourceColumn === 'barCode') {
              that.item.itemBarCode = dispData.text
            } else if (dispData.sourceColumn === '库存') {
              that.item.itemStock = dispData.text
            } else {

            }
            dispmsData.push(dispData)
            if (!(flag--)) {
              that.item.itemPrice = priceLeft + priceRight
              that.item.itemOnSalePrice = onSalePriceLeft + onSalePriceRight
              that.isLabelLoading = false
              that.$refs.label_canvas.initData(dispmsData, data.width, data.height)
            }
          })
        }
      })
    },
    getStyleTableData () {
      var that = this
      that.isTableLoading = true
      getAllStyle().then(res => {
        const data = res.data.data
        that.styleData = data
        that.isTableLoading = false
      })
    },
    onTableSearch (search) {
      alert('查询条件：' + JSON.stringify(search, null, 4))
    },
    onTableClick (currentRow) {
      this.getLabelData(currentRow.styleid)
    },
    remove (index) {
      this.$Message.info('delete' + index)
    },
    editStyle (styleid) {
      this.isModal = true
      this.$refs.designer.getStyleData(styleid)
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
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.right{
  flex-grow: 1;
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
