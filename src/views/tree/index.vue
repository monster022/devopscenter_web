js
<template>
  <div>请求状态：{{ requestStatus }}</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      requestStatus: '未请求',
      intervalId: null,
      counter: 0,
      maxCount: 600, // 最多请求600次，即10分钟
      apiUrl: 'http://127.0.0.1:8080/devops/jenkins/job-status?job-name=flight_uat'
    }
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.makeRequest()
    }, 100000)
  },
  methods: {
    makeRequest() {
      axios
        .get(this.apiUrl)
        .then(response => {
          if (response.data === true) {
            console.log(response.data)
            this.requestStatus = '请求成功'
            clearInterval(this.intervalId)
          } else {
            this.counter++
            this.requestStatus = `正在请求中...（第 ${this.counter} 次）`
            if (this.counter >= this.maxCount) {
              clearInterval(this.intervalId)
              this.requestStatus = '超时停止请求'
            }
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>
