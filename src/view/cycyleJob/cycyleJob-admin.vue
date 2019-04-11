<template>
    <div ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="22"><p>定期任务信息</p></Col>
                <Col span="2"><Button type="primary" @click="cycyleJobReload">刷新</Button></Col>
              </Row>
          </div>
          <super_table @onDoubleClick="onTableClick" :pageSize="countPerPage" :current.sync="currentPage" @onSearch="onTableSearch" :data="cycleJobData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="cycleJobDataCount"></super_table>
        </Card>
        <Card :bordered="false" v-bind:style="{ marginTop:'10px', width: windowWidth*0.98 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                    <Col span="24"><p>添加定期任务</p></Col>
              </Row>
          </div>
          <div style="display:flex; align-items:center;margin-top:10px;">
            <span>商品定期任务：</span>
            <Select style="margin-left:8px;width: 200px" v-model="goodMode">
                  <Option :value="-1">商品基本数据</Option>
                  <Option :value="-2">商品变价数据</Option>
            </Select>
              <span style="width:120px;margin-left:10px;">文件路径：</span>
              <Input type="text" style="width:200px" v-model="goodFilePath" />
            <Input  v-model="goodCronExpr" placeholder="输入cron表达式" style="margin-left:8px;width: 300px">
                <Button slot="append" @click="isGoodCronModalShow=true">选择时间</Button>
            </Input>
            <Button style="margin-left:10px;" type="primary" @click="onGoodCycle">开始</Button>
          </div >
          <div style="display:flex; align-items:center;margin-top:10px;">
            <span>价签定期刷新：</span>
            <Select v-model="shopId" style="width: 300px">
              <Option v-for="(item) in shopData" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
            <Input  v-model="tagFlushCronExpr" placeholder="输入cron表达式" style="margin-left:8px;width: 300px">
                <Button slot="append" @click="isTagFlushCronModalShow=true">选择时间</Button>
            </Input>
            <Button style="margin-left:10px;" type="primary" @click="onTagFlushCycle">开始</Button>
          </div >
          <div style="display:flex; align-items:center;margin-top:10px;">
            <span>价签定期巡检：</span>
            <Select v-model="shopId" style="width: 300px">
              <Option v-for="(item) in shopData" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
            <Input  v-model="tagScanCronExpr" placeholder="输入cron表达式" style="margin-left:8px;width: 300px">
                <Button slot="append" @click="isTagScanCronModalShow=true">选择时间</Button>
            </Input>
            <Button style="margin-left:10px;" type="primary" @click="onTagScanCycle">开始</Button>
            <Button style="margin-left:10px;" type="primary" @click="onScanAll">对所有价签巡检</Button>
          </div >
        </Card>
        <corn-selector :isModalShow="isCronModalShow" @onOk="onCron" @onIsShow="onIsShow"></corn-selector>
        <corn-selector :isModalShow="isGoodCronModalShow" @onOk="onGoodCron" @onIsShow="onIsGoodShow"></corn-selector>
        <corn-selector :isModalShow="isTagFlushCronModalShow" @onOk="onFlushTagCron" @onIsShow="onIsFlushTagShow"></corn-selector>
        <corn-selector :isModalShow="isTagScanCronModalShow" @onOk="onScanTagCron" @onIsShow="onIsScanTagShow"></corn-selector>

    </div>
