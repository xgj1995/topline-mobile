<template>
  <div>
    <form action="">
    <van-nav-bar title="登录" class="login-top"></van-nav-bar>
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          required
          clearable
          label="手机号"
          placeholder="请输入手机号"
          v-validate="'required: true,mobile: /^\d{11}$/'"
          name="mobile"
          :error-message="errors.first('mobile')"
        />
        <van-field
        v-model="user.code"
        type="password"
        label="密码"
        placeholder="请输入密码"
        v-validate="'required'"
        name="password"
        :error-message="errors.first('password')"
         />
      </van-cell-group>
      <div class="btn-login-box">
          <van-button type="info" :loading="loding" loading-text="加载中..." class="btn-login" @click.prevent="handleLogin">登录</van-button>
      </div>
    </form>
  </div>
</template>

<script>

import { login } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      loding: false
      // errors:{
      //   mobile:'',
      //   code:''
      // }
    }
  },
  created () {
    this.errorsMessages()
  },
  methods: {
    // 登录
    async handleLogin () {
      // const regMobile = /^\d{11}$/
      // const regPassword = /^\w{6,13}$/
      try {
        // if(this.user.mobile.trim().length === 0) {
        //   return this.errors.mobile = '用户名不能为空'
        // } else if (!regMobile.test(this.user.mobile.trim())) {
        //   this.errors.mobile = '请输入正确的手机号码'
        // } else {
        //   this.errors.mobile = ''
        // }
        // //  if(this.user.mobile.length === 0) {
        // //   return this.errors.mobile = '密码不能为空'
        // // } else {
        // //   this.errors.mobile = ''
        // // }
        // if(this.user.code.length === 0) {
        //   return this.errors.code = '密码不能为空'
        // } else if(!regPassword.test(this.user.code)) {
        //   this.errors.code = '密码至少为6位'
        // } else {
        //   this.errors.code = ''
        // }
        // 表单验证
        const valid = await this.$validator.validate()
        console.log(valid)
        if (!valid) {
          return
        }
        this.loding = true
        const res = await login(this.user)
        this.$store.commit('setUser', res)// 设置用户登录token
        // this.$notify('登录成功');//颜色不知怎么更改
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (err) {
        // Notify('登录失败')
        this.$notify('登录失败')
        console.log(err)
      }
      this.loding = false
    },
    errorsMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空',
            mobile: '请输入一个有效的手机号'
          },
          password: {
            required: '验证码不能为空',
            password: '请输入一个有效的验证码'
          }
        }
      }
      // or use the instance method
      this.$validator.localize('zh_CN', dict)
    }

  }
}
</script>

<style lang="less" scopen>
.login-top {
  background-color: #3296fa;
}
.login-top /deep/ .van-nav-bar__title {
  color: #fff
}
.btn-login-box{
  margin-top: 20px;
  text-align: center;
  .btn-login{
      width: 80%;
  }
}
</style>
