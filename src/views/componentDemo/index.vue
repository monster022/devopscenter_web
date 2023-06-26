<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="openAddition()">Addition</el-button>
    </div>

    <el-table
      :data="tableData"
      fit
      stripe
      max-height="815"
      highlight-current-row
    >
      <el-table-column label="序号" prop="id" />
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="性别" prop="sex" />
    </el-table>

    <el-dialog title="Add People" :visible.sync="additionDialogVisible" width="600px">
      <TableComponent :table-columns="tableColumns" :table-data="tableData" />
    </el-dialog>
  </div>
</template>

<script>
import TableComponent from './TableComponent.vue'

export default {
  components: {
    TableComponent
  },
  data() {
    return {
      tableColumns: [
        {
          label: 'Id',
          prop: 'id'
        },
        {
          label: 'Name',
          prop: 'name'
        },
        {
          label: 'Sex',
          prop: 'sex'
        }
      ],
      additionDialogVisible: false,
      tableData: [
        {
          id: 1,
          name: '刘一',
          sex: '男'
        },
        {
          id: 2,
          name: '陈二',
          sex: '女'
        },
        {
          id: 3,
          name: '张三',
          sex: '男'
        },
        {
          id: 4,
          name: '李四',
          sex: '男'
        },
        {
          id: 5,
          name: '王五',
          sex: '女'
        },
        {
          id: 6,
          name: '赵六',
          sex: '男'
        },
        {
          id: 7,
          name: '孙七',
          sex: '女'
        },
        {
          id: 8,
          name: '周八',
          sex: '男'
        },
        {
          id: 9,
          name: '吴九',
          sex: '女'
        },
        {
          id: 10,
          name: '郑十',
          sex: '女'
        }
      ]
    }
  },
  methods: {
    openAddition() {
      this.additionDialogVisible = true
    }
  }
}
</script>
