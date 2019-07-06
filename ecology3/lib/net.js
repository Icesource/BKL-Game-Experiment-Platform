cooperation = 1;
betray = 0;

class Net{
    constructor(N, T, K, X0, R0, c, d, o,t) {
        //do not change，网络固定参数
        this.N = N;//网络大小
        this.T = T;
        this.K = K;
        this.c = c;
        this.d = d;
        this.o = o;
        this.t = t;
        this.X0 = X0;//初始合作比例
        this.R0 = R0;//初始资源量

        //change each term，会变的网络实时参数
        this.X = X0;//网络中当前的合作比例
        this.R = R0;//网络的当前资源量
        this.nt = 0;//网络的当前轮次数

        this.neighbor_net = this.construct_complete_net();//创建二维矩阵作为邻居网络，里面的每一行即一个结点，一行中的每一个值为其邻居结点的索引，如全连接网络的shape=(500,499)
        this.nodes = this.construct_nodes();//记录每一个节点的信息，包含这个节点所分配的用户uid(默认为null)，last_strategy(上一次的策略，根据X值初始化),last_income(上一次选择后的收入，默认为0)
        this.user_indexs = {};//节点分配记录，记录每个加进来的用户被分配的节点索引，uid做name,即uid->index，根据节点的index在neighbor_net，nodes中可以得到此节点的邻居，节点信息

        this.random_indexs = this.construct_indexs();//一个size=N，范围在0-N的随机数组作为每添加一个用户（调用adduser）时，用户在网络中的索引，仅仅为辅助用
    }
    construct_complete_net(){//建立全连接网络
        var neighbor_net = [];
        for(var i=0;i<this.N;i++) {//为每个节点创造记录邻居索引的数组
            neighbor_net[i] = [];
            for (var j = 0; j < this.N; j++) {
                if (i == j)
                    continue;
                else
                    neighbor_net[i].push(j);
            }
        }
        return neighbor_net
    }
    construct_nodes() {
        //创建节点信息，name为节点的index，value为节点的信息
        var nodes = {};
        for(var i=0;i<this.N;i++){
            //随机模拟在i索引的节点的上一次策略
            var last_strategy = betray;//默认策略为背叛
            if (Math.random() <= this.X)//根据概率决定此结点上一次策略是否为合作
                last_strategy = cooperation;
            nodes[i] = {
                uid:null,
                last_strategy:last_strategy,
                last_income:0,
                last_nt:0//记录玩家上一次做选择时的轮次
            }
        }

        //更新网络中的实际X,及其邻居
        var CNum = 0;//网络中的总合作人数
        for(var node of Object.values(nodes))
            if(node.last_strategy == cooperation)
                CNum += 1;
        this.X = CNum/this.N;

        //初始化节点的last_income
        for(var user_index of Object.keys(this.neighbor_net)){
            var cnum = 0;
            for(var nei_index of Object.values(this.neighbor_net[user_index]))
                if(nodes[nei_index].last_strategy == cooperation)
                    cnum += 1;
            var nc = cnum/this.neighbor_net[user_index].length;
            if(nodes[user_index].last_strategy == cooperation)
                nodes[user_index].last_income = nc * this.c * this.T / this.N;
            else
                nodes[user_index].last_income = this.R * this.d * this.T / this.N + this.o * this.T / this.N;

            //邻居
            nodes[user_index].neighbor_index = this.neighbor_net[user_index][Math.floor(Math.random()*this.neighbor_net[user_index].length)];
        }

        return nodes
    }
    construct_indexs(){
        //建立一个随机数组
        var indexs = [];
        for(var i=0;i<this.N;i++)
            indexs.push(i)
        indexs.sort(function() {
            return (0.5-Math.random());
        });
        return indexs
    }
    add_user(uid){//加入用户并分配节点,如果可以返回true，否则返回false
        if(Object.keys(this.user_indexs).indexOf(String(uid)) >= 0)//判断是否已经在网络中
            return true;
        else if(this.random_indexs.length === 0)//如果人数已满
            return false;
        else{
            var user_index = this.random_indexs.pop();//user_index为此用户分配的节点的索引
            this.nodes[user_index].uid = uid;
            this.user_indexs[uid] = user_index;//记录此用户分配到那个节点
            return true;
        }
    }
    get_neighbor_strategies(uid){//获取uid邻居的策略信息，即邻居们上一次选择合作的比例
        var user_index = this.user_indexs[uid];//user_index为此uid用户在网络中的节点的索引
        var CNum = 0;//邻居中合作的数量
        var NNum = this.neighbor_net[user_index].length;//邻居数

        //找到此uid在网络中的所有邻居信息
        for(var neighbor_index of this.neighbor_net[user_index]){
            var strategy = this.nodes[neighbor_index].last_strategy;
            //console.log(strategy);
            if(strategy == cooperation)
                CNum += 1
        }
        var nc = CNum/NNum;//uid的邻居的合作比例

        return nc
    }
    get_random_neighbor(uid){//返回uid的一个随机邻居的上一次策略以及收入
        var user_index = this.user_indexs[uid];//user_index为此uid用户在网络中的节点的索引
        var neighbor_index = this.nodes[user_index].neighbor_index//一个uid的随机邻居的索引


        if(this.nodes[neighbor_index].last_strategy == cooperation){
            var CNum = 0;//邻居中合作的数量
            var NNum = this.neighbor_net[neighbor_index].length;//邻居数


            for(var index of this.neighbor_net[neighbor_index])
                if(this.nodes[index].last_strategy == cooperation)
                    CNum += 1;

            var nc = CNum/NNum;
            var nei_income = nc/(this.c * this.T / this.N);
        }
        else{
            var nei_income = this.R* this.d * this.T / this.N + this.o * this.T / this.N;
        }
        return [neighbor_index,this.nodes[neighbor_index].last_strategy,nei_income];
    }
    make_choice(uid,strategy){
        if(this.R <= 0)
            return[false];
        if (Object.keys(this.user_indexs).indexOf(String(uid)) < 0)//如果此用户不在此网络中
            return [false];

        var nc = this.get_neighbor_strategies(uid);//nc为邻居的合作比例
        //更新网络的X
        var user_index = this.user_indexs[uid];
        if(this.nodes[user_index].last_strategy != strategy){//如果用户此次策略与上一次策略不相同
            if(strategy == cooperation)//如果此次策略为合作，那么意味着上一次的策略为背叛，则X增加
                this.X += 1/this.N;
            else//如果此次策略为背叛，那么意味着上一次的策略为合作，则X减小
                this.X -= 1/this.N;
        }

        var [income,R] = this.calculate(nc,strategy);//计算得失，income为用户收入，newR为新的网络总资源

        var before_R = this.R;
        this.R = R;//将网络资源更新
        this.nt += 1;

        //更新用户的最新信息
        var last_strategy = this.nodes[user_index].last_strategy;
        var last_income = this.nodes[user_index].last_income;
        this.nodes[user_index].last_strategy = strategy;
        this.nodes[user_index].last_income = income;
        this.nodes[user_index].last_nt = this.nt;
        this.nodes[user_index].neighbor_index = this.neighbor_net[user_index][Math.floor(Math.random()*this.neighbor_net[user_index].length)];

        return [true,income,before_R,last_strategy,last_income] ;//返回此用户的收益，新资源，之前的策略
    }
    calculate(nc,strategy) {//计算当邻居中合作比例为nc，此次策略为strategy时的收入及总资源影响
        //nc 邻居合作比例，不包括自己，上一轮选择,
        //N T R K c d o net parameters
        //cnum total player who choosed coporation

        //caculate ec ed eo
        var ec = this.c * this.T / this.N;
        var ed = this.d * this.T / this.N;
        var eo = this.o * this.T / this.N;
        if (strategy == cooperation) {//choice cooperation
            //caculate payoff uc
            var income = nc * ec;
            // update total Resources R
            var new_R = this.R + (this.T * this.R * (1 - this.R / this.K) - this.N * this.R * (this.X * ec + (1 - this.X * ed)))/this.N;
        }
        else {//choice betray
            //caculate payoff
            var income = this.R * ed + eo;
            // update total Resources R
            var new_R = this.R + (this.T * this.R * (1 - this.R / this.K) - this.N * this.R * (this.X * ec + (1 - this.X * ed)))/this.N;
        }
        return [income, new_R]
    }
    playGame(uid){//获取轮次信息
        var user_index = this.user_indexs[uid];
        var last_choice = this.nodes[user_index].last_strategy;
        var last_income = this.nodes[user_index].last_income;
        var [neibor_index,neibor_choose,neibor_income] = this.get_random_neighbor(uid);
        return [this.R,last_choice,last_income,neibor_choose,neibor_income]
    }
    getVector(){
        var temp = [];
        for(var index of Object.keys(this.nodes))
            temp[index] = this.nodes[index].last_strategy;
        return temp;
    }
    playAble(uid){
        if(Object.keys(this.user_indexs).indexOf(String(uid)) == -1)
             return true;
        var user_index = this.user_indexs[uid];
        if(this.nodes[user_index].last_nt+this.N/2 >= this.nt)
            return true;//这里改为true，则玩家N/2内无法玩
        else
            return true;
    }
    getNeighborStrategyRating(uid){//获得uid玩家的邻居中合作与非合作的数量
        var user_index = this.user_indexs[uid];//user_index为此uid用户在网络中的节点的索引
        var CNum = 0;//邻居中合作的数量
        var NNum = this.neighbor_net[user_index].length;//邻居数

        //找到此uid在网络中的所有邻居信息
        for(var neighbor_index of this.neighbor_net[user_index]){
            var strategy = this.nodes[neighbor_index].last_strategy;
            //console.log(strategy);
            if(strategy == cooperation)
                CNum += 1
        }

        return [CNum,NNum-CNum];
    }
    getResource(){
        return this.R;
    }
}

//N, T, K, X0, R0, c, d, o

// net = new Net(6,2,1,0.8,0.2,0.7,3,0.2);
// net = JSON.stringify(net);
// net = JSON.parse(net);
// console.log(net.neighbor_net.length);
// console.log(net.neighbor_net[0].length);
// console.log(net)
// console.log(net.add_user(456));
// console.log(net.make_choice(456,cooperation));
// console.log(net.get_random_neighbor(456));

// console.log(net.make_choice(456,cooperation));

module.exports = Net;
