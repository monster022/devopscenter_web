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

export function addMachine(data) {
  return request({
    url: '/machine',
    method: 'post',
    // headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function patchMachineName(id, params) {
  return request({
    url: '/machine/' + id,
    method: 'patch',
    params
  })
}

export function getPublishMachineList(id) {
  return request({
    url: '/container/machine/' + id,
    method: 'get'
  })
}

export function getDownloadMachine() {
  return request({
    url: '/download',
    method: 'get'
  })
}
