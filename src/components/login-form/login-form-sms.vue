<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
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
  </Form>
</template>
<script>
import { getVerCode } from '@/api/user'
export default {
  name: 'LoginFormSMS',
  props: {
    phone: {
      type: String,
      default: ''
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
        vercode: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        vercode: this.vercodeRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            phone: this.phone,
            vercode: this.form.vercode
          })
        }
      })
    },
    getVercode () {
      let data = { phoneNumber: this.phone, smsType: 'AUTH' }
      getVerCode(data).then(res => {
        this.$Message.info('获取验证码成功')
      })
    },
    toPswLogin () {
      this.$emit('toPswLogin')
    }
  }
}
</script>
