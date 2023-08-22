import request from '@/utils/request'

export function getCronJobList(params) {
  return request({
    url: '/cronjob',
    method: 'get',
    params
  })
}

export function getCronJobListV2(params) {
  return request({
    url: '/cronjobV2',
    method: 'get',
    params
  })
}

export function postCronJob(data) {
  return request({
    url: '/cronjob',
    method: 'post',
    data
  })
}
