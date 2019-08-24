<template>
    <div class="initLicense" ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card class="card" :bordered="false" v-bind:style="{ width: windowWidth*0.6 + 'px' }">

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
      display: inline;
        right: 160px;
        top: 50%;
        transform: translateY(-60%);
    }
}
</style>
