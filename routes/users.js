var express = require('express');
var router = express.Router();

var user = require("../model/user/user.js");
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/doLogin', function(req, res, next) {
    user.doLogin(req, res, next);
});

router.get('/judgeToken', function(req, res, next) {
    user.judgeToken(req, res, next);
});

module.exports = router;