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

    <el-table :data="list" max-height="790">
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
      <el-table-column label="端口" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.port }}
        </template>
      </el-table-column>
      <el-table-column label="协议" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.protocol }}
        </template>
      </el-table-column>
      <el-table-column label="目标端口" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.target_port }}
        </template>
      </el-table-column>
      <el-table-column label="类型" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="Deployment" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.deployment }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" header-align="center" align="center">
        <template>
          <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加资源表单 -->
    <el-dialog title="添加service资源" :visible.sync="addResourceDialogVisible" width="600px" center>
      <el-form ref="addResourceForm" :model="addResourceForm" :rules="addResourceFormRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="环境" label-width="80px" prop="env">
              <el-select v-model="addResourceForm.env" style="width: 150px;" placeholder="请选择环境" @change="envChangeV2()">
                <el-option label="dev" value="dev" />
                <el-option label="uat" value="uat" />
                <el-option label="fat" value="fat" />
                <el-option label="pro" value="pro" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称空间" label-width="80px" prop="namespace">
              <el-select v-model="addResourceForm.namespace" style="width: 150px;" placeholder="请选择名称空间">
                <el-option v-for="(item, index) in namespaceListV2" :key="index" :label="item.metadata.name" :value="item.metadata.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model="addResourceForm.name" style="width: 425px;" placeholder="请输入名称" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="协议" label-width="80px" prop="protocol">
              <el-select v-model="addResourceForm.protocol" style="width: 150px;" placeholder="请选择协议">
                <el-option label="TCP" value="TCP" />
                <el-option label="UDP" value="UDP" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" label-width="80px" prop="type">
              <el-select v-model="addResourceForm.type" style="width: 150px;" placeholder="请选择类型">
                <el-option label="ClusterIP" value="ClusterIP" />
                <el-option label="NodePort" value="NodePort" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="端口" label-width="80px" prop="port">
              <el-input v-model="addResourceForm.port" style="width: 150px;" placeholder="请输入端口" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标端口" label-width="80px" prop="target_port">
              <el-input v-model="addResourceForm.target_port" style="width: 150px;" placeholder="请输入目标端口" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="关联应用" label-width="80px">
          <el-switch v-model="addResourceForm.deploymentSwitch" />
        </el-form-item>
        <el-form-item v-if="addResourceForm.deploymentSwitch === true" label="应用名" label-width="80px" prop="deployment">
          <el-input v-model="addResourceForm.deployment" style="width: 425px;" placeholder="请选择应用" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="addResourceDialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="addResourceSubmit('addResourceForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getNameSpaceList } from '@/api/namespace'
import { getServiceListV2, postServiceV2 } from '@/api/service'

export default {
  data() {
    return {
      // 添加资源弹框
      addResourceDialogVisible: false,
      addResourceForm: {
        env: '',
        namespace: '',
        name: '',
        port: null,
        target_port: null,
        protocol: '',
        type: '',
        deploymentSwitch: true,
        deployment: ''
      },
      // 校验数据不为空
      addResourceFormRules: {
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
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只能输入数字' }
        ],
        target_port: [
          { required: true, message: '请输入目标端口', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只能输入数字' }
        ],
        protocol: [
          { required: true, message: '请输入协议', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ],
        deployment: [
          { required: true, message: '请输入需要关联的DeployMent名称', trigger: 'blur' }
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
        getServiceListV2(params).then(response => {
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
      getServiceListV2(params).then(response => {
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
      this.addResourceForm.port = null
      this.addResourceForm.target_port = null
      this.addResourceForm.protocol = ''
      this.addResourceForm.type = ''
      this.addResourceForm.deployment = ''
      this.addResourceDialogVisible = true
    },

    addResourceSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            env: this.addResourceForm.env,
            namespace: this.addResourceForm.namespace,
            name: this.addResourceForm.name,
            port: parseInt(this.addResourceForm.port),
            target_port: parseInt(this.addResourceForm.target_port),
            protocol: this.addResourceForm.protocol,
            type: this.addResourceForm.type,
            deployment: this.addResourceForm.deployment
          }
          postServiceV2(data).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            })
          })
          this.addResourceDialogVisible = false
        } else {
          return false
        }
      })
    }
  }
}
</script>
