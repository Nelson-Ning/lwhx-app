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
    getNotice: (req, res, next) => {
        pool.getConnection((err, connection) => {
            var channel = req.query.channel;
            if (channel) {
                channel = channel.split(',');
                var sql = "SELECT notice.id, notice.title, notice.time, notice.publisher, notice.content, notice.status, notice.channel from notice where ";
                for (let i = 0; i < channel.length; i++) {
                    sql += ` channel like '%${channel[i]}%'`;
                    if (i < channel.length - 1) {
                        sql += ' or ';
                    }
                }
                sql += ' and status != 0';
                connection.query(sql, (err, result) => {
                    if (result) {
                        result.map((currentValue, index, arr) => (currentValue.time = toTime(currentValue.time)));
                    }
                    jsonWrite(res, result);
                })
            }
            connection.release();
        })
    },
    addNotice: (req, res, next) => {
        var param = req.body;
        let sql = '';
        if (!param.id) {
            sql = `INSERT INTO notice (title, publisher, content, channel) VALUES ('${param.title}', '${param.publisher}', '${param.content}', '${param.channel}')`;
        } else {
            sql = `UPDATE notice set title = '${param.title}', content = '${param.content}', status = 1, channel = '${param.channel}' WHERE id = '${param.id}'`;
        }
        pool.getConnection((err, connection) => {
            connection.query(sql, (err, result) => {
                jsonWrite(res, result);
                connection.release();
            })
        })
    },
    recallNotice: (req, res, next) => {
        var id = req.query.id;
        pool.getConnection((err, connection) => {
            connection.query(`UPDATE notice set status = 0 WHERE id = ${id}  `, (err, result) => {
                if (result) {
                    jsonWrite(res, result);
                    connection.release();
                }
            });
        })
    }
}