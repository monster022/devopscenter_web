import request from '@/utils/request'
import axios from 'axios'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

// export function testPostData(data) {
//   return request({
//     url: '/api/postData',
//     method: 'post',
//     data
//   })
// }

export function testPostData(data) {
  axios.post('http://127.0.0.1:8080/devops/api/postData', data).then(response => {
    console.log('successful')
  }).catch(error => {
    console.log(error)
  })
}
