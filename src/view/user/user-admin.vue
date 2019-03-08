<template>
    <div class="container" ref="container">
        <Card :bordered="false" v-bind:style="{ width: windowWidth*0.9 + 'px' }">
          <div slot="title">
            <Row type="flex" justify="center" align="middle">
                <Col span="24"><p>用户列表</p></Col>
            </Row>
          </div>
          <super_table @onClick="onTableClick" :pageSize="countPerPage" :current.sync="currentPage" @onSearch="onTableSearch" :data="userData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="userDataCount"></super_table>
        </Card>
    </div>
</template>
<script>
import { getAllUser } from '@/api/user'
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
          filter: {
            type: 'Input'
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
    }
  }

}
</script>
