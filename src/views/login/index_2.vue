<template>
  <div class="login-page">
    <form class="login-form" @submit.prevent="handleSubmit">
      <h2 class="title">登录</h2>
      <div class="form-group">
        <label for="username">用户名</label>
        <input id="username" v-model="username" type="text" placeholder="请输入用户名" required>
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input id="password" v-model="password" type="password" placeholder="请输入密码" required>
      </div>
      <button type="submit" class="btn btn-primary">登录</button>
    </form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleSubmit() {
      const data = {
        username: this.username,
        password: this.password
      }
      login(data).then(response => {
        window.localStorage.setItem('token', response.data)
        this.$message({
          type: 'success',
          message: response.message
        })
        this.$router.push('/dashboard')
      }).catch(error => {
        console.log(error)
      })
      // 处理用户登录逻辑
      // 可以通过调用后端API来验证用户凭证
      // 如果验证通过，则可以跳转到主页或者其他需要认证的页面
    }
  }
}
</script>

<style>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  width: 400px;
  padding: 40px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
}

.title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-size: 16px;
}

.input {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  background-color: #0084ff;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>
