var express = require('express');
var router = express.Router();

var college = require("../model/college.js");
/* GET college listing. */

router.post('/addTime', function(req, res, next) {
	college.addTime(req, res, next);
});

router.get('/getTime', function(req, res, next) {
	college.getTime(req, res, next);
});

module.exports = router;