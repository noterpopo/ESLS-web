<template>
    <div class="container" :style="{flexDirection: 'column'}">
      <div class="container" :style="{flexDirection: 'row'}">
        <canvas id="canvas" ref="canvas"></canvas>
          <div class="left">
              <div class="infoarea">
                <Card dis-hover>
                  <div slot="title">
                    <Row type="flex" justify="center" align="middle">
                        <Col span="6"><p>样式信息</p></Col>
                        <Col span="18"><p>当前选择区域：{{translate[currentClickSourceColumn]}}</p></Col>
                    </Row>
                </div>
                  <p :style="{fontSize: '16px'}">样式：{{styleid}}</p>
                  <p :style="{fontSize: '16px'}">样式宽度：{{styleWidth}}</p>
                  <p :style="{fontSize: '16px'}">样式高度：{{styleHeight}}</p>
                  <div :style="{marginTop:'4px'}">
                    <p>
                      <Row v-for="(item,index) in currentDispmsData" v-if="index%2==0" :key="item.id">
                        <Col span="12">
                          <Checkbox style="margin:2px;" :value="item.status==1" @on-change="onCheckItem($event,item)"></Checkbox>
                          <span @click.stop="onAreaClick(index)">{{translate[item.sourceColumn]}}</span>
                        </Col>
                        <Col span="12" v-if="index+1<currentDispmsData.length">
                          <Checkbox style="margin:2px;" :value="currentDispmsData[index+1].status==1" @on-change="onCheckItem($event,currentDispmsData[index+1])"></Checkbox>
                          <span @click.stop="onAreaClick(index+1)">{{translate[currentDispmsData[index+1].sourceColumn]}}</span>
                        </Col>
                      </Row>
                    </p>
                  </div>
                  <Button :style="{margin:'10px'}" type="primary" @click="addArea">添加自定义字段</Button>
                  <Button  type="primary" @click="reset">恢复默认值</Button>
                  <Button v-if="mode!='new'" :style="{marginLeft:'10px',marginTop:'10px'}" type="primary" @click="saveAsNew">另存为新样式</Button>
              </Card>
              </div>
          </div>
          <div class="right">
              <div class="editorarea" v-if="reRenderFlag" :style="{ zIndex:'9999',border:'1px solid black', width:styleWidth+'px',height:styleHeight+'px'}">
                <Poptip v-for="(item,index) in currentDispmsData" :key="index" trigger="click" title="编辑框" class="poptipWarp" :style="{ position: 'absolute',left: item.x+'px',top: item.y+'px'}">
                    <vue-draggable-resizable :id="'poptip'+index" v-show="item.status===1" :style="{ backgroundColor:item.backgroundColor==='0'?'black':item.backgroundColor==='1'?'white':'red',position: 'relative',left: 0+'px',top: 0+'px'}" :x="item.x" :y="item.y" :w="item.width" :h="item.height" class-name-active="draggerItem-active-class" class-name="draggerItem-class" @activated="onActivated(index)" @dragging="onDrag(arguments,index)" @resizing="onResize(arguments,index)" parent=".editorarea">
                        <span v-if="item.columnType === '字符串'" :style="{ color:item.fontColor==='0'?'black':item.fontColor==='1'?'white':'red', verticalAlign:'top', fontSize :item.fontSize+'px', fontWeight:item.fontType, lineHeight:item.height+'px', fontFamily:item.fontFamily, fontStyle:item.fontType}">{{item.startText + item.text + item.endText}}</span>
                        <span v-else-if="item.columnType === '数字'" :style="{lineHeight:item.height+'px'}" >
                          <span :class="item.backup.split('/')[0]==='1' ? 'line' : '' " :style="{ color:item.fontColor==='0'?'black':item.fontColor==='1'?'white':'red', fontSize :item.fontSize+'px', fontWeight:item.fontType,  fontFamily:item.fontFamily, fontStyle:item.fontType}">{{item.text.split('.')[0] +'.'}}</span>
                          <span :class="item.backup.split('/')[0]==='1' ? 'line' : '' " :style="{ verticalAlign:'top',color:item.fontColor==='0'?'black':item.fontColor==='1'?'white':'red', fontSize :(item.sourceColumn==='promotePrice'?decFontSizePromotePrice:decFontSizePrice)+'px', fontWeight:item.fontType,  fontFamily:item.fontFamily, fontStyle:item.fontType}">{{ item.text.split('.')[1]}}</span>
                        </span>
                        <hr :style="{height:item.backup+'px',background : '#000'}" v-else-if="item.columnType === '线段'&&item.width>item.height">
                        <hr :style="{width:item.backup+'px',background : '#000'}" v-else-if="item.columnType === '线段'&&item.width<item.height">
                        <img v-else-if="item.columnType === '二维码'" id="qrCodeImg" :style="{ width:item.width+'px', height:item.height+'px'}"/>
                        <img v-else-if="item.columnType === '条形码'" id="barCodeImg" :style="{ width:item.width+'px', height:item.height+'px'}"/>
                        <img v-else-if="item.columnType === '图片'" id="img" :style="{ width:item.width+'px', height:item.height+'px'}"/>
                    </vue-draggable-resizable>
                    <div slot="content">
                      <div v-if="item.columnType === '二维码'||item.columnType === '条形码'||item.columnType === '图片'" class="float-edit-img">
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">x:</span>
                          <InputNumber @on-change="onNumChange(val)" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.x"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">y:</span>
                          <InputNumber @on-change="onNumChange" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.y"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">宽:</span>
                          <InputNumber @on-change="onNumChange" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.width"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">高:</span>
                          <InputNumber @on-change="onNumChange" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.height"/>
                        </div>
                      </div>
                      <div v-else-if="item.columnType === '线段'" class="float-edit-line">
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">x:</span>
                          <InputNumber @on-change="onNumChange($event,val)" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.x"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">y:</span>
                          <InputNumber @on-change="onNumChange" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.y"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">宽:</span>
                          <InputNumber @on-change="onNumChange" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.width"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">高:</span>
                          <InputNumber @on-change="onNumChange" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.height"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">线高:</span>
                          <InputNumber :min="0" :max="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.backup"/>
                        </div>
                      </div>
                      <div v-else class="float-edit-text">
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">x:</span>
                          <InputNumber @on-change="onNumChange" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.x"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">y:</span>
                          <InputNumber @on-change="onNumChange" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.y"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">宽:</span>
                          <InputNumber @on-change="onNumChange" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.width"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">高:</span>
                          <InputNumber @on-change="onNumChange" :min="0" :step="8" size="small" type="text" :style="{width:'40px',marginRight: '4px'}" v-model="item.height"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">字号:</span>
                          <InputNumber :min="0"  size="small" :style="{width:'76px',marginRight: '4px'}" v-model="item.fontSize"/>
                        </div>
                        <div v-if="item.sourceColumn==='price'">
                          <span :style="{fontSize:'16px', marginRight: '4px'}">小数字号:</span>
                          <InputNumber :min="0" size="small" :style="{width:'76px',marginRight: '4px'}" v-model="decFontSizePrice"/>
                        </div>
                        <div v-if="item.sourceColumn==='promotePrice'">
                          <span :style="{fontSize:'16px', marginRight: '4px'}">小数字号:</span>
                          <InputNumber :min="0" size="small" :style="{width:'76px',marginRight: '4px'}" v-model="decFontSizePromotePrice"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">字体:</span>
                          <Select size="small" :style="{width:'230px',marginRight: '4px'}" v-model="item.fontFamily">
                            <Option value="微软雅黑">微软雅黑</Option>
                            <Option value="宋体">宋体</Option>
                            <Option value="楷体">楷体</Option>
                            <Option value="aurakaSong">点阵宋</Option>
                          </Select>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">字体色:</span>
                          <Select size="small" :style="{width:'76px',marginRight: '4px'}" v-model="item.fontColor">
                            <Option value="0">黑色</Option>
                            <Option value="1">白色</Option>
                            <Option value="2">红色</Option>
                          </Select>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">背景色:</span>
                          <Select size="small" :style="{width:'76px',marginRight: '4px'}" v-model="item.backgroundColor">
                            <Option value="0">黑色</Option>
                            <Option value="1">白色</Option>
                            <Option value="2">红色</Option>
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
                          <span :style="{fontSize:'16px', marginRight: '4px'}">前缀:</span>
                          <Input size="small" type="text" :style="{width:'76px',marginRight: '4px'}" v-model="item.startText"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">文本:</span>
                          <Input size="small" type="text" :style="{width:'76px',marginRight: '4px'}" v-model="item.text"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">后缀:</span>
                          <Input size="small" type="text" :style="{width:'76px',marginRight: '4px'}" v-model="item.endText"/>
                        </div>
                        <div v-if="item.sourceColumn=='custom'||item.sourceColumn=='0'">
                          <Button @click="onDeleteCustom(index)">删除</Button>
                        </div>
                      </div>
                    </div>
                </Poptip>
                  <Spin size="large" fix v-if="isLoading"></Spin>
              </div>
          </div>
      </div>
    </div>
