<template>
  <div class="app-container">
    <div>
      <el-button style="float: left;" type="primary" icon="el-icon-plus" @click="additionOpen()">添加项目</el-button>
      <el-input v-model="headInput" style="float: left; width: 200px; margin-left: 30px;" placeholder="清输入名称" @change="fetchData()">
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
    </div>

    <el-table
      v-loading.fullscreen.lock="fullscreenLoading"
      :data="list"
      element-loading-text="小老弟莫急 正玩命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.7)"
      fit
      stripe
      max-height="790"
      highlight-current-row
    >
      <el-table-column label="序号" width="95" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="项目" header-align="center" align="center" show-overflow-tooltip>
        <template slot="header">
          <div class="custom-header">
            项目
            <el-tooltip class="custom-tooltip" effect="dark" content="GitLab 中的名称" placement="top">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.project_name }}
          <!-- <el-button :disabled="scope.row.project_status === 0" type="text" size="mini" @click="projectDetail(scope.row.project_name)">{{ scope.row.project_name }}</el-button> -->
          <!-- <font color="#409EFF">{{ scope.row.project_name }}</font> -->
        </template>
      </el-table-column>
      <el-table-column label="名称" header-align="center" align="center">
        <template slot="header">
          <div class="custom-header">
            名称
            <el-tooltip class="custom-tooltip" effect="dark" content="K8s 中 DeployMent 的名称" placement="top">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="scope">
          <el-button :disabled="scope.row.project_status === 0" type="text" size="mini" @click="projectDetail(scope.row.alias_name)">{{ scope.row.alias_name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="AppId" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.app_id }}
        </template>
      </el-table-column>
      <el-table-column label="语言" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.language }}
        </template>
      </el-table-column>
      <el-table-column label="构建" header-align="center" align="center">
        <template slot-scope="{row}">
          <el-button :disabled="buildType(row.id,row.project_status)" :class="{act: buildLoadingType(row.id)}" :loading="buildLoadingType(row.id)" type="text" size="mini" @click="buildOpen(row)">{{ buildWd(row.id) }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="发布" header-align="center" align="center">
        <template slot-scope="{row}">
          <el-button :disabled="row.project_status === 0" type="text" size="mini" @click="deployOpen(row)">deploy</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="250"
        header-align="center"
      >
        <template slot-scope="{row}">
          <el-button :disabled="row.project_status === 1" type="text" size="small" icon="el-icon-open" @click="switchStatusEnable(row)">启用</el-button>
          <el-button :disabled="row.project_status === 0" type="text" size="small" icon="el-icon-turn-off" @click="switchStatusDisable(row)">禁用</el-button>
          <el-button :disabled="row.project_status === 0" type="text" size="small" icon="el-icon-edit" @click="editProjectOpen(row)">编辑</el-button>
          <el-button :disabled="row.project_status === 0" type="text" size="small" icon="el-icon-delete" @click="deleteProject(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="paginationClass">
      <el-pagination layout="total, prev, pager, next" :total="total" hide-on-single-page :current-page.sync="currentPage" :page-size="size" @prev-click="pageChange" @next-click="pageChange" @current-change="pageChange" />
    </div>

    <!-- 添加 -->
    <el-dialog title="添加项目" :visible.sync="additionDialogVisible" width="600px">
      <el-form ref="additionForm" :model="additionForm" :rules="additionRules">
        <el-form-item label="项目" label-width="100px" prop="name">
          <el-input v-model="additionForm.name" style="width: 400px;" />
        </el-form-item>
        <el-form-item label="别名" label-width="100px" prop="alias_name">
          <el-input v-model="additionForm.alias_name" style="width: 400px;" />
        </el-form-item>
        <el-form-item label="语言" label-width="100px" prop="language">
          <el-select v-model="additionForm.language" style="width: 400px;" placeholder="请选择项目语言">
            <el-option label="Dotnet2.2" value="dotnet2.2" />
            <el-option label="Dotnet5.0" value="dotnet5.0" />
            <el-option label="Golang" value="go" />
            <el-option label="Vue" value="vue" />
            <el-option label="Html" value="html" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="additionForm.language == 'dotnet5.0' || additionForm.language == 'dotnet2.2'" label="构建路径" label-width="100px">
          <el-input v-model="additionForm.build_path" style="width: 400px;" />
        </el-form-item>
        <el-form-item v-if="additionForm.language == 'dotnet5.0' || additionForm.language == 'dotnet2.2'" label="包名" label-width="100px">
          <el-input v-model="additionForm.package_name" style="width: 400px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="additionDialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="additionSubmit('additionForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑项目" :visible.sync="editDialogVisible" width="600px">
      <el-form :model="editForm">
        <el-form-item label="项目名" label-width="100px">
          <el-input v-model="editForm.name" :disabled="true" style="width: 400px;" />
        </el-form-item>
        <el-form-item label="项目仓库" label-width="100px">
          <el-input v-model="editForm.repo" :disabled="true" style="width: 400px;" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="ID" label-width="100px">
              <el-input v-model="editForm.project_id" :disabled="true" style="width: 150px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="语言" label-width="150px">
              <el-input v-model="editForm.language" :disabled="true" style="width: 160px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="构建路径" label-width="100px">
          <el-input v-model="editForm.build_path" style="width: 400px;" />
        </el-form-item>
        <el-form-item label="项目包名" label-width="100px">
          <el-input v-model="editForm.package_name" style="width: 400px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="editDialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="editSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 构建 -->
    <el-dialog :title="build_title" :visible.sync="buildDialogVisible" width="600px" center>
      <el-form ref="buildForm" :model="buildForm" :rules="buildRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名" label-width="80px">
              <el-input v-model="buildForm.name" style="width: 150px;" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="环境" label-width="80px" prop="env">
              <el-select v-model="buildForm.env" style="width: 150px;" placeholder="请选择构建环境">
                <el-option label="dev" value="dev" />
                <el-option label="uat" value="uat" />
                <el-option label="fat" value="fat" />
                <el-option label="pro" value="pro" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="仓库地址" label-width="80px">
          <el-input v-model="buildForm.repository" style="width: 425px;" :disabled="true" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分支" label-width="80px" prop="branch">
              <el-select v-model="buildForm.branch" style="width: 150px;" placeholder="请选择分支" @change="branchChangeCommit()">
                <el-option v-for="(item, index) in branchList" :key="index" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" label-width="80px">
              <el-input v-model="buildForm.authorName" style="width: 150px;" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="提交信息" label-width="80px">
          <el-input v-model="buildForm.message" style="width: 425px;" :disabled="true" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="buildForm.language === 'dotnet5.0' || buildForm.language === 'dotnet2.2'" label="是否依赖" label-width="90px">
              <el-switch v-model="buildForm.depend" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="buildForm.depend === true" label="依赖名" label-width="80px">
              <el-input v-model="buildForm.dependent_project" style="width: 150px;" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="buildForm.depend === true" label="依赖分支" label-width="80px">
              <el-select v-model="buildForm.dependent_branch" style="width: 150px;">
                <el-option label="release_20220418" value="release_20220418" />
                <el-option label="release" value="release" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="buildForm.depend === true" label="依赖仓库" label-width="80px">
          <el-input v-model="buildForm.dependent_repository" style="width: 425px;" :disabled="true" />
        </el-form-item>
        <el-form-item v-if="buildForm.language === 'dotnet5.0' || buildForm.language === 'dotnet2.2'" label="构建路径" label-width="80px" prop="build_path">
          <el-input v-model="buildForm.build_path" style="width: 425px;" placeholder=".cspro文件所在路径" />
        </el-form-item>
        <el-form-item v-if="buildForm.language === 'dotnet5.0' || buildForm.language === 'dotnet2.2'" label="包名" label-width="80px" prop="package_name">
          <el-input v-model="buildForm.package_name" style="width: 425px;" placeholder="编译生成出的可执行文件名" />
        </el-form-item>

        <el-form-item v-if="buildForm.language === 'vue'" label="编译指令" label-width="80px" prop="command">
          <el-input v-model="buildForm.command" style="width: 425px;" placeholder="使用 && 连接符,例如:  npm i && npm run build" />
        </el-form-item>

        <el-form-item label="镜像源" label-width="80px" prop="image_source">
          <el-select v-model="buildForm.image_source" style="width: 425px;" placeholder="请选择镜像版本">
            <el-option label="Dotnet Frame 5.0" value="harbor.chengdd.cn/base/dotnet_aspnet:5.0" />
            <el-option label="Dotnet Frame 2.2" value="harbor.chengdd.cn/base/dotnet_aspnet:2.2" />
            <el-option label="Nginx Version 1.20" value="harbor.chengdd.cn/base/nginx:1.20" />
            <el-option label="Golang Version alpine" value="golang:alpine" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" label-width="80px">
          <el-input v-model="buildForm.remark" type="textarea" :rows="2" style="width: 425px;" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="buildDialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="buildSubmit('buildForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 发布 -->
    <el-dialog :title="deploy_title" :visible.sync="deployDialogVisible" width="600px" center>
      <el-form :model="deployForm">
        <el-form-item label="发布方式" label-width="80px">
          <el-radio-group v-model="deployForm.publish_type">
            <el-radio :label="1"> Kubernetes </el-radio>
            <el-radio :label="2"> Docker </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" label-width="80px">
              <el-input v-model="deployForm.name" style="width: 150px;" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="环境" label-width="80px">
              <el-select v-model="deployForm.env" style="width: 150px;" placeholder="请选择发布环境" @change="tagSelect()">
                <el-option label="dev" value="dev" />
                <el-option label="uat" value="uat" />
                <el-option label="fat" value="fat" />
                <el-option label="pro" value="pro" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="deployForm.publish_type === 1" label="名称空间" label-width="80px">
              <el-select v-model="deployForm.namespace" style="width: 150px;" placeholder="默认与环境名相同" @change="namespaceSelect()">
                <el-option v-for="(item, index) in namespaceList" :key="index" :label="item.metadata.name" :value="item.metadata.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="deployForm.publish_type === 1" label="容器名" label-width="80px">
              <el-select v-model="deployForm.container_name" style="width: 150px;" placeholder="请输入容器名">
                <el-option v-for="(item, index) in containirNameList" :key="index" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="deployForm.publish_type === 1" label="调试" label-width="80px">
          <el-switch v-model="deployForm.urgen" />
        </el-form-item>
        <el-form-item v-if="deployForm.urgen === false" label="版本" label-width="80px">
          <el-select v-model="deployForm.edition" style="width: 425px;" placeholder="请选择版本">
            <el-option v-for="(item, index) in tagList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="deployForm.urgen === true" label="版本" label-width="80px">
          <el-input v-model="deployForm.urgenEdition" style="width: 425px;" placeholder="请输入完成镜像地址" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="deployForm.publish_type === 2" label="访问端口" label-width="80px">
              <el-input v-model="deployForm.container_port" style="width: 425px;" placeholder="请输入Docker访问的地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="deployForm.publish_type === 2">
          <el-transfer v-model="deployForm.transferValue" :data="transferData" :titles="['Source', 'Target']" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="deployDialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="deploySubmit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getNameSpaceList } from '@/api/namespace'
import { getList, getBranch, getHarborTag, postJenkinsJobBuild, deleteList, postAddition,
  patchStatus, patchEdit, getJenkinsBuildStatus, getProjectCommitMessage,
  postDockerProjectDeploy } from '@/api/project'
import { getPublishMachineList } from '@/api/machine'
import { getSpecifyDeployMent, patchDeploymentImage } from '@/api/deployment'
// import axios from 'axios'

export default {
  data() {
    return {
      // search
      headInput: '',
      // title
      deploy_title: '',
      build_title: '',
      bId: '',				// 选定的id
      list: null,
      fullscreenLoading: false,
      builddisable: 1,
      // 定义jobid变量
      jobId: 0,
      // 心跳检查job状态
      intervalId: null,
      counter: 0,
      maxCount: 600, // 最多请求600次，即10分钟
      // 分页设置
      total: null,
      size: 13,
      currentPage: 1,
      // 项目分支数组
      branchList: [],
      // 容器名数组
      containirNameList: [],
      // 名称空间数组
      namespaceList: [],
      // 添加项目状态与数据
      additionDialogVisible: false,
      additionForm: {
        name: '',
        alias_name: '',
        language: '',
        build_path: '',
        package_name: ''
      },
      // 编辑项目数据
      editDialogVisible: false,
      editForm: {
        name: '',
        project_id: null,
        repo: '',
        language: '',
        build_path: '',
        package_name: ''
      },
      // 构建状态与数据
      buildDialogVisible: false,
      buildForm: {
        name: '',
        env: '',
        language: '',
        repository: '',
        dependent_repository: 'git@gitlab.mojorycorp.cn:mojory/commonlibs.git',
        dependent_project: 'commonlibs',
        command: '', // 项目编译指令
        branch: '',
        short_id: '',
        dependent_branch: 'release_20220418',
        build_path: '',
        package_name: '',
        image_source: '',
        remark: '', // 备注信息
        depend: false,
        authorName: '',
        alias_name: '', // 项目别名
        message: '', // commit information
        pid: null // 项目ID
      },
      // 发布状态与数据
      deployDialogVisible: false,
      deployForm: {
        publish_type: 1,
        name: '',
        env: '',
        edition: '',
        urgen: false,
        urgenEdition: '',
        namespace: '',
        container_name: '',
        container_port: '',
        transferValue: []
      },
      // harbor 版本数组
      tagList: [],
      buildRules: {
        env: [
          { required: true, message: '必须指定环境', trigger: 'submit' }
        ],
        image_source: [
          { required: true, message: '必须指定镜像', trigger: 'submit' }
        ],
        branch: [
          { required: true, message: '必须选择分支', trigger: 'submit' }
        ],
        build_path: [
          { required: true, message: '必须填写构建路径', trigger: 'submit' }
        ],
        package_name: [
          { required: true, message: '必须填写包名', trigger: 'submit' }
        ],
        command: [
          { required: true, message: '必须输入编译指令', trigger: 'submit' }
        ]
      },
      // addition规则
      additionRules: {
        name: [{ required: true, message: '必须输入项目', trigger: 'blur' }],
        alias_name: [{ required: true, message: '必须输入别名', trigger: 'blur' }],
        language: [{ required: true, message: '必须选择语言', trigger: 'blur' }]
      },
      // 穿梭框
      transferData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 穿梭框数据的获取
    generateData(arr) {
      const data = []
      for (let i = 1; i <= arr.length; i++) {
        data.push({
          key: i,
          label: arr[i - 1]
        })
      }
      return data
    },
    buildType(id, status) {
      let bk = false
      if (this.bId || status === 0) {
        bk = true
      }
      return bk
    },
    buildLoadingType(id) {
      let bk = false
      if (id === this.bId) {
        bk = true
      }
      return bk
    },
    buildWd(id) {
      let bk = 'build'
      if (id === this.bId) {
        bk = 'Running'
      }
      return bk
    },
    fetchData() {
      this.fullscreenLoading = true
      const params = {
        page: 1,
        size: this.size,
        name: this.headInput
      }

      getList(params).then(response => {
        this.list = response.data
        this.total = response.total
      })
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 500)
    },
    pageChange(val) {
      const params = {
        page: val,
        size: this.size,
        name: this.headInput
      }
      getList(params).then(response => {
        this.list = response.data
        this.total = response.total
      })
    },
    switchStatusEnable(val) {
      const params = {
        status: 1,
        id: val.id
      }
      patchStatus(params).then(response => {
        this.$message({
          type: 'success',
          message: response.message
        })
      })
      setTimeout(() => {
        this.fetchData()
      }, 300)
    },
    switchStatusDisable(val) {
      const params = {
        status: 0,
        id: val.id
      }
      patchStatus(params).then(response => {
        this.$message({
          type: 'success',
          message: response.message
        })
      })
      setTimeout(() => {
        this.fetchData()
      }, 300)
    },
    deleteProject(val) {
      console.log(val)
      this.$confirm('此操作将永久删除该记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteList(val.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
        })
        this.fetchData()
        this.currentPage = 1
      })
    },
    additionOpen() {
      this.additionForm.name = ''
      this.additionForm.language = ''
      this.additionForm.alias_name = ''
      this.additionDialogVisible = true
    },
    additionSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.additionForm.language === 'vue' || this.additionForm.language === 'go') {
            this.additionForm.build_path = ' '
            this.additionForm.package_name = ' '
          }
          if (this.additionForm.alias_name === ' ') {
            this.additionForm.alias_name = this.additionForm.name
          }
          const data = {
            name: this.additionForm.name,
            alias_name: this.additionForm.alias_name,
            language: this.additionForm.language,
            build_path: this.additionForm.build_path,
            package_name: this.additionForm.package_name
          }
          postAddition(data).then(response => {
            this.$message.success(response.message)
          })
          this.additionDialogVisible = false
          setTimeout(() => {
            this.fetchData()
          }, 500)
        } else {
          return false
        }
      })
    },
    editProjectOpen(val) {
      this.editForm.name = val.project_name
      this.editForm.project_id = val.project_id
      this.editForm.repo = val.project_repo
      this.editForm.language = val.language
      this.editForm.build_path = val.build_path
      this.editForm.package_name = val.package_name
      this.editDialogVisible = true
    },
    editSubmit() {
      const data = {
        build_path: this.editForm.build_path,
        package_name: this.editForm.package_name
      }
      patchEdit(this.editForm.name, data).then(response => {
        this.$message({
          type: 'success',
          message: response.message
        })
      })
      this.editDialogVisible = false
      this.fetchData()
    },
    buildOpen(row) {
      this.build_title = row.language + ' ' + row.alias_name + ' 项目构建'
      const params = {
        id: row.project_id
      }
      getBranch(params).then(response => {
        this.branchList = response.data
      })
      this.buildForm.id = row.id
      this.buildForm.name = row.project_name
      this.buildForm.repository = row.project_repo
      this.buildForm.language = row.language
      this.buildForm.build_path = row.build_path
      this.buildForm.package_name = row.package_name
      this.buildForm.env = ''
      this.buildForm.branch = ''
      this.buildForm.command = ''
      this.buildForm.image_source = ''
      this.buildForm.authorName = ''
      this.buildForm.message = ''
      this.buildForm.alias_name = row.alias_name
      this.buildForm.pid = row.project_id
      this.buildForm.remark = row.remark
      this.buildDialogVisible = true
    },
    branchChangeCommit() {
      const params = {
        branch: this.buildForm.branch
      }
      getProjectCommitMessage(this.buildForm.pid, params).then(response => {
        this.buildForm.authorName = response.data.authorName
        this.buildForm.message = response.data.message
        this.buildForm.short_id = response.data.short_id
      })
    },
    buildSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            env: this.buildForm.env,
            repository: this.buildForm.repository,
            language: this.buildForm.language,
            dependent_repository: this.buildForm.dependent_repository,
            project: this.buildForm.name,
            dependent_project: this.buildForm.dependent_project,
            command: this.buildForm.command,
            branch: this.buildForm.branch,
            short_id: this.buildForm.short_id,
            dependent_branch: this.buildForm.dependent_branch,
            build_path: this.buildForm.build_path,
            package_name: this.buildForm.package_name,
            image_source: this.buildForm.image_source,
            alias_name: this.buildForm.alias_name,
            create_by: window.localStorage.getItem('username')
          }
          postJenkinsJobBuild(data).then(response => {
            this.bId = this.buildForm.id
            this.$message({
              type: 'success',
              message: response.message
            })
            this.jobId = response.data
          }).catch(err => {
            console.log(err)
          })
          this.buildDialogVisible = false
          this.intervalId = setInterval(() => {
            this.healthCheck(this.buildForm.language + '_Template', this.jobId)
          }, 1000)
        } else {
          return false
        }
      })
    },
    projectDetail(val) {
      this.$router.push({
        path: '/project/detail/' + val
      })
    },
    deployOpen(row) {
      this.deploy_title = row.alias_name + ' 项目发布'
      this.deployForm.name = row.alias_name
      this.deployForm.env = ''
      this.deployForm.edition = ''
      this.deployForm.namespace = ''
      this.deployForm.container_name = ''
      this.deployForm.publish_type = 1
      this.deployForm.container_port = ''
      // this.deployForm.transferValue = ''
      const params = {
        env: this.deployForm.env,
        project: row.project_name
      }
      getHarborTag(params).then(response => {
        // const harborList = response.data
        // this.tagList = harborList.slice().reverse()
        this.tagList = this.doSort(response.data)
      })
      getPublishMachineList(row.id).then(response => {
        this.transferData = this.generateData(response.data)
      })
      this.deployDialogVisible = true
    },
    deploySubmit() {
      if (this.deployForm.publish_type === 1) {
        // Kubernetes 发布
        if (this.deployForm.urgen === false) {
          const data = {
            env: this.deployForm.env,
            publish_type: 'Kubernetes',
            deployment_name: this.deployForm.name,
            namespace: this.deployForm.namespace,
            container_name: this.deployForm.container_name,
            image_source: 'harbor.chengdd.cn/' + this.deployForm.env + '/' + this.deployForm.name + ':' + this.deployForm.edition,
            create_by: localStorage.getItem('username')
          }
          patchDeploymentImage(data).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            })
          }).catch(error => {
            console.log(error)
          })
          this.deployDialogVisible = false
        } else {
          const data = {
            env: this.deployForm.env,
            publish_type: 'Docker',
            deployment_name: this.deployForm.name,
            namespace: this.deployForm.namespace,
            container_name: this.deployForm.container_name,
            image_source: this.deployForm.urgenEdition
          }
          patchDeploymentImage(data).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            })
          }).catch(error => {
            console.log(error)
          })
          this.deployDialogVisible = false
        }
      } else {
        // Docker 发布
        const data = {
          env: this.deployForm.env,
          name: this.deployForm.name,
          image: 'harbor.chengdd.cn/' + this.deployForm.env + '/' + this.deployForm.name + ':' + this.deployForm.edition,
          target: this.transferValue(this.deployForm.transferValue),
          port: this.deployForm.container_port,
          create_by: localStorage.getItem('username')
        }
        postDockerProjectDeploy(data).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          }).catch(error => {
            console.log(error)
          })
        })
        this.deployDialogVisible = false
      }
    },
    tagSelect() {
      // console.log(this.deployForm.name)
      this.deployForm.namespace = ''
      this.deployForm.edition = ''
      this.deployForm.container_name = ''
      const params = {
        env: this.deployForm.env,
        project: this.deployForm.name
      }
      const params2 = {
        env: this.deployForm.env
      }
      getHarborTag(params).then(response => {
        // const harborList = response.data
        this.tagList = this.doSort(response.data)
      })
      getNameSpaceList(params2).then(response => {
        this.namespaceList = response.data
      })
    },
    namespaceSelect() {
      const params = {
        env: this.deployForm.env,
        namespace: this.deployForm.namespace
      }
      getSpecifyDeployMent(params, this.deployForm.name).then(response => {
        this.containirNameList = response.data
      })
    },
    healthCheck(template, id) {
      getJenkinsBuildStatus(template, id).then(response => {
        if (response.data === 'SUCCESS' || response.data === 'ABORTED' || response.data === 'FAILURE') {
          this.bId = ''
          this.$message({
            type: 'success',
            message: '构建状态为: ' + response.data
          })
          clearInterval(this.intervalId)
        } else {
          this.counter++
          if (this.counter >= this.maxCount) {
            this.bId = ''
            this.$message({
              type: 'info',
              message: '已取消, 超时10分钟'
            })
            clearInterval(this.intervalId)
          }
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // 从穿梭框中拿取数据
    transferValue(arr) {
      const newArr = []
      const tdArr = JSON.parse(JSON.stringify(this.transferData))
      arr.forEach((item, index) => {
        tdArr.forEach((item01, index01) => {
          if (item === item01.key) {
            newArr.push(item01.label)
          }
        })
      })
      return newArr
    },
    // 排序harbor标签
    doSort(data) {
      if (!Array.isArray(data)) {
        return []
      }
      const z = data.slice() // 创建data的浅拷贝
      // z.sort(function(a, b) { return b.push_time.localeCompare(a.push_time) })
      z.sort(function(a, b) { return b.push_time.localeCompare(a.push_time) })
      return z
    }
  }
}
</script>

<style>
  .paginationClass {
    position: fixed;
    bottom: 0;
    padding: 5px;
    height: 40px;
    width: 100%;
  }
  .font-color {
    background: #2e90ff;
  }
  .el-button.is-disabled.act { color: #409EFF; }
  /* 穿梭框 */
  .el-transfer {
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-transfer__buttons {
    display: inline-block;
    vertical-align: middle;
    padding: 0 10px;
  }
  .el-transfer-panel {
    width: 180px;
    height: 180px;
  }

</style>
