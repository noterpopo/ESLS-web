<template>
  <div>
    <e_label v-bind="item" ref="label_canvas" ></e_label>
    <input type="text" v-model="item.itemName" @change="onItemChange"/>
    <input type="text" v-model="item.itemPrice" @change="onItemChange"/>
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
        itemOrigin: '上海',
        itemNo: '00012',
        itemQRCode: '233333',
        itemBarCode: '233333',
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
