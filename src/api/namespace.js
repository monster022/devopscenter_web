import request from '@/utils/request'

export function getNameSpaceList(params) {
  return request({
    url: '/namespaces',
    method: 'get',
    params
  })
}
