<template>
    <div style="display: flex;flex-direction: column;flex-wrap: wrap;justify-content: flex-start; align-items: center;align-content: center;" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="22"><p>用户列表</p></Col>
                <Col span="2"><Button v-if="hasUserAccess" type="primary" @click="addUser">添加用户</Button></Col>
            </Row>
          </div>
          <super_table @onClick="onTableClick" :pageSize="countPerPage" :current.sync="currentPage" @onDoubleClick="onTableDoubleClick" @onSearch="onTableSearch" :data="userData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="userDataCount"></super_table>
        </Card>
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.98 + 'px' ,marginTop:'10px'}">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="22"><p>角色列表</p></Col>
                <Col span="2"><Button v-if="hasUserAccess" type="primary" @click="addRole">添加角色</Button></Col>
            </Row>
          </div>
          <Collapse v-model="selectRole" accordion>
            <Panel v-for="(item,index) in roleData" :name="item.id+''" :key="item.id">
            {{item.name}}
                <div slot="content">
                  <Transfer
                  v-if="hasUserAccess"
                    :titles="['未获得权限','角色权限']"
                    :list-style="listStyle"
                    :data="allPerData"
                    :target-keys="getRolePerKey(index)"
                    :render-format="renderPermission"
                    @on-change="onTransferChange(index,arguments)"></Transfer>
                    <Button v-if="hasUserAccess" type="primary" style="margin-top:10px;" @click="delRole">删除角色</Button>
                </div>
            </Panel>
          </Collapse>
        </Card>
        <Modal :width="1040" v-model="editModal" title="修改用户信息" @on-ok="asyncEditOK">
          <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>名字：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.name"/></Col>
                    <Col span="1"><p style="position:relative;left:10px;">部门</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.department" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>电话：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.telephone" /></Col>
                    <Col span="1"><p style="position:relative;left:10px;">邮件：</p></Col>
                    <Col span="11"><Input type="text" v-model="currentSelectedRow.mail" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="1"><p>地址：</p></Col>
                    <Col span="23"><Input type="text" v-model="currentSelectedRow.address" /></Col>
                </Row>
        </Modal>
        <Modal :width="1040" v-model="addUserModal" title="添加用户" :footer-hide="true">
          <userRedister></userRedister>
        </Modal>
    </div>
