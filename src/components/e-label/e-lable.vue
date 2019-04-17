<template>
    <div class ="label-canvas">
      <slot></slot>
      <canvas id="tcanvas" ref="canvas"></canvas>
      <div v-if="isShow" class="right">
          <div class="editorarea" :style="{border:'1px solid black',width:styleWidth+'px',height:styleHeight+'px'}">
            <div v-for="(item,index) in dispmsData" :key="index" v-show="item.status===1" :style="{position:'absolute', left:item.x+'px', top:item.y+'px'}">
              <div :style="{textAlign:'left',position: 'absolute',left: 0+'px',top: 0+'px',width:item.width+'px',height:item.height+'px',backgroundColor:item.backgroundColor==='0'?'black':item.backgroundColor==='1'?'rgba(0,0,0,0)':'red'}">
                <span v-if="item.columnType === '字符串'" :style="{ color:item.fontColor==='0'?'black':item.fontColor==='1'?'white':'red', verticalAlign:'top', fontSize :item.fontSize+'px', fontWeight:item.fontType, lineHeight:item.height+'px', fontFamily:item.fontFamily, fontStyle:item.fontType}">{{item.startText + item.text + item.endText}}</span>
                <span v-else-if="item.columnType === '数字'" :style="{lineHeight:item.height+'px'}">
                  <span :class="item.backup.split('/')[0]==='1' ? 'line' : '' " :style="{ color:item.fontColor==='0'?'black':item.fontColor==='1'?'white':'red', fontSize :item.fontSize+'px', fontWeight:item.fontType,  fontFamily:item.fontFamily, fontStyle:item.fontType}">{{item.text.split('.')[0] +'.'}}</span>
                  <span :class="item.backup.split('/')[0]==='1' ? 'line' : '' " :style="{ color:item.fontColor==='0'?'black':item.fontColor==='1'?'white':'red', verticalAlign:'top',fontSize :(item.sourceColumn==='promotePrice'?decFontSizePromotePrice:decFontSizePrice)+'px', fontWeight:item.fontType,  fontFamily:item.fontFamily, fontStyle:item.fontType}">{{ item.text.split('.')[1]}}</span>
                </span>
                <hr v-else-if="item.columnType === '线段'" class="hrline" :style="{height:item.backup+'px',background : '#000'}">
                <img v-else-if="item.columnType === '二维码'" id="tqrCodeImg" :style="{ width:item.width+'px', height:item.height+'px'}"/>
                <img v-else-if="item.columnType === '条形码'" id="tbarCodeImg" :style="{ width:item.width+'px', height:item.height+'px'}"/>
                <img v-else-if="item.columnType === '图片'" id="timg" :style="{ width:item.width+'px', height:item.height+'px'}"/>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
import qrcode from 'qrcode'
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
  data () {
    return {
      isShow: false,
      styleWidth: 0,
      styleHeight: 0,
      dispmsData: [],
      decFontSizePrice: 0,
      decFontSizePromotePrice: 0,
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
        labelStyle: '5'
      }
    }
  },
  updated () {
    var canvas = document.getElementById('tcanvas')
    if (this.item.itemBarCode !== '') {
      var barCodeEle = document.getElementById('tbarCodeImg')
      try {
        JsBarcode('#tcanvas', this.item.itemBarCode, {
          format: 'EAN13',
          fontSize: 0,
          margin: 0,
          textMargin: 0,
          width: 2
        })
        var barcodeimg = canvas.toDataURL('image/png')
        barCodeEle.setAttribute('src', barcodeimg)
      } catch (error) {
        console.error('barcode error ' + error)
      }
    }
    if (this.item.itemQRCode !== '') {
      var qrCodeEle = document.getElementById('tqrCodeImg')
      try {
        qrcode.toCanvas(canvas, this.item.itemQRCode, function (error) {
          if (error) console.error(error)
        })
        var qrcodeimg = canvas.toDataURL('image/png')
        qrCodeEle.setAttribute('src', qrcodeimg)
      } catch (error) {
        console.error('qrcode error ' + error)
      }
    }
  },
  mounted () {
  },
  methods: {
    initData (data, width, height, item) {
      if (data === null) {
        this.dispmsData = []
        this.styleWidth = 0
        this.styleHeight = 0
        return
      }
      this.isShow = true
      var len = data.length
      // 循环变量
      for (var i = 0; i < len; ++i) {
        data[i].fontColor = data[i].fontColor + ''
        data[i].backgroundColor = data[i].backgroundColor + ''
        if (data[i].sourceColumn === 'barCode') {
          this.item.itemBarCode = data[i].text
        } else if (data[i].sourceColumn === 'qrCode') {
          this.item.itemQRCode = data[i].text
        } else if (data[i].sourceColumn === 'price') {
          this.decFontSizePrice = parseInt(data[i].backup.split('/')[1])
        } else if (data[i].sourceColumn === 'promotePrice') {
          this.decFontSizePromotePrice = parseInt(data[i].backup.split('/')[1])
        }
        if (item !== null) {
          if (data[i].sourceColumn === 'barCode') {
            data[i].text = item['itemBarCode']
          } else if (data[i].sourceColumn === 'qrCode') {
            data[i].text = item['itemQRCode']
          } else if (data[i].sourceColumn === 'price') {
            data[i].text = item['itemPrice']
          } else if (data[i].sourceColumn === 'promotePrice') {
            data[i].text = item['itemOnSalePrice']
          } else if (data[i].sourceColumn === 'name') {
            data[i].text = item['itemName']
          } else if (data[i].sourceColumn === 'unit') {
            data[i].text = item['itemUnit']
          } else if (data[i].sourceColumn === 'spec') {
            data[i].text = item['itemNorm']
          } else if (data[i].sourceColumn === 'category') {
            data[i].text = item['itemCategory']
          } else if (data[i].sourceColumn === 'origin') {
            data[i].text = item['itemOrigin']
          } else if (data[i].sourceColumn === 'shelfNumber') {
            data[i].text = item['itemNo']
          } else if (data[i].sourceColumn === 'stock') {
            data[i].text = item['itemStock']
          } else if (data[i].sourceColumn === 'imageUrl') {
            data[i].text = item['itemImgUrl']
          } else if (data[i].sourceColumn === 'provider') {
            data[i].text = item['itemProvider']
          }
        }
      }
      console.log(data)
      this.dispmsData = data
      this.styleWidth = width // TODO
      this.styleHeight = height // TODO
    }
  }
}
</script>

<style>
#label{
  position: relative;
  margin: auto;
}
#tcanvas{
  display: none
}
.label-canvas{
  display: flex;
  position: relative;
  text-align: center;
}
.right{
    margin: 10px;
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
}
.editorarea{
    position: relative;
}
</style>
