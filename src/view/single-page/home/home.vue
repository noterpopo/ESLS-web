<template>
  <div>
    <e_label v-bind="item" ref="label_canvas" ></e_label>
    <Input type="text" v-model="item.itemName" @on-change="onItemChange"/>
    <Input type="text" v-model="item.itemUnit" @on-change="onItemChange"/>
    <Input type="text" v-model="item.itemNorm" @on-change="onItemChange"/>
    <Input type="text" v-model="item.itemCategory" @on-change="onItemChange"/>
    <Input type="text" v-model="item.itemOrigin" @on-change="onItemChange"/>
    <Input type="text" v-model="item.itemNo" @on-change="onItemChange"/>
    <Input type="text" v-model="item.itemQRCode" @on-change="onItemChange"/>
    <Input type="text" v-model="item.itemBarCode" @on-change="onItemChange"/>
    <Input type="text" v-model="item.itemPrice" @on-change="onItemChange"/>
    <Input type="text" v-model="item.itemOnSalePrice" @on-change="onItemChange"/>
    <i-switch v-model="item.itemisOnSale" @on-change="onItemChange" />

  </div>
</template>

<script>
import e_label from './e-lable.vue'

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
        itemQRCode: '233333',
        itemBarCode: '692226641428',
        itemisOnSale: false,
        itemPrice: '999.99',
        itemOnSalePrice: '999.99'
      }
    }
  },
  methods: {
    onItemChange () {
      this.$refs.label_canvas.draw()
    }
  }
}
</script>
