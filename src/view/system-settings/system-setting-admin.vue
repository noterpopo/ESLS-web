<template>
    <div ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.6 + 'px' }">
          <Select v-if="hasProAccess" :transfer="true" v-model="curShopId" @on-change="changeShop">
            <Option v-for="item in shopData" :key="item.id" :value="item.id" :label="item.name"></Option>
          </Select>
            <Tabs v-if="hasProAccess" :animated="false">
                <TabPane label="设置导出文件字段">
                    <p>字段设置:</p>
                    <Select :transfer="true" :multiple="true" v-model="currentFileArgs">
                      <Option v-for="item in fileArgs" :value="item" :key="item" >{{translate[item]}}</Option>
                    </Select>
                    <Button style="margin-top:10px;" type="primary" @click="onSubmit">确定</Button>
                </TabPane>
                <TabPane v-if="isMainShop" label="短信验证设置">
                    <p>是否开启短信验证:</p>
                    <i-switch style="margin-top:10px;" v-model="isSMS" @on-change="changeSMS"/>
                </TabPane>
                <TabPane label="盘点">
                    <p>盘点方式:</p>
                    <Select :transfer="true" v-model="computeWay">
                      <Option  :value="0">{{'手动盘点'}}</Option>
                      <Option  :value="2">{{'电子秤'}}</Option>
                    </Select>
                    <Button style="margin-top:10px;" type="primary" @click="changeEBlance">确定</Button>
                    <p style="margin-top:10px;">预警门限:</p>
                    <Input v-model="repNum" />
                    <Button style="margin-top:10px;" type="primary" @click="changeRepNum">修改门限</Button>
                    <Button style="margin-top:10px;margin-left:10px;" type="primary" @click="clearZero">盘点清零</Button>
                </TabPane>
                <TabPane label=" 改价通知方式">
                    <p>改价通知方式:</p>
                    <Select :transfer="true" v-model="currentwarWay">
                      <Option :value="0" >{{"邮箱"}}</Option>
                      <Option :value="1" >{{"短信"}}</Option>
                      <Option :value="2" >{{"邮箱和短信"}}</Option>
                      <Option :value="3" >{{"不通知"}}</Option>
                    </Select>
                    <Button style="margin-top:10px;" type="primary" @click="onWarWaySubmit">确定</Button>
                </TabPane>
                <TabPane v-if="isMainShop" label="短信参数设置">
                    <p>短信AccessKey:</p>
                    <Input v-model="smsAppId"/>
                    <p>短信AccessSecret:</p>
                    <Input v-model="smsAppKey"/>
                    <p>短信签名:</p>
                    <Input v-model="messageSign"/>
                    <p>短信通知模版Id:</p>
                    <Input v-model="smsTemp1"/>
                    <p>短信验证模版Id:</p>
                    <Input v-model="smsTemp2"/>
                    <Button style="margin-top:10px;" type="primary" @click="onChangeSMSArgs">确定</Button>
                </TabPane>
                <TabPane v-if="isMainShop" label="通知邮箱设置">
                    <p>邮箱账号:</p>
                    <Input v-model="notifyMailAccount"/>
                    <p>邮箱密码:</p>
                    <Input v-model="notifyMailPassword"/>
                    <Button style="margin-top:10px;" type="primary" @click="onChangeEmailArgs">确定</Button>
                </TabPane>
                <TabPane v-if="isMainShop && curShopId==1" label="唤醒个数">
                    <p>唤醒个数:</p>
                    <Input v-model="tagsLengthCommand"/>
                    <Button style="margin-top:10px;" type="primary" @click="onChangeETagsLength">确定</Button>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>

