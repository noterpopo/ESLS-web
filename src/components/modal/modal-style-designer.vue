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
                        <Col span="18"><p>当前选择区域：{{currentClickSourceColumn}}</p></Col>
                    </Row>
                </div>
                  <p :style="{fontSize: '16px'}">样式id：{{styleid}}</p>
                  <p :style="{fontSize: '16px'}">样式宽度：{{styleWidth}}</p>
                  <p :style="{fontSize: '16px'}">样式高度：{{styleHeight}}</p>
                  <div :style="{display:'flex',flexWrap: 'wrap',marginTop:'4px'}">
                    <Checkbox style="margin:2px;" v-for="(item) in currentDispmsData" :key="item.id" :value="item.status==1" @on-change="onCheckItem($event,item)">{{item.sourceColumn}}</Checkbox>
                  </div>
                  <Button :style="{marginTop:'10px'}" type="primary" @click="reset">恢复默认值</Button>
                  <Button v-if="mode!='new'" :style="{marginLeft:'10px',marginTop:'10px'}" type="primary" @click="saveAsNew">另存为新样式</Button>
              </Card>
              </div>
          </div>
          <div class="right">
              <div class="editorarea" v-if="reRenderFlag" :style="{width:styleWidth+'px',height:styleHeight+'px'}">
                <Poptip v-for="(item,index) in currentDispmsData" :key="index" trigger="click" title="编辑框" class="poptipWarp" :style="{ position: 'absolute',left: item.x+'px',top: item.y+'px'}">
                    <vue-draggable-resizable v-show="item.status===1" :style="{ backgroundColor:item.backgroundColor==='0'?'black':item.backgroundColor==='1'?'white':'red',position: 'absolute',left: 0+'px',top: 0+'px'}" :x="item.x" :y="item.y" :w="item.width" :h="item.height" class-name-active="draggerItem-active-class" class-name="draggerItem-class" @activated="onActivated(index)" @dragging="onDrag(arguments,index)" @resizing="onResize(arguments,index)" parent=".editorarea">
                        <span v-if="item.columnType === '字符串'" :style="{ color:item.fontColor==='0'?'black':item.fontColor==='1'?'white':'red', fontSize :item.fontSize+'px', fontWeight:item.fontType, lineHeight:item.height+'px', fontFamily:item.fontFamily, fontStyle:item.fontType}">{{item.startText + item.text + item.endText}}</span>
                        <span v-else-if="item.columnType === '数字'" >
                          <span :class="item.backup.split('/')[0]==='1' ? 'line' : '' " :style="{ color:item.fontColor==='0'?'black':item.fontColor==='1'?'white':'red', fontSize :item.fontSize+'px', fontWeight:item.fontType,  fontFamily:item.fontFamily, fontStyle:item.fontType}">{{item.text.split('.')[0] +'.'}}</span>
                          <span :class="item.backup.split('/')[0]==='1' ? 'line' : '' " :style="{ color:item.fontColor==='0'?'black':item.fontColor==='1'?'white':'red', verticalAlign:'super',fontSize :(item.sourceColumn==='promotePrice'?decFontSizePromotePrice:decFontSizePrice)+'px', fontWeight:item.fontType,  fontFamily:item.fontFamily, fontStyle:item.fontType}">{{ item.text.split('.')[1]}}</span>
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
                        <div v-if="item.sourceColumn==='price'">
                          <span :style="{fontSize:'16px', marginRight: '4px'}">小数字号:</span>
                          <InputNumber size="small" :style="{width:'76px',marginRight: '4px'}" v-model="decFontSizePrice"/>
                        </div>
                        <div v-if="item.sourceColumn==='promotePrice'">
                          <span :style="{fontSize:'16px', marginRight: '4px'}">小数字号:</span>
                          <InputNumber size="small" :style="{width:'76px',marginRight: '4px'}" v-model="decFontSizePromotePrice"/>
                        </div>
                        <div>
                          <span :style="{fontSize:'16px', marginRight: '4px'}">字体:</span>
                          <Select size="small" :style="{width:'230px',marginRight: '4px'}" v-model="item.fontFamily">
                            <Option value="微软雅黑">微软雅黑</Option>
                            <Option value="宋体">宋体</Option>
                            <Option value="楷体">楷体</Option>
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
    </div>
