import request from '@/utils/request'

export function getConfigMap(params) {
  return request({
    url: '/configmap',
    method: 'get',
    params
  })
}

export function postConfigMapV2(data) {
  return request({
    url: '/configmapV2',
    method: 'post',
    data
  })
}
