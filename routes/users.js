var express = require('express');
var router = express.Router();

var user = require("../model/user/user.js");
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/getUserAuth', function(req, res, next) {
    user.getUserAuth(req, res, next);
});

module.exports = router;