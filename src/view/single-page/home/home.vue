<template>
  <div>
    <e_label v-bind="item" ref="label_canvas" ></e_label>
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
    <Button type="primary" @click="getLabelData">Primary</Button>
  </div>
</template>

<script>
import e_label from './e-lable.vue'
import { getDispms, getStyle } from '@/api/style'
export default {
  components: {
    e_label
  },
  data () {
    return {
      item: {
        itemName: '测试商品名称1',
        itemUnit: '盒',
        itemNorm: '250g',
        itemCategory: '食品',
        itemOrigin: '上海',
        itemNo: '00012',
        itemQRCode: '692226641428',
        itemBarCode: '692226641428',
        itemStock: '110',
        itemisOnSale: false,
        itemPrice: '999.99',
        itemOnSalePrice: '999.99',
        labelStyle: '1'
      },
      styleList: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6'
      ]
    }
  },
  methods: {
    getLabelData () {
      var that = this
      getStyle(10).then(res => {
        const data = res.data.data
        var dispmsData = [] // 保存数据
        var len = data.dispms.length // 循环变量
        var flag = len - 1 // 保证循环后调用initData()
        for (var i = 0; i < len; ++i) {
          getDispms(data.dispms[i]).then(res => {
            const dispData = res.data.data
            if (dispData.columnType === '名称') {
              that.item.itemName = dispData.text
            } else if (dispData.columnType === '价格') {
              that.item.itemPrice = dispData.text
            } else if (dispData.columnType === '原价') {
              that.item.itemPrice = dispData.text
            } else if (dispData.columnType === '促价') {
              that.item.itemOnSalePrice = dispData.text
            } else if (dispData.columnType === '规格') {
              that.item.itemNorm = dispData.text
            } else if (dispData.columnType === '类别') {
              that.item.itemCategory = dispData.text
            } else if (dispData.columnType === '单位') {
              that.item.itemUnit = dispData.text
            } else if (dispData.columnType === '产地') {
              that.item.itemOrigin = dispData.text
            } else if (dispData.columnType === '货号') {
              that.item.itemNo = dispData.text
            } else if (dispData.columnType === '二维码') {
              that.item.itemQRCode = dispData.text
            } else if (dispData.columnType === '条形码') {
              that.item.itemBarCode = dispData.text
            } else if (dispData.columnType === '库存') {
              that.item.itemStock = dispData.text
            } else {

            }
            dispmsData.push(dispData)
            if (!(flag--)) {
              that.$refs.label_canvas.initData(dispmsData, data.width, data.height)
            }
          })
        }
      })
    }
  }
}
</script>
