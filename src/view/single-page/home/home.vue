<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="tagPieData" text="价签信息"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="routerPieData" text="路由器信息"></chart-pie>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie } from '_c/charts'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie
  },
  data () {
    return {
      inforCardData: [
        { title: '商品数量', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        { title: '价签数量', icon: 'md-locate', count: 232, color: '#19be6b' },
        { title: '样式数量', icon: 'md-help-circle', count: 142, color: '#ff9900' },
        { title: '店铺数量', icon: 'md-share', count: 657, color: '#ed3f14' },
        { title: '路由器数量', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        { title: '用户数量', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      tagPieData: [
        { value: 1, name: '正常' },
        { value: 0, name: '未绑定' },
        { value: 1, name: '离线' },
        { value: 11, name: '禁用' }
      ],
      routerPieData: [
        { value: 335, name: '正常' },
        { value: 310, name: '离线' },
        { value: 234, name: '禁用' }
      ]
    }
  },
  created () {
    axios.request({
      url: '/goods',
      methods: 'get'
    }).then(res => { this.inforCardData[0].count = res.data.code })
    axios.request({
      url: '/tags',
      methods: 'get'
    }).then(res => {
      this.inforCardData[1].count = res.data.code
      const data = res.data.data
      let goodTagCount = 0
      let noBIndTagCount = 0
      let noWorkingTagCount = 0
      let disableTagCount = 0
      for (let i = 0; i < data.length; ++i) {
        if (data[i].isWorking === 0) {
          noWorkingTagCount = noWorkingTagCount + 1
        } else if (data[i].goodId === 0) {
          noBIndTagCount = noBIndTagCount + 1
        } else if (data[i].forbidState === 0) {
          disableTagCount = disableTagCount + 1
        } else {
          goodTagCount = goodTagCount + 1
        }
      }
      this.tagPieData[0].value = goodTagCount
      this.tagPieData[1].value = noBIndTagCount
      this.tagPieData[2].value = noWorkingTagCount
      this.tagPieData[3].value = disableTagCount
    })
    axios.request({
      url: '/styles',
      methods: 'get'
    }).then(res => { this.inforCardData[2].count = res.data.code })
    axios.request({
      url: '/shops',
      methods: 'get'
    }).then(res => { this.inforCardData[3].count = res.data.code })
    axios.request({
      url: '/routers',
      methods: 'get'
    }).then(res => { this.inforCardData[4].count = res.data.code })
    axios.request({
      url: '/users',
      methods: 'get'
    }).then(res => { this.inforCardData[5].count = res.data.code })
  }

}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
