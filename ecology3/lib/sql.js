var connection = require('./connection').connection;
require("./format");


var login = function(email,password,callback){
    connection.query("select uid,roles,name,email,school,phone,income,passed from ecology.user where " +
        "email = '{0}' and password = '{1}'".format(email.toLowerCase(),password),function (err,result) {

        if (err)
            callback(false);
        else if (result.length == 1) {
            callback(true,result[0].uid,{
                'roles':result[0].roles.split(","),
                "name":result[0].name,
                "email":result[0].email,
                "school":result[0].school,
                "income":result[0].income,
                "studentId":result[0].studentId,
                "phone":result[0].phone,
                "passed":result[0].passed
            });
        }
        else
            callback(-1);
    });
};
//login("524937890@qq.com","7474741lz",console.log);

var userinfo = function (uid,callback) {
    connection.query("select uid,roles,name,email,studentId,school,phone,passed,income from ecology.user where uid={0}".format(uid),function (err,result) {
        if(err)
            callback(false);
        else if (result.length == 1) {
            callback(true,{
                'roles':result[0].roles.split(","),
                "name":result[0].name,
                "email":result[0].email,
                "school":result[0].school,
                "studentId":result[0].studentId,
                "income":result[0].income,
                "phone":result[0].phone,
                'passed':result[0].passed
            });
        }
        else
            callback(false);

    })
};
//userinfo(1,console.log)

var pass = function (uid,callback) {
    connection.query("UPDATE `ecology`.`user` SET `passed`='1' WHERE `uid`='{0}';".format(uid),function (err,result) {
        if(err)
            callback(false);
        else if (result.affectedRows == 1) {
            callback(true)
        }
        else
            callback(false);
    })
};


var register = function(body,callback){
    connection.query("select * from user where email = '{0}' limit 1".format(body.email),function (err,result) {
        if(err)
            callback(false);
        else if(result.length == 1)
            callback(-1);//-1标志已有用此邮箱注册的用户
        else{
            connection.query("INSERT INTO `ecology`.`user` (`email`, `name`, `password`, `socialAccount`, `age`, `studentId`, `gender`, `phone`, `school`) " +
                "VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}');"
                    .format(body.email.toLowerCase(),body.name,body.password,body.socialAccount,body.age,body.studentId.toLowerCase(),body.gender,body.phone,body.school),function (err,result) {
                //console.log(err);
                if (err)
                    callback(false);
                else if (result.affectedRows == 1) {
                    callback(true);
                }
                else
                    callback(false);
            });
        }
    });
};
// register({
//     "email":'524137890@qq.com',
//     "name":'123',
//     "password":'123',
//     "socialAccount":'123',
//     "age":'123',
//     "gender":'123',
//     "phone":'123',
//     "studentId":123,
//     "school":'123'},console.log);

var userlist = function(username,callback){
    connection.query("select uid,name,email,phone,school,date_format(lastTimeToGame,'%Y-%c-%d %h:%i:%s') " +
        "as lastTimeToGame from last_operation where name like '%{0}%'".format(username),function (err,result) {
        if(err)
            callback(false);
        else{
            var temp = [];
            for(var i=0;i < result.length;i++){
                temp.push({
                    "id":result[i].uid,
                    "name":result[i].name,
                    "email":result[i].email,
                    "phone":result[i].phone,
                    "school":result[i].school,
                    "lastTimeToGame":result[i].lastTimeToGame
                })
            }
            callback(true,{
                'totalElements':temp.length,
                content:temp
            })
        }
    })
};
//userlist("",console.log);

var operate = function(uid,callback){//得到每个用户的最近五次操作
    connection.query(("select operations.uid,games.name,operations.strategy,date_format(operations.time,'%Y-%c-%d %h:%i:%s') as time " +
        "from operations,games " +
        "where operations.uid='{0}' and operations.gid = games.gid " +
        "order by time limit 5").format(uid),function (err,result) {
        if(err)
            callback(false);
        else{
            var temp = [];
            for(var i=0;i<result.length;i++)
                temp.push({
                    "id":result[i].uid,
                    "gameName":result[i].name,
                    "strategy":result[i].strategy,
                    "time":result[i].time
                });
            callback(true,{
                "content":temp
            })
        }

    })
};
//operate(1,console.log);

