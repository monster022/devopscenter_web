<template>
  <div class="app-container">
    <div>
      <el-tabs @tab-click="handleClick">
        <el-tab-pane label="负载均衡" name="first">
          <div style="float: left;">
            <el-button type="primary" icon="el-icon-circle-plus-outline"> 添加 Ingress 资源</el-button>
          </div>
          <div style="float: left; margin-left:20px">
            <el-select v-model="ingressNameSpace" style="width: 180px" placeholder="选择名称空间" class="line-space" @change="IngressSearch">
              <el-option v-for="(item, index) in nameSpaceList" :key="index" :label="item.metadata.name" :value="item.metadata.name" class="line-space" />
            </el-select>
          </div>
          <el-table
            v-loading="listLoading"
            :data="ingressList"
            :span-method="objectSpanMethod"
            element-loading-text="玩命加载中"
            element-loading-spinner="el-icon-loading"
            fit
            highlight-current-row
          >
            <el-table-column label="序号">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="域名">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="small" icon="el-icon-link">{{ scope.row.spec.rules[0].host }}</el-button> -->
                <el-link :href="'http://'+scope.row.host" type="primary" :underline="false" icon="el-icon-link">{{ scope.row.host }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="路径">
              <template slot-scope="scope">
                {{ scope.row.path }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="130" header-align="center" align="center">
              <template>
                <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="total, prev, pager, next" :hide-on-single-page="true" :total="ingressTotal" :current-page.sync="ingressCurrentPage" :page-size="ingresssize" @prev-click="ingressPageChange" @next-click="ingressPageChange" @current-change="ingressPageChange" />
        </el-tab-pane>
        <el-tab-pane label="工作负载" name="second">
          <div style="float: left;">
            <el-button type="primary" icon="el-icon-circle-plus-outline"> 添加 DeployMent 资源</el-button>
          </div>
          <div style="float: left; margin-left:20px">
            <el-select v-model="deploymentNameSpace" style="width: 180px" placeholder="选择名称空间" class="line-space" @change="DeploymentSearch">
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
            <el-table-column label="序号" width="95" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column label="名称" width="300" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="副本数" width="95" header-align="center" align="center">
              <template slot-scope="scope" icon="el-icon-edit-outline">
                {{ scope.row.replicate }}
              </template>
            </el-table-column>
            <el-table-column label="容器名称" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.container_name }}
              </template>
            </el-table-column>
            <el-table-column label="镜像" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.image }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="130" header-align="center" align="center">
              <template>
                <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="total, prev, pager, next" :hide-on-single-page="true" :total="deploymentTotal" :current-page.sync="deploymentCurrentPage" :page-size="deploymentSize" @prev-click="deploymentPageChange" @next-click="deploymentPageChange" @current-change="deploymentPageChange" />
        </el-tab-pane>
        <el-tab-pane label="服务发现" name="third">
          <div style="float: left;">
            <el-button type="primary" icon="el-icon-circle-plus-outline"> 添加 Service 资源</el-button>
          </div>
          <div style="float: left; margin-left:20px">
            <el-select v-model="serviceNameSpace" style="width: 180px" placeholder="选择名称空间" class="line-space" @change="ServiceSearch">
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
            <el-table-column label="序号">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="端口名称">
              <template slot-scope="scope">
                {{ scope.row.port_name }}
              </template>
            </el-table-column>
            <el-table-column label="端口">
              <template slot-scope="scope">
                {{ scope.row.port }}
              </template>
            </el-table-column>
            <el-table-column label="目标端口">
              <template slot-scope="scope">
                {{ scope.row.target_port }}
              </template>
            </el-table-column>
            <el-table-column label="节点端口">
              <template slot-scope="scope">
                {{ scope.row.node_port }}
              </template>
            </el-table-column>
            <el-table-column label="协议">
              <template slot-scope="scope">
                {{ scope.row.protocol }}
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                {{ scope.row.type }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" header-align="center" align="center">
              <template>
                <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="total, prev, pager, next" :hide-on-single-page="true" :total="serviceTotal" :current-page.sync="serviceCurrentPage" :page-size="serviceSize" @prev-click="servicePageChange" @next-click="servicePageChange" @current-change="servicePageChange" />
        </el-tab-pane>
        <el-tab-pane label="定时任务" name="fourth">
          <div style="float: left;">
            <el-button type="primary" icon="el-icon-circle-plus-outline"> 添加 CronJob 资源</el-button>
          </div>
          <div style="float: left; margin-left:20px">
            <el-select v-model="cronjobNameSpace" style="width: 180px" placeholder="选择名称空间" class="line-space" @change="CronjobSearch">
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
            <el-table-column label="序号">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column label="名称" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="时间" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.schedule }}
              </template>
            </el-table-column>
            <el-table-column label="镜像源" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.image }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120" header-align="center">
              <template>
                <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="total, prev, pager, next" :hide-on-single-page="true" :total="cronjobtTotal" :current-page.sync="cronjobCurrentPage" :page-size="cronjobSize" @prev-click="cronjobPageChange" @next-click="cronjobPageChange" @current-change="cronjobPageChange" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getNameSpaceList } from '@/api/namespace'
