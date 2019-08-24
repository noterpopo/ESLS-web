<template>
    <div class="initLicense" ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card class="card" title="注册证书" :bordered="false" v-bind:style="{ width: windowWidth*0.6 + 'px' }">

        </Card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      windowWidth: 0
    }
  },
  mounted () {
    var that = this
    this.$nextTick(() => {
      this.windowWidth = this.$refs.container.offsetWidth
    })
    window.onresize = function () {
      that.windowWidth = that.$refs.container.offsetWidth
    }
  },
  methods: {

  }
}
</script>
<style lang="less">
.initLicense{
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/login-bg.jpg');
    background-size: cover;
    background-position: center;
    text-align:center;
    .card{
      margin-top: 80px;
      display: inline-block;
    }
}
</style>
