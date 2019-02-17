<template>
    <div>
      <canvas id="label" ref="canvas">您的浏览器不支持canvas！</canvas>
      <canvas id="barcode">您的浏览器不支持canvas！</canvas>
      <canvas id="qrcode">您的浏览器不支持canvas！</canvas>
    </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
import qrcode from 'qrcode'
import { convertCanvasToImage } from '@/libs/util'
var canvas
var ctx
var barcodecanvas
var barcodeimg
var qrcodecanvas
var qrcodeimg
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
      default: '692226641428'
    },
    itemBarCode: {
      type: String,
      default: '692226641428'
    },
    itemStock: {
      type: String,
      default: '110'
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
    },
    labelStyle: {
      type: String,
      default: '1'
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
    'itemStock': function () {
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
    },
    'labelStyle': function () {
      this.draw()
    }
  },
  mounted () {
    this.draw()
  },
  methods: {
    draw () {
      var widthRadius
      var heightRadius
      canvas = this.$refs.canvas
      ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.textBaseline = 'alphabetic'
      if (this.labelStyle === '1') {
        canvas.width = 250
        canvas.height = 122
        widthRadius = canvas.width / 250
        heightRadius = canvas.height / 122
        // 商品名称
        ctx.textBaseline = 'alphabetic'
        this.drawDispms('', 2 * widthRadius, 18 * heightRadius, 0, 0, 1, this.itemName, '', '', 'normal', '微软雅黑', 0, 21 * widthRadius)
        // 下划线
        ctx.textBaseline = 'alphabetic'
        this.drawDispms('线段', 2 * widthRadius, 28 * heightRadius, 250 * widthRadius, 0, 1, '', '', '', 'normal', '微软雅黑', 1, 0)
        if (this.itemisOnSale) {
          // 原价整
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 10 * widthRadius, 48 * heightRadius, 0, 0, 1, '原价：￥', '', '', 'bold', '微软雅黑', 0, 16 * widthRadius)
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 72 * widthRadius, 48 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'bold', '微软雅黑', 0, 16 * widthRadius)
          // 原价小
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 80 * widthRadius, 46 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[1], '', '', 'bold', '微软雅黑', 0, 14 * widthRadius, this.itemPrice.split('.')[0], 8 * widthRadius)
          // 划线
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('线段', 68 * widthRadius, 42 * heightRadius, 0, 0, 1, '', '', '', 'normal', '微软雅黑', 1, 0, '', 0, this.itemPrice.split('.')[0], 14 * widthRadius)
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('线段', 80 * widthRadius, 40 * heightRadius, 0, 0, 1, '', '', '', 'normal', '微软雅黑', 1, 0, this.itemPrice.split('.')[0], 8 * widthRadius, this.itemPrice.split('.')[1], 10 * widthRadius)
          // 红色底
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('背景', 57 * widthRadius, 56 * heightRadius, 96 * widthRadius, 32 * heightRadius, 2, '', '', '', 'bold', '微软雅黑', 2, 16 * widthRadius)
          // 促价整
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 10 * widthRadius, 80 * heightRadius, 0, 0, 1, '现价：', '', '', 'bold', '微软雅黑', 2, 16 * widthRadius)
          ctx.fillStyle = 'white'
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 57 * widthRadius, 80 * heightRadius, 0, 0, 1, this.itemOnSalePrice.split('.')[0], '￥', '.', 'bold', '微软雅黑', 1, 21 * widthRadius)
          // 促价小
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 88 * widthRadius, 77 * heightRadius, 0, 0, 1, this.itemOnSalePrice.split('.')[1], '', '', 'bold', '微软雅黑', 1, 18 * widthRadius, this.itemOnSalePrice.split('.')[0], 12 * widthRadius)
        } else {
          // 价格整
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 10 * widthRadius, 86 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'normal', '微软雅黑', 0, 50 * widthRadius)
          // 价格小
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 10 * widthRadius, 78 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[1], '', '', 'normal', '微软雅黑', 0, 38 * widthRadius, this.itemPrice.split('.')[0], 33 * widthRadius)
        }
        // 右边框信息-规格
        ctx.textBaseline = 'alphabetic'
        this.drawDispms('', 170 * widthRadius, 56 * heightRadius, 0, 0, 1, this.itemNorm, '规格：', '', 'normal', '微软雅黑', 0, 13 * widthRadius)
        // 右边框信息-类别
        ctx.textBaseline = 'alphabetic'
        this.drawDispms('', 170 * widthRadius, 74 * heightRadius, 0, 0, 1, this.itemCategory, '类别：', '', 'normal', '微软雅黑', 0, 13 * widthRadius)
        // 右边框信息-单位
        ctx.textBaseline = 'alphabetic'
        this.drawDispms('', 170 * widthRadius, 92 * heightRadius, 0, 0, 1, this.itemUnit, '单位：', '', 'normal', '微软雅黑', 0, 13 * widthRadius)
        // 右边框信息-产地
        ctx.textBaseline = 'alphabetic'
        this.drawDispms('', 170 * widthRadius, 110 * heightRadius, 0, 0, 1, this.itemOrigin, '产地：', '', 'normal', '微软雅黑', 0, 13 * widthRadius)
        // 条形码
        this.drawDispms('条形码', 2 * widthRadius, 96 * heightRadius, 114 * widthRadius, 25 * heightRadius, 0, this.itemBarCode, '', '', 0, '', '', 67 * widthRadius)
      } else if (this.labelStyle === '2') {
        ctx.textBaseline = 'alphabetic'
        canvas.width = 400
        canvas.height = 300
        widthRadius = canvas.width / 400
        heightRadius = canvas.height / 300
        // 商品名称
        ctx.textBaseline = 'alphabetic'
        this.drawDispms('', 2 * widthRadius, 30 * heightRadius, 0, 0, 1, this.itemName, '', '', 'normal', '微软雅黑', 0, 33 * widthRadius)
        // 下划线
        ctx.textBaseline = 'alphabetic'
        this.drawDispms('线段', 2 * widthRadius, 38 * heightRadius, 400 * widthRadius, 0, 1, '原价：￥', '', '', 'normal', '微软雅黑', 0, 20 * widthRadius)

        if (this.itemisOnSale) {
          // '原价：￥'
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 6 * widthRadius, 76 * heightRadius, 0, 0, 1, '原价：￥', '', '', 'normal', '微软雅黑', 0, 20 * widthRadius)
          // 原价整
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 86 * widthRadius, 76 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'oblique', '微软雅黑', 0, 20 * widthRadius)
          // 原价小
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 86 * widthRadius, 72 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[1], '', '', 'oblique', '微软雅黑', 0, 15 * widthRadius, this.itemPrice.split('.')[0], 14 * widthRadius)
          // 划线
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('线段', 86 * widthRadius, 70 * heightRadius, 0, 0, 1, '', '', '', 'normal', '微软雅黑', 2, 0, '', 0, this.itemPrice.split('.')[0], 14 * widthRadius)
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('线段', 86 * widthRadius, 67 * heightRadius, 0, 0, 1, '', '', '', 'normal', '微软雅黑', 2, 0, this.itemPrice.split('.')[0], 14 * widthRadius, this.itemPrice.split('.')[1], 12 * widthRadius)
          ctx.fillStyle = 'red'
          // '现价：￥'
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 6 * widthRadius, 150 * heightRadius, 0, 0, 1, '现价：￥', '', '', 'normal', '微软雅黑', 2, 20 * widthRadius)
          // 现价整
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 82 * widthRadius, 150 * heightRadius, 0, 0, 1, this.itemOnSalePrice.split('.')[0], '', '.', 'bold', '微软雅黑', 2, 66 * widthRadius)
          // 现价小
          this.drawDispms('', 82 * widthRadius, 140 * heightRadius, 0, 0, 1, this.itemOnSalePrice.split('.')[1], '', '', 'bold', '微软雅黑', 2, 57 * widthRadius, this.itemOnSalePrice.split('.')[0], 48 * widthRadius)
          ctx.fillStyle = 'black'
        } else {
          // '￥'号
          ctx.textBaseline = 'alphabetic'
          this.drawDispms('', 6 * widthRadius, 110 * heightRadius, 0, 0, 1, '￥', '', '', 'normal', '微软雅黑', 0, 44 * widthRadius)
          // 价格整
          this.drawDispms('', 48 * widthRadius, 140 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'normal', '微软雅黑', 0, 80 * widthRadius)
          // 价格小
          this.drawDispms('', 64 * widthRadius, 120 * heightRadius, 48 * widthRadius, 0, 1, this.itemPrice.split('.')[1], '', '', 'normal', '微软雅黑', 0, 57 * widthRadius, this.itemPrice.split('.')[0], 48 * widthRadius)
          // '元'
          this.drawDispms('', 64 * widthRadius, 150 * heightRadius, 0, 0, 1, '元', '', '', 'normal', '微软雅黑', 0, 44 * widthRadius, this.itemPrice.split('.')[0], 50 * widthRadius, this.itemPrice.split('.')[1], 40 * widthRadius)
        }
        ctx.textBaseline = 'alphabetic'
        // 规格
        this.drawDispms('', 6 * widthRadius, 204 * heightRadius, 0, 0, 1, this.itemNorm, '规格：', '', 'normal', '微软雅黑', 0, 17 * widthRadius)
        // 单位
        this.drawDispms('', 133 * widthRadius, 204 * heightRadius, 0, 0, 1, this.itemUnit, '单位：', '', 'normal', '微软雅黑', 0, 17 * widthRadius)
        // 产地
        this.drawDispms('', 6 * widthRadius, 244 * heightRadius, 0, 0, 1, this.itemOrigin, '产地：', '', 'normal', '微软雅黑', 0, 17 * widthRadius)
        // 等级
        this.drawDispms('', 133 * widthRadius, 244 * heightRadius, 0, 0, 1, this.itemCategory, '等级：', '', 'normal', '微软雅黑', 0, 17 * widthRadius)
        // 二维码
        this.drawDispms('二维码', 280 * widthRadius, 180 * heightRadius, 100 * heightRadius, 100 * heightRadius, 0, this.itemQRCode, '', '', 0, '', '', 0)
        // 条形码
        this.drawDispms('条形码', 6 * widthRadius, 258 * canvas.height / 300, 100 * widthRadius, 30 * heightRadius, 0, this.itemBarCode, '', '', 0, '', '', 67 * widthRadius)
      } else {

      }
    },
    drawDispms (columnType, x, y, width, height, bgColor, text, sText, eText, fontBold, fontFamily, fontColor, fontSize, xpre = '', xprel = 0, xext = '', xextl = 0) {
      if (columnType === '条形码') {
        // 条形码
        barcodecanvas = document.getElementById('barcode')
        barcodecanvas.width = barcodecanvas.width
        JsBarcode('#barcode', text, {
          format: 'EAN13',
          fontSize: fontSize,
          margin: 0,
          textMargin: 0,
          width: text.length / 3
        })
        barcodeimg = convertCanvasToImage(barcodecanvas)
        barcodeimg.onload = function () { ctx.drawImage(barcodeimg, x, y, width, height) }
      } else if (columnType === '二维码') {
        // 二维码
        qrcodecanvas = document.getElementById('qrcode')
        qrcode.toCanvas(qrcodecanvas, text, function (error) {
          if (error) console.error(error)
        })
        qrcodeimg = convertCanvasToImage(qrcodecanvas)
        qrcodeimg.onload = function () { ctx.drawImage(qrcodeimg, x, y, width, height) }
      } else if (columnType === '线段') {
        // 划线
        x = x + xpre.length * xprel
        width = width + xextl * xext.length
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + width, y + height)
        ctx.stroke()
      } else if (columnType === '背景') {
        // bg
        x = x + xpre.length * xprel
        width = width + xextl * xext.length
        if (bgColor === 0) {
          ctx.fillStyle = 'black'
        } else if (bgColor === 1) {
          ctx.fillStyle = 'white'
        } else {
          ctx.fillStyle = 'red'
        }
        ctx.fillRect(x, y, width, height)
      } else {
        x = x + xpre.length * xprel + xextl * xext.length
        // 文字
        if (fontColor === 0) {
          ctx.fillStyle = 'black'
        } else if (fontColor === 1) {
          ctx.fillStyle = 'white'
        } else {
          ctx.fillStyle = 'red'
        }
        ctx.font = fontBold + ' ' + fontSize + 'px ' + fontFamily
        ctx.fillText(sText + text + eText, x, y)
      }
    }
  }
}
</script>

<style>
#barcode{
  display: none;
}
#qrcode{
  display: none;
}
</style>
