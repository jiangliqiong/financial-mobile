/**
 * Created by Administrator on 2017/8/31.
 */
var express = require('express');
var router = express.Router();
var request = require('request-promise');
var config = require('../../config.js');
var fxPath = config.basePath;

 /* GET 交易商【监管机构】 page. */
router.get('/', function(req, res, next) {
    res.render('supervision/details', { title: '监管机构'});
});
module.exports = router;