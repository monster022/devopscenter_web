import request from '@/utils/request'

// 列表数据
export function getList(params) {
  return request({
    url: '/project',
    method: 'get',
    params
  })
}

// 删除项目
export function deleteList(id) {
  return request({
    url: '/project/' + id,
    method: 'delete'
  })
}

// 添加数据
export function postAddition(data) {
  return request({
    url: '/project',
    method: 'post',
    // headers: { 'Content-Type': 'multipart/form-data' },
    data
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
    // headers: { 'Content-Type': 'multipart/form-data' },
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

// 修改状态
export function patchStatus(params) {
  return request({
    url: '/project',
    method: 'patch',
    params
  })
}

// 修改项目构建路径与包名
export function patchEdit(name, data) {
  return request({
    url: '/project/' + name,
    method: 'patch',
    // headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 项目构建信息
export function getProjectDetails(project, params) {
  return request({
    url: '/project/detail/' + project,
    method: 'get',
    params
  })
}

// 获取 Jenkins 构建状态
export function getJenkinsBuildStatus(project, id) {
  return request({
    url: '/jenkins/' + project + '/' + id,
    method: 'get'
  })
}

// 获取项目的提交信息
export function getProjectCommitMessage(pid, params) {
  return request({
    url: '/project/' + pid + '/commit',
    method: 'get',
    params
  })
}
