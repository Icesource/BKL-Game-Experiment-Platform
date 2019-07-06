var express = require('express');
let jwt = require('jsonwebtoken');
var router = express.Router();
var sql = require("../lib/sql");
var auth = require("../lib/authVerify");
var antiSql = require("../lib/antiSqlValid");

//登录
router.post('/login', function(req, res) {
    var body = req.body;
    console.log(body)
    if(antiSql.sqlValid(body.username) || antiSql.sqlValid(body.password)){//判断用户名和密码是否有sql注入
        res.json({
            "code": 0,
            "message": 'specialCharacters',
            "data": {}
        });
    }
    else{
        sql.login(body.username,body.password,function (status,uid,data) {
            if(status === true){
                var token = jwt.sign({
                    success:true,
                    uid:uid,
                    roles:data.roles,
                    passed:data.passed
                },require("../config").superSecret, {expiresIn: 40 * 60});
                res.json({
                    "code": 20000,
                    "message": 'loginSuccess',
                    "data": data,
                    "token":token
                });
            }
            else if(status == -1)
                res.json({
                    "code": 0,
                    "message": 'usernamePwdError',
                    "data": {}
                });
            else
                res.json({
                    "code": 0,
                    "message": 'unknownError',
                    "data": {}
                });
        });
    }
});

//获取当前用户信息
router.get('/info', function(req, res) {
    auth.loginVerify(req,res,function (status) {
       if(status){
           sql.userinfo(req.session.uid, function (status, data) {
               if (status) {
                   res.json({
                       "code": 20000,
                       "message": 'getInfoSuccess',
                       "data": data
                   });
               }
               else
                   res.json({
                       "code": 0,
                       "message": 'getInfoFail',
                       "data": {}
                   });
           });
       }
    });
});

//登出
router.all('/logout', function(req, res) {
    res.json({
        "code": 20000,
        "message": 'logoutSuccess'
    });
});

//注册
router.post('/register', function(req, res,next) {
    var body = req.body;
    for(var field_index in body){
        if(antiSql.sqlValid(body[field_index])){
            req.json({
                "code": 0,
                "message": 'specialCharacters',
                "data": {}
            });
            next()
        }
    }
    sql.register(body,function (status) {
        if(status == true)
            res.json({
                "code": 20000,
                "message": 'registerSuccess'
            });
        else if(status == -1)
            res.json({
                "code": 0,
                "message": 'emailOccupy'
            });
        else
            res.json({
                "code": 0,
                "message": 'registerFail'
            })
    })
});

//通过答题
router.post('/pass', function(req, res,next) {
    auth.loginVerify(req,res,function (status) {
        if(status){
            if(req.body.answer === "BCB"){
                sql.pass(req.session.uid, function (status, data) {
                    if (status) {
                        var token = jwt.sign({
                            success:true,
                            uid:req.session.uid,
                            roles:req.session.roles,
                            passed:1
                        },require("../config").superSecret, {expiresIn: 40 * 60});
                        res.json({
                            "code": 20000,
                            "message": 'answerSuccess',
                            "token":token
                        });
                    }
                    else
                        res.json({
                            "code": 0,
                            "message": 'answerFail'
                        });
                });
            }
            else
                res.json({
                    "code": 0,
                    "message": 'answerError'
                });
        }
    });
});

module.exports = router;
