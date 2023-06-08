<template>
  <div class="container">
    <!-- <h1>Table Example</h1> -->
    <table-component
      :table-columns="tableColumns"
      :table-data="tableData"
      :total="total"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      :table-height="tableHeight"
    />
  </div>
</template>

<script>
import TableComponent from '@/views/form/TableComponent.vue'

export default {
  components: {
    TableComponent
  },
  data() {
    return {
      tableColumns: [
        {
          label: 'Name',
          prop: 'name'
        },
        {
          label: 'Age',
          prop: 'age'
        },
        {
          label: 'Address',
          prop: 'address'
        }
      ],
      tableData: [
        {
          name: 'John Doe',
          age: 25,
          address: '123 Main St'
        },
        {
          name: 'Jane Smith',
          age: 30,
          address: '456 Broadway'
        },
        {
          name: 'Bob Johnson',
          age: 45,
          address: '789 Market St'
        }
      ],
      total: 3,
      pageSize: 10,
      currentPage: 1,
      tableHeight: ''
    }
  }
}
</script>
