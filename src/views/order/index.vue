<template>
  <div>
    <div style="float: left; margin-top: 20px; margin-left: 20px; margin-bottom: 10px;">
      <el-button size="small" @click="allOrder()"> 所有待办 </el-button>
      <el-button size="small" @click="tackleOrder()"> 我的待办 </el-button>
      <el-button size="small" @click="submitOrder()"> 我创建的 </el-button>
      <el-button size="small"> 我相关的 </el-button>
      <el-button type="primary" size="small" icon="el-icon-s-promotion" @click="submitOpen()"> 提交申请 </el-button>
    </div>

    <div class="app-container">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%;"
      >
        <el-table-column label="工单号" width="80" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderId }}
          </template>
        </el-table-column>
        <el-table-column label="提交人" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.submitName }}
          </template>
        </el-table-column>
        <el-table-column label="优先级" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.priority | priorityTagFilter">{{ aliasPriority(scope.row.priority) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="内容" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.message }}
          </template>
        </el-table-column>
        <el-table-column label="处理人" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.tackleName }}
          </template>
        </el-table-column>
        <el-table-column label="处理状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.status | statusFilter"> {{ aliasStatus(scope.row.status) }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="拒绝理由" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.rejectReason }}
          </template>
        </el-table-column>
        <el-table-column label="处理时间" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.date }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100px"
          header-align="center"
        >
          <template slot-scope="{row}">
            <el-popconfirm
              title="确定开始处理这条待办吗?"
              icon-color="red"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @onConfirm="PatchStatusCancel(row, 'doing')"
            >
              <el-button v-if="row.status === 'await' && row.tackleName === currentTackleName" slot="reference" type="text" size="small">处理</el-button>
            </el-popconfirm>
            <el-button v-if="row.status === 'doing' && row.tackleName === currentTackleName" type="text" size="small" @click="rejectOpen(row)">驳回</el-button>
            <el-popconfirm
              title="确定撤回这条待办吗?"
              icon-color="red"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @onConfirm="PatchStatusCancel(row, 'cancel')"
            >
              <el-button v-if="row.status === 'doing' && row.submitName === currentTackleName" slot="reference" type="text" size="small">撤回</el-button>
            </el-popconfirm>
            <el-popconfirm
              title="确定完成这条待办吗?"
              icon-color="red"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @onConfirm="PatchStatusCancel(row, 'finish')"
            >
              <el-button v-if="row.status === 'doing' && row.tackleName === currentTackleName" slot="reference" type="text" size="small">完成</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :visible.sync="additionDialogVisible" width="600px" :title="'添加 To-Do'">
      <el-form :model="additionFrom">
        <el-form-item label="优先级" label-width="80px">
          <el-radio v-model="additionFrom.priority" label="normal">一般</el-radio>
          <el-radio v-model="additionFrom.priority" label="important">重要</el-radio>
          <el-radio v-model="additionFrom.priority" label="urgent">紧急</el-radio>
        </el-form-item>
        <el-form-item label="申请内容" label-width="80px">
          <el-input v-model="additionFrom.message" placeholder="请输入内容" style="width:450px;">
            <el-select slot="prepend" v-model="additionFrom.messagePrepend" placeholder="请输入类别" style="width: 110px;">
              <el-option label="申请机器" value="申请机器,  " />
              <el-option label="项目发布" value="项目发布,  " />
              <el-option label="其它" value="其它,  " />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="处理人" label-width="80px">
          <el-select v-model="additionFrom.tackleName" placeholder="请选择处理人" style="width: 450px;">
            <el-option label="总监" value="sheny" />
            <el-option label="运维" value="yen" />
            <el-option label="测试" value="ssh" />
            <el-option label="lihua" value="lihua" />
            <el-option label="wangxy" value="wangxy" />
            <el-option label="前端" value="zhujq" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="medium" @click="additionDialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="additionSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllOrder, getTackleName, getSubmitName, patchStatus, postStatusReject, postOrder } from '@/api/order'
export default {
  filters: {
    priorityTagFilter(tag) {
      const tagMap = {
        normal: 'success',
        important: 'warning',
        urgent: 'danger'
      }
      return tagMap[tag]
    },
    statusFilter(tag) {
      const tagMap = {
        await: '',
        doing: 'warning',
        finish: 'success',
        reject: 'danger',
        cancel: 'info'
      }
      return tagMap[tag]
    }
  },
  data() {
    return {
      // 默认框
      defaultRadio: '所有待办',
      tableData: null,
      currentTackleName: localStorage.getItem('username'),
      additionFrom: {
        submitName: '',
        priority: '',
        message: '',
        messagePrepend: '',
        tackleName: ''
      },
      additionDialogVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    aliasPriority(val) {
      if (val === 'normal') {
        return '一般'
      } else if (val === 'important') {
        return '重要'
      } else {
        return '紧急'
      }
    },
    aliasStatus(val) {
      if (val === 'await') {
        return '待处理'
      } else if (val === 'doing') {
        return '处理中'
      } else if (val === 'reject') {
        return '已拒绝'
      } else if (val === 'cancel') {
        return '已取消'
      } else {
        return '已完成'
      }
    },
    fetchData() {
      const param = {
        page: 1,
        size: 15
      }
      getAllOrder(param).then(response => {
        this.tableData = response.data
      })
    },
    allOrder() {
      const param = {
        page: 1,
        size: 15
      }
      getAllOrder(param).then(response => {
        this.tableData = response.data
      })
    },
    tackleOrder() {
      const param = {
        page: 1,
        size: 15
      }
      getTackleName(param).then(response => {
        this.tableData = response.data
      })
    },
    submitOrder() {
      const param = {
        page: 1,
        size: 15
      }
      getSubmitName(param).then(response => {
        this.tableData = response.data
      })
    },
    rejectOpen(val) {
      this.$prompt('请输入驳回原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value) {
            return '内容不能为空'
          }
        }
      }).then(({ value }) => {
        const data = {
          rejectReason: value
        }
        postStatusReject(val.orderId, 'reject', data).then(response => {
          if (response.data === 'true') {
            this.$message({
              type: 'success',
              message: '已驳回'
            })
          } else {
            this.$message({
              type: 'error',
              message: response.data
            })
          }
        })
      }).catch(err => {
        this.$notify.err({
          message: err
        })
      })
    },
    PatchStatusCancel(val, status) {
      patchStatus(val.orderId, status).then(response => {
        this.$message({
          type: 'success',
          message: status + ' ' + response.message
        })
      })
    },
    submitOpen() {
      this.additionFrom.priority = ''
      this.additionFrom.messagePrepend = ''
      this.additionFrom.message = ''
      this.additionDialogVisible = true
    },
    additionSubmit() {
      const data = {
        submitName: this.currentTackleName,
        priority: this.additionFrom.priority,
        message: this.additionFrom.messagePrepend + this.additionFrom.message,
        tackleName: this.additionFrom.tackleName
      }
      postOrder(data).then(response => {
        this.$message({
          type: 'success',
          message: response.message
        })
      })
      this.additionDialogVisible = false
    }
  }
}
</script>

<style>
  .el-radio-button {
    margin-right: 30px; /* 调整适当的间距 */
  }
  .topAndLeft-interval {
    margin-top: 20px;
    margin-left: 20px;
  }
  .el-card__body {
    padding: 15px;
    height: 60px;
  }
  .card {
    height: 60px;
  }
  .row {
    display: flex;
    align-items: center;
    height: 10px;
    margin-top: 1px;
    margin-left: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
  }
</style>
