<template>
    <div class="container">
      <canvas id="canvas" ref="canvas"></canvas>
        <div class="left">
            <div class="inputarea">
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
                <Button type="primary" @click="reset">恢复默认值</Button>
            </div>
        </div>
        <div class="right">
            <div class="editorarea" v-if="reRenderFlag" :style="{width:editAreaWidth+'px',height:editAreaHeight+'px'}">
              <Poptip v-for="(item,index) in currentDispmsData" :key="index" trigger="click" title="编辑框" class="poptipWarp" :style="{ position: 'absolute',left: item.x+'px',top: item.y+'px'}">
                  <vue-draggable-resizable :style="{ position: 'absolute',left: 0+'px',top: 0+'px'}" :x="item.x" :y="item.y" :w="item.width" :h="item.height" class-name-active="draggerItem-active-class" class-name="draggerItem-class" @activated="onActivated(index)" @dragging="onDrag(arguments,index)" @resizing="onResize(arguments,index)" parent=".editorarea">
                      <span v-if="item.columnType === '字符串'" :style="{ fontSize :item.fontSize+'px', lineHeight:item.height+'px', fontFamily:item.fontFamily, fontStyle:item.fontStyle}">{{item.startText + item.text + item.endText}}</span>
                      <span v-else-if="item.columnType === '数字左侧'" :style="{ fontSize :item.fontSize+'px', lineHeight:item.height+'px', fontFamily:item.fontFamily, fontStyle:item.fontStyle}">{{item.startText + item.text + item.endText}}.</span>
                      <span v-else-if="item.columnType === '数字右侧'" :style="{ fontSize : item.fontSize+'px', lineHeight:item.height+'px', fontFamily:item.fontFamily, fontStyle:item.fontStyle}">{{item.startText + item.text + item.endText}}</span>
                      <Divider v-else-if="item.columnType === '线段'"></Divider>
                      <img v-else-if="item.columnType === '二维码'" id="qrCodeImg" :style="{ width:item.width+'px', height:item.height+'px'}"/>
                      <img v-else-if="item.columnType === '条形码'" id="barCodeImg" :style="{ width:item.width+'px', height:item.height+'px'}"/>
                      <img v-else-if="item.columnType === '图片'" id="img" :style="{ width:item.width+'px', height:item.height+'px'}"/>
                  </vue-draggable-resizable>
                  <div slot="content">
                    <div v-if="item.columnType === '二维码'||item.columnType === '条形码'||item.columnType === '图片'||item.columnType === '线段'" class="float-edit-img">
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">x:</span>
                        <InputNumber size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.x"/>
                      </div>
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">y:</span>
                        <InputNumber size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.y"/>
                      </div>
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">宽:</span>
                        <InputNumber size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.width"/>
                      </div>
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">高:</span>
                        <InputNumber size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.height"/>
                      </div>
                    </div>
                    <div v-else class="float-edit-text">
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">x:</span>
                        <InputNumber size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.x"/>
                      </div>
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">y:</span>
                        <InputNumber size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.y"/>
                      </div>
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">宽:</span>
                        <InputNumber size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.width"/>
                      </div>
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">高:</span>
                        <InputNumber size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.height"/>
                      </div>
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">字号:</span>
                        <InputNumber size="small" :style="{width:'76px',marginRight: '4px'}" v-model="item.fontSize"/>
                      </div>
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">字体:</span>
                        <Select size="small" :style="{width:'76px',marginRight: '4px'}" v-model="item.fontFamily">
                          <Option value="微软雅黑">微软雅黑</Option>
                          <Option value="宋体">宋体</Option>
                        </Select>
                      </div>
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">字体样式:</span>
                        <Select size="small" type="text" :style="{width:'76px',marginRight: '4px'}" v-model="item.fontStyle">
                          <Option value="normal">Normal</Option>
                          <Option value="bold">Bold</Option>
                          <Option value="oblique">Oblique</Option>
                        </Select>
                      </div>
                      <div>
                        <span :style="{fontSize:'16px', marginRight: '4px'}">文本:</span>
                        <Input size="small" type="text" :style="{width:'76px',marginRight: '4px'}" v-model="item.text"/>
                      </div>
                    </div>
                  </div>
              </Poptip>
                <Spin size="large" fix v-if="isLoading"></Spin>
            </div>
        </div>
    </div>
