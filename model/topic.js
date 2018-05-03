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
    },
    getAllTopic: (req, res, next) => {
        var college = req.query.college;
        pool.getConnection((err, connection) => {
            connection.query(`SELECT teacher_information.\`name\` as teacher_name, teacher_information.user_id as teacher_id, teacher_information.summary as teacher_summary,teacher_information.title as teacher_title,teacher_information.good as teacher_good,topic_information.id,topic_information.optional_num, \`user\`.username, topic_information.title, topic_information.demand, topic_information.\`describe\`, topic_information.isreview from user, topic_information, teacher_information where \`user\`.user_id = topic_information.user_id and \`user\`.user_id = teacher_information.user_id and topic_information.isreview = '1' and \`user\`.college = ${college} and topic_information.selectable = 1`, (err, result) => {
                if (result) {
                    jsonWrite(res, result);
                }
                connection.release();
            })
        })
    },
    selectTopic: (req, res, next) => {
        var param = req.body;
        pool.getConnection((err, connection) => {
            connection.query(`SELECT topic_information.id, \`user\`.username, topic_information.title, topic_information.demand, topic_information.\`describe\`, topic_information.isreview from user, topic_information where \`user\`.user_id = topic_information.user_id and topic_information.isreview = '-1' and \`user\`.college = ${college}`, (err, result) => {
                if (result) {
                    jsonWrite(res, result);
                }
                connection.release();
            })
        })
    },
    selectedTopic: (req, res, next) => {
        var param = req.body;
        pool.getConnection((err, connection) => {
            connection.query(`SELECT count(*) as num from topic_temp WHERE topic_id = '${param.topic_id}' and student_id = '${param.student_id}'  and teacher_id = '${param.teacher_id}'`, (err, result) => {
                if (result[0].num == 0) {
                    connection.query(`SELECT optional_num from topic_information WHERE id = '${param.topic_id}'`, (err, result) => {
                        if (result) {
                            if (result[0].optional_num > 0) {
                                connection.query(`INSERT into topic_temp (topic_id, student_id, teacher_id) VALUES ('${param.topic_id}','${param.student_id}','${param.teacher_id}')`, (err, result) => {
                                    if (result) {
                                        connection.query(`update topic_information set optional_num = IF(optional_num<1, 0, optional_num-1) WHERE id = '${param.topic_id}'`, (err, result) => {
                                            if (result) {
                                                jsonWrite(res, {
                                                    "code": "200",
                                                    "message": "选题成功！"
                                                });
                                            }
                                        })
                                    }
                                })
                            } else {
                                jsonWrite(res, {
                                    "code": "500",
                                    "message": "已经达到选题上限"
                                });
                            }
                        }
                        connection.release();
                    })
                } else {
                    jsonWrite(res, {
                        "code": "500",
                        "message": "您已经选择过此课题 请等待结果"
                    });
                }
            })
        })
    },
    getselectedStudent: (req, res, next) => {
        var topic_id = req.query.topic_id;
        pool.getConnection((err, connection) => {
            connection.query(`SELECT user.user_id,user.username,topic_temp.id,topic_temp.topic_id from topic_temp, user WHERE topic_id = '${topic_id}' and topic_temp.student_id = user.user_id`, (err, result) => {
                if (result) {
                    jsonWrite(res, result);
                }
                connection.release();
            })
        })
    },
    getselectStudent: (req, res, next) => {
        var id = req.query.id;
        var topic_id = req.query.topic_id;
        pool.getConnection((err, connection) => {
            connection.query(`UPDATE topic_temp set selected = 1 WHERE id = '${id}' `, (err, result) => {
                if (result) {
                    connection.query(`UPDATE topic_information set selectable = 0 WHERE id = '${topic_id}' `, (err, result) => {
                        jsonWrite(res, result);
                        connection.release();
                    })
                }
            })
        })
    },
    getCompleteTopic: (req, res, next) => {
        pool.getConnection((err, connection) => {
            connection.query(`SELECT A.username as student_name, B.username as teacher_name, topic_result.topic_id, C.title, C.id FROM topic_result LEFT JOIN user A ON topic_result.student_id = A.user_id LEFT JOIN user B ON topic_result.teacher_id = B.user_id LEFT JOIN topic_information C ON topic_result.topic_id = C.id`, (err, result) => {
                if (result) {
                    jsonWrite(res, result);
                }
                connection.release();
            })
        })
    }
}