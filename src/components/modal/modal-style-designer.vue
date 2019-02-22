<template>
    <div class="container">
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
            </div>
        </div>
        <div class="right">
            <div class="editorarea" v-if="reRenderFlag">
              <Poptip v-for="(item,index) in currentDispmsData" :key="index" trigger="click" title="Title" content="content" class="poptipWarp" :style="{ position: 'absolute',left: item.x+'px',top: item.y+'px'}">
                  <vue-draggable-resizable :style="{ position: 'absolute',left: 0+'px',top: 0+'px'}" :x="item.x" :y="item.y" :w="item.width" :h="item.height" class-name-active="draggerItem-active-class" class-name="draggerItem-class" @activated="onActivated(index)" @dragging="onDrag(arguments,index)" @resizing="onResize(arguments,index)" parent=".editorarea">
                      <span :style="{ fontSize :item.width+'px', lineHeight:item.height+'px'}">Hello</span>
                  </vue-draggable-resizable>
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
      x: 0,
      y: 0,
      width: 200,
      height: 200,
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
        var len = data.dispms.length // 循环变量
        var flag = len - 1 // 保证循环后调用initData()
        for (var i = 0; i < len; ++i) {
          getDispms(data.dispms[i]).then(res => {
            const dispData = res.data.data
            dispmsData.push(dispData)
            if (!(flag--)) {
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
      console.log('Actived')
    },
    onDrag ([x, y], index) {
      console.info(x + ' ' + this.currentDispmsData[index].x + this.dispmsData[index].x)
      this.$set(this.currentDispmsData[index], 'x', x)
      this.$set(this.currentDispmsData[index], 'y', y)
    },
    onResize ([x, y, width, height], index) {
      this.$set(this.currentDispmsData[index], 'x', x)
      this.$set(this.currentDispmsData[index], 'y', y)
      this.$set(this.currentDispmsData[index], 'width', width)
      this.$set(this.currentDispmsData[index], 'height', height)
    }
  }
}
</script>
<style>
Input{
  margin: 10px;
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
    width: 800px;
    height: 600px;
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
</style>
