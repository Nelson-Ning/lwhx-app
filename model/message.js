let {
    pool
} = require('../conf/mysql'); // 获取数据库连接配置
let {
    jsonWrite
} = require('../utils/index.js');
let {
    toTime
} = require('../utils/index.js');
module.exports = {
    getMessage: (req, res, next) => {
        pool.getConnection((err, connection) => {
            var user_id = req.query.user_id;
            var college = req.query.college;
            if (user_id) {
                connection.query(`SELECT b.id, b.time, b.content, user.username AS publisher, user.user_id AS publisher_id FROM (SELECT * FROM message WHERE isread = 0 AND receiver = ${user_id} or receiver= 'c_${college}' ) b, USER WHERE b.publisher = user.user_id`, (err, result) => {
                    if (result) {
                        result.map((currentValue, index, arr) => (currentValue.time = toTime(currentValue.time)));
                    }
                    jsonWrite(res, result);
                    connection.release();
                })
            }
        })
    },
    callMessage: (req, res, next) => {
        var param = req.body;
        pool.getConnection((err, connection) => {
            connection.query(`INSERT INTO message (publisher, content, receiver) VALUES (${param.publisher}, '${param.content}', '${param.receiver}')`, (err, result) => {
                if (result && param.id != '') {
                    connection.query(`update message set isread = 1 WHERE id = ${param.id} `, (err, result) => {
                        if (result) {
                            jsonWrite(res, result);
                        }
                    })
                } else {
                    jsonWrite(res, result);
                }
                connection.release();
            })
        })
    }
}