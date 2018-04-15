var express = require('express');
var router = express.Router();

var message = require("../model/message.js");
/* GET message listing. */

router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/getMessage', function(req, res, next) {
	message.getMessage(req, res, next);
});

router.post('/callMessage', function(req, res, next) {
	message.callMessage(req, res, next);
});

module.exports = router;