</template>
<script>
// https://github.com/mauricius/vue-draggable-resizable
import { getStyle, updateStyle, newStyle } from '@/api/style'
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
          width: 219,
          height: 38,
          sourceColumn: 'name',
          columnType: '字符串',
          backgroundColor: '1',
          text: '默认名字',
          startText: '',
          endText: '',
          fontType: 'normal',
          fontFamily: '楷体',
          fontColor: '1',
          fontSize: 33,
          status: 1,
          imageUrl: '',
          backup: '0',
          regionId: '1'
        },
        {
          id: 12,
          name: '线段',
          x: 2,
          y: 45,
          width: 400,
          height: 2,
          sourceColumn: '0',
          columnType: '线段',
          backgroundColor: '1',
          text: '',
          startText: '',
          endText: '',
          fontType: '',
          fontFamily: '',
          fontColor: '0',
          fontSize: 0,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: null,
          regionId: '2'
        },
        {
          id: 13,
          name: '字符串',
          x: 6,
          y: 62,
          width: 79,
          height: 28,
          sourceColumn: '0',
          columnType: '字符串',
          backgroundColor: '2',
          text: '原价：￥',
          startText: '',
          endText: '',
          fontType: 'normal',
          fontFamily: '微软雅黑',
          fontColor: '0',
          fontSize: 20,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: null,
          regionId: '3'
        },
        {
          id: 14,
          name: '数字左侧(price)',
          x: 115,
          y: 60,
          width: 285,
          height: 33,
          sourceColumn: 'price',
          columnType: '数字',
          backgroundColor: '2',
          text: '999.99',
          startText: '',
          endText: '',
          fontType: 'normal',
          fontFamily: '微软雅黑',
          fontColor: '2',
          fontSize: 24,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: '1/20/45',
          regionId: '4'
        },
        {
          id: 16,
          name: '字符串',
          x: 6,
          y: 130,
          width: 79,
          height: 28,
          sourceColumn: '0',
          columnType: '字符串',
          backgroundColor: '2',
          text: '现价：￥',
          startText: '',
          endText: '',
          fontType: 'normal',
          fontFamily: '微软雅黑',
          fontColor: '0',
          fontSize: 20,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: null,
          regionId: '5'
        },
        {
          id: 17,
          name: '数字左侧(promotePrice)',
          x: 118,
          y: 98,
          width: 282,
          height: 88,
          sourceColumn: 'promotePrice',
          columnType: '数字',
          backgroundColor: '2',
          text: '111.23',
          startText: '',
          endText: '',
          fontType: 'bold',
          fontFamily: '微软雅黑',
          fontColor: '2',
          fontSize: 66,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: '0/60/123',
          regionId: '6'
        },
        {
          id: 19,
          name: '字符串',
          x: 6,
          y: 190,
          width: 99,
          height: 20,
          sourceColumn: 'spec',
          columnType: '字符串',
          backgroundColor: '2',
          text: '盒',
          startText: '规格：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '2',
          fontSize: 17,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: null,
          regionId: '7'
        },
        {
          id: 20,
          name: '字符串',
          x: 133,
          y: 190,
          width: 71,
          height: 20,
          sourceColumn: 'unit',
          columnType: '字符串',
          backgroundColor: '2',
          text: '个',
          startText: '单位：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '2',
          fontSize: 17,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: null,
          regionId: '8'
        },
        {
          id: 22,
          name: '字符串',
          x: 133,
          y: 221,
          width: 138,
          height: 20,
          sourceColumn: 'category',
          columnType: '字符串',
          backgroundColor: '2',
          text: '生活用品',
          startText: '类别：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '2',
          fontSize: 17,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: null,
          regionId: '9'
        },
        {
          id: 23,
          name: '二维码',
          x: 280,
          y: 170,
          width: 104,
          height: 100,
          sourceColumn: 'qrCode',
          columnType: '二维码',
          backgroundColor: '2',
          text: '强力粘钩',
          startText: '',
          endText: '',
          fontType: '',
          fontFamily: '',
          fontColor: '2',
          fontSize: 0,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: null,
          regionId: '10'
        },
        {
          id: 24,
          name: '条形码',
          x: 41,
          y: 260,
          width: 201,
          height: 30,
          sourceColumn: 'barCode',
          columnType: '条形码',
          backgroundColor: '2',
          text: '6921489003907',
          startText: '',
          endText: '',
          fontType: '',
          fontFamily: '',
          fontColor: '0',
          fontSize: 0,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: null,
          regionId: '11'
        },
        {
          id: 102,
          name: '字符串',
          x: 7,
          y: 221,
          width: 111,
          height: 20,
          sourceColumn: 'shelfNumber',
          columnType: '字符串',
          backgroundColor: '2',
          text: '10g',
          startText: '货号：',
          endText: '',
          fontType: 'normal',
          fontFamily: '宋体',
          fontColor: '2',
          fontSize: 17,
          status: 1,
          imageUrl: 'https://mybucket1-1257353650.cos.ap-guangzhou.myqcloud.com/dismps_image/dispm_0.bmp',
          backup: null,
          regionId: '12'
        }
      ],
      indeterminate: true,
      checkAll: false
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
    getStyleData (id, type, w, h, mode) {
      this.mode = mode
      this.dispmsData = []
      this.currentDispmsData = []
      this.styleid = id
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
        getStyle(id).then(res => {
          const data = res.data.data
          // 重新渲染editorarea
          this.reRenderFlag = false
          this.$nextTick(() => {
            this.reRenderFlag = true
          })
          var len = data.length // 循环变量
          for (var i = 0; i < len; ++i) {
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
      }
    },
    onActivated (index) {
      this.currentClickSourceColumn = this.currentDispmsData[index].sourceColumn
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
      if (this.mode === 'new') {
        this.currentDispmsData = coppyArray(newdata)
      } else {
        this.currentDispmsData = coppyArray(this.dispmsData)
      }
    },
    update (id) {
      for (let i = 0; i < this.currentDispmsData.length; ++i) {
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
            updateStyle(id, this.currentDispmsData, 1, 1)
          },
          onCancel: () => {
            updateStyle(id, this.currentDispmsData, 1, 0)
          }
        })
      } else {
        for (let i = 0; i < this.currentDispmsData.length; ++i) {
          delete this.currentDispmsData[i].id
        }
        var that = this
        let styledes = this.styleType
        newStyle(styledes).then(res => {
          const newId = res.data.data.id
          updateStyle(newId, that.currentDispmsData, 0, 0).then(res => {
            that.$emit('reloadTable')
            this.$Message.info('新建样式成功')
          })
        })
      }
    },
    saveAsNew () {
      this.$emit('onSava')
      for (let i = 0; i < this.currentDispmsData.length; ++i) {
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
            const newId = res.data.data.id
            updateStyle(newId, that.currentDispmsData, 0, 0).then(res => {
              that.$emit('reloadTable')
              this.$Message('另存为样式成功')
            })
          })
        }
      })
    },
    saveNew () {
      this.$emit('onSava')
      for (let i = 0; i < this.currentDispmsData.length; ++i) {
        delete this.currentDispmsData[i].id
      }
      this.$Modal.confirm({
        title: '新样式信息',
        render: (h, params) => {
          var that = this
          return h('span', [
            h('p', '样式信息:'),
            h('Select', {
              props: {
                value: this.newStyleSize
              },
              on: {
                'on-change': (val) => {
                  that.newStyleSize = val
                }
              }
            }, [
              h('Option', {
                props: {
                  value: '4.0寸',
                  label: '4.0寸'
                }
              }),
              h('Option', {
                props: {
                  value: '2.13寸',
                  label: '2.13寸'
                }
              }),
              h('Option', {
                props: {
                  value: '2.9寸',
                  label: '2.13寸'
                }
              })
            ]),
            h('Input', {
              attrs: {
                style: 'margin-top:10px'
              },
              props: {
                placeholder: '输入名字',
                value: this.newStyleName
              },
              on: {
                'on-change': (event) => {
                  that.newStyleName = event.target.value
                }
              }
            }),
            h('Select', {
              props: {
                value: this.newStyleType
              },
              attrs: {
                style: 'margin-top:10px'
              },
              on: {
                'on-change': function (val) {
                  that.newStyleType = val
                }
              }
            }, [
              h('Option', {
                props: {
                  value: '黑白',
                  label: '黑白'
                }
              }),
              h('Option', {
                props: {
                  value: '三色',
                  label: '三色'
                }
              })
            ])
          ])
        },
        onOk: () => {
          this.$Message.info(this.newStyleSize + ' ' + this.newStyleType)
        }

      })
    },
    onCheckItem (status, item) {
      console.log(status)
      if (status) {
        item.status = 1
      } else {
        item.status = 0
      }
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
  height: 140px;
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