</template>
<script>
// https://github.com/mauricius/vue-draggable-resizable
import { getDispms, getStyle } from '@/api/style'
import { coppyArray } from '@/libs/util'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import JsBarcode from 'jsbarcode'
import qrcode from 'qrcode'
export default {
  name: 'modal_style_designer',
  components: {
    'vue-draggable-resizable': VueDraggableResizable
  },
  data () {
    return {
      styleid: 0,
      isLoading: false,
      reRenderFlag: true,
      editAreaWidth: 800,
      editAreaHeight: 600,
      dispmsData: [],
      currentDispmsData: [],
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
  watch: {
    // 必须watch才能正确获取element
    currentDispmsData: function () {
      this.$nextTick(function () {
        var qrCodeEle = document.getElementById('qrCodeImg')
        var barCodeEle = document.getElementById('barCodeImg')
        console.log('hhh ')
        var canvas = document.getElementById('canvas')
        qrcode.toCanvas(canvas, this.item.itemQRCode, function (error) {
          if (error) console.error(error)
        })
        var qrcodeimg = canvas.toDataURL('image/png')
        qrCodeEle.setAttribute('src', qrcodeimg)

        JsBarcode('#canvas', this.item.itemBarCode, {
          format: 'EAN13',
          fontSize: 0,
          margin: 0,
          textMargin: 0,
          width: 2
        })
        var barcodeimg = canvas.toDataURL('image/png')
        barCodeEle.setAttribute('src', barcodeimg)
      })
    }
  },
  methods: {
    getStyleData (id) {
      // 重新渲染editorarea
      this.reRenderFlag = false
      this.$nextTick(() => {
        this.reRenderFlag = true
      })
      this.styleid = id
      this.isLoading = true
      var that = this
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
            dispData.x = dispData.x * 2
            dispData.y = dispData.y * 2
            dispData.width = dispData.width * 2
            dispData.height = dispData.height * 2
            dispData.fontSize = dispData.fontSize * 1.414
            if (dispData.sourceColumn === 'price') {
              priceLeft = dispData.text + '.'
            } else if (dispData.sourceColumn === 'price_right') {
              priceRight = dispData.text
            } else if (dispData.sourceColumn === 'promotePriceLeft') {
              onSalePriceLeft = dispData.text + '.'
            } else if (dispData.sourceColumn === 'promotePriceRight') {
              onSalePriceRight = dispData.text
            } else if (dispData.sourceColumn === 'barCode') {
              that.item.itemBarCode = dispData.text
            } else if (dispData.sourceColumn === 'qrCode') {
              that.item.itemQRCode = dispData.text
            } else {

            }
            dispmsData.push(dispData)
            if (!(flag--)) {
              var offset = 0
              that.item.itemPrice = priceLeft + priceRight
              that.item.itemOnSalePrice = onSalePriceLeft + onSalePriceRight
              for (var i = 0; i < dispmsData.length; ++i) {
                if (dispmsData[i].sourceColumn === 'price_right') {
                  offset = dispmsData[i].backUp.split('/')[1]
                  dispmsData[i].x = dispmsData[i].x + that.item.itemPrice.split('.')[0].length * offset * 2
                }
              }
              for (var j = 0; j < dispmsData.length; ++j) {
                if (dispmsData[j].sourceColumn === 'promotePriceRight') {
                  offset = dispmsData[j].backUp.split('/')[1]
                  dispmsData[j].x = dispmsData[j].x + that.item.itemOnSalePrice.split('.')[0].length * offset * 2
                }
              }
              that.isLoading = false
              that.currentDispmsData = dispmsData
              that.dispmsData = coppyArray(dispmsData)
              console.info(that.currentDispmsData)
            }
          })
        }
      })
    },
    onActivated (index) {
    },
    onDrag ([x, y], index) {
      this.$set(this.currentDispmsData[index], 'x', x)
      this.$set(this.currentDispmsData[index], 'y', y)
    },
    onResize ([x, y, width, height], index) {
      this.$set(this.currentDispmsData[index], 'x', x)
      this.$set(this.currentDispmsData[index], 'y', y)
      this.$set(this.currentDispmsData[index], 'width', width)
      this.$set(this.currentDispmsData[index], 'height', height)
    },
    reset () {
      this.currentDispmsData = coppyArray(this.dispmsData)
    }

  }
}
</script>
<style>
#canvas{
  display: none
}
Input{
  margin: 10px；
}
.container{
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    align-content: center;
}
.left{
    margin: 10px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
}
.inputarea{
    width: 400px;
    height: auto;
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
.poptipWarp{
}
.draggerItem-class{
  position: absolute;
}
.draggerItem-active-class{
  position: absolute;
  border: 1px dashed black;
}
.float-edit-text{
  width: 280px;
  height: 82px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
  align-content: center;
}
.float-edit-img{
  width: 280px;
  height: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
  align-content: center;
}
</style>
