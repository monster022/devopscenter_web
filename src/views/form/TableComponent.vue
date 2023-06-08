<template>
  <div>
    <el-table :data="tableData" :height="tableHeight" style="width: 100%">
      <el-table-column v-for="column in tableColumns" :key="column.prop" :label="column.label" :prop="column.prop" />
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :total="total"
      layout="sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
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
    },
    total: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    tableHeight: {
      type: [Number, String],
      default: ''
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.$emit('update:currentPage', page)
    },
    handleSizeChange(size) {
      this.$emit('update:pageSize', size)
    }
  }
}
</script>
