<template>
  <div>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="host" label="域名" />
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="namespace" label="名称空间" />
      <el-table-column fixed="right" label="操作" header-align="center" align="center">
        <template>
          <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        id: '1',
        name: 'demo',
        host: 'demo.chengdd.cn',
        path: '/(.*)',
        namespace: 'dev'
      }, {
        id: '2',
        name: 'demo',
        host: 'demo.chengdd.cn',
        path: '/',
        namespace: 'dev'
      }, {
        id: '3',
        name: 'demo',
        host: 'demo.chengdd.cn',
        path: '/api',
        namespace: 'dev'
      }, {
        id: '4',
        name: 'demo',
        host: 'demo.chengdd.cn',
        path: '/api/(.*)',
        namespace: 'dev'
      }, {
        id: '5',
        name: 'demo',
        host: 'demo.chengdd.cn',
        path: '/demo/api/',
        namespace: 'dev'
      }, {
        id: '6',
        name: 'hotel',
        host: 'hotel.chengdd.cn',
        path: '/',
        namespace: 'dev'
      }, {
        id: '7',
        name: 'hotel',
        host: 'hotel.chengdd.cn',
        path: '/api',
        namespace: 'dev'
      }, {
        id: '8',
        name: 'message',
        host: 'message.chengdd.cn',
        path: '/',
        namespace: 'dev'
      }, {
        id: '9',
        name: 'passport',
        host: 'passport.chengdd.cn',
        path: '/',
        namespace: 'dev'
      }]
    }
  },
  methods: {
    // ok
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const data = this.tableData
      const cellValue = row[column.property]
      const noSortArr = ['id', 'path', 'namespace']
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
    objectSpanMethod1({ row, column, rowIndex, columnIndex }) {
      const data = this.tableData // 拿到当前table中数据
      const cellValue = row[column.id] // 当前位置的值
      const noSortArr = ['path'] // 不需要合并的字段（不进行合并行的prop）
      if (cellValue && !noSortArr.includes(column.id)) {
        const prevRow = data[rowIndex - 1] // 获取到上一条数据
        let nextRow = data[rowIndex + 1] // 下一条数据
        if (prevRow && prevRow[column.id] === cellValue) { // 当有上一条数据，并且和当前值相等时
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.id] === cellValue) { // 当有下一条数据并且和当前值相等时,获取新的下一条
            nextRow = data[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    }
  }
}
</script>
