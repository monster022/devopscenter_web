import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/machine',
    method: 'get',
    params
  })
}

export function getPassWordList(params) {
  return request({
    url: '/machine/password',
    method: 'get',
    params
  })
}

export function deleteList(params) {
  return request({
    url: '/machine',
    method: 'delete',
    params
  })
}
