<template>
  <el-table :data="data">
    <el-table-column v-for="column in tableColumns" :key="column.key" :label="column.label" :prop="column.prop" />
  </el-table>
</template>

<script>
export default {
  props: {
    tableColumns: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      columns: this.tableColumns,
      data: this.tableData
    }
  }
}
</script>
