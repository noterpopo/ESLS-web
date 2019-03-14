<template>
    <div ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                    <Col span="22"><p>定期任务信息</p></Col>
                    <Col span="2"><Button type="primary" @click="cycyleJobReload">刷新</Button></Col>
              </Row>
          </div>
          <super_table @onDoubleClick="onTableClick" :pageSize="countPerPage" :current.sync="currentPage" @onSearch="onTableSearch" :data="cycleJobData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="cycleJobDataCount"></super_table>
        </Card>
        <Modal :width="1040" v-model="editModal" title="修改商店信息" @on-ok="editOK">
            <div>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>模式：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentCycyleJobData.mode"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">类型：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentCycyleJobData.type" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>参数：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentCycyleJobData.args"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">cron：</p></Col>
                    <Col span="11">
                        <Input  v-model="currentCycyleJobData.cron" >
                            <Button slot="append" @click="isCronModalShow=true">选择时间</Button>
                        </Input>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>描述：</p></Col>
                    <Col span="23"><Input type="text" v-model="currentCycyleJobData.description"/></Col>
                </Row>
            </div>
            <corn-selector :isModalShow="isCronModalShow" @onOk="onCron" @onIsShow="onIsShow"></corn-selector>
        </Modal>
    </div>
</template>
<script>
import { getAllCycleJob, updateCycleJob, deleteCyclejobs } from '@/api/cycylejob'
import super_table from '@/components/table/supertable.vue'
import cronSelector from '@/components/corn-selector/corn-selector.vue'
export default {
  components: {
    super_table,
    'corn-selector': cronSelector
  },
  data () {
    return {
      windowWidth: 0,
      isTableLoading: false,
      countPerPage: 6,
      currentPage: 1,
      cycleJobDataCount: 0,
      cycleJobData: [],
      tableColumns: [
        {
          title: '描述',
          key: 'description',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '类型',
          key: 'type',
          width: '80',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '模式',
          key: 'mode',
          width: '80',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '参数',
          key: 'args',
          filter: {
            type: 'Input'
          }
        },
        {
          title: 'cron表达式',
          key: 'cron',
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
      currentCycyleJobData: {},
      editModal: false,
      isCronModalShow: false

    }
  },
  created () {
    this.getCycyleJobTableData({ page: 0, count: this.countPerPage })
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
  watch: {
    currentPage () {
      this.getCycyleJobTableData({ page: this.currentPage - 1, count: this.countPerPage })
    }
  },
  methods: {
    getCycyleJobTableData ({ page, count, query, queryString }) {
      var that = this
      that.isTableLoading = true
      getAllCycleJob({ page: page, count: count, query: query, queryString: queryString }).then(res => {
        that.cycleJobData = res.data.data
        that.cycleJobDataCount = res.data.code
        that.isTableLoading = false
      })
    },
    remove (id) {
      var that = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除该定期任务吗？',
        onOk: function () {
          deleteCyclejobs(id)
            .then(() => {
              that.getCycyleJobTableData({ page: that.currentPage - 1, count: that.countPerPage })
            })
        }
      })
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getCycyleJobTableData({ page: 0, count: this.countPerPage })
        this.currentTagPage = 1
        return
      }
      var value = search[key[0]]
      this.getCycyleJobTableData({ query: key[0], queryString: value })
    },
    cycyleJobReload () {
      this.getCycyleJobTableData({ page: this.currentPage - 1, count: this.countPerPage })
    },
    onTableClick (currentRow) {
      this.currentCycyleJobData = currentRow
      this.editModal = true
    },
    editOK () {
      updateCycleJob(this.currentCycyleJobData).then(res => {
        this.getCycyleJobTableData({ page: this.currentPage - 1, count: this.countPerPage })
      })
    },
    onCron (data) {
      this.currentCycyleJobData.cron = data
    },
    onIsShow (val) {
      this.isCronModalShow = val
    }
  }
}
</script>
<style scoped>
.Row{
  margin-bottom: 6px;
}
</style>
