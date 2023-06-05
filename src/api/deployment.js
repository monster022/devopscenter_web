import request from '@/utils/request'

export function getDeployMentList(params) {
  return request({
    url: '/deployment',
    method: 'get',
    params
  })
}

export function getDeployMentListV2(params) {
  return request({
    url: '/deploymentV2',
    method: 'get',
    params
  })
}

export function getSpecifyDeployMent(params, name) {
  return request({
    url: '/deployment/' + name,
    method: 'get',
    params
  })
}

export function patchDeploymentImage(data) {
  return request({
    url: '/deployment',
    method: 'patch',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
