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
                <Col span="22"><p>角色列表</p></Col>
                <Col span="2"><Button type="primary" @click="addRole">添加角色</Button></Col>
            </Row>
          </div>
          <Collapse v-model="selectRole">
            <Panel v-for="(item,index) in roleData" :key="item.id">
            {{item.name}}
                <Transfer
                  slot="content"
                  :titles="['未获得权限','角色权限']"
                  :list-style="listStyle"
                  :data="allPerData"
                  :target-keys="getRolePerKey(index)"
                  :render-format="renderPermission"
                  @on-change="onTransferChange(index,$event)"></Transfer>
            </Panel>
          </Collapse>
        </Card>
    </div>
</template>
<script>
import { getAllUser, switchUserUsable, deleteUser } from '@/api/user'
import { getAllRole } from '@/api/role'
import { getAllPermissions } from '@/api/permission'
import super_table from '@/components/table/supertable.vue'
import store from '@/store'
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
          title: '角色',
          key: 'roleList',
          render: (h, params) => {
            let roleName = []
            $.ajax({
              url: 'http://39.108.106.167:8086/user/role/' + params.row.id,
              async: false,
              headers: {
                ESLS: store.getters.token
              },
              type: 'get',
              success: (res) => {
                res.data.map((item) => {
                  roleName.push(item.name)
                })
              }
            })
            return h('p', roleName.join(','))
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
      roleData: [],
      selectRole: '',
      allPerData: [],
      listStyle: {
        width: '250px',
        height: '200px'
      }
    }
  },
  created () {
    this.getUserTableData({ page: 0, count: this.countPerPage })
    this.getRoleList()
    this.getPermissionData()
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
    addRole () {},
    getPermissionData () {
      getAllPermissions().then(res => {
        const data = res.data.data
        for (let i = 0; i < data.length; ++i) {
          data[i].id = data[i].id + ''
          Object.assign(data[i], { key: data[i].id })
        }
        this.allPerData = data
      })
    },
    onTransferChange (index, newTargetKeys) {
      this.roleData[index].permissions = this.allPerData.filter((item) => {
        return newTargetKeys.indexOf(item.key) !== -1
      })
    },
    getRolePerKey (index) {
      let res = []
      this.roleData[index].permissions.map((item) => {
        res.push(item.id + '')
      })
      return res
    },
    renderPermission (item) {
      return item.name
    },
    onTableClick (currentRow) {

    },
    getRoleList () {
      getAllRole().then(res => {
        this.roleData = res.data.data
      })
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
