import request from '@/utils/request'

/*  fetchList, createGame, updateGame, resetGame, changeGameStatus  */
export function fetchList(query) {
  return request({
    url: '/api/games/list',
    method: 'get',
    params: query
  })
}

export function createGame(data) {
  return request({
    url: '/api/games/add',
    method:'post',
    data
  })
}

export function updateGame(data) {
  return request({
    url:'/api/games/update',
    method: 'post',
    data
  })
}

export function resetGame(query) {
  return request({
    url:'/api/games/reset',
    method:'get',
    params: query
  })
}

export function changeGameStatus(query) {
  return request({
    url:'/api/games/changeStatus',
    method: 'get',
    params: query
  })
}

export function playGameInfo(query) {
  return request({
    url: 'api/games/playGame',
    method: 'get',
    params: query
  })
}

export function playChoice(query) {
  return request({
    url: 'api/games/playChoice',
    method: 'get',
    params: query
  })
}

export function answerQuestions(data) {
  return request({
    url: 'api/user/pass',
    method: 'post',
    data
  })
}

export function exportCsv(params) {
  return request({
    url: 'api/games/csv',
    method: 'get',
    params: params
  })
}

export function gameHistory(params) {
  return request({
    url: 'api/games/history',
    method: 'get',
    params: params
  })
}