</template>
<script>
import { getAllUser, switchUserUsable, updateUser, updateRole, deleteUser, adminChangePsw } from '@/api/user'
import { getAllRole, addPerm, delPerm, addRole, delRole } from '@/api/role'
import { getAllPermissions } from '@/api/permission'
import { getAllShop } from '@/api/shop'
import store from '@/store'
import super_table from '@/components/table/supertable.vue'
import userRedister from '@/components/register/register.vue'
export default {
  components: {
    super_table,
    userRedister
  },
  data () {
    return {
      addUserModal: false,
      currentSelectedRow: {},
      editModal: false,
      windowWidth: 0,
      isTableLoading: false,
      countPerPage: 10,
      currentPage: 1,
      userDataCount: 0,
      userData: [],
      shopData: [],
      tableColumns: [
        {
          title: '名字',
          key: 'name',
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
          width: '200',
          render: (h, params) => {
            let currentRole = []
            for (let i = 0; i < params.row.roleList.split(' ').length; ++i) {
              currentRole.push(parseInt(params.row.roleList.split(' ')[i]))
            }
            return h('Select', {
              props: {
                value: currentRole[0],
                transfer: true,
                disabled: !this.hasUserAccess
              },
              attrs: {
                style: 'padding-left:10px;padding-right:10px;text-align:left;'
              },
              on: {
                'on-change': (val) => {
                  this.onUpdateRole(params.row, val)
                }
              }
            }, this.roleData.map((item) => {
              return h('Option', {
                props: {
                  value: item.id,
                  label: item.name
                }
              })
            })
            )
          }
        },
        {
          title: '商店',
          key: 'shop',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: params.row.shopId,
                transfer: true,
                disabled: !this.hasUserAccess
              },
              attrs: {
                style: 'padding-left:10px;padding-right:10px;text-align:left;'
              },
              on: {
                'on-change': (val) => {
                  this.onUpdateShop(params.row, val)
                }
              }
            }, this.shopData.map((item) => {
              return h('Option', {
                props: {
                  value: item.id,
                  label: item.name
                }
              })
            })
            )
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
                size: 'large',
                disabled: !this.hasUserAccess
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
          }
        },
        {
          title: '短信验证',
          render: (h, params) => {
            const row = params.row
            const needSMS = row.loginType !== 'username'
            return h('i-switch', {
              props: {
                value: needSMS,
                size: 'large',
                disabled: !this.hasUserAccess
              },
              on: {
                'on-change': (val) => {
                  if (val) {
                    params.row.loginType = 'phone'
                  } else {
                    params.row.loginType = 'username'
                  }
                  delete params.row.createTime
                  delete params.row.lastLoginTime
                  updateUser(params.row)
                }
              }
            }, [
              h('span', {
                slot: 'open'
              }, '开启'),
              h('span', {
                slot: 'close'
              }, '关闭')
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: '150',
          render: (h, params) => {
            let data = {}
            let tparams = {}
            let items = []
            tparams = {}
            this.$set(tparams, 'query', 'id')
            this.$set(tparams, 'queryString', params.row.id)
            items.push(tparams)
            this.$set(data, 'items', items)
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: !this.hasUserAccess
                },
                style: {
                  margin: '2px'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    this.adminChangePsw(data)
                  }
                }
              }, '修改密码'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: !this.hasUserAccess
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
      },
      addRoleName: '',
      addRoleType: ''
    }
  },
  created () {
    this.getUserTableData({ page: 0, count: this.countPerPage })
    this.getRoleList()
    this.getPermissionData()
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
      this.getUserTableData({ page: this.currentPage - 1, count: this.countPerPage })
    }
  },
  computed: {
    hasUserAccess: () => {
      return store.getters.access.indexOf(1) !== -1
    }
  },
  methods: {
    adminChangePsw (data) {
      let newPsw = ''
      this.$Modal.confirm({
        title: '修改密码',
        render: (h, params) => {
          return h('div', [
            h('p', '输入新密码'),
            h('Input', {
              props: {
                value: newPsw
              },
              on: {
                'on-change': (event) => {
                  newPsw = event.target.value
                }
              }
            })
          ])
        },
        onOk: () => {
          adminChangePsw(data, newPsw).then(res => {
            this.$Message.info('修改密码成功')
          })
        }
      })
    },
    asyncEditOK () {
      this.editModal = false
      delete this.currentSelectedRow.createTime
      delete this.currentSelectedRow.lastLoginTime
      updateUser(this.currentSelectedRow).then(res => {
        this.getUserTableData({ page: 0, count: this.countPerPage })
        this.$Message.info('修改成功')
      })
    },
    onTableDoubleClick (currentRow) {
      if (!this.hasUserAccess) {
        return
      }
      this.currentSelectedRow = currentRow
      this.editModal = true
    },
    onUpdateShop (userdata, newshopId) {
      userdata.shopId = newshopId
      delete userdata.createTime
      delete userdata.lastLoginTime
      console.log(userdata)
      updateUser(userdata)
    },
    onUpdateRole (row, val) {
      if (row.roleList === '1 ') {
        this.$Modal.confirm({
          title: '警告',
          content: '确定更换该用户总店管理员角色吗？',
          onOk: () => {
            updateRole(val, row.id)
          },
          onCancel: () => {
            this.getUserTableData({ page: this.currentPage - 1, count: this.countPerPage })
          }
        })
      } else {
        updateRole(val, row.id)
      }
    },
    addRole () {
      this.$Modal.confirm({
        title: '新角色信息',
        render: (h, params) => {
          var that = this
          return h('span', [
            h('Input', {
              prop: {
                placeholder: '输入名字',
                value: this.addRoleName
              },
              on: {
                'on-change': (event) => {
                  that.addRoleName = event.target.value
                }
              }
            }),
            h('Select', {
              props: {
                value: this.addRoleType,
                transfer: true
              },
              attrs: {
                style: 'margin-top:10px'
              },
              on: {
                'on-change': function (val) {
                  that.addRoleType = val
                }
              }
            }, [
              h('Option', {
                props: {
                  value: '最高权限',
                  label: '最高权限'
                }
              }),
              h('Option', {
                props: {
                  value: '中级权限',
                  label: '中级权限'
                }
              }),
              h('Option', {
                props: {
                  value: '低级权限',
                  label: '低级权限'
                }
              })
            ])
          ])
        },
        onOk: () => {
          addRole(this.addRoleName, this.addRoleType).then(res => {
            this.$Message.info('添加角色成功')
            this.getRoleList()
          })
        }
      })
    },
    delRole () {
      delRole(this.selectRole).then(
        this.getRoleList()
      )
    },
    getPermissionData () {
      getAllPermissions().then(res => {
        const data = res.data.data
        for (let i = 0; i < data.length; ++i) {
          data[i].id = data[i].id + ''
          Object.assign(data[i], { key: data[i].id })
        }
        console.log(data)
        this.allPerData = data
      })
    },
    onTransferChange (index, argu) {
      let newTargetKeys = argu[2]
      let direction = argu[1]
      if (direction === 'left') {
        let params = { collectionIds: [], ids: [] }
        let cIds = []
        for (let i = 0; i < newTargetKeys.length; ++i) {
          cIds.push(parseInt(newTargetKeys[i]))
        }
        params.collectionIds.push(cIds)
        params.ids.push(parseInt(this.selectRole[0]))
        delPerm(params)
        this.roleData[index].permissions = this.roleData[index].permissions.filter((item) => {
          console.log(newTargetKeys)
          return newTargetKeys.indexOf(item.id + '') === -1
        })
      } else if (direction === 'right') {
        let params = { collectionIds: [], ids: [] }
        let cIds = []
        for (let i = 0; i < newTargetKeys.length; ++i) {
          if (this.roleData[index].permissions.indexOf(newTargetKeys[i]) === -1) {
            cIds.push(parseInt(newTargetKeys[i]))
          }
        }
        params.collectionIds.push(cIds)
        params.ids.push(parseInt(this.selectRole[0]))
        addPerm(params)
        let addPer = this.allPerData.filter((item) => {
          return newTargetKeys.indexOf(item.key) !== -1
        })
        this.roleData[index].permissions = this.roleData[index].permissions.concat(addPer)
      }
    },
    getRolePerKey (index) {
      let res = []
      this.roleData[index].permissions.map((item) => {
        res.push(item.id + '')
      })
      console.log(res)
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
    },
    addUser () {
      this.addUserModal = true
    }
  }

}
</script>

<style scoped>
.Row{
  margin-bottom: 6px;
}
</style>
