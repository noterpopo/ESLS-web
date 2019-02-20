<template>
    <div class="container">
        <div class="left">
            <div class="inputarea">
                <p>kkk</p>
            </div>
        </div>
        <div class="right">
            <div class="editor">
                <vue-draggable-resizable style="{position:'relative;'}" >
                    <p>Hello! I'm a flexible component. You can drag me around and you can resize me.<br></p>
                </vue-draggable-resizable>
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
      isLoading: false
    }
  },
  methods: {
    getStyleData (id) {
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
              console.info(dispmsData)
            }
          })
        }
      })
    }
  }
}
</script>
<style>
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
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
}
.editor{
    width: 800px;
    height: 600px;
}
</style>
