var express = require('express');
var router = express.Router();
var sql = require("../lib/sql");
var game = require("../lib/game");
var auth = require("../lib/authVerify");
var fs = require("fs");
var process = require('process');

//获取游戏列表及其参数
router.get('/list',function (req,res) {
    auth.loginVerify(req,res,function (status) {
        if(status){//如果用户登陆了
            var currentPage = req.query.currentPage;
            var pageSize = req.query.pageSize;
            if(currentPage == undefined)
                currentPage = 0;
            if(pageSize == undefined)
                pageSize = 20;
            sql.listGames(currentPage,pageSize,function (status,result) {
                if(!status)
                    res.json({
                        "code": 0,
                        "message": 'getGamelistFail',
                        "data": {}
                    });
                else
                    res.json({
                        "code": 20000,
                        "message": 'getGamelistSuccess',
                        "data": result
                    });
            })
        }
    })

});

//添加游戏
router.post('/add',function (req,res) {
    auth.adminVerify(req,res,function (status) {
        if(status){//如果用户具有管理员权限
            sql.addGame(req.body,function (status, gid) {
                if (status) {
                    req.body["id"] = gid;
                    game.add(req.body);
                    res.json({
                        "code": 20000,
                        "message": 'addSuccess'
                    })
                }
                else
                    res.json({
                        "code": 0,
                        "message": 'addFail'
                    })
            })
        }
    });
});

//更新游戏参数
router.post('/update',function (req,res) {
    auth.adminVerify(req,res,function (status) {
        if(status){//如果用户具有管理员权限
            sql.updateGame(req.body,function (status, data) {
                if (status) {
                    game.update(req.body);
                    res.json({
                        "code": 20000,
                        "message": 'updateGameSuccess'
                    })
                }
                else
                    res.json({
                        "code": 0,
                        "message": 'updateGameFail'
                    })
            })
        }
    });
});

//重置游戏
router.get('/reset',function (req,res) {
    auth.adminVerify(req,res,function (status) {
        if(status){
            sql.resetGame(req.query.id,function (status, data) {//重置数据库中的游戏网络资源量
                if(status)
                    game.reset(req.query.id,function (status) {//重置内存中的游戏网络
                        if (status) {
                            res.json({
                                "code": 20000,
                                "message": 'resetGameSuccess'
                            })
                        }
                        else
                            res.json({
                                "code": 0,
                                "message": 'resetGameFail'
                            })
                    });
                else
                    res.json({
                        "code": 0,
                        "message": 'resetGameFail'
                    })
            })
        }
    });
});

//变更游戏状态，类似于删除一个游戏
router.get('/changeStatus',function (req,res) {
    auth.adminVerify(req,res,function (status) {
        if(status){
            sql.changeStatus(req.query.id,function (status, data) {//在数据库的层面上使某游戏不为用户可见
                if (status) {
                    res.json({
                        "code": 20000,
                        "message": 'changeGameStatusSuccess'
                    })
                }
                else
                    res.json({
                        "code": 0,
                        "message": 'changeGameStatusFail'
                    })
            })
        }
    });
});

//获取轮次信息
router.all('/playGame',function (req,res) {
    auth.loginVerify(req,res,function (status) {
        if(status){
            if(req.session.passed == 0){
                res.json({
                    code: 30001,
                    message: 'unAnswered',
                })
            }
            else{
                try{
                    var gid = req.query.gameId;
                    var uid = req.session.uid;
                    if(game.add_user(gid,uid) === false){
                        res.json({
                            code: 0,
                            message: 'numberIsFull',
                            data:{}
                        })
                    }
                    else if(game.playAble(gid,uid) === false){
                        res.json({
                            code: 0,
                            message: '!!!!!',
                            data:{}
                        });
                    }
                    else{
                        game.playGame(gid,uid,function (status,result) {
                            if(status)
                                res.json({
                                    code: 20000,
                                    message: 'getGameInfoSuccess',
                                    data:result
                                });
                            else
                                res.json({
                                    code: 0,
                                    message: 'getGameInfoFail',
                                    data:{}
                                });
                        });
                    }
                }
                catch (e) {
                    console.log(e)
                    res.json({
                        code: 0,
                        message: 'getGameInfoFail',
                        data:{}
                    })
                }
            }
        }
    });
});

