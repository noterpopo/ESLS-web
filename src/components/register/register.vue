<template>
    <div>
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
                <FormItem label="邮箱" prop="department">
                    <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
                </FormItem>
                <FormItem label="电话" prop="telephone">
                    <Input v-model="formValidate.telephone" placeholder="请输入电话"></Input>
                </FormItem>
                <FormItem label="店铺" prop="shopId">
                    <Select v-model="formValidate.shopId">
                      <Option v-for="item in shoplist" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="角色" prop="roleList">
                    <Select v-model="formValidate.roleList">
                      <Option v-for="item in rolelist" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
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
    </div>
</template>
<script>
import { registryUser } from '@/api/user'
import { getAllShop } from '@/api/shop'
import { getAllRole } from '@/api/role'
export default {
  name: 'userRedister',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
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
    const selectCheck = (rule, value, callback) => {
      if (value === ''||value===-1) {
        callback(new Error('请选择必填项'))
      } else {
        callback()
      }
    }
    return {
      windowWidth: 0,
      rolelist: [],
      shoplist: [],
      formValidate: {
        roleList: '',
        shopId: -1,
        name: '',
        address: '',
        department: '',
        mail: '',
        gender: '',
        telephone: '',
        passwd: '',
        passwdCheck: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '名字栏不能为空', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '部门栏不能为空', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '邮箱栏不能为空', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别栏不能为空', trigger: 'change' }
        ],
        shopId: [
          { required: true, validator:selectCheck, trigger: 'blur' }
        ],
        roleList: [
          { required: true, validator:selectCheck, trigger: 'blur' }
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
    this.$Message.config({
      duration: 3
    })
    getAllShop({ page: 0, count: 100 }).then(res => {
      this.shoplist = res.data.data
    })
    getAllRole().then(res => {
      this.rolelist = res.data.data
    })
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$delete(this.formValidate, 'passwdCheck', this.formValidate.passwdCheck)
          registryUser(this.formValidate).then(res => {
            this.$Message.success('注册成功!')
            this.$router.push({
              name: 'user_admin'
            })
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
