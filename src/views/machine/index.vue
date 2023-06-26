<template>
  <div class="app-container">
    <!-- 表头 -->
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="additionOpen()">添加实例</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading.fullscreen.lock="fullscreenLoading"
      :data="list"
      element-loading-text="小老弟莫急 正玩命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.7)"
      fit
      stripe
      max-height="815"
      highlight-current-row
    >
      <el-table-column label="序号" width="95" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="名称" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.instance_name }}
        </template>
      </el-table-column>
      <el-table-column label="地址" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.instance_ip }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.instance_username }}
        </template>
      </el-table-column>
      <el-table-column label="CPU" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.instance_cpu }}
        </template>
      </el-table-column>
      <el-table-column label="内存" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.instance_memory }}
        </template>
      </el-table-column>
      <el-table-column label="标签" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.instance_tag | tagFilter">{{ scope.row.instance_tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300"
        header-align="center"
      >
        <template slot-scope="{row}">
          <el-button v-if="row.instance_tag === 'CentOS' || row.instance_tag === 'Rancher'" type="text" size="small" icon="el-icon-monitor" @click="openTerminal(row)">终端</el-button>
          <el-button type="text" size="small" icon="el-icon-view" @click="showPassword(row)">查看密码</el-button>
          <el-button type="text" size="small" icon="el-icon-edit" @click="openConfiguration(row)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" @click="deleteMachine(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination layout="total, prev, pager, next" :total="total" hide-on-single-page :current-page.sync="currentPage" :page-size="size" @prev-click="pageChange" @next-click="pageChange" @current-change="pageChange" />

    <!-- 添加 子表单 -->
    <el-dialog :visible.sync="additionDialogVisible" width="600px" :title="'添加实例'">
      <el-form ref="additionFrom" :model="additionFrom" :rules="additionRules">
        <el-form-item label="实例名" label-width="100px" prop="instance_name">
          <el-input v-model="additionFrom.instance_name" style="width: 400px;" placeholder="请输入名称"><i slot="suffix" class="el-icon-edit el-input__icon" /></el-input>
        </el-form-item>
        <el-form-item label="地址" label-width="100px" prop="instance_ip">
          <el-input v-model="additionFrom.instance_ip" style="width: 400px" placeholder="请输入IP"><i slot="suffix" class="el-icon-edit el-input__icon" /></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户名" label-width="100px" prop="instance_username">
              <el-input v-model="additionFrom.instance_username" style="width: 150px" placeholder="请输入用户名"><i slot="suffix" class="el-icon-edit el-input__icon" /></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码" label-width="165px" prop="instance_password">
              <el-input v-model="additionFrom.instance_password" style="width: 150px" placeholder="请输入密码"> <i slot="suffix" class="el-icon-edit el-input__icon" /></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="CPU" label-width="100px" prop="instance_cpu">
              <el-select v-model="additionFrom.instance_cpu" style="width: 150px;" placeholder="请选择CPU数">
                <el-option label="2" value="2" />
                <el-option label="4" value="4" />
                <el-option label="8" value="8" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="内存" label-width="165px" prop="instance_memory">
              <el-select v-model="additionFrom.instance_memory" style="width: 150px" placeholder="请选择内存数">
                <el-option label="4" value="4" />
                <el-option label="8" value="8" />
                <el-option label="16" value="16" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="标签" label-width="100px" prop="instance_tag">
          <el-select v-model="additionFrom.instance_tag" style="width: 400px" placeholder="请选择标签">
            <el-option label="CentOS" value="CentOS" />
            <el-option label="Win" value="Win" />
            <el-option label="Rancher" value="Rancher" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="medium" @click="additionDialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="additionSubmit('additionFrom')">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 子表单 -->
    <el-dialog :visible.sync="openDetailDialogVisible" width="600px" :title="'修改实例'">
      <el-form :model="editFrom">
        <el-form-item label="实例名称" label-width="100px">
          <el-input v-model="editFrom.instance_name" style="width: 400px;" />
        </el-form-item>
        <el-form-item label="地址" label-width="100px">
          <el-input v-model="editFrom.instance_ip" :disabled="true" style="width: 400px" />
        </el-form-item>
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="editFrom.instance_username" :disabled="true" style="width: 400px" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="CPU" label-width="100px">
              <el-input v-model="editFrom.instance_cpu" :disabled="true" style="width: 150px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="内存" label-width="160px">
              <el-input v-model="editFrom.instance_memory" :disabled="true" style="width: 150px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="标签" label-width="100px">
          <el-input v-model="editFrom.instance_tag" :disabled="true" style="width: 400px" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="medium" @click="openDetailDialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="editSubmit()">确定</el-button>
      </div>
    </el-dialog>

    <!-- terminal -->
    <el-dialog :visible.sync="openTerminalDialogVisible" width="970px" :title="'Terminal'">
      <Terminal :hostname="hostName" :ip="instanceIp" :name="instanceUsername" />
    </el-dialog>

  </div>
