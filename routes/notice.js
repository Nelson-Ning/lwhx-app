var express = require('express');
var router = express.Router();

var notice = require("../model/notice.js");
/* GET notice listing. */

router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/getNotice', function(req, res, next) {
	notice.getNotice(req, res, next);
});

router.post('/addNotice', function(req, res, next) {
	notice.addNotice(req, res, next);
});

router.get('/recallNotice', function(req, res, next) {
	notice.recallNotice(req, res, next);
});

module.exports = router;