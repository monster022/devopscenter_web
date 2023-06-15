<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark" />
      </el-col>
    </el-row>
    <div class="change-password-container">
      <el-form ref="passwordForm" :model="passwordData" :rules="passwordRules" class="password-form">
        <h2 class="password-title">修改密码</h2>
        <el-form-item prop="currentPassword">
          <el-input v-model="passwordData.currentPassword" :show-password="showPassword" placeholder="当前密码" type="password" />
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input v-model="passwordData.newPassword" :show-password="showPassword" placeholder="新密码" type="password" />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="passwordData.confirmPassword" :show-password="showPassword" placeholder="确认密码" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword">修改密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { changePassword } from '@/api/user'
import router from '@/router'

export default {
  data() {
    return {
      showPassword: true,
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        currentPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    changePassword() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          // 执行修改密码逻辑
          const data = {
            username: localStorage.getItem('username'),
            currentPassword: this.passwordData.currentPassword,
            newPassword: this.passwordData.newPassword,
            confirmPassword: this.passwordData.confirmPassword
          }
          changePassword(data).then(response => {
            if (response.data === true) {
              this.$message({
                type: 'success',
                message: 'Change Password ' + response.message + ', Please Relogin'
              })
              setTimeout(() => {
                document.cookie = 'vue_admin_template_token' + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
                router.push('/')
              }, 1000)
            } else {
              this.$message({
                type: 'warning',
                message: 'Change Password ' + response.message + ', Please Check Current Password'
              })
            }
          })
          console.log('密码修改成功')
        } else {
          console.log('表单校验失败')
          return false
        }
      })
    },
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.passwordData.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    // toggleShowPassword() {
    //   this.showPassword = !this.showPassword
    // }
  }
}
</script>

<style>
  .change-password-container {
    display: flex;
    margin-left: 50px;
    height: 100vh;
  }

  .password-form {
    width: 300px;
  }

  .password-title {
    text-align: center;
    margin-bottom: 20px;
  }

  .grid-content {
    min-height: 36px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .eye-icon {
    position: absolute;
    top: 38px;
    right: 10px;
    cursor: pointer;
  }

  .eye-icon:hover {
    color: #409EFF;
  }

</style>
