<template>
    <div class="initLicense" ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card class="card" title="注册证书" :bordered="false" v-bind:style="{ width: windowWidth*0.2 + 'px' }">
          <Button type="primary" @click="showServerInfo">查看服务器信息</Button>
        </Card>
        <Modal v-model="isShow" title="服务器信息">
              <div class="font">
                <p>{{'CPU：'+cpuSerial}}</p>
                <p>{{'IP地址：'+ipAddress}}</p>
                <p>{{'MAC地址：'+macAddress}}</p>
                <p>{{'主板：'+mainBoardSerial}}</p>
              </div>
            </Modal>
    </div>
</template>

<script>
import { getServerInfos } from '@/api/license'
export default {
  data () {
    return {
      windowWidth: 0,
      isShow: false,
      cpuSerial: '',
      ipAddress: '',
      macAddress: '',
      mainBoardSerial: ''
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
    showServerInfo () {
      getServerInfos('ubuntu').then(res => {
        this.cpuSerial = res.data.cpuSerial
        this.ipAddress = res.data.ipAddress
        this.macAddress = res.data.macAddress
        this.mainBoardSerial = res.data.mainBoardSerial

        this.isShow = true
      })
    }
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
.font{
  font-size: 16px;
}
</style>
