import request from '@/utils/request'

// 获取所有订单
export function getAllOrder(params) {
  return request({
    url: '/order',
    method: 'get',
    params
  })
}

// 获取当前处理人订单
export function getTackleName(params) {
  return request({
    url: '/order/tackle/' + localStorage.getItem('username'),
    method: 'get',
    params
  })
}

// 获取当前处理人的所有TodoList
export function getTackleNameTotal() {
  return request({
    url: '/order/tackle/' + localStorage.getItem('username') + '/total',
    method: 'get'
  })
}

// 获取提交人TodoList
export function getSubmitName(params) {
  return request({
    url: '/order/submit/' + localStorage.getItem('username'),
    method: 'get',
    params
  })
}

// 修改TodoList状态
export function patchStatus(id, status) {
  return request({
    url: '/order/' + id + '/' + status,
    method: 'patch'
  })
}

// 修改TodoList的拒绝状态
export function postStatusReject(id, status, data) {
  return request({
    url: '/order/' + id + '/' + status,
    method: 'post',
    data
  })
}

// 添加TodoList
export function postOrder(data) {
  return request({
    url: '/order',
    method: 'post',
    data
  })
}
