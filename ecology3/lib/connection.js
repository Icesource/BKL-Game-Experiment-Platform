var mysql = require('mysql');
let configObj = require("../config.json");//读取配置文件



class Connection{
    constructor(){
        this.connect();
        console.log("Database connected");
    }
    connect(){
            var con = mysql.createConnection({
                connectionLimit: configObj.mySQLConnectionLimit,
                host: configObj.mySQLAddress,
                user: configObj.mySQLUser,
                password: configObj.mySQLPassword,
                database: configObj.mySQLDataBase
            });
            con.connect();
            this.con = con;
        }
    query(sql,callback){
        this.con.query(sql,callback);
    }
}

connection = new Connection();

module.exports = {connection};