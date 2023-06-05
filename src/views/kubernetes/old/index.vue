<template>
  <div class="app-container">
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="负载均衡" name="first">
          <div style="float: left;">
            <el-button type="primary" icon="el-icon-circle-plus-outline"> 添加 Ingress 资源</el-button>
          </div>
          <div style="float: left; margin-left:20px">
            <el-select v-model="nameSpace" style="width: 180px" placeholder="选择名称空间" class="line-space" @change="IngressSearch">
              <el-option v-for="(item, index) in nameSpaceList" :key="index" :label="item.metadata.name" :value="item.metadata.name" class="line-space" />
            </el-select>
          </div>
          <el-table
            v-loading="listLoading"
            :data="ingressList"
            element-loading-text="玩命加载中"
            element-loading-spinner="el-icon-loading"
            fit
            highlight-current-row
          >
            <el-table-column label="名称">
              <template slot-scope="scope">
                {{ scope.row.metadata.name }}
              </template>
            </el-table-column>
            <el-table-column label="hosts">
              <template slot-scope="scope">
                <el-link :href="'http://'+scope.row.spec.rules[0].host" type="info" color="blue">{{ scope.row.spec.rules[0].host }}</el-link>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" header-align="center" align="center">
              <template>
                <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="工作负载" name="second">
          <div style="float: left;">
            <el-button type="primary" icon="el-icon-circle-plus-outline"> 添加 DeployMent 资源</el-button>
          </div>
          <div style="float: left; margin-left:20px">
            <el-select v-model="nameSpace" style="width: 180px" placeholder="选择名称空间" class="line-space" @change="DeploymentSearch">
              <el-option v-for="(item, index) in nameSpaceList" :key="index" :label="item.metadata.name" :value="item.metadata.name" class="line-space" />
            </el-select>
          </div>
          <el-table
            v-loading="listLoading"
            :data="deploymentList"
            element-loading-text="玩命加载中"
            element-loading-spinner="el-icon-loading"
            fit
            highlight-current-row
          >
            <el-table-column label="名称">
              <template slot-scope="scope">
                {{ scope.row.metadata.name }}
              </template>
            </el-table-column>
            <el-table-column label="副本数">
              <template slot-scope="scope">
                {{ scope.row.spec.replicas }}
              </template>
            </el-table-column>
            <el-table-column label="容器名称">
              <template slot-scope="scope">
                {{ scope.row.spec.template.spec.containers[0].name }}
              </template>
            </el-table-column>
            <el-table-column label="镜像">
              <template slot-scope="scope">
                {{ scope.row.spec.template.spec.containers[0].image }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" header-align="center" align="center">
              <template>
                <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="服务发现" name="third">
          <div style="float: left;">
            <el-button type="primary" icon="el-icon-circle-plus-outline"> 添加 Service 资源</el-button>
          </div>
          <div style="float: left; margin-left:20px">
            <el-select v-model="nameSpace" style="width: 180px" placeholder="选择名称空间" class="line-space" @change="ServiceSearch">
              <el-option v-for="(item, index) in nameSpaceList" :key="index" :label="item.metadata.name" :value="item.metadata.name" class="line-space" />
            </el-select>
          </div>
          <el-table
            v-loading="listLoading"
            :data="serviceList"
            element-loading-text="玩命加载中"
            element-loading-spinner="el-icon-loading"
            fit
            highlight-current-row
          >
            <el-table-column label="名称">
              <template slot-scope="scope">
                {{ scope.row.metadata.name }}
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                {{ scope.row.spec.type }}
              </template>
            </el-table-column>
            <el-table-column label="端口">
              <template slot-scope="scope">
                {{ scope.row.spec.ports[0].port }}
              </template>
            </el-table-column>
            <el-table-column label="容器端口">
              <template slot-scope="scope">
                {{ scope.row.spec.ports[0].targetPort }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" header-align="center" align="center">
              <template>
                <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="定时任务" name="fourth">
          <div style="float: left;">
            <el-button type="primary" icon="el-icon-circle-plus-outline"> 添加 CronJob 资源</el-button>
          </div>
          <div style="float: left; margin-left:20px">
            <el-select v-model="nameSpace" style="width: 180px" placeholder="选择名称空间" class="line-space" @change="CronjobSearch">
              <el-option v-for="(item, index) in nameSpaceList" :key="index" :label="item.metadata.name" :value="item.metadata.name" class="line-space" />
            </el-select>
          </div>
          <el-table
            v-loading="listLoading"
            :data="cronjobList"
            element-loading-text="玩命加载中"
            element-loading-spinner="el-icon-loading"
            fit
            highlight-current-row
          >
            <el-table-column label="名称" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.metadata.name }}
              </template>
            </el-table-column>
            <el-table-column label="时间" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.spec.schedule }}
              </template>
            </el-table-column>
            <el-table-column label="镜像源" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.spec.jobTemplate.spec.template.spec.containers[0].image }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" header-align="center" align="center">
              <template>
                <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getNameSpaceList } from '@/api/namespace'
import { getIngressList } from '@/api/ingress'
import { getDeployMentList } from '@/api/deployment'
import { getServiceList } from '@/api/service'
import { getCronJobList } from '@/api/cronjob'

export default {
  data() {
    return {
      // first page
      activeName: 'first',
      // loading status
      listLoading: true,
      // default namespace
      nameSpace: 'default',
      // namespace data
      nameSpaceList: [],
      // ingress data
      ingressList: null,
      // deploymnet data
      deploymentList: null,
      // service data
      serviceList: null,
      // cronjob data
      cronjobList: null
    }
  },
  created() {
    this.fetchDataFirst()
    // this.fetchDataSecond()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    fetchDataFirst() {
      const params = {
        env: 'old'
      }
      const params1 = {
        env: 'old',
        namespace: this.nameSpace
      }
      getNameSpaceList(params).then(response => {
        this.nameSpaceList = response.data
      })
      getIngressList(params1).then(response => {
        this.ingressList = response.data
      })
      getDeployMentList(params1).then(response => {
        this.deploymentList = response.data
      })
      getServiceList(params1).then(response => {
        this.serviceList = response.data
      })
      this.listLoading = false
    },
    IngressSearch(val) {
      const params = {
        env: 'old',
        namespace: val
      }
      getIngressList(params).then(response => {
        this.ingressList = response.data
      })
      this.listLoading = false
    },
    DeploymentSearch(val) {
      const params = {
        env: 'old',
        namespace: val
      }
      getDeployMentList(params).then(response => {
        this.deploymentList = response.data
      })
      this.listLoading = false
    },
    ServiceSearch(val) {
      const params = {
        env: 'old',
        namespace: val
      }
      getServiceList(params).then(response => {
        this.serviceList = response.data
      })
      this.listLoading = false
    },
    CronjobSearch(val) {
      const params = {
        env: 'old',
        namespace: val
      }
      getCronJobList(params).then(response => {
        this.cronjobList = response.data
      })
      this.listLoading = false
    }
  }
}
</script>
