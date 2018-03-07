var express = require('express');
var router = express.Router();

var user = require("../model/user/user.js");
/* GET users listing. */

router.requireAuthentication = function(req, res, next) {
    // if (req.path == "/login") {
    //     next();
    //     return;
    // }

    // if (req.cookies["account"] != null) {
    //     var account = req.cookies["account"];
    //     var user = account.account;
    //     var hash = account.hash;
    //     if (authenticate(user, hash) == 0) {
    //         console.log(req.cookies.account.account + " had logined.");
    //         next();
    //         return;
    //     }
    // }
    // console.log("not login, redirect to /login");
    // res.redirect('/login?' + Date.now());
    if (req.path == "/api/user/doLogin") {
        next();
        return;
    } else {
        user.judgeToken(req, res, next);
    }
};

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