var listGames = function(currentPage,pageSize,callback){//列出游戏
    connection.query("select * from games limit {0},{1}".format(currentPage*pageSize,pageSize),function (err,result) {
        //console.log(err)
        if(err)
            callback(false);
        else{
            var temp = [];
            for(var i=0;i<result.length;i++) {
                temp.push({
                    'id': result[i].gid,
                    'gameName': result[i].name,
                    'picUrl': "./images/" + result[i].name + ".jpg",
                    'N': result[i].N, /* 网络规模 */
                    'T': result[i].T, /* 增长率 */
                    'K': result[i].K,
                    'x0': result[i].X0,
                    'R0': result[i].R0,
                    'ec': result[i].c,
                    'ed': result[i].d,
                    'o': result[i].o,
                    'X': result[i].X,
                    'R': result[i].R,
                    't': result[i].t_,
                    'status': result[i].status,
                    'gameType': result[i].gameType
                });
            }
            callback(true,{
                "totalElements":temp.length,
                "content":temp
            })
        }
    })
};

var getGame = function (gid,callback) {//获得某个游戏的参数
    connection.query("select * from games where gid = '{0}'".format(gid),function (err,result) {
        if(err)
            callback(false);
        else
            callback(true,result);
    })
};
//getGame(1,console.log);

var addGame = function(body,callback){//添加游戏
    connection.query("INSERT INTO `ecology`.`games` (`name`, `N`, `T`, `K`, `X0`, `R0`, `c`, `d`, `o`,`R`,`t_`,`gameType`) " +
        "VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}','{9}','{10}','{11}');".format(body.gameName,
            body.N,body.T,body.K,body.x0,body.R0,body.ec,body.ed,body.o,body.R0,body.t,body.gameType),function (err,result){
            if(err)
                callback(false);
            else
                callback(true,result.insertId);
        }
    )
};
// addGame({
//     'gameName': '游戏4',
//     'N': 500 /* 网络规模 */,
//     'T': 2, /* 增长率 */
//     'K': 1,
//     'x0': 0.1,
//     'R0': 0.3,
//     'ec': 0.3,
//     'ed': 0.3,
//     'o': 0.5
//     },console.log);


var updateGame = function(body,callbcak){//更新游戏参数
    connection.query("UPDATE `ecology`.`games` " +
        "SET `N`='{0}', `T`='{1}', `K`='{2}', `X0`='{3}', `R0`='{4}', `c`='{5}', `d`='{6}', `o`='{7}', `name`='{8}', `t_`='{9}', `gameType`='{10}' WHERE `gid`='{11}';".format(
            body.N,body.T,body.K,body.x0,body.R0,body.ec,body.ed,body.o,body.gameName,body.t,body.gameType,body.id
        ),function (err,result) {
        if(err)
            callbcak(false);
        else
            callbcak(true);
    })
};
// updateGame({
//     'id':1,
//     'gameName': '游戏456',
//     'N': 500,
//     'T': 2,
//     'K': 1,
//     'x0': 0.1,
//     'R0': 0.3,
//     'ec': 0.3,
//     'ed': 0.3,
//     'o': 0.5
// },console.log);

var resetGame = function (gid,callback) {//重置游戏的R以及X
    connection.query("update games set R = R0 , X = X0 where gid = '{0}'".format(gid),function (err1,result) {
        connection.query("DELETE FROM `ecology`.`operations` WHERE (`gid` ='{0}');".format(gid),function (err2,result) {
            connection.query("UPDATE user,income SET user.income = income.income WHERE user.uid = income.uid;",function (err3,result) {
                if(err1 || err2|| err3)
                    callback(false);
                else
                    callback(true)
            });
        });
    })
};
//resetGame(1,console.log);