<script>
import { setSystemArgs, getSystemArgs } from '@/api/systemsetting'
import { computeTagToZero } from '@/api/tag'
import store from '@/store'
import { getAllShop } from '@/api/shop'
export default {
  data () {
    return {
      currentwarWay: -1,
      curShopId: -1,
      shopData: [],
      currentArgs: {},
      headers: {
        ESLS: store.getters.token
      },
      isSMS: true,
      computeWay: 0,
      windowWidth: 0,
      repNum: 0,
      smsAppId: '',
      smsAppKey: '',
      smsTemp1: '',
      smsTemp2: '',
      messageSign: '',
      notifyMailAccount: '',
      notifyMailPassword: '',
      tagsLengthCommand: '',
      currentFileArgs: [],
      fileArgs: [
        'name',
        'qrCode',
        'oriPrice',
        'curPrice',
        'provider',
        'operator',
        'category',
        'origin',
        'spec',
        'shopNumber',
        'stock',
        'unit',
        'shopNumber',
        'shelfNumber',
        'promoteTimeGap',
        'promotionReason',
        'isPromote',
        'rfu01',
        'rfu02',
        'rfus01',
        'rfus02',
        'isComputeOpen',
        'weightSpec',
        'replenishNumber',
        'barCode',
        'computeNumber'
      ],
      translate: {
        name: '商品名称',
        qrCode: '二维码',
        oriPrice: '原价',
        curPrice: '价格',
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
        isPromote: '是否促销',
        rfu01: '铺货',
        rfu02: '自定义字段2',
        rfus01: '自定义字段3',
        rfus02: '自定义字段4',
        isComputeOpen: '是否开启计件',
        weightSpec: '重量规格',
        replenishNumber: '预警数量',
        barCode: '商品条码',
        computeNumber: '件数',
        shopNumber: '店铺编号'
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
      this.currentArgs = res.data.data
      this.curShopId = this.currentArgs[0].shopid
      this.currentFileArgs = this.currentArgs[0].goodDataFormat.split(' ')
      this.isSMS = this.currentArgs[0].isMessageVerifyOpen === 1
      this.computeWay = this.currentArgs[0].computeType
      this.repNum = this.currentArgs[0].replenishNumber
      this.currentwarWay = this.currentArgs[0].notifyType
      this.smsAppKey = this.currentArgs[0].msgAppKey
      this.smsAppId = this.currentArgs[0].msgAppId
      this.smsTemp1 = this.currentArgs[0].notifyTemplateId
      this.smsTemp2 = this.currentArgs[0].messageTemplateId
      this.messageSign = this.currentArgs[0].messageSign
      this.notifyMailAccount = this.currentArgs[0].notifyMailAccount
      this.tagsLengthCommand = this.currentArgs[0].tagsLengthCommand
      this.notifyMailPassword = this.currentArgs[0].notifyMailPassword
    })
    getAllShop({ page: 0, count: 100 }).then(res => {
      this.shopData = res.data.data
      if (store.getters.shopId !== 1) {
        this.shopData = this.shopData.filter((item) => {
          return item.id === store.getters.shopId
        })
      }
    })
  },
  computed: {
    hasProAccess: () => {
      return store.getters.access.indexOf(16) !== -1
    },
    isMainShop: () => {
      return store.getters.shopId === 1
    }
  },
  methods: {
    onChangeEmailArgs () {
      setSystemArgs(17, this.notifyMailAccount + ' ' + this.notifyMailPassword, this.curShopId).then(res => {
        this.$Message.info('修改成功')
      })
    },
    onChangeSMSArgs () {
      setSystemArgs(7, this.smsAppId + ' ' + this.smsAppKey + ' ' + this.smsTemp1 + ' ' + this.smsTemp2, this.curShopId).then(res => {
        this.$Message.info('修改成功')
      })
    },
    onChangeETagsLength () {
      setSystemArgs(8, this.tagsLengthCommand, this.curShopId).then(res => {
        this.$Message.info('修改成功')
      })
    },
    onWarWaySubmit () {
      setSystemArgs(16, this.currentwarWay, this.curShopId).then(res => {
        this.$Message.info('修改成功')
      })
    },
    changeShop (shopId) {
      getSystemArgs().then(res => {
        this.currentArgs = res.data.data
        this.currentArgs.map((item) => {
          if (item.shopid === shopId) {
            this.currentFileArgs = item.goodDataFormat.split(' ')
            this.isSMS = item.isMessageVerifyOpen === 1
            this.computeWay = item.computeType
            this.repNum = item.replenishNumber
            this.currentwarWay = item.notifyType
            this.smsAppKey = item.msgAppKey
            this.smsAppId = item.msgAppId
            this.smsTemp1 = item.notifyTemplateId
            this.smsTemp2 = item.messageTemplateId
            this.messageSign = item.messageSign
            this.notifyMailAccount = item.notifyMailAccount
            this.tagsLengthCommand = item.tagsLengthCommand
            this.notifyMailPassword = item.notifyMailPassword
          }
        })
      })
    },
    clearZero () {
      computeTagToZero().then(res => {
        this.$Message.info('清零成功')
      })
    },
    onSubmit () {
      setSystemArgs(9, this.currentFileArgs.join(' '), this.curShopId).then(res => {
        this.$Message.info('修改成功')
      })
    },
    changeSMS (val) {
      if (val) {
        setSystemArgs(13, 1, this.curShopId).then(res => {
          this.$Message.info('修改成功')
        })
      } else {
        setSystemArgs(13, 0, this.curShopId).then(res => {
          this.$Message.info('修改成功')
        })
      }
    },
    changeEBlance () {
      if (this.computeWay != null) {
        setSystemArgs(14, this.computeWay, this.curShopId).then(res => {
          this.$Message.info('修改成功')
        })
      }
    },
    changeRepNum () {
      if (this.repNum != null) {
        setSystemArgs(15, this.repNum, this.curShopId).then(res => {
          this.$Message.info('修改成功')
        })
      }
    }
  }
}
</script>
