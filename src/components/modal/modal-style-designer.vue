<template>
    <div class="container">
        <div>
            <div></div>
            <div class="editor">
                <vue-draggable-resizable :w="100" :h="100" :parent="true" :resizable="true">
                    <p>Hello! I'm a flexible component. You can drag me around and you can resize me.<br></p>
                </vue-draggable-resizable>
                <Spin size="large" fix v-if="isLoading"></Spin>
            </div>
        </div>
        <div>
        </div>
    </div>
</template>
<script>
// https://github.com/mauricius/vue-draggable-resizable
import { getDispms, getStyle } from '@/api/style'
import VueDraggableResizable from 'vue-draggable-resizable'
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
}
.editor{
    width: 400px;
    height: 400px;
}
</style>
