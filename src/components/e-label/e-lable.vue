<template>
    <div class ="label-canvas">
      <slot></slot>
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
var widthRadius
var heightRadius
var dispmsData // 从父级取得的数据，防止频繁请求
var isDataReady = false // 确保drawLabel（）不会在取得数据前触发
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
      this.drawLabel()
    },
    'itemUnit': function () {
      this.drawLabel()
    },
    'itemNorm': function () {
      this.drawLabel()
    },
    'itemCategory': function () {
      this.drawLabel()
    },
    'itemOrigin': function () {
      this.drawLabel()
    },
    'itemNo': function () {
      this.drawLabel()
    },
    'itemQRCode': function () {
      this.drawLabel()
    },
    'itemBarCode': function () {
      this.drawLabel()
    },
    'itemStock': function () {
      this.drawLabel()
    },
    'itemisOnSale': function () {
      this.drawLabel()
    },
    'itemPrice': function () {
      this.drawLabel()
    },
    'itemOnSalePrice': function () {
      this.drawLabel()
    },
    'labelStyle': function () {
      this.drawLabel()
    }
  },
  mounted () {
  },
  methods: {
    draw () {
      console.log('draw')
      canvas = this.$refs.canvas
      ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.textBaseline = 'top'
      if (this.labelStyle === '1') {
        canvas.width = 250
        canvas.height = 122
        canvas.width = canvas.width
        widthRadius = canvas.width / 250
        heightRadius = canvas.height / 122
        // 商品名称
        this.drawDispms('', 2 * widthRadius, 4 * heightRadius, 0, 0, 1, this.itemName, '', '', 'normal', '微软雅黑', 0, 21 * widthRadius)
        // 下划线
        this.drawDispms('线段', 2 * widthRadius, 28 * heightRadius, 250 * widthRadius, 0, 1, '', '', '', 'normal', '微软雅黑', 1, 0)
        if (this.itemisOnSale) {
          // 原价整
          this.drawDispms('', 10 * widthRadius, 36 * heightRadius, 0, 0, 1, '原价：￥', '', '', 'bold', '微软雅黑', 0, 16 * widthRadius)
          this.drawDispms('', 72 * widthRadius, 36 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'bold', '微软雅黑', 0, 16 * widthRadius)
          // 原价小
          this.drawDispms('', 80 * widthRadius, 34 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[1], '', '', 'bold', '微软雅黑', 0, 14 * widthRadius, this.itemPrice.split('.')[0], 8 * widthRadius)
          // 划线
          this.drawDispms('线段', 68 * widthRadius, 42 * heightRadius, 0, 0, 1, '', '', '', 'normal', '微软雅黑', 1, 0, '', 0, this.itemPrice.split('.')[0], 14 * widthRadius)
          this.drawDispms('线段', 80 * widthRadius, 40 * heightRadius, 0, 0, 1, '', '', '', 'normal', '微软雅黑', 1, 0, this.itemPrice.split('.')[0], 8 * widthRadius, this.itemPrice.split('.')[1], 10 * widthRadius)
          // 红色底
          this.drawDispms('背景', 57 * widthRadius, 56 * heightRadius, 96 * widthRadius, 32 * heightRadius, 2, '', '', '', 'bold', '微软雅黑', 2, 16 * widthRadius)
          // 促价整
          this.drawDispms('', 10 * widthRadius, 66 * heightRadius, 0, 0, 1, '现价：', '', '', 'bold', '微软雅黑', 2, 16 * widthRadius)
          this.drawDispms('', 57 * widthRadius, 66 * heightRadius, 0, 0, 1, this.itemOnSalePrice.split('.')[0], '￥', '.', 'bold', '微软雅黑', 1, 21 * widthRadius)
          // 促价小
          this.drawDispms('', 88 * widthRadius, 64 * heightRadius, 0, 0, 1, this.itemOnSalePrice.split('.')[1], '', '', 'bold', '微软雅黑', 1, 18 * widthRadius, this.itemOnSalePrice.split('.')[0], 12 * widthRadius)
        } else {
          // 价格整
          this.drawDispms('', 10 * widthRadius, 46 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'normal', '微软雅黑', 0, 50 * widthRadius)
          // 价格小
          this.drawDispms('', 10 * widthRadius, 40 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[1], '', '', 'normal', '微软雅黑', 0, 38 * widthRadius, this.itemPrice.split('.')[0], 33 * widthRadius)
        }
        // 右边框信息-规格
        this.drawDispms('', 170 * widthRadius, 48 * heightRadius, 0, 0, 1, this.itemNorm, '规格：', '', 'normal', '微软雅黑', 0, 13 * widthRadius)
        // 右边框信息-类别
        this.drawDispms('', 170 * widthRadius, 66 * heightRadius, 0, 0, 1, this.itemCategory, '类别：', '', 'normal', '微软雅黑', 0, 13 * widthRadius)
        // 右边框信息-单位
        this.drawDispms('', 170 * widthRadius, 84 * heightRadius, 0, 0, 1, this.itemUnit, '单位：', '', 'normal', '微软雅黑', 0, 13 * widthRadius)
        // 右边框信息-产地
        this.drawDispms('', 170 * widthRadius, 102 * heightRadius, 0, 0, 1, this.itemOrigin, '产地：', '', 'normal', '微软雅黑', 0, 13 * widthRadius)
        // 条形码
        this.drawDispms('条形码', 2 * widthRadius, 96 * heightRadius, 114 * widthRadius, 25 * heightRadius, 0, this.itemBarCode, '', '', '', '', 0, 67 * widthRadius)
      } else if (this.labelStyle === '2') {
        ctx.textBaseline = 'top'
        canvas.width = canvas.width
        canvas.width = 400
        canvas.height = 300
        widthRadius = canvas.width / 400
        heightRadius = canvas.height / 300
        // 商品名称
        this.drawDispms('', 2 * widthRadius, 4 * heightRadius, 0, 0, 1, this.itemName, '', '', 'normal', '微软雅黑', 0, 33 * widthRadius)
        // 下划线
        this.drawDispms('线段', 2 * widthRadius, 40 * heightRadius, 400 * widthRadius, 0, 1, '原价：￥', '', '', 'normal', '微软雅黑', 0, 0 * widthRadius)
        if (this.itemisOnSale) {
          // '原价：￥'
          this.drawDispms('', 6 * widthRadius, 62 * heightRadius, 0, 0, 1, '原价：￥', '', '', 'normal', '微软雅黑', 0, 20 * widthRadius)
          // 原价整
          this.drawDispms('', 86 * widthRadius, 62 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'oblique', '微软雅黑', 0, 20 * widthRadius)
          // 原价小
          this.drawDispms('', 86 * widthRadius, 60 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[1], '', '', 'oblique', '微软雅黑', 0, 15 * widthRadius, this.itemPrice.split('.')[0], 14 * widthRadius)
          // 划线
          this.drawDispms('线段', 86 * widthRadius, 70 * heightRadius, 0, 0, 1, '', '', '', 'normal', '微软雅黑', 2, 0, '', 0, this.itemPrice.split('.')[0], 14 * widthRadius)
          this.drawDispms('线段', 86 * widthRadius, 67 * heightRadius, 0, 0, 1, '', '', '', 'normal', '微软雅黑', 2, 0, this.itemPrice.split('.')[0], 14 * widthRadius, this.itemPrice.split('.')[1], 12 * widthRadius)
          // '现价：￥'
          this.drawDispms('', 6 * widthRadius, 130 * heightRadius, 0, 0, 1, '现价：￥', '', '', 'normal', '微软雅黑', 2, 20 * widthRadius)
          // 现价整
          this.drawDispms('', 82 * widthRadius, 98 * heightRadius, 0, 0, 1, this.itemOnSalePrice.split('.')[0], '', '.', 'bold', '微软雅黑', 2, 66 * widthRadius)
          // 现价小
          this.drawDispms('', 82 * widthRadius, 88 * heightRadius, 0, 0, 1, this.itemOnSalePrice.split('.')[1], '', '', 'bold', '微软雅黑', 2, 57 * widthRadius, this.itemOnSalePrice.split('.')[0], 48 * widthRadius)
        } else {
          // '￥'号
          this.drawDispms('', 6 * widthRadius, 80 * heightRadius, 0, 0, 1, '￥', '', '', 'normal', '微软雅黑', 0, 44 * widthRadius)
          // 价格整
          this.drawDispms('', 48 * widthRadius, 80 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'normal', '微软雅黑', 0, 80 * widthRadius)
          // 价格小
          this.drawDispms('', 64 * widthRadius, 78 * heightRadius, 48 * widthRadius, 0, 1, this.itemPrice.split('.')[1], '', '', 'normal', '微软雅黑', 0, 57 * widthRadius, this.itemPrice.split('.')[0], 48 * widthRadius)
          // '元'
          this.drawDispms('', 280 * widthRadius, 110 * heightRadius, 0, 0, 1, '元', '', '', 'normal', '微软雅黑', 0, 44 * widthRadius, this.itemPrice.split('.')[0], 0 * widthRadius, this.itemPrice.split('.')[1], 0 * widthRadius)
        }
        // 规格
        this.drawDispms('', 6 * widthRadius, 190 * heightRadius, 0, 0, 1, this.itemNorm, '规格：', '', 'normal', '微软雅黑', 0, 17 * widthRadius)
        // 单位
        this.drawDispms('', 133 * widthRadius, 190 * heightRadius, 0, 0, 1, this.itemUnit, '单位：', '', 'normal', '微软雅黑', 0, 17 * widthRadius)
        // 产地
        this.drawDispms('', 6 * widthRadius, 230 * heightRadius, 0, 0, 1, this.itemOrigin, '产地：', '', 'normal', '微软雅黑', 0, 17 * widthRadius)
        // 等级
        this.drawDispms('', 133 * widthRadius, 230 * heightRadius, 0, 0, 1, this.itemCategory, '等级：', '', 'normal', '微软雅黑', 0, 17 * widthRadius)
        // 二维码
        this.drawDispms('二维码', 280 * widthRadius, 170 * heightRadius, 100 * heightRadius, 100 * heightRadius, 0, this.itemQRCode, '', '', 0, '', '', 0)
        // 条形码
        this.drawDispms('条形码', 6 * widthRadius, 258 * canvas.height / 300, 100 * widthRadius, 30 * heightRadius, 0, this.itemBarCode, '', '', 0, '', '', 67 * widthRadius)
      } else if (this.labelStyle === '3') {
        canvas.width = 250
        canvas.height = 122
        canvas.width = canvas.width
        widthRadius = canvas.width / 250
        heightRadius = canvas.height / 122
        // 商品名称
        this.drawDispms('', 4 * widthRadius, 8 * heightRadius, 0, 0, 1, this.itemName, '', '', 'bold', '微软雅黑', 0, 16 * widthRadius)
        if (this.itemisOnSale) {
          // 单位
          this.drawDispms('', 4 * widthRadius, 34 * heightRadius, 0, 0, 1, this.itemUnit, '单位：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
          // 规格
          this.drawDispms('', 4 * widthRadius, 52 * heightRadius, 0, 0, 1, this.itemNorm, '规格：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
          // 产地
          this.drawDispms('', 4 * widthRadius, 70 * heightRadius, 0, 0, 1, this.itemOrigin, '产地：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
          // 黑色底
          this.drawDispms('背景', 4 * widthRadius, 82 * heightRadius, 76 * widthRadius, 30 * heightRadius, 0, '', '', '', 'bold', '微软雅黑', 2, 0)
          // '促销'
          this.drawDispms('', 12 * widthRadius, 86 * heightRadius, 0, 0, 1, '促销', '', '', 'normal', '微软雅黑', 1, 28 * widthRadius)
          // '现价'
          this.drawDispms('', 88 * widthRadius, 78 * heightRadius, 0, 0, 1, '现价', '', '', 'bold', '微软雅黑', 0, 16 * widthRadius)
          // 黑色底
          this.drawDispms('背景', 130 * widthRadius, 74 * heightRadius, 120 * widthRadius, 45 * heightRadius, 0, '', '', '', 'bold', '微软雅黑', 2, 0)
          // 现价整
          this.drawDispms('', 130 * widthRadius, 84 * heightRadius, 0, 0, 1, this.itemOnSalePrice.split('.')[0], '', '.', 'bold', '微软雅黑', 1, 40 * widthRadius)
          // 现价小
          this.drawDispms('', 146 * widthRadius, 77 * heightRadius, 0, 0, 1, this.itemOnSalePrice.split('.')[1], '', '', 'bold', '微软雅黑', 1, 32 * widthRadius, this.itemOnSalePrice.split('.')[0], 22 * widthRadius)
          // '原价'
          this.drawDispms('', 104 * widthRadius, 50 * heightRadius, 0, 0, 1, '原价', '', '', 'normal', '微软雅黑', 0, 14 * widthRadius)
          // 原价整
          this.drawDispms('', 200 * widthRadius, 50 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'oblique', '微软雅黑', 0, 16 * widthRadius)
          // 原价小
          this.drawDispms('', 208 * widthRadius, 50 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[1], '', '', 'oblique', '微软雅黑', 0, 12 * widthRadius, this.itemPrice.split('.')[0], 8 * widthRadius)
          // 划线
          this.drawDispms('线段', 200 * widthRadius, 56 * heightRadius, 0, 0, 1, '', '', '', 'normal', '微软雅黑', 1, 0, '', 0, this.itemPrice.split('.')[0], 12 * widthRadius)
          this.drawDispms('线段', 208 * widthRadius, 54 * heightRadius, 0, 0, 1, '', '', '', 'normal', '微软雅黑', 1, 0, this.itemPrice.split('.')[0], 8 * widthRadius, this.itemPrice.split('.')[1], 8 * widthRadius)
          // 条形码
          this.drawDispms('条形码', 140 * widthRadius, 19 * heightRadius, 100 * widthRadius, 20 * heightRadius, 0, this.itemBarCode, '', '', 0, '', '', 67 * widthRadius)
        } else {
          // 单位
          this.drawDispms('', 4 * widthRadius, 34 * heightRadius, 0, 0, 1, this.itemUnit, '单位：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
          // 规格
          this.drawDispms('', 70 * widthRadius, 34 * heightRadius, 0, 0, 1, this.itemNorm, '规格：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
          // 产地
          this.drawDispms('', 4 * widthRadius, 54 * heightRadius, 0, 0, 1, this.itemOrigin, '产地：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
          // 货号
          this.drawDispms('', 70 * widthRadius, 54 * heightRadius, 0, 0, 1, this.itemNo, '货号：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
          // 价格整
          this.drawDispms('', 4 * widthRadius, 90 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'normal', '微软雅黑', 0, 42 * widthRadius)
          // 价格小
          this.drawDispms('', 24 * widthRadius, 80 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[1], '', '', 'normal', '微软雅黑', 0, 38 * widthRadius, this.itemPrice.split('.')[0], 22 * widthRadius)
          // 二维码
          this.drawDispms('二维码', 160 * widthRadius, 9 * heightRadius, 80 * heightRadius, 80 * heightRadius, 0, this.itemQRCode, '', '', 0, '', '', 0)
          // 条形码
          this.drawDispms('条形码', 140 * widthRadius, 100 * heightRadius, 100 * widthRadius, 20 * heightRadius, 0, this.itemBarCode, '', '', 0, '', '', 67 * widthRadius)
        }
      } else if (this.labelStyle === '4') {
        canvas.width = 212
        canvas.height = 104
        widthRadius = canvas.width / 212
        heightRadius = canvas.height / 104
        // '名称'
        this.drawDispms('', 4 * widthRadius, 4 * heightRadius, 0, 0, 1, this.itemName, '', '', 'bold', '微软雅黑', 0, 20 * widthRadius)
        // 条形码
        this.drawDispms('条形码', 2 * widthRadius, 30 * heightRadius, 90 * widthRadius, 20 * heightRadius, 0, this.itemBarCode, '', '', 0, '', '', 67 * widthRadius)
        // 货号
        this.drawDispms('', 4 * widthRadius, 62 * heightRadius, 0, 0, 1, this.itemNo, '货号：', '', 'bold', '微软雅黑', 0, 16 * widthRadius)
        // 库存
        this.drawDispms('', 4 * widthRadius, 82 * heightRadius, 0, 0, 1, this.itemStock, '库存：', '', 'bold', '微软雅黑', 0, 16 * widthRadius)
      } else if (this.labelStyle === '5') {
        canvas.width = 250
        canvas.height = 122
        widthRadius = canvas.width / 250
        heightRadius = canvas.height / 122
        // '名称'
        this.drawDispms('', 4 * widthRadius, 4 * heightRadius, 0, 0, 1, this.itemName, '', '', 'bold', '微软雅黑', 0, 22 * widthRadius)
        // 单位
        this.drawDispms('', 4 * widthRadius, 30 * heightRadius, 0, 0, 1, this.itemUnit, '单位：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
        // 规格
        this.drawDispms('', 76 * widthRadius, 30 * heightRadius, 0, 0, 1, this.itemNorm, '规格：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
        // 产地
        this.drawDispms('', 4 * widthRadius, 46 * heightRadius, 0, 0, 1, this.itemOrigin, '产地：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
        // 货号
        this.drawDispms('', 76 * widthRadius, 46 * heightRadius, 0, 0, 1, this.itemNo, '货号：', '', 'normal', '微软雅黑', 0, 12 * widthRadius)
        // 价格整
        this.drawDispms('', 4 * widthRadius, 80 * heightRadius, 0, 0, 1, this.itemPrice.split('.')[0], '', '.', 'bold', '微软雅黑', 0, 50 * widthRadius)
        // 价格小
        this.drawDispms('', 26 * widthRadius, 70 * heightRadius, 48 * widthRadius, 0, 1, this.itemPrice.split('.')[1], '', '', 'bold', '微软雅黑', 0, 44 * widthRadius, this.itemPrice.split('.')[0], 28 * widthRadius)
        // 二维码
        this.drawDispms('二维码', 170 * widthRadius, 9 * heightRadius, 80 * heightRadius, 80 * heightRadius, 0, this.itemQRCode, '', '', 0, '', '', 0)
      } else {

      }
    },
    drawDispms (columnType, x, y, width, height, bgColor, text, sText, eText, fontBold, fontFamily, fontColor, fontSize) {
      if (columnType === '条形码') {
        // 条形码
        barcodecanvas = document.getElementById('barcode')
        barcodecanvas.width = barcodecanvas.width
        JsBarcode('#barcode', text, {
          format: 'EAN13',
          fontSize: fontSize,
          margin: 0,
          textMargin: 0,
          width: height / 5
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
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + width, y)
        ctx.stroke()
      } else if (columnType === '背景') {
        // 背景
        if (bgColor === 0) {
          ctx.fillStyle = 'black'
        } else if (bgColor === 1) {
          ctx.fillStyle = 'white'
        } else {
          ctx.fillStyle = 'red'
        }
        ctx.fillRect(x, y, width, height)
      } else {
        ctx.textBaseline = 'top'
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
    },
    drawLabel () {
      if (!isDataReady) return
      canvas.width = canvas.width // 清空画布
      var len = dispmsData.length
      for (var i = 0; i < len; ++i) {
        if (dispmsData[i].status === 0) {
          continue
        }
        this.drawDispms('背景', dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemName, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        if (dispmsData[i].sourceColumn === 'name') {
          this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemName, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        } else if (dispmsData[i].sourceColumn === 'price') {
          if (this.itemPrice.split('.').length === 1) {
            let isLine = dispmsData[i].backup.split('/')[0]
            if (isLine === '1') {
              this.drawDispms('线段', dispmsData[i].x * widthRadius, (dispmsData[i].y + 0.5 * dispmsData[i].height) * heightRadius, parseInt(dispmsData[i].backup.split('/')[1]) * widthRadius, 0 * heightRadius, dispmsData[i].backgroundColor, '', dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
            }
            this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemPrice, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
          } else {
            let intPart = (this.itemPrice + '').split('.')[0]
            let decPart = (this.itemPrice + '').split('.')[1]
            let isLine = dispmsData[i].backup.split('/')[0]
            let decFontSize = dispmsData[i].backup.split('/')[1]
            let fontPerLen = parseInt(dispmsData[i].backup.split('/')[2]) / (dispmsData[i].text.split('.')[0].length)
            if (isLine === '1') {
              this.drawDispms('线段', dispmsData[i].x * widthRadius, (dispmsData[i].y + 0.5 * dispmsData[i].height) * heightRadius, fontPerLen * (intPart.length) * widthRadius, 0 * heightRadius, dispmsData[i].backgroundColor, this.itemName, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
              this.drawDispms('线段', (dispmsData[i].x + fontPerLen * (intPart.length + 1)) * widthRadius, (dispmsData[i].y + 0.4 * dispmsData[i].height) * heightRadius, fontPerLen * (intPart.length) * widthRadius, 0 * heightRadius, dispmsData[i].backgroundColor, this.itemName, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
            }
            this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, intPart + '.', dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
            this.drawDispms(dispmsData[i].columnType, (dispmsData[i].x + fontPerLen * (intPart.length + 1)) * widthRadius, dispmsData[i].y * heightRadius, (dispmsData[i].width - fontPerLen * (intPart.length + 1)) * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, decPart, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, parseInt(decFontSize) * widthRadius)
          }
        } else if (dispmsData[i].sourceColumn === 'promotePrice') {
          if (this.itemOnSalePrice.split('.') === 1) {
            let isLine = dispmsData[i].backup.split('/')[0]
            if (isLine === '1') {
              this.drawDispms('线段', dispmsData[i].x * widthRadius, (dispmsData[i].y + 0.5 * dispmsData[i].height) * heightRadius, parseInt(dispmsData[i].backup.split('/')[1]) * widthRadius, 0 * heightRadius, dispmsData[i].backgroundColor, '', dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
            }
            this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemOnSalePrice, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
          } else {
            let intPart = (this.itemOnSalePrice + '').split('.')[0]
            let decPart = (this.itemOnSalePrice + '').split('.')[1]
            let isLine = dispmsData[i].backup.split('/')[0]
            let decFontSize = dispmsData[i].backup.split('/')[1]
            let fontPerLen = parseInt(dispmsData[i].backup.split('/')[2]) / (dispmsData[i].text.split('.')[0].length)
            if (isLine === '1') {
              ctx.textBaseline = 'middle'
              this.drawDispms('线段', dispmsData[i].x * widthRadius, (dispmsData[i].y + 0.2 * dispmsData[i].height) * heightRadius, fontPerLen * (intPart.length) * widthRadius, 0 * heightRadius, dispmsData[i].backgroundColor, this.itemName, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
              this.drawDispms('线段', (dispmsData[i].x + fontPerLen * (intPart.length + 1)) * widthRadius, (dispmsData[i].y + 0.18 * dispmsData[i].height) * heightRadius, fontPerLen * (intPart.length) * widthRadius, 0 * heightRadius, dispmsData[i].backgroundColor, this.itemName, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
              ctx.textBaseline = 'top'
            }
            this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, intPart + '.', dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
            this.drawDispms(dispmsData[i].columnType, (dispmsData[i].x + fontPerLen * (intPart.length + 1)) * widthRadius, dispmsData[i].y * heightRadius, (dispmsData[i].width - fontPerLen * (intPart.length + 1)) * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, decPart, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, parseInt(decFontSize) * widthRadius)
          }
        } else if (dispmsData[i].sourceColumn === 'normal') {
          this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemNorm, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        } else if (dispmsData[i].sourceColumn === 'category') {
          this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemCategory, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        } else if (dispmsData[i].sourceColumn === 'unit') {
          this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemUnit, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        } else if (dispmsData[i].sourceColumn === 'origin') {
          this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemOrigin, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        } else if (dispmsData[i].sourceColumn === 'shelfNumber') {
          this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemNo, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        } else if (dispmsData[i].sourceColumn === 'qrCode') {
          this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemQRCode, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        } else if (dispmsData[i].sourceColumn === 'barCode') {
          this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemBarCode, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        } else if (dispmsData[i].sourceColumn === 'stock') {
          this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, this.itemStock, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        } else {
          this.drawDispms(dispmsData[i].columnType, dispmsData[i].x * widthRadius, dispmsData[i].y * heightRadius, dispmsData[i].width * widthRadius, dispmsData[i].height * heightRadius, dispmsData[i].backgroundColor, dispmsData[i].text, dispmsData[i].startText, dispmsData[i].endText, dispmsData[i].fontType, dispmsData[i].fontFamily, dispmsData[i].fontColor, dispmsData[i].fontSize * widthRadius)
        }
      }
    },
    initData (data, width, height) {
      canvas = this.$refs.canvas
      if (data === null) {
        canvas.width = 0
        canvas.height = 0
        return
      }
      isDataReady = true
      dispmsData = data.sort((a, b) => {
        if (a.columnType === '背景') {
          return -1
        } else if (b.columnType === '背景') {
          return 1
        } else {
          return 0
        }
      })
      canvas = this.$refs.canvas
      canvas.width = width // TODO
      canvas.height = height // TODO
      widthRadius = canvas.width / width // TODO
      heightRadius = canvas.height / height // TODO
      ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.textBaseline = 'top'
      this.drawLabel()
    }
  }
}
</script>

<style>
#label{
  position: relative;
  margin: auto;
}
#barcode{
  display: none;
}
#qrcode{
  display: none;
}
.label-canvas{
  display: flex;
  position: relative;
  text-align: center;
}
</style>