</template>
<script>
// https://github.com/mauricius/vue-draggable-resizable
import { getStyle, getStyleDisp, updateStyle, newStyle, deleteDispm } from '@/api/style'
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
      currentClickSourceColumn: '',
      styleid: 0,
      styleWidth: 0,
      styleHeight: 0,
      styleType: '',
      isLoading: false,
      reRenderFlag: true,
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
      },
      decFontSizePrice: 0,
      decFontSizePromotePrice: 0,
      newStyleSize: '',
      newStyleType: '',
      newStyleName: '',
      mode: '',
      newdata: [
        {
          id: 11,
          name: '商品名称',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'name',
          columnType: '字符串',
          backgroundColor: '1',
          text: '名字',
          startText: '',
          endText: '',
          fontType: 'normal',
          fontFamily: '楷体',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: '0'
        },
        {
          id: 11,
          name: '线段',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'line',
          columnType: '线段',
          backgroundColor: '1',
          text: '',
          startText: '',
          endText: '',
          fontType: '',
          fontFamily: '',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: null
        },
        {
          id: 11,
          name: '数字左侧(price)',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'price',
          columnType: '数字',
          backgroundColor: '1',
          text: '999.99',
          startText: '',
          endText: '',
          fontType: 'normal',
          fontFamily: '微软雅黑',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: '1/20/45'
        },
        {
          id: 11,
          name: '数字左侧(promotePrice)',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'promotePrice',
          columnType: '数字',
          backgroundColor: '1',
          text: '111.23',
          startText: '',
          endText: '',
          fontType: 'bold',
          fontFamily: '微软雅黑',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: '0/123/60'
        },
        {
          id: 11,
          name: '字符串',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'spec',
          columnType: '字符串',
          backgroundColor: '1',
          text: '250g',
          startText: '规格：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: null
        },
        {
          id: 11,
          name: '字符串',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'unit',
          columnType: '字符串',
          backgroundColor: '1',
          text: '个',
          startText: '单位：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: null

        },
        {
          id: 11,
          name: '字符串',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'category',
          columnType: '字符串',
          backgroundColor: '1',
          text: '生活用品',
          startText: '类别：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: null

        },
        {
          id: 11,
          name: '字符串',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'origin',
          columnType: '字符串',
          backgroundColor: '1',
          text: '深圳',
          startText: '产地：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: null

        },
        {
          id: 11,
          name: '字符串',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'stock',
          columnType: '字符串',
          backgroundColor: '1',
          text: '30',
          startText: '库存：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: null

        },
        {
          id: 11,
          name: '二维码',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'qrCode',
          columnType: '二维码',
          backgroundColor: '1',
          text: '默认二维码',
          startText: '',
          endText: '',
          fontType: '',
          fontFamily: '',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: null

        },
        {
          id: 11,
          name: '条形码',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'barCode',
          columnType: '条形码',
          backgroundColor: '1',
          text: '6921489003907',
          startText: '',
          endText: '',
          fontType: '',
          fontFamily: '',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: null

        },
        {
          id: 11,
          name: '字符串',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'shelfNumber',
          columnType: '字符串',
          backgroundColor: '1',
          text: '10010',
          startText: '货号：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: null

        },
        {
          id: 11,
          name: '字符串',
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          sourceColumn: 'provider',
          columnType: '字符串',
          backgroundColor: '1',
          text: '华润万家',
          startText: '供应商：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '0',
          fontSize: 14,
          status: 0,
          imageUrl: '',
          backup: null

        }
      ],
      indeterminate: true,
      checkAll: false,
      newArea: {
        id: 0,
        name: '字符串',
        x: 0,
        y: 0,
        width: 8,
        height: 8,
        sourceColumn: '0',
        columnType: '字符串',
        backgroundColor: '1',
        text: '自定义',
        startText: '',
        endText: '',
        fontType: 'normal',
        fontFamily: '宋体',
        fontColor: '0',
        fontSize: 14,
        status: 1,
        imageUrl: '',
        backup: null
      },
      translate: {
        promotePrice: '价格',
        name: '名称',
        qrCode: '二维码',
        0: '自定义字段',
        price: '原价',
        imageUrl: '图片',
        barCode: '条形码',
        unit: '单位',
        spec: '规格',
        category: '类别',
        origin: '产地',
        shelfNumber: '货号',
        stock: '库存',
        custom: '自定义字段',
        provider: '供应商',
        line: '线段'
      },
      sortRule: [
        'name',
        'line',
        'price',
        'promotePrice',
        'shelfNumber',
        'stock',
        'origin',
        'category',
        'unit',
        'spec',
        'barCode',
        'qrCode'
      ]
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
    onAreaClick (index) {
      let poptipElement = document.getElementById('poptip' + index)
      poptipElement.click()
    },
    onDeleteCustom (index) {
      this.currentDispmsData.splice(index, 1)
    },
    addArea () {
      let newtemp = Object.assign({}, this.newArea)
      this.currentDispmsData.push(newtemp)
    },
    onNumChange (val, e) {
      console.log(e)
      console.log(val)
    },
    getStyleData (sN, isPromote, type, w, h, mode) {
      this.mode = mode
      this.dispmsData = []
      this.currentDispmsData = []
      this.styleid = sN
      this.styleWidth = w
      this.styleHeight = h
      this.styleType = type
      if (mode === 'new') {
        this.reRenderFlag = false
        this.$nextTick(() => {
          this.reRenderFlag = true
        })
        this.currentDispmsData = coppyArray(this.newdata)
      } else {
        this.isLoading = true
        var that = this
        getStyle(sN, isPromote).then(res => {
          getStyleDisp(res.data.data.id).then(res => {
            const data = that.sortDispm(res.data.data)
            // 重新渲染editorarea
            this.reRenderFlag = false
            this.$nextTick(() => {
              this.reRenderFlag = true
            })
            var len = data.length // 循环变量
            for (var i = 0; i < len; ++i) {
              if (data[i].text === null) {
                data[i].text = ''
              }
              if (data[i].startText === null) {
                data[i].startText = ''
              }
              if (data[i].endText === null) {
                data[i].endText = ''
              }
              data[i].fontColor = data[i].fontColor + ''
              data[i].backgroundColor = data[i].backgroundColor + ''
              if (data[i].sourceColumn === 'barCode') {
                that.item.itemBarCode = data[i].text
              } else if (data[i].sourceColumn === 'qrCode') {
                that.item.itemQRCode = data[i].text
              } else if (data[i].sourceColumn === 'price') {
                this.decFontSizePrice = parseInt(data[i].backup.split('/')[1])
              } else if (data[i].sourceColumn === 'promotePrice') {
                this.decFontSizePromotePrice = parseInt(data[i].backup.split('/')[1])
              }
            }
            that.isLoading = false
            that.currentDispmsData = data
            that.dispmsData = coppyArray(data)
          })
        })
      }
    },
    onActivated (index) {
      this.currentClickSourceColumn = this.currentDispmsData[index].sourceColumn
    },
    onDrag ([x, y], index) {
      x = x - x % 8
      y = y - y % 8
      this.$set(this.currentDispmsData[index], 'x', x)
      this.$set(this.currentDispmsData[index], 'y', y)
    },
    onResize ([x, y, width, height], index) {
      x = x - x % 8
      y = y - y % 8
      width = width - width % 8
      height = height - height % 8
      this.$set(this.currentDispmsData[index], 'x', x)
      this.$set(this.currentDispmsData[index], 'y', y)
      this.$set(this.currentDispmsData[index], 'width', width)
      this.$set(this.currentDispmsData[index], 'height', height)
    },
    reset () {
      if (this.mode === 'new') {
        this.currentDispmsData = coppyArray(newdata)
      } else {
        this.currentDispmsData = coppyArray(this.dispmsData)
      }
    },
    update (id) {
      let index = 1
      for (let i = 0; i < this.currentDispmsData.length; ++i) {
        delete this.currentDispmsData[i].regionId
        if (this.currentDispmsData[i].status === 1) {
          this.$set(this.currentDispmsData[i], 'regionId', index++)
        } else {
          this.$set(this.currentDispmsData[i], 'regionId', 0)
        }
        if (this.currentDispmsData[i].sourceColumn === 'promotePrice') {
          let backUp = this.currentDispmsData[i].backup.split('/')
          backUp[1] = this.decFontSizePromotePrice
          this.currentDispmsData[i].backup = backUp[0] + '/' + backUp[1] + '/' + backUp[2]
        } else if (this.currentDispmsData[i].sourceColumn === 'price') {
          let backUp = this.currentDispmsData[i].backup.split('/')
          backUp[1] = this.decFontSizePrice
          this.currentDispmsData[i].backup = backUp[0] + '/' + backUp[1] + '/' + backUp[2]
        }
      }
      if (this.mode !== 'new') {
        this.$Modal.confirm({
          title: '提醒',
          content: '是否需要更新到价签',
          onOk: () => {
            let newData = this.currentDispmsData.filter((item) => {
              if (item.id === 0) {
                delete item.id
                return true
              }
              return false
            })
            let oldData = this.currentDispmsData.filter((item) => {
              return item.id !== 0
            })
            if (this.currentDispmsData.length < this.dispmsData.length) {
              console.log('hhh')
              let delData = this.dispmsData.filter((item) => {
                for (let j = 0; j < this.currentDispmsData.length; ++j) {
                  if (item.id === this.currentDispmsData[j].id) {
                    return false
                  }
                }
                return true
              })
              console.log(delData)
              for (let i = 0; i < delData.length; ++i) {
                deleteDispm(delData[i].id)
              }
            }
            updateStyle(id, oldData, 1, 1)
            updateStyle(id, newData, 0, 1)
          },
          onCancel: () => {
            let newData = this.currentDispmsData.filter((item) => {
              if (item.id === 0) {
                delete item.id
                return true
              }
              return false
            })
            let oldData = this.currentDispmsData.filter((item) => {
              return item.id !== 0
            })
            if (this.currentDispmsData.length < this.dispmsData.length) {
              console.log('hhh')
              let delData = this.dispmsData.filter((item) => {
                for (let j = 0; j < this.currentDispmsData.length; ++j) {
                  if (item.id === this.currentDispmsData[j].id) {
                    return false
                  }
                }
                return true
              })
              console.log(delData)
              for (let i = 0; i < delData.length; ++i) {
                deleteDispm(delData[i].id)
              }
            }
            updateStyle(id, oldData, 1, 0)
            updateStyle(id, newData, 0, 0)
          }
        })
      } else {
        let index = 1
        for (let i = 0; i < this.currentDispmsData.length; ++i) {
          if (this.currentDispmsData[i].status === 1) {
            this.$set(this.currentDispmsData[i], 'regionId', index++)
          } else {
            this.$set(this.currentDispmsData[i], 'regionId', 0)
          }
          delete this.currentDispmsData[i].id
        }
        var that = this
        let styledes = this.styleType
        console.log('usdhgu')
        newStyle(styledes).then(res => {
          let newId = res.data.data[0].id
          let newPromoteId = res.data.data[1].id
          updateStyle(newId, that.currentDispmsData, 0, 0).then(res => {
            updateStyle(newPromoteId, that.currentDispmsData, 0, 0).then(r => {
              that.$emit('reloadTable')
              that.$Message.info('新建样式成功')
            })
          })
        })
      }
    },
    saveAsNew () {
      this.$emit('onSava')
      let index = 1
      for (let i = 0; i < this.currentDispmsData.length; ++i) {
        delete this.currentDispmsData[i].regionId
        if (this.currentDispmsData[i].status === 1) {
          this.$set(this.currentDispmsData[i], 'regionId', index++)
        } else {
          this.$set(this.currentDispmsData[i], 'regionId', 0)
        }
        delete this.currentDispmsData[i].id
      }
      this.$Modal.confirm({
        title: '新样式信息',
        render: (h, params) => {
          var that = this
          return h('span', [
            h('p', '样式名字:'),
            h('Input', {
              props: {
                placeholder: '输入名字',
                value: this.newStyleName
              },
              on: {
                'on-change': (event) => {
                  that.newStyleName = event.target.value
                }
              }
            })
          ])
        },
        onOk: () => {
          var that = this
          let styledes = this.styleType + '-' + this.newStyleName
          newStyle(styledes).then(res => {
            let newId = res.data.data[0].id
            let newPromoteId = res.data.data[1].id
            updateStyle(newId, that.currentDispmsData, 0, 0).then(res => {
              updateStyle(newPromoteId, that.currentDispmsData, 0, 0).then(r => {
                that.$emit('reloadTable')
                that.$Message.info('另存为样式成功')
              })
            })
          })
        }
      })
    },
    onCheckItem (status, item) {
      if (status) {
        item.status = 1
      } else {
        item.status = 0
      }
    },
    sortDispm (disp) {
      var sorted = []
      for (let i = 0; i < disp.length; ++i) {
        for (let j = 0; j < disp.length; ++j) {
          if (i < this.sortRule.length) {
            if (disp[j].sourceColumn === this.sortRule[i]) {
              sorted.push(disp[j])
            }
          } else {

          }
        }
      }
      console.log(sorted)
      for (let k = 0; k < disp.length; ++k) {
        if (disp[k].sourceColumn === '0') {
          sorted.push(disp[k])
        }
      }
      console.log(sorted)
      return sorted
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
.switch-area{
  margin-top: 10px;
  width: 100%
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
    width: 300px;
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
  height: 190px;
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
.float-edit-line{
  width: 350px;
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
