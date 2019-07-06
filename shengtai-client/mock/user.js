
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['user'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    email: '715409135@qq.com',
    school: '云南大学',
    phone: '123135165132'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

const user_list = [
  {
    'id': '565132198161',
    'name': '张三',
    'email': '56156@qq.com',
    'phone': '1234651',
    'school': '云南大学',
    'lastTimeToGame': '2019/04/24 19:00'
  },
  {
    'id': '565132198161',
    'name': '张三',
    'email': '56156@qq.com',
    'phone': '1234651',
    'school': '云南大学',
    'lastTimeToGame': 15
  },
  {
    'id': '565132198161',
    'name': '张三',
    'email': '56156@qq.com',
    'phone': '1234651',
    'school': '云南大学',
    'lastTimeToGame': 15
  },
  {
    'id': '565132198161',
    'name': '张三',
    'email': '56156@qq.com',
    'phone': '1234651',
    'school': '云南大学',
    'lastTimeToGame': 15
  },
  {
    'id': '565132198161',
    'name': '张三',
    'email': '56156@qq.com',
    'phone': '1234651',
    'school': '云南大学',
    'lastTimeToGame': 15
  },
  {
    'id': '565132198161',
    'name': '张三',
    'email': '56156@qq.com',
    'phone': '1234651',
    'school': '云南大学',
    'lastTimeToGame': 15
  },
  {
    'id': '565132198161',
    'name': '张三',
    'email': '56156@qq.com',
    'phone': '1234651',
    'school': '云南大学',
    'lastTimeToGame': 15
  }
]
const user_operate_list = [
  {
    'id': '1562313516',
    'gameName': '游戏1',
    'strategy': '合作',
    'time': '2019/04/24 23:11:00'
  },
  {
    'id': '1562313516',
    'gameName': '游戏1',
    'strategy': '合作',
    'time': '2019/04/24 23:11:00'
  },
  {
    'id': '1562313516',
    'gameName': '游戏1',
    'strategy': '合作',
    'time': '2019/04/24 23:11:00'
  },
  {
    'id': '1562313516',
    'gameName': '游戏1',
    'strategy': '合作',
    'time': '2019/04/24 23:11:00'
  },
  {
    'id': '1562313516',
    'gameName': '游戏1',
    'strategy': '合作',
    'time': '2019/04/24 23:11:00'
  }
]

export default [
  // user login
  {
    url: '/api/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/api/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/api/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url:'/api/user/register',
    type:'post',
    response: _ =>{
      return{
        code: 20000,
        message: '注册成功'
      }
    }
  },

  {
    url:'/api/users/list',
    type:'get',
    response:_=>{
      return{
        code:20000,
        data:{
          content:user_list,
          totalElements:10
        }
      }
    }
  },

  {
    url: '/api/users/operate',
    type: 'get',
    response:_=>{
      return{
        code:20000,
        data:{
          content:user_operate_list,
        }
      }
    }
  }
]