</template>

<script>
import { getList, getPassWordList, deleteList, addMachine, patchMachineName } from '@/api/machine'
import Terminal from './console.vue'

export default {
  components: {
    Terminal
  },
  filters: {
    tagFilter(tag) {
      const tagMap = {
        CentOS: 'success',
        Win: 'gray',
        Rancher: 'danger'
      }
      return tagMap[tag]
    }
  },
  data() {
    return {
      list: null,
      fullscreenLoading: false,
      // 分页设置
      total: null,
      currentPage: 1,
      size: 13,
      openDetailDialogVisible: false,
      editFrom: {
        id: null,
        instance_name: '',
        instance_ip: '',
        instance_username: '',
        instance_cpu: '',
        instance_memory: '',
        instance_tag: ''
      },
      additionDialogVisible: false,
      additionFrom: {
        instance_name: '',
        instance_ip: '',
        instance_username: '',
        instance_password: '',
        instance_cpu: '',
        instance_memory: '',
        instance_tag: ''
      },
      additionRules: {
        instance_name: [{ required: true, message: '必须输入实例名', trigger: 'blur' }],
        instance_ip: [{ required: true, message: '必须输入实例IP', trigger: 'blur' }],
        instance_username: [{ required: true, message: '必须输入用户名', trigger: 'blur' }],
        instance_password: [{ required: true, message: '必须输入密码', trigger: 'blur' }],
        instance_cpu: [{ required: true, message: '必须选择CPU数', trigger: 'blur' }],
        instance_memory: [{ required: true, message: '必须输入内存数', trigger: 'blur' }],
        instance_tag: [{ required: true, message: '必须输入标签', trigger: 'blur' }]
      },
      // 子组件使用数据
      openTerminalDialogVisible: false,
      hostName: '',
      instanceIp: '',
      instanceUsername: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.fullscreenLoading = true
      const params = {
        page: 1,
        size: this.size
      }
      getList(params).then(response => {
        this.list = response.data
        this.total = response.total
      })
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 500)
    },

    additionOpen() {
      this.additionFrom.instance_name = ''
      this.additionFrom.instance_ip = ''
      this.additionFrom.instance_username = ''
      this.additionFrom.instance_password = ''
      this.additionFrom.instance_cpu = ''
      this.additionFrom.instance_memory = ''
      this.additionFrom.instance_tag = ''
      this.additionDialogVisible = true
    },

    additionSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            instance_name: this.additionFrom.instance_name,
            instance_ip: this.additionFrom.instance_ip,
            instance_username: this.additionFrom.instance_username,
            instance_password: this.additionFrom.instance_password,
            instance_cpu: parseInt(this.additionFrom.instance_cpu),
            instance_memory: parseInt(this.additionFrom.instance_memory),
            instance_tag: this.additionFrom.instance_tag
          }
          addMachine(data).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            })
          })
          this.additionDialogVisible = false
          setTimeout(() => {
            this.fetchData()
            this.currentPage = 1
          }, 500)
        } else {
          return false
        }
      })
    },

    pageChange(val) {
      this.fullscreenLoading = true
      const params = {
        page: val,
        size: this.size
      }
      getList(params).then(response => {
        this.list = response.data
        this.total = response.total
      })
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 500)
    },

    showPassword(val) {
      const params = {
        id: val.id
      }
      getPassWordList(params).then(response => {
        this.$alert(response.data, val.instance_ip + ' 服务器密码', {
          dangerouslyUseHTMLString: true
        })
      })
    },

    openConfiguration(val) {
      this.editFrom.id = val.id
      this.editFrom.instance_name = val.instance_name
      this.editFrom.instance_ip = val.instance_ip
      this.editFrom.instance_username = val.instance_username
      this.editFrom.instance_cpu = val.instance_cpu
      this.editFrom.instance_memory = val.instance_memory
      this.editFrom.instance_tag = val.instance_tag
      this.openDetailDialogVisible = true
    },

    editSubmit() {
      const params = {
        name: this.editFrom.instance_name
      }
      patchMachineName(this.editFrom.id, params).then(response => {
        this.$message({
          type: 'success',
          message: response.message
        })
      })
      this.openDetailDialogVisible = false
      setTimeout(() => {
        this.fetchData()
        this.currentPage = 1
      }, 500)
    },

    deleteMachine(val) {
      const params = {
        id: val.id
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteList(params).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
        })
        this.fetchData()
        this.currentPage = 1
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    openTerminal(val) {
      this.instanceIp = val.instance_ip
      this.instanceUsername = val.instance_username
      this.hostName = '[' + val.instance_username + '@' + val.instance_ip + '_' + val.instance_name + ' ~]# '
      this.openTerminalDialogVisible = true
    }
  }
}
</script>

<style>
</style>
