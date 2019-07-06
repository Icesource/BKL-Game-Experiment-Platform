var express = require('express');
var router = express.Router();
var sql = require("../lib/sql");
var auth = require("../lib/authVerify");

//列出用户列表
router.get('/list', function(req, res) {
    auth.adminVerify(req,res,function (status) {
       if(status){
           if(req.query.username === undefined)
               req.query.username = "";
           sql.userlist(req.query.username,function (status, data) {
               if (status) {
                   res.json({
                       "code": 20000,
                       "message": 'getUserListSuccess',
                       "data": data
                   })
               }
               else
                   res.json({
                       "code": 0,
                       "message": 'getUserListFail',
                       "data": {}
                   })
           })
       }
    });
});

//列出某用户的最近五次操作
router.get('/operate',function (req,res) {
    auth.adminVerify(req,res,function (status) {
        if(status){
            var uid = req.query.id;
            sql.operate(uid,function (status,result) {
                if(!status)
                    res.json({
                        code: 0,
                        message: 'queryFail',
                        data:{}
                    });
                else
                    res.json({
                        code: 20000,
                        message: 'querySuccess',
                        data:result
                    })

            })
        }
    });
});

module.exports = router;