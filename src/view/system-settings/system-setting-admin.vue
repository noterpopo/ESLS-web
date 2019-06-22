<template>
    <div ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.6 + 'px' }">
            <Tabs :animated="false">
                <TabPane v-if="hasProAccess" label="设置导出文件字段">
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
      windowWidth: 0,
      currentFileArgs: [],
      fileArgs: [
        'shopNumber',
        'name',
        'barCode',
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
        shopNumber: '店铺编码',
        name: '名称',
        barCode: '条码',
        qrCode: '二维码',
        price: '价格',
        promotePrice: '促销价',
        provider: '供应商',
        operator: '操作员',
        category: '类别',
        origin: '产地',
        spec: '规格',
        stock: '库存',
        unit: '单位',
        shelfNumber: '货号',
        promoteTimeGap: '促销价格',
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
    }
  }
}
</script>
