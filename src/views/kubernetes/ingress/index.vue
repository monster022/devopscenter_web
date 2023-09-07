<template>
  <div class="app-contianer">
    <div style="float: left; margin-left:20px; margin-top:20px;">
      <label style="width: 80px; font-weight: normal;">环境</label>
      <el-select v-model="title.env" style="width: 200px; margin-left:20px;" placeholder="请选择环境" @change="envChange()">
        <el-option label="dev" value="dev" />
        <el-option label="uat" value="uat" />
        <el-option label="fat" value="fat" />
        <el-option label="pro" value="pro" />
      </el-select>
      <label style="width: 80px; margin-left:20px; font-weight: normal;">名称空间</label>
      <el-select v-model="title.namespace" style="width: 200px; margin-left:20px" placeholder="请选择名称空间" @change="namespaceChange()">
        <el-option v-for="(item, index) in namespaceList" :key="index" :label="item.metadata.name" :value="item.metadata.name" />
      </el-select>
    </div>
    <div style="float: right; margin-right: 20px; margin-top: 20px;">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addResource()">添加资源</el-button>
    </div>

    <el-table :data="list" max-height="780">
      <el-table-column type="expand" width="95" header-align="center" align="center">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item v-for="(item, index) in parseData(scope.row.data)" :key="index" label="路由">
              <span>{{ item.path }}</span>
              <span class="arrow">-&gt;</span>
              <span>{{ item.target_service }}</span>
              <span class="arrow">-&gt;</span>
              <span>{{ item.target_port }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="95" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="名称" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="域名" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.domain }}
        </template>
      </el-table-column>
      <el-table-column label="数据" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.data }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" @click="editOpen(scope.row)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加Ingress资源" :visible.sync="addResourceDialogVisible" width="600px" center>
      <el-form ref="addResourceForm" :model="addResourceForm" :rules="addResourceFormFules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="环境" prop="env">
              <el-select v-model="addResourceForm.env" style="width: 150px" placeholder="请选择环境" @change="envChangeV2()">
                <el-option label="dev" value="dev" />
                <el-option label="uat" value="uat" />
                <el-option label="fat" value="fat" />
                <el-option label="pro" value="pro" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称空间" prop="namespace">
              <el-select v-model="addResourceForm.namespace" style="width: 150px" placeholder="请选择名称空间">
                <el-option v-for="(item, index) in namespaceListV2" :key="index" :label="item.metadata.name" :value="item.metadata.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="名称" prop="name">
          <el-input v-model="addResourceForm.name" style="width: 425px;" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="域名" prop="domain">
          <el-input v-model="addResourceForm.domain" style="width: 425px;" placeholder="请输入域名" />
        </el-form-item>
        <el-form-item label="开启跳转">
          <el-switch v-model="addResourceForm.rewrite" placeholder="请输入域名" />
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item v-for="(item, index) in addResourceForm.rules" :key="index" :label="'路由 ' + index">
              <el-input v-model="item.path" style="width: 425px;" placeholder="请输入路径" />
              <el-input v-model="item.target_service" style="width: 160px; margin-top: 20px;" placeholder="请选择后端服务" />
              <el-input v-model="item.target_port" style="width: 160px; margin-top: 20px; margin-left: 20px;" placeholder="请选择后端端口" />
              <el-button type="danger" size="small" circle icon="el-icon-minus" style="margin-left: 30px;" @click="removeRules(index)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="70px">
          <el-button type="primary" size="small" icon="el-icon-plus" circle @click="addRules" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="addResourceDialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="addResourceSubmit('addResourceForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="更新Ingress资源" :visible.sync="updateResourceDialogVisible" width="600px" center>
      <el-form :model="editForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="环境">
              <el-input v-model="editForm.env" :disabled="true" style="width: 150px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称空间">
              <el-input v-model="editForm.namespace" :disabled="true" style="width: 150px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="名称">
          <el-input v-model="editForm.name" style="width: 425px;" />
        </el-form-item>
        <el-form-item label="域名">
          <el-input v-model="editForm.domain" style="width: 425px;" />
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item v-for="(item, index) in editForm.rules" :key="index" :label="'路由 ' + index">
              <el-input v-model="item.path" style="width: 425px;" placeholder="请输入路径" />
              <el-input v-model="item.target_service" style="width: 160px; margin-top: 20px;" placeholder="请选择后端服务" />
              <el-input v-model="item.target_port" style="width: 160px; margin-top: 20px; margin-left: 20px;" placeholder="请选择后端端口" />

              <el-button type="danger" size="small" circle icon="el-icon-minus" style="margin-left: 30px;" @click="editRemoveRules(index)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-plus" circle @click="editAddRules()" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="updateResourceDialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="updateResourceDialogVisible = false">确 定</el-button>
        <el-button size="medium" type="danger" @click="updateResourceDialogVisible = false">还原配置</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getNameSpaceList } from '@/api/namespace'
