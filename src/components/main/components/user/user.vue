<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <span style="vertical-align:middle;display:inline-block;">{{userName}}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem v-if="hasChangePswAccess" name="changePsw">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal
        v-model="isShowChangePsw"
        title="修改密码"
        @on-ok="onChangePsw">
        <span>
          <p>输入新密码：</p>
          <Input type="text" v-model="newPsw" />
          <p>再次输入新密码：</p>
          <Input type="text" v-model="newPswTwice" />
        </span>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { changePsw } from '@/api/user'
import store from '@/store'
export default {
  name: 'User',
  data () {
    return {
      isShowChangePsw: false,
      newPsw: '',
      newPswTwice: ''
    }
  },
  computed: {
    hasChangePswAccess: () => {
      return store.getters.access.indexOf(2) !== -1
    }
  },
  props: {
    userName: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    onChangePsw () {
      if (this.newPsw === this.newPswTwice) {
        let data = { newPassword: this.newPsw }
        changePsw(data).then(res => {
          this.$Message.info('修改密码成功')
          this.logout()
        })
      } else {
        this.$Message.error('两次输入的密码不一致')
      }
    },
    changePsw () {
      this.isShowChangePsw = true
    },
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'changePsw': this.changePsw()
          break
      }
    }
  }
}
</script>
