<template>
  <div class="app-contianer">

    <div style="float: left; margin-left:20px; margin-top:20px;">
      <label style="width: 80px; font-weight: normal;">环境</label>
      <el-select v-model="title.env" style="width: 200px; margin-left:20px;" placeholder="请选择环境" @change="envChange()">
        <el-option label="dev" value="dev" />
        <el-option label="uat" value="uat" />
        <el-option label="fat" value="fat" />
      </el-select>
      <label style="width: 80px; margin-left:20px; font-weight: normal;">名称空间</label>
      <el-select v-model="title.namespace" style="width: 200px; margin-left:20px" placeholder="请选择名称空间" @change="namespaceChange()">
        <el-option v-for="(item, index) in namespaceList" :key="index" :label="item.metadata.name" :value="item.metadata.name" />
      </el-select>
    </div>
    <div style="float: right; margin-right: 20px; margin-top: 20px;">
      <el-button type="primary" icon="el-icon-circle-plus-outline">添加资源</el-button>
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
      <el-table-column label="容器名" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.container_name }}
        </template>
      </el-table-column>
      <el-table-column label="镜像" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.image }}
        </template>
      </el-table-column>
      <el-table-column label="副本数" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.replicate }}
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

  </div>
</template>

<script>

import { getNameSpaceList } from '@/api/namespace'
import { getDeployMentListV2 } from '@/api/deployment'

export default {
  data() {
    return {
      list: null,
      title: {
        env: 'dev',
        namespace: ''
      },
      namespaceList: [],
      total: null,
      currentPage: 1,
      size: 15
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
    namespaceChange() {
      const params = {
        env: this.title.env,
        namespace: this.title.namespace,
        page: 1,
        size: 15
      }
      getDeployMentListV2(params).then(response => {
        this.list = response.data
        this.total = response.total
      })
    },
    pageChange() {
      console.log('xxx')
    }
  }
}
</script>
