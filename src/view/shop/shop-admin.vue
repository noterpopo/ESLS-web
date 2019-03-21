<template>
    <div ref="container" style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;">
      <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px',marginBottom:'10px' }">
        <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>总店信息</p></Col>
            </Row>
            <Table border :columns="tableColumns" :data="centerShopData"></Table>
          </div>
      </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                    <Col span="20"><p>分店信息</p></Col>
                    <Col span="2"><Button type="primary" @click="addShop">添加店铺</Button></Col>
                    <Col span="2"><Button type="primary" @click="shopReload">刷新</Button></Col>
              </Row>
          </div>
          <super_table @onDoubleClick="onTableClick" :pageSize="countPerPage" :current.sync="currentPage" @onSearch="onTableSearch" :data="subShopData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="shopDataCount"></super_table>
        </Card>
        <Modal :width="1040" v-model="editModal" title="修改店铺信息" @on-ok="editOK">
            <div>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>编码：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentShopData.number"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">类型：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentShopData.type" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>名称：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentShopData.name"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">电话：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentShopData.phone"/></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>总店：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentShopData.fatherShop"/></Col>
                    <Col span="2"><p style="position:relative;left:10px;">管理员:</p></Col>
                    <Col span="10"><Input type="text" v-model="currentShopData.manager" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>账号：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentShopData.account"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">密码:</p></Col>
                    <Col span="11"><Input type="text" v-model="currentShopData.password" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>地址:</p></Col>
                    <Col span="23"><Input type="text" v-model="currentShopData.address"/></Col>
                </Row>
            </div>
        </Modal>
        <Modal :width="1040" v-model="addModal" title="添加店铺" @on-ok="addOK">
            <div>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>编码：</p></Col>
                    <Col span="11"><Input type="text" v-model="addShopData.number"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">类型：</p></Col>
                    <Col span="11"><Input type="text" v-model="addShopData.type" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>名称：</p></Col>
                    <Col span="11"><Input type="text" v-model="addShopData.name"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">电话：</p></Col>
                    <Col span="11"><Input type="text" v-model="addShopData.phone"/></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>总店：</p></Col>
                    <Col span="11"><Input type="text" v-model="addShopData.fatherShop"/></Col>
                    <Col span="2"><p style="position:relative;left:10px;">管理员:</p></Col>
                    <Col span="10"><Input type="text" v-model="addShopData.manager" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>账号：</p></Col>
                    <Col span="11"><Input type="text" v-model="addShopData.account"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">密码:</p></Col>
                    <Col span="11"><Input type="text" v-model="addShopData.password" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>地址:</p></Col>
                    <Col span="23"><Input type="text" v-model="addShopData.address"/></Col>
                </Row>
            </div>
        </Modal>
    </div>
</template>
<script>
import { getAllShop, updateShop, deleteShop } from '@/api/shop'
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
      countPerPage: 6,
      currentPage: 1,
      shopDataCount: 0,
      centerShopData: [],
      subShopData: [],
      routerData: [],
      tableColumns: [
        {
          title: '店铺编码',
          key: 'number',
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
          title: '管理员',
          key: 'manager',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '地址',
          key: 'address',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '电话',
          key: 'phone',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '路由器',
          render: (h, params) => {
            let currentRoute = []
            for (let i = 0; i < params.row.routers.length; ++i) {
              currentRoute.push(params.row.routers[i].id)
            }
            return h('Select', {
              props: {
                multiple: true,
                value: currentRoute
              },
              on: {
                'on-change': (val) => {
                  this.onUpdateRouter(params.row, val)
                }
              }
            }, this.routerData.map((item) => {
              return h('Option', {
                props: {
                  value: item.id,
                  label: item.barCode
                }
              })
            })
            )
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
      currentShopData: {},
      editModal: false,
      addModal: false,
      addShopData: {
        type: 0,
        number: 'FFFFF',
        fatherShop: 'FFFFF',
        name: '默认店铺名字',
        manager: '默认管理员',
        address: '默认地址',
        account: '默认账户',
        password: '默认密码',
        phone: '默认电话'
      }
    }
  },
  created () {
    this.getShopTableData({ page: 0, count: this.countPerPage })
    this.getCenterShop()
    getAllRoute({ page: 0, count: 100 }).then(res => {
      this.routerData = res.data.data
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
      this.getShopTableData({ page: this.currentPage - 1, count: this.countPerPage })
    }
  },
  methods: {
    onUpdateRouter (row, data) {
      let routersInfo = this.routerData.filter((item) => {
        for (let i = 0; i < data.length; ++i) {
          if (item.id === data[i]) {
            return true
          }
        }
        return false
      })
      row.routers = routersInfo
      console.log(row)
      updateShop(row).then(res => {
        this.$Message.info('修改路由器成功')
      })
    },
    getCenterShop () {
      getAllShop({ query: 'type', queryString: 1 }).then(res => {
        this.centerShopData = res.data.data
      })
    },
    getShopTableData ({ page, count, query, queryString }) {
      this.subShopData = []
      var that = this
      that.isTableLoading = true
      getAllShop({ page: page, count: count, query: query, queryString: queryString }).then(res => {
        for (let i = 0; i < res.data.data.length; ++i) {
          if (res.data.data[i].type === 1) {
          } else if (res.data.data[i].type === 0) {
            that.subShopData.push(res.data.data[i])
          }
        }
        that.shopDataCount = res.data.code - that.centerShopData.length
        that.isTableLoading = false
      })
    },
    remove (id) {
      var that = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除该店铺吗？',
        onOk: function () {
          deleteShop(id)
            .then(() => {
              that.getShopTableData({ page: that.currentPage - 1, count: that.countPerPage })
            })
        }
      })
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getShopTableData({ page: 0, count: this.countPerPage })
        this.currentTagPage = 1
        return
      }
      var value = search[key[0]]
      this.getShopTableData({ query: key[0], queryString: value })
    },
    shopReload () {
      this.getShopTableData({ page: this.currentPage - 1, count: this.countPerPage })
    },
    onTableClick (currentRow) {
      this.currentShopData = currentRow
      this.editModal = true
    },
    editOK () {
      updateShop(this.currentShopData).then(res => {
        this.getShopTableData({ page: this.currentPage - 1, count: this.countPerPage })
      })
    },
    addShop () {
      this.addModal = true
    },
    addOK () {
      updateShop(this.addShopData).then(res => {
        this.getShopTableData({ page: 0, count: this.countPerPage })
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
