var express = require('express');
var router = express.Router();

var Topic = require("../model/topic.js");
/* GET Topic listing. */

router.post('/addTopic', function(req, res, next) {
	Topic.addTopic(req, res, next);
});

router.get('/getTopicStatus', function(req, res, next) {
	Topic.getTopicStatus(req, res, next);
});

router.post('/changeTopicStatus', function(req, res, next) {
	Topic.changeTopicStatus(req, res, next);
});

router.get('/getTopic', function(req, res, next) {
	Topic.getTopic(req, res, next);
});

module.exports = router;