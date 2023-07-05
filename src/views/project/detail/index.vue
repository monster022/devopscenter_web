<template>
  <div>
    <div class="app-container">
      <el-table
        v-loading.fullscreen.lock="fullscreenLoading"
        :data="list"
        element-loading-text="小老弟莫急 正玩命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.7)"
        fit
        stripe
        max-height="400"
        highlight-current-row
      >
        <el-table-column label="序号" width="95" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="构建者" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="构建Job" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.job_name }}
          </template>
        </el-table-column>
        <el-table-column label="构建ID" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击跳转查看详细信息" placement="bottom">
              <a class="job-link" :href="'http://jenkins.chengdd.cn/job/' + scope.row.job_name + '/' + scope.row.job_id + '/console'">{{ scope.row.job_id }}</a>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="构建参数" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.params }}
          </template>
        </el-table-column>
        <el-table-column label="构建信息" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.message }}
          </template>
        </el-table-column>
        <el-table-column label="构建时间" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.time }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="app-container">
      <el-table
        v-loading.fullscreen.lock="fullscreenLoading"
        :data="deployList"
        element-loading-text="小老弟莫急 正玩命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.7)"
        fit
        stripe
        max-height="400"
        highlight-current-row
      >
        <el-table-column label="序号" width="95" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="发布者" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="环境" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.env }}
          </template>
        </el-table-column>
        <el-table-column label="名称空间" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.namespace }}
          </template>
        </el-table-column>
        <el-table-column label="版本" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.version }}
          </template>
        </el-table-column>
        <el-table-column label="发布时间" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.time }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import { getProjectDetails, getProjectDeployDetails } from '@/api/project'

export default {
  data() {
    return {
      list: null,
      deployList: null,
      fullscreenLoading: false,
      // 分页
      total: null,
      currentPage: 1,
      size: 15
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
      console.log(this.$route.params.project)
      getProjectDetails(this.$route.params.project, params).then(response => {
        this.list = response.data
        this.total = response.total
      })
      getProjectDeployDetails(this.$route.params.project, params).then(response => (
        this.deployList = response.data
      ))
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 500)
    },
    pageChange() {
      console
    }
  }
}
</script>

<style>
  .el-tooltip__popper{
    max-width:20%;
  }
  .el-tooltip__popper,.el-tooltip__popper.is-dark{
    background:rgb(48, 65, 86) !important;
    color: #fff !important;
    line-height: 24px;
  }
  .job-link:hover {
    text-decoration: underline;
  }
</style>
