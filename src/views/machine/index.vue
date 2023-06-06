<template>
  <div class="app-container">
    <!-- 表头 -->
    <div>
      <el-button type="primary" icon="el-icon-plus">添加机器</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
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
      <el-table-column label="地址" header-align="center" align="center">
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
          <el-tag :type="scope.row.instance_tag | tagFilter">{{ scope.row.instance_tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        header-align="center"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="small" icon="el-icon-view" @click="showPassword(row)">查看密码</el-button>
          <el-button type="text" size="small" icon="el-icon-edit" @click="openConfiguration">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" @click="deleteMachine(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑 子表单 -->
    <el-dialog :visible.sync="openDetail" width="600px" :title="'修改'">
      <el-from ref="editFrom" :model="editFrom" label-position="center">
        <el-form-item label="名称">
          <el-input v-model="editFrom.instance_name" style="width: 430px" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editFrom.instance_ip" style="width: 430px" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editFrom.instance_username" style="width: 430px" />
        </el-form-item>
        <el-form-item label="CPU">
          <el-input v-model="editFrom.instance_cpu" style="width: 430px" />
        </el-form-item>
        <el-form-item label="内存">
          <el-input v-model="editFrom.instance_memory" style="width: 430px" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="editFrom.instance_tag" style="width: 430px" />
        </el-form-item>
      </el-from>
      <div slot="footer">
        <el-button @click="openDetail = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>

    <el-pagination layout="total, prev, pager, next" :total="total" :current-page.sync="currentPage" :page-size="size" @prev-click="pageChange" @next-click="pageChange" @current-change="pageChange" />
  </div>
</template>

<script>
import { getList, getPassWordList, deleteList } from '@/api/machine'

export default {
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
      listLoading: true,
      // 分页设置
      total: null,
      currentPage: 1,
      size: 13,
      openDetail: false,
      editFrom: {
        instance_name: '',
        instance_ip: '',
        instance_username: '',
        instance_cpu: '',
        instance_memory: '',
        instance_tag: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const params = {
        page: 1,
        size: this.size
      }
      getList(params).then(response => {
        this.list = response.data
        this.total = response.total
      })
      this.listLoading = false
    },

    pageChange(val) {
      this.listLoading = true
      const params = {
        page: val,
        size: this.size
      }
      getList(params).then(response => {
        this.list = response.data
        this.total = response.total
      })
      this.listLoading = false
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
      // this.editFrom.instance_name = val.instance_name
      // this.editFrom.instance_ip = val.instance_ip
      // this.editFrom.instance_username = val.instance_username
      // this.editFrom.instance_cpu = val.instance_cpu
      // this.editFrom.instance_memory = val.instance_memory
      // this.editFrom.instance_tag = val.instance_tag
      this.openDetail = true
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
    }
  }
}
</script>
