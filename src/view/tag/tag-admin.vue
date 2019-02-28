<template>
    <div class="container" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>价签信息</p></Col>
            </Row>
          </div>
          <super_table  @onSearch="onTableSearch" @onClick="onTableClick" :data="tagData" :columns="tableColumns" :isLoading="isTableLoading" :pageNum="pageNum"></super_table>
        </Card>
        <Modal v-model="settingModal" title="设置价签" :loading="settingOkLoading" @on-ok="asyncSettingOK">
          <div>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>定期刷新：</p></Col>
                <Col span="17"><Input type="text" v-model="cronExp" /></Col>
                <Col span="4"><corn-selector @onOk="onCron" style="margin-right:4px">选择时间</corn-selector></Col>
            </Row>

          </div>
        </Modal>
    </div>
</template>
<script>
import super_table from '@/components/table/supertable.vue'
import cronSelector from '@/components/corn-selector/corn-selector.vue'
import { getAllTag } from '@/api/tag'
export default {
  components: {
    super_table,
    'corn-selector': cronSelector
  },
  data () {
    return {
      windowWidth: 0,
      isTableLoading: false,
      settingOkLoading: true,
      settingModal: false,
      pageNum: 0,
      countPerPage: 14,
      tagData: [],
      tableColumns: [
        {
          title: 'id',
          key: 'id',
          width: '100',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '电量',
          key: 'power',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '硬件版本',
          key: 'hardwareVersion',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '软件版本',
          key: 'softwareVersion',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '地址',
          key: 'tagAddress',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '宽',
          key: 'resolutionWidth',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '高',
          key: 'resolutionHeight',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '工作状态',
          key: 'isWorking',
          width: '140',
          render: (h, params) => {
            const row = params.row
            const color = row.isWorking === 1 ? 'primary' : 'error'
            const text = row.isWorking === 1 ? '工作中' : '发生错误'

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
          title: '绑定商品',
          key: 'goodId',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '绑定样式',
          key: 'styleId',
          width: '70',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '路由器',
          key: 'routerId',

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
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: '150',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: '2px'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    this.editStyle(params.row.id, params.row.width, params.row.height)
                  }
                }
              }, '绑定'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  margin: '2px'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    this.remove(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      cronExp: ''

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
    this.getTagTableData({ page: this.pageNum, count: this.countPerPage })
  },
  methods: {
    getTagTableData (page, count) {
      var that = this
      that.isTableLoading = true
      getAllTag(page, count).then(res => {
        const data = res.data.data
        that.tagData = data
        that.isTableLoading = false
      })
    },
    onTableClick () {
      this.settingModal = true
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      var value = search[key]
      this.getTagTableData({ queryId: key[0], queryString: value })
    },
    onCron (data) {
      this.cronExp = data
    }
  }

}
</script>
<style>
.container{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: stretch;
    align-content: center;
}
</style>
