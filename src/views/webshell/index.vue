<template>
  <div>
    <el-button @click="openConsole"> Open Console</el-button>
    <el-dialog :visible.sync="showConsole" :title="'Console'">
      <your-component />
    </el-dialog>
  </div>

</template>
<script>
import YourComponent from './console.vue'
export default {
  components: {
    YourComponent
  },
  data() {
    return {
      showConsole: false
    }
  },
  methods: {
    openConsole() {
      this.showConsole = true
    }
  }
}

</script>