//进行选择
router.get('/playChoice',function (req,res) {
    auth.loginVerify(req,res,function (status) {
        if(status){
            try{
                var gid = req.query.gameId;
                var uid = req.session.uid;
                var strategy = req.query.choice;
                if(game.add_user(gid,uid) === false ){
                    res.json({
                        code: 0,
                        message: 'numberIsFull',
                        data:{}
                    });
                }
                else if(game.playAble(gid,uid) === false){
                    res.json({
                        code: 0,
                        message: '!!!!!',
                        data:{}
                    });
                }
                else{
                    game.play(gid,uid,strategy,function (benefit) {
                        if(benefit === false){
                            res.json({
                                code: 20000,
                                message: 'chooseStrategyFail',
                                data:{}
                            });
                        }
                        else if(benefit === -1){
                            res.json({
                                code: 20000,
                                message: 'chooseStrategyFail',
                                data:{}
                            })
                        }
                        else{
                            res.json({
                                code: 20000,
                                message: 'chooseStrategySuccess',
                                data:{
                                    benefit:benefit
                                }
                            })
                        }
                    });
                }
            }
            catch (e) {
                res.json({
                    code: 0,
                    message: 'chooseStrategyFail',
                    data:{}
                })
            }
        }
    });
});

//导出csv
router.post('/csv',function (req,res) {
    // auth.adminVerify(req,res,function (status) {
    //     if(status){
            var parameters = game.getParameters(req.query.id);
            sql.getOperations(req.query.id,function (status,content) {
                if(status) {
                    var result = "index,last_strategy,last_income,neighbor_index,neighbor_strategy,neighbor_income,R,strategy,X,vector,time\n";
                    for (var line of content)
                        result += Object.values(line).join(",")+"\n";
                    fs.writeFile("../csv/"+parameters+".csv",result,function (err) {
                        if(err){
                            throw err;
                        }
                        else{
                            res.download("../csv/"+parameters+".csv");
                        }

                    })
                }
    //             else{
    //                 res.json({
    //                     code:0
    //                 });
    //             }
    //         })
    //     }
    });
});

router.get('/abort',function (req,res) {
    auth.adminVerify(req,res,function(status) {
        if(status){
            game.save(function (status) {
                if(status)
                    res.json({
                        code:20000,
                        message:"保存网络成功"
                    });
                else
                    res.json({
                        code:0,
                        message:"保存网络失败"
                    });
                process.abort();
            })
        }
    })
});

router.all("/history",function (req,res) {
    auth.loginVerify(req,res,function (status) {
        if(status){
            if(req.session.passed == 0){
                res.json({
                    code: 30001,
                    message: 'unAnswered',
                })
            }
            else{
                try{
                    var gid = req.query.gameId;
                    var uid = req.session.uid;
                    var gameType = req.query.gameType;
                    if(game.add_user(gid,uid) === false){
                        res.json({
                            code: 0,
                            message: 'numberIsFull',
                            data:{}
                        })
                    }
                    else if(game.playAble(gid,uid) === false){
                        res.json({
                            code: 0,
                            message: '!!!!!',
                            data:{}
                        });
                    }
                    else{
                        var result = {};
                        var send = function () {
                            res.json({
                                code: 20000,
                                message: 'getGameInfoSuccess',
                                data:result
                            });
                        };
                        if(gameType == "1"){
                            sql.getStrategyIncomeHistory(gid,uid,function (status,data) {
                                if(status) {
                                    result.history = data;
                                    send();
                                }
                            })
                        }
                        else if(gameType == "2"){
                            sql.getStrategyIncomeHistory(gid,uid,function (status,data) {
                                if(status){
                                    result.history = data;
                                    var [CNum,DNum] = game.getNeighborStrategyRating(gid,uid);
                                    result.neighbor = {
                                        "CNum":CNum,
                                        "DNum":DNum
                                    };
                                    send()
                                }
                            });
                        }
                        else if(gameType == "3"){
                            sql.getStrategyIncomeHistory(gid,uid,function (status,data) {
                                if(status){
                                    result.history = data;
                                    var [CNum,DNum] = game.getNeighborStrategyRating(gid,uid);
                                    result.neighbor = {
                                        "CNum":CNum,
                                        "DNum":DNum
                                    }
                                    result.resource = game.getResource(gid,uid);
                                    send()
                                }
                            });
                        }
                        else if(gameType == "4"){
                            sql.getStrategyIncomeResourceHistory(uid,gid,function (status,data) {
                                if(status){
                                    result.history = data;
                                    var [CNum,DNum] = game.getNeighborStrategyRating(gid,uid);
                                    result.neighbor = {
                                        "CNum":CNum,
                                        "DNum":DNum
                                    };
                                    send()
                                }
                            });
                        }
                        else
                            throw "gameType error";
                    }
                }
                catch (e) {
                    res.json({
                        code: 0,
                        message: 'getGameInfoFail',
                        data:{}
                    })
                }
            }
        }
    });
});
module.exports = router;
