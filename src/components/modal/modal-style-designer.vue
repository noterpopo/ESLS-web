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
              <Poptip trigger="click" title="Title" content="content" class="poptipWarp" :style="{ position: 'relative',left: x+'px',top: y+'px'}">
                  <vue-draggable-resizable :style="{ position: 'relative',left: 0+'px',top: 0+'px'}" class-name-active="draggerItem-active-class" class-name="draggerItem-class" @activated="onActivated"  @dragging="onDrag" @resizing="onResize" parent=".editorarea">
                      <p>Hello</p>
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
              that.dispmsData = dispmsData
              that.currentDispmsData = dispmsData
              console.info(that.currentDispmsData)
            }
          })
        }
      })
    },
    onActivated () {
      console.log('Actived')
    },
    onDrag (x, y) {
      this.x = x
      this.y = y
    },
    onResize () {

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
}
.inputarea{
    width: 400px;
    height: auto;
}
.right{
    margin: 10px;
    flex-grow: 2;
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
