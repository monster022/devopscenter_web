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
      <el-table-column label="副本数" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.replicas }}
        </template>
      </el-table-column>
      <el-table-column label="镜像" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.image }}
        </template>
      </el-table-column>
      <el-table-column label="配置项" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.configName }}
        </template>
      </el-table-column>
      <el-table-column label="健康检查地址" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.uri }}
        </template>
      </el-table-column>
      <el-table-column label="健康检查端口" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.port }}
        </template>
      </el-table-column>
      <el-table-column label="CPU限制" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.cpu }}
        </template>
      </el-table-column>
      <el-table-column label="内存限制" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.mem }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" header-align="center" align="center">
        <template>
          <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination layout="total, prev, pager, next" :hide-on-single-page="true" :total="total" :current-page.sync="currentPage" :page-size="size" @prev-click="pageChange" @next-click="pageChange" @current-change="pageChange" />

    <el-dialog title="添加Deployment资源" :visible.sync="addResourceDialogVisible" width="600px" center>
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" label-width="80px" prop="name">
              <el-input v-model="addResourceForm.name" style="width: 150px;" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="副本数" label-width="80px">
              <el-input-number v-model="addResourceForm.replicas" style="width: 150px;" :min="1" :max="5" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="镜像" label-width="80px" prop="image">
          <el-input v-model="addResourceForm.image" style="width: 425px;" placeholder="请输入镜像" />
        </el-form-item>
        <el-form-item label="关联配置" label-width="80px">
          <el-switch v-model="addResourceForm.switchConfig" />
        </el-form-item>
        <el-form-item v-if="addResourceForm.switchConfig === true" label="配置项" label-width="80px" prop="configName">
          <el-input v-model="addResourceForm.configName" style="width: 425px;" placeholder="请输入配置项名称" />
        </el-form-item>
        <el-form-item label="健康检查" label-width="80px">
          <el-switch v-model="addResourceForm.healthCheck" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="addResourceForm.healthCheck === true" label="路径" label-width="80px" prop="uri">
              <el-input v-model="addResourceForm.uri" style="width: 150px;" placeholder="请输入uri" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="addResourceForm.healthCheck === true" label="端口" label-width="80px" prop="port">
              <el-input v-model="addResourceForm.port" style="width: 150px;" placeholder="请输入端口" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="资源限制" label-width="80px">
          <el-switch v-model="addResourceForm.resourceLimit" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="addResourceForm.resourceLimit === true" label="CPU" label-width="80px" prop="cpu">
              <el-input v-model="addResourceForm.cpu" style="width: 150px;" placeholder="请输入CPU">
                <template slot="append">m</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="addResourceForm.resourceLimit === true" label="Mem" label-width="80px" prop="mem">
              <el-input v-model="addResourceForm.mem" style="width: 150px;" placeholder="请输入Mem">
                <template slot="append">Mi</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import { getDeployMentListV2, postDeploymentAdd } from '@/api/deployment'

export default {
  data() {
    return {
      // 添加资源弹框
      addResourceDialogVisible: false,
      addResourceForm: {
        env: '',
        namespace: '',
        name: '',
        image: '',
        replicas: 1,
        switchConfig: true,
        configName: '',
        healthCheck: true,
        uri: '',
        port: '',
        resourceLimit: true,
        cpu: '',
        mem: ''
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
        image: [
          { required: true, message: '请输入完整镜像地址', trigger: 'blur' }
        ],
        configName: [
          { required: true, message: '请输入配置项名称', trigger: 'blur' }
        ],
        uri: [
          { required: true, message: '请输入URI', trigger: 'blur' },
          { pattern: /^\/.*/, message: 'e.g /healthz' }
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只能输入数字' }
        ],
        cpu: [
          { required: true, message: '请输入CPU数', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只能输入数字' }
        ],
        mem: [
          { required: true, message: '请输入Mem数', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只能输入数字' }
        ]
      },
      list: null,
      title: {
        env: 'dev',
        namespace: ''
      },
      namespaceList: [],
      namespaceListV2: [],
      total: null,
      currentPage: 1,
      size: 13
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
          namespace: this.title.namespace,
          size: this.size,
          page: this.currentPage
        }
        getDeployMentListV2(params).then(response => {
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
        namespace: this.title.namespace,
        size: this.size,
        page: this.currentPage
      }
      getDeployMentListV2(params).then(response => {
        this.list = response.data
        this.total = response.total
      })
    },

    pageChange() {
      console.log('xxx')
    },

    addResource() {
      this.addResourceForm.env = ''
      this.addResourceForm.namespace = ''
      this.addResourceForm.name = ''
      this.addResourceForm.replicas = ''
      this.addResourceForm.image = ''
      this.addResourceForm.configName = ''
      this.addResourceForm.uri = ''
      this.addResourceForm.port = ''
      this.addResourceForm.cpu = ''
      this.addResourceForm.mem = ''
      this.addResourceDialogVisible = true
    },

    addResourceSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            env: this.addResourceForm.env,
            namespace: this.addResourceForm.namespace,
            name: this.addResourceForm.name,
            replicas: this.addResourceForm.replicas,
            image: this.addResourceForm.image,
            configName: this.addResourceForm.configName,
            uri: this.addResourceForm.uri,
            port: parseInt(this.addResourceForm.port),
            cpu: this.addResourceForm.cpu + 'm',
            mem: this.addResourceForm.mem + 'Mi'
          }
          postDeploymentAdd(data).then(response => {
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
