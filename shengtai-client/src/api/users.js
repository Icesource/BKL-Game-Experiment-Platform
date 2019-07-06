import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/users/list',
    method: 'get',
    params: query
  })
}

export function getUserOperate(query) {
  return request({
    url: '/api/users/operate',
    method: 'get',
    params: query
  })
}


