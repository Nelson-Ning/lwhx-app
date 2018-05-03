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

router.get('/getAllTopic', function(req, res, next) {
	Topic.getAllTopic(req, res, next);
});

router.post('/selectedTopic', function(req, res, next) {
	Topic.selectedTopic(req, res, next);
});

router.get('/getselectedStudent', function(req, res, next) {
	Topic.getselectedStudent(req, res, next);
});

router.get('/getselectStudent', function(req, res, next) {
	Topic.getselectStudent(req, res, next);
});

router.get('/getCompleteTopic', function(req, res, next) {
	Topic.getCompleteTopic(req, res, next);
});
module.exports = router;