/**
 * Created by Administrator on 2017/8/31.
 */
var express = require('express');
var router = express.Router();
var seo = require('../../data/seo.js');

/* GET 交易商【监管机构列表】 page. */
router.get('/', function(req, res, next) {
    res.render('supervision/list', { title: '监管机构列表',seo:seo.supervisionList});
});

module.exports = router;
