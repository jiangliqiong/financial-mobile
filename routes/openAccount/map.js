var express = require('express');
var router = express.Router();
var request = require('request-promise');
var common = require('../../config');

/* GET home page. */
router.get('/', function(req, resa, next) {
	resa.render('openAccount/map', { title: '外汇开户'});
});

module.exports = router;