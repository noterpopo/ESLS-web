<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form v-if="!isSMS" @on-success-valid="handleSubmit" @toSMSLogin="toSMSLogin"></login-form>
          <LoginFormSMS v-if="isSMS" :phone="phone" @on-success-valid="handleSubmitSMS" @toPswLogin="toPswLogin"></LoginFormSMS>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form/login-form.vue'
import LoginFormSMS from '_c/login-form/login-form-sms.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm,
    LoginFormSMS
  },
  data () {
    return {
      isSMS: false,
      phone: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      let type = 1
      this.handleLogin({ userName, password, type }).then(res => {
        console.log(res)
        if (res.data.data.loginType === 'username') {
          this.$router.push({
            name: this.$config.homeName
          })
        } else {
          this.isSMS = true
        }
      }).catch(error => {
        if (error.data.code === 20015) {
          this.phone = error.data.data
          this.$Message.info('该账户需要短信二次验证')
          this.isSMS = true
        }
      })
    },
    handleSubmitSMS ({ phone, vercode }) {
      let type = 2
      console.log(phone)
      console.log(vercode)
      let userName = phone
      let password = vercode
      this.handleLogin({ userName, password, type }).then(res => {
        this.$router.push({
          name: this.$config.homeName
        })
      })
      // SMSlogin({phoneNumber:phone,userCode:vercode,smsType:'AUTH'}).then(res => {
      //   this.$router.push({
      //     name: this.$config.homeName
      //   })
      // })
    },
    toPswLogin () {
      this.isSMS = false
    },
    toSMSLogin () {
      this.isSMS = true
    }
  }
}
</script>

<style>

</style>