var changeStatus = function(gid,callback){//更改游戏可识性
    connection.query("update games set status = 1-status where gid = "+gid,function (err,result) {
        if(err)
            callback(false);
        else
            callback(true)
    })
};
//changeStatus(1,console.log);

var record = function(gid,uid,R,strategy,last_strategy,last_income,income,nei_strategy,nei_income,X,user_index,end,vector,nei_index,callback){//记录用户选择
    connection.query("INSERT INTO `ecology`.`operations` (`gid`, `uid`,`index` ,`R`, `strategy`, `last_strategy`,`last_income`, `income`, `nei_index`,`nei_strategy`, `nei_income`, `X`, `vector`)" +
        " VALUES ('{0}', '{1}', '{2}', '{3}', '{4}','{5}', '{6}', '{7}', '{8}','{9}','{10}','{11}','{12}');".format(gid,uid,user_index+1,R,strategy,last_strategy,last_income,income,nei_index+1,nei_strategy,nei_income,X,vector),function (err1,result) {
        if(end){//如果游戏已经结束
            connection.query("UPDATE `ecology`.`games` SET `X`='{0}', `R`='{1}',`status`=0 WHERE `gid`='{2}';".format(X,R,gid),function (err2,result) {
                connection.query("UPDATE `ecology`.`user` SET `income`=`income`+{0} WHERE `uid`='{1}';".format(income,uid),function (err3,result) {
                    if(err1 || err2 || err3){
                        callback(false)
                    }
                    else
                        callback(true);
                });
            });
        }
        else{
            connection.query("UPDATE `ecology`.`games` SET `X`='{0}', `R`='{1}' WHERE `gid`='{2}';".format(X,R,gid),function (err2,result) {
                connection.query("UPDATE `ecology`.`user` SET `income`=`income`+{0} WHERE `uid`='{1}';".format(income,uid),function (err3,result) {
                    if(err1 || err2 || err3){
                        callback(false)
                    }
                    else
                        callback(true);
                });
            });
        }
    })
};
//record(1,1,0.25,0,1,0.222,0,0.33333,0.5,console.log);

var getOperations = function(gid,callback){
    //index,strategy,last_strategy,last_income,neighbor_strategy,neighbor_income,R,strategy,X,time
    connection.query("select `index`, `last_strategy`,`last_income`, `nei_index`,`nei_strategy`, `nei_income`," +
        " `R`,`strategy`,`X`,`vector`,date_format(time,'%Y-%c-%d %h:%i:%s') as time from operations where gid = {0} order by time".format(gid),function (err,result) {
        if(err)
            callback(false);
        else
            callback(true,result);
    })
};
//getOperations(1,console.log);

var getStrategyIncomeHistory = function(gid,uid,callback){
    connection.query("select `strategy`,`income` from operations where `uid` ='{0}' and `gid` = '{1}'".format(uid,gid),function (err,result) {
        if(err)
            callback(false);
        else{
            var strategy = [];
            var income = [];
            for(var i=0;i<result.length;i++){
                strategy.push(result[i].strategy);
                income.push(result[i].income);
            }
            callback(true,{
                "strategy":strategy,
                "income":income
            });
        }
    })
};

var getStrategyIncomeResourceHistory = function(uid,gid,callback){
    connection.query("select `strategy`,`income`,`R` from operations where `uid` ='{0}' and `gid` = '{1}'".format(uid,gid),function (err,result) {
        if(err)
            callback(false);
        else{
            var strategy = [];
            var income = [];
            var resource = [];
            for(var i=0;i<result.length;i++){
                strategy.push(result[i].strategy);
                income.push(result[i].income);
                resource.push(result[i].R);
            }
            callback(true,{
                "strategy":strategy,
                "income":income,
                "resource":resource
            });
        }
    })
};
module.exports = {login,userinfo,register,userlist,listGames,operate,
    addGame,updateGame,record,changeStatus,resetGame,getGame,pass,getOperations,
    getStrategyIncomeHistory,getStrategyIncomeResourceHistory};