import { getIngressListV2, postIngress } from '@/api/ingress'

export default {
  data() {
    return {
      // 添加资源弹框
      addResourceDialogVisible: false,
      addResourceForm: {
        env: '',
        namespace: '',
        name: '',
        domain: '',
        rewrite: false,
        rules: [{ path: '', target_service: '', target_port: null }]
      },
      // 更新资源弹框
      updateResourceDialogVisible: false,
      editForm: {
        env: '',
        namespace: '',
        name: '',
        domain: '',
        rewrite: '',
        rules: [{ path: '', target_service: '', target_port: null }]
      },
      // 校验表单中数据
      addResourceFormFules: {
        env: [
          { required: true, message: '请选择环境', trigger: 'change' }
        ],
        namespace: [
          { required: true, message: '请选择名称空间', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { pattern: /^[a-z0-9\-]+$/, message: '只能输入小写字母、数字和连字符(-)' },
          { max: 30, message: '名称不能超过30个字符', trigger: 'blur' }
        ],
        domain: [
          { required: true, message: '请输入域名, e.g. www.chengduoduo.com', trigger: 'blur' }
        ]
      },
      // 表中数据
      list: null,
      title: {
        env: 'dev',
        namespace: ''
      },
      namespaceList: [],
      namespaceListV2: []
    }
  },
  created() {
    const params = {
      env: 'dev'
    }
    getNameSpaceList(params).then(response => {
      this.namespaceList = response.data
    })
  },
  methods: {
    addRules() {
      this.addResourceForm.rules.push({ path: '', target_service: '', target_port: '' })
    },
    removeRules(index) {
      this.addResourceForm.rules.splice(index, 1)
    },
    editAddRules() {
      this.editForm.rules.push({ path: '', target_service: '', target_port: '' })
    },
    editRemoveRules(index) {
      this.editForm.rules.splice(index, 1)
    },
    parseData(data) {
      try {
        return JSON.parse(data)
      } catch (error) {
        return []
      }
    },

    envChange() {
      const params = {
        env: this.title.env
      }
      getNameSpaceList(params).then(response => {
        this.namespaceList = response.data
      })
      if (this.title.namespace !== '') {
        const params = {
          env: this.title.env,
          namespace: this.title.namespace
        }
        getIngressListV2(params).then(response => {
          this.list = response.data
        })
      }
    },

    envChangeV2() {
      const params = {
        env: this.addResourceForm.env
      }
      getNameSpaceList(params).then(response => {
        this.namespaceListV2 = response.data
      })
    },

    namespaceChange() {
      const params = {
        env: this.title.env,
        namespace: this.title.namespace
      }
      getIngressListV2(params).then(response => {
        this.list = response.data
      })
    },

    pageChange() {
      console.log('xxx')
    },

    addResource() {
      this.addResourceForm.env = ''
      this.addResourceForm.namespace = ''
      this.addResourceForm.name = ''
      this.addResourceForm.domain = ''
      this.addResourceDialogVisible = true
    },

    addResourceSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addResourceForm.rules.forEach(rule => {
            rule.target_port = parseInt(rule.target_port)
          })
          const data = {
            env: this.addResourceForm.env,
            namespace: this.addResourceForm.namespace,
            name: this.addResourceForm.name,
            domain: this.addResourceForm.domain,
            rewrite: this.addResourceForm.rewrite,
            rules: this.addResourceForm.rules
          }
          postIngress(data).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            })
          })
          console.log(data)
          this.addResourceDialogVisible = false
        } else {
          return false
        }
      })
    },

    editOpen(val) {
      this.editForm.env = this.title.env
      this.editForm.namespace = this.title.namespace
      this.editForm.name = val.name
      this.editForm.domain = val.domain
      this.editForm.rewrite = false
      this.editForm.rules = this.parseData(val.data)
      this.updateResourceDialogVisible = true
      console.log(val)
    }
  }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }
  .arrow {
    color: #99a9bf;
    margin-left: 20px;
    margin-right: 20px;
  }
</style>
