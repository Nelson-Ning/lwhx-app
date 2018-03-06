let {
    pool
} = require('../../conf/mysql'); // 获取数据库连接配置
let sql = require('./userSql.js');
let {
    jsonWrite,
    token
} = require('../../utils/index.js');
module.exports = {
    doLogin: (req, res, next) => {
        pool.getConnection((err, connection) => {
            var param = req.body;
            connection.query(sql.doLogin, [param.username, param.password], (err, result) => {
                var obj = {};
                if (result.length == 0) {
                    obj['userInfo'] = {
                        'message': '帐号密码不正确',
                        'code': 404
                    }
                    jsonWrite(res, obj);
                } else {
                    connection.query(sql.getUserAuth, [result[0].user_id], (err, result) => {
                        result[0]['token'] = token.createToken(result[0], 60 * 60 * 12);
                        obj['userInfo'] = result[0];
                        jsonWrite(res, obj);
                    })
                }
                connection.release();
            })
        })
    },
    judgeToken: (req, res, next) => {
        let obj = token.decodeToken(req.cookies.token);
        let ret = {};
        let obj_ = {};
        let tokenTime = obj.payload.created + obj.payload.exp;
        if (Date.parse(new Date()) / 1000 > tokenTime) {
            obj_['userInfo'] = {
                'message': 'Token过期,需要重新登录',
                'code': 403
            }
            jsonWrite(res, obj_);
            return
        }
        if (obj) {
            ret['username'] = obj.payload.data.username;
            ret['level'] = obj.payload.data.level;
            obj_['userInfo'] = ret;
            jsonWrite(res, obj_);
        } else {
            obj_['userInfo'] = {
                'message': 'Token不存在,需要重新登录',
                'code': 403
            }
            jsonWrite(res, obj_);
        }
    }
}