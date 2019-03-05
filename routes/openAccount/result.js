var express = require('express');
var router = express.Router();
var request = require('request-promise');
var common = require('../../config');

/* GET home page. */
router.get('/', function(req, resa, next) { 
    var flag = req.query.flag;
    var brokerId = req.query.brokerId;
    resa.render('openAccount/result', { title: '外汇开户',flag: flag,brokerId: brokerId,});
});
module.exports = router;