import { getIngressListV2 } from '@/api/ingress'
import { getDeployMentListV2 } from '@/api/deployment'
import { getServiceListV2 } from '@/api/service'
import { getCronJobListV2 } from '@/api/cronjob'

export default {
  data() {
    return {
      // first page
      // activeName: 'first',
      // loading status
      listLoading: true,
      // default namespace
      nameSpace: 'default',
      // ingress default namespace
      ingressNameSpace: 'default',
      // deployment default namespace
      deploymentNameSpace: 'default',
      // service default namespace
      serviceNameSpace: 'default',
      // cronjob default namespace
      cronjobNameSpace: 'default',
      // namespace data
      nameSpaceList: [],
      // ingress data
      ingressList: [],
      // deploymnet data
      deploymentList: null,
      // service data
      serviceList: null,
      // cronjob data
      cronjobList: null,
      // Ingress 分页设置
      // size: 12,
      ingressCurrentPage: 1,
      ingressSize: 12,
      ingressTotal: null,
      deploymentCurrentPage: 1,
      deploymentSize: 12,
      deploymentTotal: null,
      serviceCurrentPage: 1,
      serviceSize: 12,
      serviceTotal: null,
      cronjobCurrentPage: 1,
      cronjobSize: 12,
      cronjobTotal: null
    }
  },
  created() {
    this.fetchDataFirst()
    // this.fetchDataSecond()
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    fetchDataFirst() {
      const params = {
        env: 'dev'
      }
      const ingressParams = {
        env: 'dev',
        namespace: this.ingressNameSpace,
        page: 1,
        size: this.ingressSize
      }
      const deplomentParams = {
        env: 'dev',
        namespace: this.deploymentNameSpace,
        page: 1,
        size: this.size
      }
      const serviceParams = {
        env: 'dev',
        namespace: this.serviceNameSpace,
        page: 1,
        size: this.size
      }
      const cronjobParams = {
        env: 'dev',
        namespace: this.cronjobNameSpace,
        page: 1,
        size: this.cronjobSize
      }
      getNameSpaceList(params).then(response => {
        this.nameSpaceList = response.data
      })
      getIngressListV2(ingressParams).then(response => {
        this.ingressList = response.data
        this.ingressTotal = response.total
      })
      getDeployMentListV2(deplomentParams).then(response => {
        this.deploymentList = response.data
        this.deploymentTotal = response.total
      })
      getServiceListV2(serviceParams).then(response => {
        this.serviceList = response.data
        this.serviceTotal = response.total
      })
      getCronJobListV2(cronjobParams).then(response => {
        this.cronjobList = response.data
        this.cronjobTotal = response.total
      })
      this.listLoading = false
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const data = this.ingressList
      const cellValue = row[column.property]
      const noSortArr = [data.id, data.path, data.namespace]
      if (cellValue && !noSortArr.includes(column.property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    },
    IngressSearch(val) {
      const params = {
        env: 'dev',
        namespace: val,
        page: 1,
        size: this.ingressSize
      }
      getIngressListV2(params).then(response => {
        this.ingressList = response.data
        this.ingressTotal = response.total
      })
      this.listLoading = false
    },
    DeploymentSearch(val) {
      const params = {
        env: 'dev',
        namespace: val,
        page: 1,
        size: this.deploymentSize
      }
      getDeployMentListV2(params).then(response => {
        this.deploymentList = response.data
        this.deploymentTotal = response.total
      })
      this.listLoading = false
    },
    ServiceSearch(val) {
      const params = {
        env: 'dev',
        namespace: val,
        page: 1,
        size: this.serviceSize
      }
      getServiceListV2(params).then(response => {
        this.serviceList = response.data
        this.serviceTotal = response.total
      })
      this.listLoading = false
    },
    CronjobSearch(val) {
      const params = {
        env: 'dev',
        namespace: val,
        page: 1,
        size: this.cronjobSize
      }
      getCronJobListV2(params).then(response => {
        this.cronjobList = response.data
        this.cronjobTotal = response.total
      })
      this.listLoading = false
    },
    ingressPageChange(val) {
      this.listLoading = true
      const params = {
        env: 'dev',
        namespace: this.ingressNameSpace,
        page: val,
        size: this.ingressSize
      }
      getIngressListV2(params).then(response => {
        this.ingressList = response.data
      })
      this.listLoading = false
    },
    deploymentPageChange(val) {
      this.listLoading = true
      const params = {
        env: 'dev',
        namespace: this.deploymentNameSpace,
        page: val,
        size: this.deploymentSize
      }
      getDeployMentListV2(params).then(response => {
        this.deploymentList = response.data
      })
      this.listLoading = false
    },
    servicePageChange(val) {
      this.listLoading = true
      const params = {
        env: 'dev',
        namespace: this.serviceNameSpace,
        page: val,
        size: this.serviceSize
      }
      getServiceListV2(params).then(response => {
        this.serviceList = response.data
      })
      this.listLoading = false
    },
    cronjobPageChange(val) {
      this.listLoading = true
      const params = {
        env: 'dev',
        namespace: this.cronjobNameSpace,
        page: val,
        size: this.cronjobSize
      }
      getCronJobListV2(params).then(response => {
        this.cronjobList = response.data
        this.cronjobTotal = response.total
      })
      this.listLoading = false
    }
  }
}
</script>
