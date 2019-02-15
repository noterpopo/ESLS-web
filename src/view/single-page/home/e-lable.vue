<template>
    <div>
      <canvas id="label" ref="canvas">您的浏览器不支持canvas！</canvas>
      <canvas id="barcode">您的浏览器不支持canvas！</canvas>
    </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
import { convertCanvasToImage } from '@/libs/util'
var canvas
var ctx
export default {
  name: 'e_lable',
  props: {
    itemName: {
      type: String,
      default: '测试商品名称1'
    },
    itemUnit: {
      type: String,
      default: '盒'
    },
    itemNorm: {
      type: String,
      default: '250g'
    },
    itemOrigin: {
      type: String,
      default: '上海'
    },
    itemNo: {
      type: String,
      default: '00012'
    },
    itemQRCode: {
      type: String,
      default: '233333'
    },
    itemBarCode: {
      type: String,
      default: '23333'
    },
    itemisOnSale: {
      type: Boolean,
      default: false
    },
    itemPrice: {
      type: String,
      default: '999.99'
    },
    itemOnSalePrice: {
      type: String,
      default: '999.99'
    }
  },
  mounted () {
    this.draw()
  },
  methods: {
    draw () {
      var topMargin = 2
      var leftMargin = 2
      canvas = this.$refs.canvas
      ctx = canvas.getContext('2d')
      if (!ctx) return
      canvas.width = 300
      canvas.height = canvas.width / 2
      // 商品名称
      ctx.font = canvas.width / 15 + 'px 微软雅黑'
      ctx.fillText(this.itemName, leftMargin + 0, topMargin + canvas.width / 15)
      // 下划线
      ctx.beginPath()
      ctx.moveTo(leftMargin + 0, topMargin + canvas.width / 15 + 10)
      ctx.lineTo(canvas.width, topMargin + canvas.width / 15 + 10)
      ctx.stroke()
      // 价格整
      ctx.font = canvas.width / 6 + 'px 微软雅黑'
      ctx.textBaseline = 'hanging'
      ctx.fillText(this.itemPrice.split('.')[0] + '.', leftMargin + 8, topMargin + canvas.width / 6)
      // 价格小
      ctx.font = canvas.width / 7.5 + 'px 微软雅黑'
      ctx.fillText(this.itemPrice.split('.')[1], leftMargin + 8 + canvas.width / 9 * this.itemPrice.split('.')[0].length, topMargin + canvas.width / 6)
      // 右边框信息-规格
      ctx.font = canvas.width / 18.75 + 'px 微软雅黑'
      ctx.fillText('规格：' + this.itemNorm, leftMargin + 8 + canvas.width / 9 * this.itemPrice.split('.')[0].length + this.itemPrice.split('.')[1].length * canvas.width / 12.5 + 20, topMargin + canvas.width / 6)
      // 右边框信息-类别
      ctx.font = canvas.width / 18.75 + 'px 微软雅黑'
      ctx.fillText('类别：' + this.itemQRCode, leftMargin + 8 + canvas.width / 9 * this.itemPrice.split('.')[0].length + this.itemPrice.split('.')[1].length * canvas.width / 12.5 + 20, topMargin + canvas.width / 6 + canvas.width / 13.5 * 1)
      // 右边框信息-单位
      ctx.font = canvas.width / 18.75 + 'px 微软雅黑'
      ctx.fillText('单位：' + this.itemUnit, leftMargin + 8 + canvas.width / 9 * this.itemPrice.split('.')[0].length + this.itemPrice.split('.')[1].length * canvas.width / 12.5 + 20, topMargin + canvas.width / 6 + canvas.width / 13.5 * 2)
      // 右边框信息-产地
      ctx.font = canvas.width / 18.75 + 'px 微软雅黑'
      ctx.fillText('产地：' + this.itemOrigin, leftMargin + 8 + canvas.width / 9 * this.itemPrice.split('.')[0].length + this.itemPrice.split('.')[1].length * canvas.width / 12.5 + 20, topMargin + canvas.width / 6 + canvas.width / 13.5 * 3)
      // 条形码
      var barcode = document.getElementById('barcode')
      barcode.width = barcode.width
      var barcodewidth = canvas.width / 2.5
      var barcodeheight = canvas.height / 4
      JsBarcode('#barcode', this.itemBarCode, {
        fontSize: canvas.width / 6
      })
      var barcodeimg = convertCanvasToImage(barcode)
      barcodeimg.onload = function () { ctx.drawImage(barcodeimg, leftMargin, canvas.height * 0.74, barcodewidth, barcodeheight) }
    }
  }
}
</script>

<style>
#barcode{
  display: none;
}
</style>
