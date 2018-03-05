/**
 * Created by wangyongning
 */

module.exports = {
    jsonWrite: function(res, ret) {
        if (typeof ret === 'undefined') {
            res.json({
                code: '1',
                msg: '操作失败'
            });
        } else {
            res.json(ret);
        }
    };
}