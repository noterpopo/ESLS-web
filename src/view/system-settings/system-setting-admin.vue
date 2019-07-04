<template>
    <div ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.6 + 'px' }">
            <Tabs v-if="hasProAccess" :animated="false">
                <TabPane label="设置导出文件字段">
                    <p>字段设置:</p>
                    <Select :transfer="true" :multiple="true" v-model="currentFileArgs">
                      <Option v-for="item in fileArgs" :value="item" :key="item" >{{translate[item]}}</Option>
                    </Select>
                    <Button style="margin-top:10px;" type="primary" @click="onSubmit">确定</Button>
                </TabPane>
                <TabPane label="短信验证设置">
                    <p>是否开启短信验证:</p>
                    <i-switch style="margin-top:10px;" v-model="isSMS" @on-change="changeSMS"/>
                </TabPane>
                <TabPane label="盘点方式">
                    <p>盘点方式:</p>
                    <Select :transfer="true" v-model="computeWay">
                      <Option  :value="0">{{'手动盘点'}}</Option>
                      <Option  :value="1">{{'电子秤'}}</Option>
                      <Option  :value="2">{{'都开启'}}</Option>
                    </Select>
                    <Button style="margin-top:10px;" type="primary" @click="changeEBlance">确定</Button>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>

<script>
import { setSystemArgs, getSystemArgs } from '@/api/systemsetting'
import store from '@/store'
export default {
  data () {
    return {
      headers: {
        ESLS: store.getters.token
      },
      isSMS: true,
      computeWay: 0,
      windowWidth: 0,
      currentFileArgs: [],
      fileArgs: [
        'name',
        'qrCode',
        'price',
        'promotePrice',
        'provider',
        'operator',
        'category',
        'origin',
        'spec',
        'stock',
        'unit',
        'shelfNumber',
        'promoteTimeGap',
        'promotionReason',
        'isPromote'
      ],
      translate: {
        name: '商品名称',
        qrCode: '二维码',
        price: '原件',
        promotePrice: '价格',
        provider: '供应商',
        operator: '操作员',
        category: '类别',
        origin: '产地',
        spec: '规格',
        stock: '库存',
        unit: '单位',
        shelfNumber: '货号',
        promoteTimeGap: '促销间隔',
        promotionReason: '促销原因',
        isPromote: '是否促销'
      }
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
    getSystemArgs().then(res => {
      this.currentFileArgs = res.data.data[0].goodDataFormat.split(' ')
      this.isSMS = res.data.data[0].isMessageVerifyOpen === 1
      this.computeWay = res.data.data[0].computeType
    })
  },
  computed: {
    hasProAccess: () => {
      return store.getters.access.indexOf(16) !== -1
    }
  },
  methods: {
    onSubmit () {
      setSystemArgs(9, this.currentFileArgs.join(' ')).then(res => {
        this.$Message.info('修改成功')
      })
    },
    changeSMS (val) {
      if (val) {
        setSystemArgs(13, 1).then(res => {
          this.$Message.info('修改成功')
        })
      } else {
        setSystemArgs(13, 0).then(res => {
          this.$Message.info('修改成功')
        })
      }
    },
    changeEBlance () {
      if (this.computeWay != null) {
        setSystemArgs(14, this.computeWay).then(res => {
          this.$Message.info('修改成功')
        })
      }
    }
  }
}
</script>
