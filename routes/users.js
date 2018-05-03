var express = require('express');
var router = express.Router();

var user = require("../model/user.js");
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
  if (req.path == "/api/user/doLogin" || req.path == "/api/notice/getNotice") {
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

router.post('/addUser', function(req, res, next) {
  user.addUser(req, res, next);
});

router.get('/delUser', function(req, res, next) {
  user.delUser(req, res, next);
});

router.get('/getUser', function(req, res, next) {
  user.getUser(req, res, next);
});

router.get('/judgeToken', function(req, res, next) {
  user.judgeToken(req, res, next);
});

router.get('/judgeLogin', function(req, res, next) {
  user.judgeLogin(req, res, next);
});

router.post('/addTeacherInformation', function(req, res, next) {
  user.addTeacherInformation(req, res, next);
});

router.get('/getTeacherInformation', function(req, res, next) {
  user.getTeacherInformation(req, res, next);
});

module.exports = router;