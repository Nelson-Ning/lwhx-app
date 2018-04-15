let {
    pool
} = require('../conf/mysql'); // 获取数据库连接配置
let {
    jsonWrite,
    token
} = require('../utils/index.js');
module.exports = {
    doLogin: (req, res, next) => {
        pool.getConnection((err, connection) => {
            var param = req.body;
            connection.query(`select * from user where username = '${param.username}' and password = '${param.password}' and isdel != 1 `, (err, result) => {
                var obj = {};
                if (result.length == 0) {
                    obj['userInfo'] = {
                        'tip': '帐号密码不正确',
                        'code': 403
                    }
                    jsonWrite(res, obj);
                } else {
                    connection.query(`select user_id, username, level, college from user where user_id = '${result[0].user_id}'`, (err, result) => {
                        let obj_ = {};
                        obj_['code'] = 200;
                        obj_['name'] = result[0].username;
                        obj_['level'] = result[0].level;
                        obj_['college'] = result[0].college;
                        obj_['user_id'] = result[0].user_id;
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
    addUser: (req, res, next) => {
        var param = req.body;
        pool.getConnection((err, connection) => {
            connection.query(`INSERT INTO user (username, password, level, college) VALUES ('${param.username}', '${param.password}', '${param.level}', '${param.college}')`, (err, result) => {
                if (result) {
                    jsonWrite(res, result);
                    connection.release();
                }
            })
        })
    },
    getUser: (req, res, next) => {
        pool.getConnection((err, connection) => {
            var level = req.query.level;
            var college = req.query.college == 0 ? '%' : req.query.college;
            if (level && college) {
                connection.query(`SELECT user.user_id , user.username, user.level, college.name as college from user, college WHERE level = '${level}' and user.college = college.id and college.id like '${college}' and isdel != 1`, (err, result) => {
                    jsonWrite(res, result);
                    connection.release();
                })
            }
        })
    },
    delUser: (req, res, next) => {
        pool.getConnection((err, connection) => {
            var user_id = req.query.user_id;
            connection.query(`update user set isdel = 1 WHERE user_id = ${user_id} `, (err, result) => {
                if (result) {
                    jsonWrite(res, result);
                    connection.release();
                }
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
            next();
        } else {
            obj_['userInfo'] = {
                'tip': 'Token不存在,需要重新登录',
                'code': 403
            }
            jsonWrite(res, obj_);
        }
    },
    judgeLogin: (req, res, next) => {
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
            ret['college'] = obj.payload.data.college;
            ret['user_id'] = obj.payload.data.user_id;
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