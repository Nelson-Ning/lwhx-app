var mysql = require('../../conf/mysql'); // 获取数据库连接配置
var sql = require('./userSql.js');



var jsonWrite = function(res, ret, key) {
    if (typeof ret === 'undefined') {
        res.json({
            errmsg: '查询失败',
            errno: 500
        });
    } else {
        res.json({
            errmsg: "success",
            errno: 0,
            ret: ret
        });
    }
};

module.exports = {
    getUserAuth: function(req, res, next) {
        mysql.pool.getConnection(function(err, connection) {
            connection.query(sql.getUserAuth, function(err, result) {
                let obj = {};
                obj['userInfo'] = result
                jsonWrite(res, obj, 'userInfo');
                connection.release();
            });
        })
    }
}