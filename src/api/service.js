import request from '@/utils/request'

export function getServiceList(params) {
  return request({
    url: '/services',
    method: 'get',
    params
  })
}

export function getServiceListV2(params) {
  return request({
    url: '/servicesV2',
    method: 'get',
    params
  })
}

export function postServiceV2(data) {
  return request({
    url: '/services',
    method: 'post',
    data
  })
}
