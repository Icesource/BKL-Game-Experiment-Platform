**1\. 登录**

> POST /api/user/login

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|username    |ture    |string|用户名（邮箱）                          |
|password    |true    |string   ||

###### 接口示例
``` 
{
    code: 20000,
    message: '登录成功',
    data: {
	    roles: ['admin'],
	    name: 'Super Admin',
	    email: '715409135@qq.com',
	    school: '云南大学',
	    phone: '123135165132'
    }
}
```


**2\. 获取登录用户信息**
在登录后，可能需要获取当前登录用户的信息

> get /api/user/info

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|cookie    |ture    |string|登陆后前端自动带上的sessionid                          |

###### 接口示例
``` 
{
    code: 20000,
    message: '获取当前用户信息成功',
    data: {
        roles: ['admin'],
        name: 'Super Admin',
        email: '715409135@qq.com',
        school: '云南大学',
        phone: '123135165132'
    }
}
```


**3\. 登出**

> post /api/user/logout

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|cookie    |ture    |string|登陆后前端自动带上的sessionid                          |

###### 接口示例
``` 
{
    code: 20000,
    message: '登出成功'
}
```



**4\. 注册**

> post /api/user/register

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|QQ    |ture    |string|                          |
|age    |ture    |string|                          |
|email   |ture    |string|                          |
|gender    |ture    |string|性别，0为男，1为女                   |
|name    |ture    |string| 真实姓名                         |
|password    |ture    |string|                           |
|phone    |ture    |string|                          |
|school    |ture    |string|                          |
###### 接口示例
``` 
{
    code: 20000,
    message: '注册成功'
}
```


**5\. 列出用户列表**
管理员查看用户的信息，查看该用户最近的操作，是否活跃
> get /api/users/list

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|currentPage    |ture  |int|                          |
|pageSize    |ture  |int|                          |
|username    |ture  |int| 可以预留一个模糊查找的字段                        |

###### 接口示例
``` 
{
    code: 20000,
    message: '获取用户列表成功',
    data:{
        totalElements:10
        content:[
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
          }
        ]
    }
}
```


**6\. 查看用户最近的操作**
根据用户id查看用户最近的五条操作
> get /api/users/operate

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|id    |ture    |string|                          |

###### 接口示例
``` 
{
    code: 20000,
    message: '成功',
    data:{
        content:[
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
    }
}
```



**7\. 列出游戏（网络列表）**

> get /api/games/list?currentPage=0&pageSize=20

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|currentPage    |ture    |int|                          |
|pageSize    |ture    |int|                          |

###### 接口示例
``` 
{
    code: 20000,
    message: '获取游戏列表成功',
    data:{
        totalElements:10,
        content: [
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
    }
}
```



**8\. 添加游戏（网络）**

> post /api/games/add

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|K    |ture    |int|                          |
|N    |ture    |int|                          |
|T    |ture    |int|                          |
|X0    |ture    |int|                          |
|R0    |ture    |int|                          |
|c    |ture    |int|                          |
|d    |ture    |int|                          |
|o    |ture    |int|                          |
|gameName    |ture    |string|                          |


###### 接口示例
``` 
{
    code: 20000,
    message: '添加游戏成功'
}
```



**9\. 更新游戏（网络）参数**

> post /api/games/update

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|K    |ture    |int|                          |
|N    |ture    |int|                          |
|T    |ture    |int|                          |
|X0    |ture    |int|                          |
|R0    |ture    |int|                          |
|c    |ture    |int|                          |
|d    |ture    |int|                          |
|o    |ture    |int|                          |
|gameName    |ture    |string|                          |


###### 接口示例
``` 
{
    code: 20000,
    message: '更新游戏参数成功'
}
```



**10\. 重置游戏（网络）**

> get /api/games/reset

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|id    |ture    |int| 需要重置的游戏id                         |

###### 接口示例
``` 
{
    code: 20000,
    message: '重置游戏成功'
}
```


**11\. 变更游戏（网络）状态**
启用或停用游戏
> get /api/games/changeStatus

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|id    |ture    |int| 游戏id                         |

###### 接口示例
``` 
{
    code: 20000,
    message: '启用/停用游戏成功'
}
```



**12\. 获取玩家该轮的屏幕显示信息**
> get /api/games/playGame

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|gameId    |ture    |int| 游戏id                         |
|玩家Id    |ture    |int| 这个参数需要解析token获取，不在传参列表内                  |

###### 接口示例
``` 
{
    code: 20000,
    message: '获取玩家该轮信息成功',
    data:{
          'Resource': 5.1651,
          'neiborChoose': '合作',
          'neiborBenefit': 1.5613,
          'cooperationBenefit': 1.9999,
          'betrayBenefit': -2.6513
        }
}
```


**13\. 选择策略（合作背叛）**
> get /api/games/playChoice

###### 请求参数
|参数|必选|类型|说明|
|:-----  |:-------|:-----|-----                               |
|choice    |ture    |int| 策略，0为合作，1为背叛                         |

###### 接口示例
``` 
{
    code: 20000,
    message: '选择策略成功'
}
```