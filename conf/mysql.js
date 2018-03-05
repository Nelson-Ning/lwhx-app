//实现与mysql交互
var mysql = require('mysql');
var conf = require('./db.js');
//使用连接池
var pool = mysql.createPool(conf.mysql);
exports.pool = pool;