let {
  pool
} = require('../conf/mysql'); // 获取数据库连接配置
let {
  jsonWrite
} = require('../utils/index.js');
module.exports = {
  addTime: (req, res, next) => {
    var param = req.body;
    pool.getConnection((err, connection) => {
      connection.query(`update college set begintime =  '${param.begintime}', endtime = '${param.endtime}' , second = ${param.second} WHERE id =  ${param.id}`, (err, result) => {
        if (result) {
          jsonWrite(res, result);
        }
        connection.release();
      })
    })
  }
}