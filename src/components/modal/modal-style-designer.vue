<template>
    <div class="container">
      <canvas id="canvas" ref="canvas"></canvas>
        <div class="left">
            <div class="infoarea">
              <Card dis-hover>
                <p slot="title">样式信息</p>
                <p :style="{fontSize: '16px'}">样式id：{{styleid}}</p>
                <p :style="{fontSize: '16px'}">样式宽度：{{styleWidth}}</p>
                <p :style="{fontSize: '16px'}">样式高度：{{styleHeight}}</p>
                <Button :style="{marginTop:'10px'}" type="primary" @click="reset">恢复默认值</Button>
                <Button :style="{margin:'10px'}" type="primary" @click="reset">另存为新样式</Button>
            </Card>
            </div>
        </div>
        <div class="right">
            <div class="editorarea" v-if="reRenderFlag" :style="{width:editAreaWidth+'px',height:editAreaHeight+'px'}">
              <Poptip v-for="(item,index) in currentDispmsData" :key="index" trigger="click" title="编辑框" class="poptipWarp" :style="{ position: 'absolute',left: item.x+'px',top: item.y+'px'}">
                  <vue-draggable-resizable :style="{ position: 'absolute',left: 0+'px',top: 0+'px'}" :x="item.x" :y="item.y" :w="item.width" :max-width="item.width" :h="item.height" class-name-active="draggerItem-active-class" class-name="draggerItem-class" @activated="onActivated(index)" @dragging="onDrag(arguments,index)" @resizing="onResize(arguments,index)" parent=".editorarea">
                      <span v-if="item.columnType === '字符串'" :style="{ color:item.fontColor===0?'black':item.fontColor===1?'white':'red', fontSize :item.fontSize+'px', fontWeight:item.fontType, lineHeight:item.height+'px', fontFamily:item.fontFamily, fontStyle:item.fontType}">{{item.startText + item.text + item.endText}}</span>
                      <span v-else-if="item.columnType === '数字'" >
                        <span :class="item.backup.split('/')[0]==='1' ? 'line' : '' " :style="{ color:item.fontColor===0?'black':item.fontColor===1?'white':'red', fontSize :item.fontSize+'px', fontWeight:item.fontType,  fontFamily:item.fontFamily, fontStyle:item.fontType}">{{item.text.split('.')[0] +'.'}}</span>
                        <span :class="item.backup.split('/')[0]==='1' ? 'line' : '' " :style="{ color:item.fontColor===0?'black':item.fontColor===1?'white':'red', verticalAlign:'super',fontSize :item.backup.split('/')[1]+'px', fontWeight:item.fontType,  fontFamily:item.fontFamily, fontStyle:item.fontType}">{{ item.text.split('.')[1]}}</span>
                      </span>
                      <hr v-else-if="item.columnType === '线段'"></hr>
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
                        <Select size="small" type="text" :style="{width:'76px',marginRight: '4px'}" v-model="item.fontType">
                          <Option value="normal">Normal</Option>
                          <Option value="bold">Bold</Option>
                          <Option value="italic">Italic</Option>
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
// TODO:字体颜色
import { getStyle, updateStyle } from '@/api/style'
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
      styleWidth: 0,
      styleHeight: 0,
      isLoading: false,
      reRenderFlag: true,
      editAreaWidth: 800,
      editAreaHeight: 600,
      styleData: {},
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
  updated () {
    var canvas = document.getElementById('canvas')
    if (this.item.itemBarCode !== '') {
      var barCodeEle = document.getElementById('barCodeImg')
      try {
        JsBarcode('#canvas', this.item.itemBarCode, {
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
      var qrCodeEle = document.getElementById('qrCodeImg')
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
  methods: {
    getStyleData (id, w, h) {
      this.styleid = id
      this.styleWidth = w
      this.styleHeight = h
      this.isLoading = true
      var that = this
      getStyle(id).then(res => {
        const data = res.data.data
        that.editAreaWidth = w
        that.editAreaHeight = h
        // 重新渲染editorarea
        this.reRenderFlag = false
        this.$nextTick(() => {
          this.reRenderFlag = true
        })
        var len = data.length // 循环变量
        for (var i = 0; i < len; ++i) {
          if (data[i].sourceColumn === 'barCode') {
            that.item.itemBarCode = data[i].text
          } else if (data[i].sourceColumn === 'qrCode') {
            that.item.itemQRCode = data[i].text
          } else {

          }
        }
        that.isLoading = false
        that.currentDispmsData = data
        that.dispmsData = coppyArray(data)
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
    },
    update (id) {
      updateStyle(id, this.currentDispmsData, 1, 1)
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
    align-items: center;
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
.infoarea{
    width: 200px;
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
.line{
  text-decoration:line-through;
}
</style>
