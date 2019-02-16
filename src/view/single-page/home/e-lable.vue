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
    itemCategory: {
      type: String,
      default: '食品'
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
  watch: {
    'itemName': function () {
      this.draw()
    },
    'itemUnit': function () {
      this.draw()
    },
    'itemNorm': function () {
      this.draw()
    },
    'itemCategory': function () {
      this.draw()
    },
    'itemOrigin': function () {
      this.draw()
    },
    'itemNo': function () {
      this.draw()
    },
    'itemQRCode': function () {
      this.draw()
    },
    'itemBarCode': function () {
      this.draw()
    },
    'itemisOnSale': function () {
      this.draw()
    },
    'itemPrice': function () {
      this.draw()
    },
    'itemOnSalePrice': function () {
      this.draw()
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
      ctx.font = canvas.width / 12 + 'px 微软雅黑'
      ctx.fillText(this.itemName, leftMargin + 0, topMargin + canvas.width / 15)
      // 下划线
      ctx.beginPath()
      ctx.moveTo(leftMargin + 0, topMargin + canvas.width / 15 + 10)
      ctx.lineTo(canvas.width, topMargin + canvas.width / 15 + 10)
      ctx.stroke()
      console.log(this.itemisOnSale)
      if (this.itemisOnSale) {
        ctx.textBaseline = 'middle'
        // 原价整
        ctx.font = 'bold ' + canvas.width / 16 + 'px 微软雅黑'
        ctx.fillText('原价：￥' + this.itemPrice.split('.')[0] + '.', leftMargin + 8, topMargin + canvas.width / 15 + 10 + canvas.width / 16)
        // 原价小
        ctx.font = 'bold ' + canvas.width / 18 + 'px 微软雅黑'
        ctx.fillText(this.itemPrice.split('.')[1], leftMargin + 8 + canvas.width / 19.5 * (this.itemPrice.split('.')[0].length + 4) + 10, topMargin + canvas.width / 15 + 10 + canvas.width / 16 * 0.9)
        // 划线
        ctx.beginPath()
        ctx.moveTo(leftMargin + 8 + canvas.width / 19.5 * 4, topMargin + canvas.width / 15 + 10 + canvas.width / 16)
        ctx.lineTo(leftMargin + 8 + canvas.width / 19.5 * (this.itemPrice.split('.')[0].length + 4) + 10, topMargin + canvas.width / 15 + 10 + canvas.width / 16)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(leftMargin + 8 + canvas.width / 19.5 * (this.itemPrice.split('.')[0].length + 4) + 10, topMargin + canvas.width / 15 + 10 + canvas.width / 16 * 0.9)
        ctx.lineTo(leftMargin + 8 + canvas.width / 19.5 * (this.itemPrice.split('.')[0].length + 5) + 10, topMargin + canvas.width / 15 + 10 + canvas.width / 16 * 0.9)
        ctx.stroke()
        // 红色底
        ctx.fillStyle = 'red'
        ctx.fillRect(leftMargin + 8 + 3 * canvas.width / 16, topMargin + canvas.width / 15 + 10 + canvas.width / 16 + canvas.width / 18, canvas.width / 13 * 5, canvas.width / 8)
        // 促价整
        ctx.font = 'bold ' + canvas.width / 16 + 'px 微软雅黑'
        ctx.fillText('现价：', leftMargin + 8, topMargin + canvas.width / 15 + 10 + canvas.width / 16 + canvas.width / 18 + canvas.width / 15)
        ctx.fillStyle = 'white'
        ctx.font = 'bold ' + canvas.width / 12 + 'px 微软雅黑'
        ctx.fillText('￥' + this.itemOnSalePrice.split('.')[0] + '.', leftMargin + 8 + 3 * canvas.width / 16, topMargin + canvas.width / 15 + 10 + canvas.width / 16 + canvas.width / 18 + canvas.width / 15)
        // 促价小
        ctx.font = 'bold ' + canvas.width / 14 + 'px 微软雅黑'
        ctx.fillText(this.itemOnSalePrice.split('.')[1], leftMargin + 8 + canvas.width / 16.5 * (this.itemOnSalePrice.split('.')[0].length + 4) + 10, topMargin + canvas.width / 15 + 10 + canvas.width / 16 + canvas.width / 18 * 0.8 + canvas.width / 15)
        ctx.textBaseline = 'hanging'
      } else {
        ctx.textBaseline = 'hanging'
        // 价格整
        ctx.font = canvas.width / 5 + 'px 微软雅黑'
        ctx.fillText(this.itemPrice.split('.')[0] + '.', leftMargin + 8, topMargin + canvas.width / 6)
        // 价格小
        ctx.font = canvas.width / 6.5 + 'px 微软雅黑'
        ctx.fillText(this.itemPrice.split('.')[1], leftMargin + 8 + canvas.width / 7.5 * this.itemPrice.split('.')[0].length, topMargin + canvas.width / 6)
      }
      ctx.fillStyle = 'black'
      // 右边框信息-规格
      ctx.font = canvas.width / 18.75 + 'px 微软雅黑'
      ctx.fillText('规格：' + this.itemNorm, canvas.width * 0.68, topMargin + canvas.width / 6)
      // 右边框信息-类别
      ctx.font = canvas.width / 18.75 + 'px 微软雅黑'
      ctx.fillText('类别：' + this.itemCategory, canvas.width * 0.68, topMargin + canvas.width / 6 + canvas.width / 13.5 * 1)
      // 右边框信息-单位
      ctx.font = canvas.width / 18.75 + 'px 微软雅黑'
      ctx.fillText('单位：' + this.itemUnit, canvas.width * 0.68, topMargin + canvas.width / 6 + canvas.width / 13.5 * 2)
      // 右边框信息-产地
      ctx.font = canvas.width / 18.75 + 'px 微软雅黑'
      ctx.fillText('产地：' + this.itemOrigin, canvas.width * 0.68, topMargin + canvas.width / 6 + canvas.width / 13.5 * 3)
      // 条形码
      var barcode = document.getElementById('barcode')
      barcode.width = barcode.width
      var barcodewidth = canvas.width / 2.2
      var barcodeheight = canvas.height / 5
      JsBarcode('#barcode', this.itemBarCode, {
        format: 'EAN13',
        fontSize: canvas.width / 6,
        margin: 0,
        textMargin: 0,
        width: this.itemBarCode.length / 3
      })
      var barcodeimg = convertCanvasToImage(barcode)
      barcodeimg.onload = function () { ctx.drawImage(barcodeimg, leftMargin, canvas.height * 0.76, barcodewidth, barcodeheight) }
    }
  }
}
</script>

<style>
#barcode{
  display: none;
}
</style>
