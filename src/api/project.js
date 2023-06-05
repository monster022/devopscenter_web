import request from '@/utils/request'

// 列表数据
export function getList(params) {
  return request({
    url: '/project',
    method: 'get',
    params
  })
}

// 分支数据
export function getBranch(params) {
  return request({
    url: '/project/branch',
    method: 'get',
    params
  })
}

// Jenkins Job Build
export function postJenkinsJobBuild(data) {
  return request({
    url: '/jenkins/job',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// export function postJenkinsJobBuild(params, data) {
//   console.log(params.job_name)
//   axios.post('http://127.0.0.1:8080/devops/jenkins/job?' + params, data).then(response => {
//     // this.$message.success(response.message)
//     this.$message({
//       type: 'info',
//       message: response.data.message
//     })
//     // console.log(response.message)
//   }).catch(err => {
//     console.log(err)
//   })
// }

// Harbor Tag List
export function getHarborTag(params) {
  return request({
    url: 'harbor',
    method: 'get',
    params
  })
}

