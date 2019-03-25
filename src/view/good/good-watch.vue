<template>
    <div style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="22"><p>等待改价列表</p></Col>
                <Col span="2"><Button v-if="hasSubmitAccess" type="primary" @click="submitUpdate">一键改价</Button></Col>
            </Row>
          </div>
          <Table border :loading='isTableLoading' ref="selection" :columns="tableColumns" :data="goodData" @on-selection-change="handleSelectionChange"></Table>
          <Button style="margin:5px" @click="handleSelectAll(true)" type="primary">全选</Button>
          <Button style="margin:5px" @click="handleSelectAll(false)" type="primary">取消全选</Button>

        </Card>
    </div>
</template>
<script>
import { getAllGood, submitUpdate } from '@/api/good'
import { getAllTag } from '@/api/tag'
import store from '@/store'
export default {
  data () {
    return {
      windowWidth: 0,
      intervalid: 0,
      isTableLoading: false,
      goodData: [],
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '条形码',
          key: 'barCode',
          width: '160',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '名称',
          key: 'name',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '产地',
          key: 'origin',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '供货商',
          key: 'provider',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '单位',
          key: 'unit',
          width: '70',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '价格',
          key: 'price',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '促销价',
          key: 'promotePrice',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '货号',
          key: 'shelfNumber',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '规格',
          key: 'spec',
          width: '70',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '类别',
          key: 'category',

          filter: {
            type: 'Input'
          }
        },
        {
          title: '状态',
          key: 'waitUpdate',
          width: '140',
          render: (h, params) => {
            const row = params.row
            const color = row.waitUpdate === 1 ? 'primary' : 'error'
            const text = row.waitUpdate === 1 ? '已经更新' : '等待更新'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          },
          filter: {
            type: 'Input'
          }
        }
      ],
      updateSum: 1,
      currentUpdate: 0,
      updateStatus: 'active',
      selectid: [],
      pageNum: 0,
      countPerPage: 10

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
  created () {
    this.getGoodTableData(this.pageNum, this.countPerPage)
  },
  computed: {
    hasSubmitAccess: () => {
      return store.getters.access.indexOf(20) !== -1
    }
  },
  methods: {
    getGoodTableData (page, count) {
      var that = this
      that.isTableLoading = true
      getAllGood({ page: page, count: count, queryId: 'waitUpdate', queryString: '0' }).then(res => {
        const data = res.data.data
        that.goodData = data
        that.isTableLoading = false
      })
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    handleSelectionChange (selection) {
      let si = []
      let len = selection.length
      for (let i = 0; i < len; ++i) {
        si.push(selection[i].id)
      }
      this.selectid = si
    },
    submitUpdate () {
      var that = this
      let data = []
      for (let i = 0; i < this.selectid.length; ++i) {
        let temp = { query: 'id', queryString: '' }
        temp.queryString = this.selectid[i] + ''
        data.push(temp)
      }
      submitUpdate(data).then(res => {
        this.updateSum = res.data.data.sum
        that.intervalid = setInterval(() => {
          getAllTag({ queryId: 'waitUpdate', queryString: '0' }).then(res => {
            let onlinedata = res.data.data.filter((item) => {
              return item.isWorking === 1 && item.forbidState === 1
            })
            that.currentUpdate = that.updateSum - onlinedata.length
            if (onlinedata.length < 0) {
              that.updateStatus = 'wrong'
              that.$Message.error('变价失败')
              clearInterval(this.intervalid)
            } else if (that.currentUpdate < 0) {
              clearInterval(this.intervalid)
              that.updateStatus = 'wrong'
              that.$Message.error('变价失败')
            } else if (onlinedata.length === 0) {
              clearInterval(this.intervalid)
              that.$Message.info('成功设置' + this.updateSum + '个价签')
              that.updateStatus = 'success'
            }
            console.log(that.currentUpdate)
          })
        }, 100)
        this.getGoodTableData(this.pageNum, this.countPerPage)
        this.$Modal.info({
          title: '更新进度',
          render: (h, params) => {
            return h('Progress', {
              props: {
                percent: (that.currentUpdate / that.updateSum) * 100,
                status: that.updateStatus
              }
            })
          },
          onOk: () => {
            clearInterval(this.intervalid)
          }
        })
      })
    }
  }

}
</script>
