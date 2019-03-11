<template>
    <div style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>用户列表</p></Col>
            </Row>
          </div>
          <super_table @onClick="onTableClick" :pageSize="countPerPage" :current.sync="currentPage" @onSearch="onTableSearch" :data="userData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="userDataCount"></super_table>
        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' ,marginTop:'10px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>持有权限列表</p></Col>
            </Row>
          </div>
          <super_table :pageSize="countPerPage" :current.sync="currentPerPage" @onSearch="onTablePerSearch" :data="perData" :columns="tablePerColumns" :isLoading="isPerTableLoading" :dataNum="perDataCount"></super_table>
        </Card>
    </div>
</template>
<script>
import { getAllUser, switchUserUsable, deleteUser, getRoleInfo } from '@/api/user'
// import { getRoleList } from '@/api/role'
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
      userDataCount: 0,
      userData: [],
      tableColumns: [
        {
          title: '名字',
          key: 'name',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '性别',
          key: 'sex',
          render: (h, params) => {
            const text = params.row.sex === 0 ? '男' : '女'
            return h('p', {
            }, text)
          },
          filter: {
            type: 'Input'
          }
        },
        {
          title: '电话',
          key: 'telephone',
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
          title: '部门',
          key: 'department',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            const row = params.row
            const isUsable = row.status === 1
            return h('i-switch', {
              props: {
                value: isUsable,
                size: 'large'
              },
              on: {
                'on-change': (val) => {
                  if (val) {
                    params.row.status = 1
                  } else {
                    params.row.status = 0
                  }
                  switchUserUsable(params.row.id).then(res => {
                  })
                }
              }
            }, [
              h('span', {
                slot: 'open'
              }, '启用'),
              h('span', {
                slot: 'close'
              }, '禁用')
            ])
          },
          filter: {
            type: 'Input'
          }
        },
        {
          title: '商店',
          key: 'shop',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '角色',
          key: 'roleList',
          render: (h, params) => {
            var roleNameList = []
            getRoleInfo(params.row.id).then(res => {
              for (let i = 0; i < res.data.data.length; ++i) {
                roleNameList.push(res.data.data[i].name)
              }
            })
            return h('p', {
              domProps: {
                innerHTML: roleNameList.join(',')
              }
            })
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
      ]
    }
  },
  created () {
    this.getUserTableData({ page: 0, count: this.countPerPage })
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
      this.getUserTableData({ page: this.currentPage - 1, count: this.countPerPage })
    }
  },
  methods: {
    onTableClick () {

    },
    onTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getUserTableData({ page: 0, count: this.countPerPage })
        this.currentTagPage = 1
        return
      }
      var value = search[key[0]]
      this.getUserTableData({ query: key[0], queryString: value })
    },
    getUserTableData ({ page, count, query, queryString }) {
      var that = this
      that.isTableLoading = true
      getAllUser({ page: page, count: count, query: query, queryString: queryString }).then(res => {
        that.userData = res.data.data
        that.userDataCount = res.data.code
        that.isTableLoading = false
      })
    },
    remove (id) {
      var that = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除该用户吗？',
        onOk: function () {
          deleteUser(id)
            .then(() => {
              that.getUserTableData({ page: that.currentPage - 1, count: that.countPerPage })
            })
        }
      })
    }
  }

}
</script>
