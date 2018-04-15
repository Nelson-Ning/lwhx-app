let {
    pool
} = require('../conf/mysql'); // 获取数据库连接配置
let {
    jsonWrite
} = require('../utils/index.js');
module.exports = {
    addTopic: (req, res, next) => {
        var param = req.body;
        pool.getConnection((err, connection) => {
            connection.query(`INSERT into topic_information (title, \`describe\`, demand, user_id) VALUES ('${param.title}','${param.describe}','${param.demand}',${param.user_id})`, (err, result) => {

                if (result) {
                    jsonWrite(res, result);
                }
                connection.release();
            })
        })
    },
    getTopicStatus: (req, res, next) => {
        var user_id = req.query.user_id;
        pool.getConnection((err, connection) => {
            connection.query(`select isreview , count(*) count from topic_information WHERE user_id  = ${user_id} group by isreview`, (err, result) => {
                if (result) {
                    let obj = {};
                    obj.isreview = result.filter((currentValue, index, arr) => currentValue.isreview === 1)[0] ? result.filter((currentValue, index, arr) => currentValue.isreview === 1)[0].count : 0;
                    obj.notreview = result.filter((currentValue, index, arr) => currentValue.isreview == '-1')[0] ? result.filter((currentValue, index, arr) => currentValue.isreview == '-1')[0].count : 0;
                    obj.rejectreview = result.filter((currentValue, index, arr) => currentValue.isreview === 0)[0] ? result.filter((currentValue, index, arr) => currentValue.isreview === 0)[0].count : 0;
                    //obj.isreview = obj
                    jsonWrite(res, obj);
                }
                connection.release();
            })
        })
    },
    changeTopicStatus: (req, res, next) => {
        var param = req.body;
        pool.getConnection((err, connection) => {
            connection.query(`UPDATE topic_information SET isreview = ${param.isreview} WHERE id = ${param.id}`, (err, result) => {
                if (result) {
                    jsonWrite(res, result);
                }
                connection.release();
            })
        })
    },
    getTopic: (req, res, next) => {
        var college = req.query.college;
        pool.getConnection((err, connection) => {
            connection.query(`SELECT topic_information.id, \`user\`.username, topic_information.title, topic_information.demand, topic_information.\`describe\`, topic_information.isreview from user, topic_information where \`user\`.user_id = topic_information.user_id and topic_information.isreview = '-1' and \`user\`.college = ${college}`, (err, result) => {
                if (result) {
                    jsonWrite(res, result);
                }
                connection.release();
            })
        })
    }
}