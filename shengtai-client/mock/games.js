const game_list = [
  {
    'id': '6513216',
    'gameName': '游戏1',
    'picUrl': '',
    'N': 500 /* 网络规模 */,
    'T': 2, /* 增长率 */
    'K': 1,
    'x0': 0.1,
    'R0': 0.3,
    'ec': 0.3,
    'ed': 0.3,
    'o': 0.5,
    'status': 1
  },
  {
    'id': '6513216',
    'gameName': '游戏2',
    'picUrl': '',
    'N': 500 /* 网络规模 */,
    'T': 2, /* 增长率 */
    'K': 1,
    'x0': 0.1,
    'R0': 0.3,
    'ec': 0.3,
    'ed': 0.3,
    'o': 0.5,
    'status': 0
  },
  {
    'id': '6513216',
    'gameName': '游戏3',
    'picUrl': '',
    'N': 500 /* 网络规模 */,
    'T': 2, /* 增长率 */
    'K': 1,
    'x0': 0.1,
    'R0': 0.3,
    'ec': 0.3,
    'ed': 0.3,
    'o': 0.5,
    'X': 0.3,
    'R': 0,
    'status': 1
  },
  {
    'id': '6513216',
    'gameName': '游戏4',
    'picUrl': '',
    'N': 500 /* 网络规模 */,
    'T': 2, /* 增长率 */
    'K': 1,
    'x0': 0.1,
    'R0': 0.3,
    'ec': 0.3,
    'ed': 0.3,
    'o': 0.5,
    'X': 0.3,
    'R': 0,
    'status': 0
  }
]

export default [
  // user login
  {
    url: '/api/games/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          content: game_list,
          totalElements: 10
        }
      }
    }
  },
  {
    url: '/api/games/add',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        message: '添加游戏成功',
      }
    }
  },
  {
    url:'/api/games/update',
    type:'post',
    response: _=>{
      return{
        code:20000,
        message: '更新参数成功'
      }
    }
  },
  {
    url:'/api/games/reset',
    type:'get',
    response: _=>{
      return{
        code:20000,
        message: '重置网络成功'
      }
    }
  },
  {
    url:'/api/games/changeStatus',
    type:'get',
    response: _=>{
      return{
        code:20000,
        message: '启用网络成功'
      }
    }
  },
  {
    url:'/api/games/playGame',
    type:'get',
    response: _=>{
      return{
        code:30001,
        message: '获取玩家该轮信息成功',
        data:{
          'Resource': 5.1651,
          'neiborChoose': '合作',
          'neiborBenefit': 1.5613,
          'cooperationBenefit': 1.9999,
          'betrayBenefit': -2.6513
        }
      }
    }
  },
  {
    url:'/api/games/playChoice',
    type:'get',
    response: _=>{
      return{
        code:20000,
        message: '选择策略成功'
      }
    }
  },
  {
    url:'/api/games/answerQuestions',
    type:'post',
    response: _=>{
      return{
        code:20000,
        message: '答题正确'
      }
    }
  }
]
