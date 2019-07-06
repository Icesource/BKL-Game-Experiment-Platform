var sql = require('./sql');
var Net = require('./net');
var fs = require('fs');

//初始化所有网络
nets = {};

sql.listGames(0,1000,function (status,result) {
    if(!status)
        console.log("初始化网络失败，请重启...");
    else{
        for(var parameters of Object.values(result.content)){
            (function (parameters) {
                fs.exists("./nets/"+parameters.id+".json",function (exists) {
                    if(exists){
                        fs.readFile("./nets/"+parameters.id+".json",function (err,data) {
                            var id = parameters.id;
                            var gameName = parameters.gameName;
                            nets[id] = new Net();
                            parameters = JSON.parse(data);
                            for(var name of Object.keys(parameters)){
                                nets[id][name] = parameters[name];
                            }
                            console.log("加载已存储的"+gameName+"成功");
                        });
                    }
                    else{
                        console.log("初始化"+parameters.gameName);
                        nets[parameters.id] = new Net(parameters.N,parameters.T,parameters.K,parameters.x0,parameters.R0,parameters.ec,parameters.ed,parameters.o,parameters.t);
                    }
                })
            })(parameters)
        }
    }
});

var play = function (gid,uid,strategy,callback) {//做选择，返回结果
    var [nei_index,nei_strategy,nei_income] = nets[gid].get_random_neighbor(uid);
    var [status,income,R,last_strategy,last_income] = nets[gid].make_choice(uid, strategy);
    if(status === false){
        console.log(gid,"用完");
        callback(false);
    }
    else if(nets[gid].nt > nets[gid].N * nets[gid].t)
        callback(-1);

    var user_index = nets[gid].user_indexs[uid];
    var end = nets[gid].nt >= nets[gid].N*nets[gid].t;
    var vector = nets[gid].getVector().join(";");
    sql.record(gid,uid,R,strategy,last_strategy,last_income,income,nei_strategy,nei_income,nets[gid].X,user_index,end,vector,nei_index,function () {//记录操作
        callback(income);
    });
};


var playGame = function (gid,uid,callback) {//轮次信息
    sql.userinfo(uid,function (status,result) {
        if(status){
            var info = nets[gid].playGame(uid);
            callback(true,{
                'Resource':info[0],
                'lastChoose':info[1],
                'lastBenefit':info[2],
                'neiborChoose': info[3],
                'neiborBenefit':info[4],
                'income':result.income
            })
        }
        else
            callback(false)
    })
};

var update = function(body){//更新内存中现有网络的固定参数，但是不更改X，R
    nets[body.id].K = body.K;
    nets[body.id].N = body.N;
    nets[body.id].T = body.T;
    nets[body.id].c = body.ec;
    nets[body.id].d = body.ed;
    nets[body.id].o = body.o;
    return;
};


var reset = function(gid,callback){//根据gid在内存中重置网络
    sql.getGame(gid,function (status,result) {
        if(status){
            nets[gid] = new Net(result[0].N,result[0].T,result[0].K,result[0].X0,result[0].R0,result[0].c,result[0].d,result[0].o);
            callback(true);
        }
        else
            callback(false);
    })
};

var add = function(body){//内存中增加网络
    nets[body.id] = new Net(body.N,body.T,body.K,body.x0,body.R0,body.ec,body.ed,body.o);
};

var add_user = function(gid,uid){
    return (nets[gid].add_user(uid));
};

var save = function(callback){
    for(var gid of Object.keys(nets)){
        (function (gid){
            fs.writeFile('./nets/'+gid+".json",JSON.stringify(nets[gid]),function (err) {
                if(err)
                    callback(false);
                else if(Object.keys(nets).indexOf(gid) === Object.keys(nets).length-1){
                    callback(true);
                }

            })
        })(gid)
    }
};

var getParameters = function(gid){
    var parameters = ["gid"+gid,"N"+nets[gid].N,"T"+nets[gid].T,"K"+nets[gid].K,"t"+nets[gid].t,"R"+nets[gid].R0,"X"+nets[gid].X0,"c"+nets[gid].c,"d"+nets[gid].d,"o"+nets[gid].o];
    return parameters.join("_");
};

var playAble = function(gid,uid){
    return nets[gid].playAble(uid);
};

var getNeighborStrategyRating = function(gid,uid){
    return nets[gid].getNeighborStrategyRating(uid);//cunm,dnum
};

var getResource = function(gid,uid){
    return nets[gid].getResource()
};
module.exports = {play,update,reset,add,playGame,add_user,save,getParameters,playAble,getNeighborStrategyRating,getResource};