</template>
<script>
import { getAllCycleJob, updateCycleJob, deleteCyclejobs, scanShoptag, flushShoptag } from '@/api/cycylejob'
import { cronUpdate } from '@/api/good'
import { scanAll } from '@/api/tag'
import super_table from '@/components/table/supertable.vue'
import cronSelector from '@/components/corn-selector/corn-selector.vue'
import { getAllShop } from '@/api/shop'
import store from '@/store'
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
            let DeleteAccess = store.getters.access.indexOf(10) === -1
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  margin: '2px',
                  display: DeleteAccess ? 'none' : 'inline-block'
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
      isCronModalShow: false,
      goodMode: -1,
      goodFilePath: '',
      goodCronExpr: '',
      isGoodCronModalShow: false,
      shopId: -1,
      shopData: [],
      tagFlushCronExpr: '',
      isTagFlushCronModalShow: false,
      tagScanCronExpr: '',
      isTagScanCronModalShow: false
    }
  },
  created () {
    this.getCycyleJobTableData({ page: 0, count: this.countPerPage })
    getAllShop({ page: 0, count: 100 }).then(res => {
      this.shopData = res.data.data
    })
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
  computed: {
    hasEditAccess: () => {
      return store.getters.access.indexOf(2) !== -1
    }
  },
  methods: {
    onScanAll () {
      scanAll()
    },
    onGoodCycle () {
      cronUpdate(this.goodCronExpr, this.goodFilePath, this.goodMode).then(res => {
        this.$Message.info('设置成功')
      })
    },
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
      var that = this
      if (store.getters.access.indexOf(2) === -1) {
        return
      }
      this.currentCycyleJobData = currentRow
      if (currentRow.mode === -1 || currentRow.mode === -2) {
        this.$Modal.confirm({
          title: '设置定期任务',
          render: (h, params) => {
            return h('span', [
              h('p', '文件路径:'),
              h('Input', {
                props: {
                  placeholder: '输入文件路径',
                  value: currentRow.args
                },
                on: {
                  'on-change': (event) => {
                    that.currentCycyleJobData.args = event.target.value
                  }
                }
              }),
              h('Input', {
                attrs: {
                  style: 'width: 360px'
                },
                props: {
                  value: that.currentCycyleJobData.cron
                }
              }, [
                h('Button', {
                  slot: 'append',
                  on: {
                    'click': () => {
                      that.isCronModalShow = true
                    }
                  }
                }, '选择时间')
              ])
            ])
          },
          onOk: () => {
            that.editOK()
          }
        })
      } else if (currentRow.mode === 0) {
        this.currentCycyleJobData.cron = currentRow.args.split('、')[0]
        this.shopId = currentRow.args.split('、')[2]
        this.$Modal.confirm({
          title: '设置定期任务',
          render: (h, params) => {
            return h('span', [
              h('p', '商店:'),
              h('Select', {
                props: {
                  value: that.shopId
                },
                on: {
                  'on-change': (val) => {
                    that.shopId = val
                  }
                }
              },
              this.shopData.map((item) => {
                return h('Option', {
                  props: {
                    value: item.id,
                    label: item.name
                  }
                })
              })
              ),
              h('Input', {
                attrs: {
                  style: 'width: 360px'
                },
                props: {
                  value: that.currentCycyleJobData.cron
                }
              }, [
                h('Button', {
                  slot: 'append',
                  on: {
                    'click': () => {
                      that.isCronModalShow = true
                    }
                  }
                }, '选择时间')
              ])
            ])
          },
          onOk: () => {
            that.editOK()
          }
        })
      } else if (currentRow.mode === 1) {
        this.currentCycyleJobData.cron = currentRow.args.split('、')[0]
        this.shopId = currentRow.args.split('、')[2]
        this.$Modal.confirm({
          title: '设置定期任务',
          render: (h, params) => {
            return h('span', [
              h('p', '商店:'),
              h('Select', {
                props: {
                  value: that.shopId
                },
                on: {
                  'on-change': (val) => {
                    that.shopId = val
                  }
                }
              },
              this.shopData.map((item) => {
                return h('Option', {
                  props: {
                    value: item.id,
                    label: item.name
                  }
                })
              })
              ),
              h('Input', {
                attrs: {
                  style: 'width: 360px'
                },
                props: {
                  value: that.currentCycyleJobData.cron
                }
              }, [
                h('Button', {
                  slot: 'append',
                  on: {
                    'click': () => {
                      that.isCronModalShow = true
                    }
                  }
                }, '选择时间')
              ])
            ])
          },
          onOk: () => {
            that.editOK()
          }
        })
      }
    },
    editOK () {
      if (this.currentCycyleJobData.mode === 0 || this.currentCycyleJobData.mode === 1) {
        this.currentCycyleJobData.args = this.currentCycyleJobData.cron + '、id、' + this.shopId + '-'
      }
      updateCycleJob(this.currentCycyleJobData).then(res => {
        this.getCycyleJobTableData({ page: this.currentPage - 1, count: this.countPerPage })
      })
    },
    onCron (data) {
      this.currentCycyleJobData.cron = data
    },
    onGoodCron (data) {
      this.goodCronExpr = data
    },
    onFlushTagCron (data) {
      this.tagFlushCronExpr = data
    },
    onScanTagCron (data) {
      this.tagScanCronExpr = data
    },
    onIsShow (val) {
      this.isCronModalShow = val
    },
    onIsGoodShow (val) {
      this.isGoodCronModalShow = val
    },
    onIsFlushTagShow (val) {
      this.isTagFlushCronModalShow = val
    },
    onIsScanTagShow (val) {
      this.isTagScanCronModalShow = val
    },
    onTagFlushCycle () {
      let data = {}
      let params = {}
      let items = []
      this.$set(params, 'cron', this.tagFlushCronExpr)
      this.$set(params, 'query', 'id')
      this.$set(params, 'queryString', this.shopId)
      items.push(params)
      this.$set(data, 'items', items)
      flushShoptag(data).then(res => {
        this.$Message.info('刷新成功')
        this.cycyleJobReload()
      })
    },
    onTagScanCycle () {
      let data = {}
      let params = {}
      let items = []
      this.$set(params, 'cron', this.tagFlushCronExpr)
      this.$set(params, 'query', 'id')
      this.$set(params, 'queryString', this.shopId)
      items.push(params)
      this.$set(data, 'items', items)
      scanShoptag(data).then(res => {
        this.$Message.info('巡检成功')
        this.cycyleJobReload()
      })
    }
  }
}
</script>
<style scoped>
.Row{
  margin-bottom: 6px;
}
</style>
