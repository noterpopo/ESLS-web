<template>
    <div  ref="container" class="regBg" style="height:100%;display: flex;flex-direction: column;flex-wrap: wrap;justify-content: center; align-items: center;align-content: center;">
        <Card v-bind:style="{ width: windowWidth*0.6 + 'px'}">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="姓名" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
                </FormItem>
                <FormItem label="性别" prop="gender">
                    <RadioGroup v-model="formValidate.gender">
                        <Radio label="0">男</Radio>
                        <Radio label="1">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="地址" prop="address">
                    <Input v-model="formValidate.address" placeholder="请输入地址"></Input>
                </FormItem>
                <FormItem label="部门" prop="department">
                    <Input v-model="formValidate.department" placeholder="请输入部门"></Input>
                </FormItem>
                <FormItem label="电话" prop="telephone">
                    <Input v-model="formValidate.telephone" placeholder="请输入电话"></Input>
                </FormItem>
                <FormItem label="密码" prop="passwd">
                    <Input type="password" v-model="formValidate.passwd"></Input>
                </FormItem>
                <FormItem label="重复密码" prop="passwdCheck">
                    <Input type="password" v-model="formValidate.passwdCheck"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">注册</Button>
                    <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script>
import { registryUser } from '@/api/user'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password'))
      } else {
        if (this.formValidate.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入您的密码'))
      } else if (value !== this.formValidate.passwd) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      windowWidth: 0,
      formValidate: {
        name: '',
        address: '',
        department: '',
        gender: '',
        telephone: '',
        passwd: '',
        passwdCheck: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '名字栏不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '地址栏不能为空', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '部门栏不能为空', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别栏不能为空', trigger: 'change' }
        ],
        telephone: [
          { required: true, message: '电话栏不能为空', trigger: 'blur' }
        ],
        passwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
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
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$delete(this.formValidate, 'passwdCheck', this.formValidate.passwdCheck)
          console.log(this.formValidate)
          registryUser(this.formValidate).then(res => {
            this.$Message.success('注册成功!')
          })
        } else {
          this.$Message.error('注册失败!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
<style scoped>
.regBg{
    background-image: url('../../assets/images/login-bg.jpg');
    background-size: cover;
    background-position: center;
}
</style>
