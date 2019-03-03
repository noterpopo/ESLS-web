<template>
    <div class="container" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="22"><p>商品信息</p></Col>
                <Col span="2"><Button type="primary" @click="addGood">添加商品</Button></Col>
            </Row>
          </div>
          <super_table  @onSearch="onTableSearch" @onClick="onTableClick" :data="goodData" :columns="tableColumns" :isLoading="isTableLoading" :pageNum="pageNum"></super_table>
        </Card>
        <Modal :width="1040" v-model="editModal" title="修改商品信息" :loading="editOkLoading" @on-ok="asyncEditOK">
          <div>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="2"><p>名称：</p></Col>
                <Col span="10"><Input type="text" v-model="currentSelectedRow.name"/></Col>
                <Col span="2"><p>产地：</p></Col>
                <Col span="10"><Input type="text" v-model="currentSelectedRow.origin" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>供应商：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.provider" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>单位：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.unit" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>操作员：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.operator" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>价格：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.price" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>促销价：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.promotePrice" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>货号：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.shelfNumber" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>规格：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.spec" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>类别：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.category" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>条形码：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.barCode" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>二维码：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.qrCode" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>促销理由：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.promotionReason" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>图片链接：</p></Col>
                <Col span="21"><Input type="text" v-model="currentSelectedRow.imageUrl" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="4"><p>自定义字段1：</p></Col>
                <Col span="20"><Input type="text" v-model="currentSelectedRow.rfu01" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="4"><p>自定义字段2：</p></Col>
                <Col span="20"><Input type="text" v-model="currentSelectedRow.rfu02" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="4"><p>自定义字段3：</p></Col>
                <Col span="20"><Input type="text" v-model="currentSelectedRow.rfus01" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="4"><p>自定义字段4：</p></Col>
                <Col span="20"><Input type="text" v-model="currentSelectedRow.rfus02" /></Col>
            </Row>
          </div>
        </Modal>
        <Modal v-model="addModal" title="添加商品" :loading="addOkLoading" @on-ok="asyncAddOK">
          <div>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>名称：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.name"/></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>产地：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.origin" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>供应商：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.provider" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>单位：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.unit" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>操作员：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.operator" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>价格：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.price" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>促销价：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.promotePrice" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>货号：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.shelfNumber" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>规格：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.spec" /></Col>
            </Row>
             <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>类别：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.category" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>条形码：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.barCode" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>二维码：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.qrCode" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>促销理由：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.promotionReason" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="3"><p>图片链接：</p></Col>
                <Col span="21"><Input type="text" v-model="addGooddata.imageUrl" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="4"><p>自定义字段1：</p></Col>
                <Col span="20"><Input type="text" v-model="addGooddata.rfu01" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="4"><p>自定义字段2：</p></Col>
                <Col span="20"><Input type="text" v-model="addGooddata.rfu02" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="4"><p>自定义字段3：</p></Col>
                <Col span="20"><Input type="text" v-model="addGooddata.rfus01" /></Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="Row">
                <Col span="4"><p>自定义字段4：</p></Col>
                <Col span="20"><Input type="text" v-model="addGooddata.rfus02" /></Col>
            </Row>
          </div>
        </Modal>
    </div>
</template>
<script>
import super_table from '@/components/table/supertable.vue'
import { getAllGood, updateGood, deleteGood } from '@/api/good'
export default {
  components: {
    super_table
  },
  data () {
    return {
      windowWidth: 0,
      isTableLoading: false,
      editOkLoading: true,
      addOkLoading: true,
      addModal: false,
      pageNum: 0,
      countPerPage: 14,
      goodData: [],
      tableColumns: [
        {
          title: 'id',
          key: 'id',
          width: '70',
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
          title: '操作员',
          key: 'operator',
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
          title: '绑定价签',
          key: 'tagIdList',
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
      editModal: false,
      currentSelectedRow: {},
      addGooddata: {
        barCode: '默认条形码',
        category: '默认种类',
        id: 0,
        imageUrl: '',
        name: '默认名字',
        operator: '默认操作员',
        origin: '默认产地',
        price: 0,
        promotePrice: 0,
        promotionReason: '默认促销理由',
        provider: '默认供应商',
        qrCode: '默认二维码',
        regionNames: '',
        rfu01: '',
        rfu02: '',
        rfus01: '',
        rfus02: '',
        shelfNumber: '默认货号',
        spec: '默认规格',
        status: 0,
        unit: '默认单位',
        stock: 0,
        waitUpdate: 0
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
  },
  created () {
    this.getGoodTableData({ page: this.pageNum, count: this.countPerPage })
  },
  methods: {
    getGoodTableData (page, count) {
      var that = this
      that.isTableLoading = true
      getAllGood(page, count).then(res => {
        const data = res.data.data
        that.goodData = data
        that.isTableLoading = false
      })
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      var value = search[key]
      this.getGoodTableData({ page: this.pageNum, count: this.countPerPage, queryId: key[0], queryString: value })
    },
    onTableClick (currentRow) {
      this.currentSelectedRow = this.goodData.find(function (item) { return item.id === currentRow.id })
      this.editModal = true
    },
    remove (id) {
      var that = this
      deleteGood(id).then(res => { that.getGoodTableData({ page: this.pageNum, count: this.countPerPage }) })
    },
    asyncEditOK () {
      var that = this
      updateGood(that.currentSelectedRow).then(res => { that.editModal = false; that.getGoodTableData({ page: this.pageNum, count: this.countPerPage }) })
    },
    addGood () {
      this.addModal = true
    },
    asyncAddOK () {
      var that = this
      updateGood(that.addGooddata).then(res => { that.addModal = false; that.getGoodTableData({ page: this.pageNum, count: this.countPerPage }) })
    }

  }

}
</script>
<style scoped>
.Row{
  margin-bottom: 6px;
}
</style>

<style>
.container{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: stretch;
    align-content: center;
}
</style>
