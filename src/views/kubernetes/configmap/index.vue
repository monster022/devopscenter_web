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

    <el-table :data="list" max-height="800">
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
      <el-table-column label="数据" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ parseData(scope.row.data) }}
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

    <el-dialog title="添加ConfigMap资源" :visible.sync="addResourceDialogVisible" width="600px" center>
      <el-form ref="addResourceForm" :model="addResourceForm" :rules="addResourceFormRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="环境" prop="env" label-width="70px">
              <el-select v-model="addResourceForm.env" style="width: 150px;" placeholder="请选择环境" @change="envChangeV2()">
                <el-option label="dev" value="dev" />
                <el-option label="uat" value="uat" />
                <el-option label="fat" value="fat" />
                <el-option label="pro" value="pro" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称空间" prop="namespace" label-width="80px">
              <el-select v-model="addResourceForm.namespace" style="width: 150px;" placeholder="请选择名称空间">
                <el-option v-for="(item, index) in namespaceListV2" :key="index" :label="item.metadata.name" :value="item.metadata.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="名称" prop="name" label-width="70px">
          <el-input v-model="addResourceForm.name" style="width: 435px;" placeholder="请输入名称" />
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item v-for="(item, index) in addResourceForm.items" :key="index" label="KV" label-width="70px">
              <el-input v-model="item.key" style="width: 170px" placeholder="e.g. foo" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item v-for="(item, index) in addResourceForm.items" :key="index" label-width="26px">
              <el-button type="danger" size="mini" circle icon="el-icon-minus" @click="removeItem(index)" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item v-for="(item, index) in addResourceForm.items" :key="index">
              <el-input v-model="item.value" type="textarea" style="width: 205px" placeholder="e.g. bar" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="70px">
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addItem" />
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
import { postConfigMapV2, getConfigMap } from '@/api/configmap'

export default {
  data() {
    return {
      // 添加资源弹框
      addResourceDialogVisible: false,
      addResourceForm: {
        env: '',
        namespace: '',
        name: '',
        items: [{ key: '', value: '' }]
      },
      // 校验表中数据
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
        ]
      },
      // 表中数据
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
    parseData(data) {
      try {
        return JSON.parse(data)
      } catch (error) {
        return []
      }
    },
    addItem() {
      this.addResourceForm.items.push({ key: '', value: '' })
    },
    removeItem(index) {
      this.addResourceForm.items.splice(index, 1)
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
          namespace: this.title.namespace,
          size: this.size,
          page: this.currentPage
        }
        getConfigMap(params).then(response => {
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
      getConfigMap(params).then(response => {
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
      this.addResourceForm.items = []
      this.addResourceDialogVisible = true
    },

    addResourceSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            env: this.addResourceForm.env,
            namespace: this.addResourceForm.namespace,
            name: this.addResourceForm.name,
            data: this.addResourceForm.items
          }
          postConfigMapV2(data).then(response => {
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
