<template>
    <div class="container" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>路由器列表</p></Col>
            </Row>
          </div>
          <super_table :pageSize="countPerPage" :current.sync="currentPage" @onSearch="onTableSearch" :data="routeData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="routeDataCount"></super_table>
        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px',marginTop:'10px'}">
            <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="24"><p>IP设置</p></Col>
                </Row>
            </div>
            <div>
                <Select v-model="ipMode" :style="{width:'160px'}">
                    <Option :value="0">自动分配</Option>
                    <Option :value="1">手动设置</Option>
                </Select>
                <InputNumber  :style="{marginLeft:'10px'}" :disabled="ipMode===0" :max="255" :min="1" v-model="from"></InputNumber>
                <span :style="{marginLeft:'4px',marginRight:'4px'}">~</span>
                <InputNumber  :disabled="ipMode===0" :max="255" :min="1" v-model="to"></InputNumber>
                <Button type="primary" @click="setIp">确定</Button>
            </div>
        </Card>
    </div>
</template>
<script>
import { getAllRoute } from '@/api/route'
import super_table from '@/components/table/supertable.vue'
export default {
  components: {
    super_table
  },
  data () {
    return {
      windowWidth: 0,
      isTableLoading: false,
      countPerPage: 10,
      currentPage: 1,
      routeDataCount: 0,
      routeData: [],
      tableColumns: [
        {
          title: '路由器条码',
          key: 'barCode',
          width: '200',
          filter: {
            type: 'Input'
          }

        },
        {
          title: 'MAC地址',
          key: 'mac',
          filter: {
            type: 'Input'
          }

        },
        {
          title: 'IP地址',
          key: 'ip',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '端口号',
          key: 'port',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '通道',
          key: 'channelId',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '创建时间',
          key: 'execTime',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '更新时间',
          key: 'completeTime',
          filter: {
            type: 'Input'
          }

        },
        {
          title: '状态',
          key: 'isWorking',
          render: (h, params) => {
            const row = params.row
            const color = row.isWorking === 1 ? 'primary' : 'error'
            const text = row.isWorking === 1 ? '工作中' : '禁用'

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
        },
        {
          title: '硬件版本',
          key: 'hardVersion',
          filter: {
            type: 'Input'
          }
        }
      ],
      ipMode: 0,
      from: 0,
      to: 0
    }
  },
  created () {
    this.getRouteTableData({ page: this.currentPage - 1, count: this.countPerPage })
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
    getRouteTableData ({ page, count, queryId, queryString }) {
      var that = this
      that.isTableLoading = true
      getAllRoute({ page: page, count: count, queryId: queryId, queryString: queryString }).then(res => {
        const data = res.data.data
        that.routeDataCount = res.data.code
        that.routeData = data
        that.isTableLoading = false
      })
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getRouteTableData({ page: 0, count: this.countPerPage })
        this.currentTagPage = 1
        return
      }
      var value = search[key[0]]
      this.getRouteTableData({ queryId: key[0], queryString: value })
    },
    setIp () {

    }
  }
}
</script>
