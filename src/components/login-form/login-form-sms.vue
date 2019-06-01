<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="phoneNumber">
      <Input v-model="form.phone" placeholder="请输入手机号码">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="verCode">
      <Input v-model="form.vercode" placeholder="请输入验证码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="getVercode" type="primary" long>获取验证码</Button>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
    <FormItem>
      <Button @click="toPswLogin" type="primary" long>密码登陆</Button>
    </FormItem>
  </Form>
</template>
<script>
import { getVerCode } from '@/api/user'
export default {
  name: 'LoginFormSMS',
  props: {
    phoneRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ]
      }
    },
    vercodeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        phone: '',
        vercode: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        phone: this.phoneRules,
        vercode: this.vercodeRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            phone: this.form.phone,
            vercode: this.form.vercode
          })
        }
      })
    },
    getVercode () {
      let data = { phoneNumber: this.form.phone, smsType: 'AUTH' }
      getVerCode(data)
    },
    toPswLogin () {
      this.$emit('toPswLogin')
    }
  }
}
</script>
