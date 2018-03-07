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
                        'tip': '帐号密码不正确',
                        'code': 403
                    }
                    jsonWrite(res, obj);
                } else {
                    connection.query(sql.getUserAuth, [result[0].user_id], (err, result) => {
                        let obj_ = {};
                        obj_['code'] = 200;
                        obj_['name'] = result[0].username;
                        obj_['level'] = result[0].level;
                        obj_['message'] = null;
                        obj['userInfo'] = obj_;

                        res.cookie('token', token.createToken(result[0], 60 * 60 * 24), {
                            maxAge: 60 * 60 * 24 * 1000
                        });
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
                'tip': 'Token过期,需要重新登录',
                'code': 403
            }
            jsonWrite(res, obj_);
            return
        }
        if (obj) {
            ret['name'] = obj.payload.data.username;
            ret['level'] = obj.payload.data.level;
            ret['code'] = 200;
            obj_['userInfo'] = ret;
            jsonWrite(res, obj_);
        } else {
            obj_['userInfo'] = {
                'tip': 'Token不存在,需要重新登录',
                'code': 403
            }
            jsonWrite(res, obj_);
        }
    }
}