import request from '@/utils/request'

export function getIngressList(params) {
  return request({
    url: '/ingress',
    method: 'get',
    params
  })
}

export function getIngressListV2(params) {
  return request({
    url: '/ingressV2',
    method: 'get',
    params
  })
}
