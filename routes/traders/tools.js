/**
 * Created by Administrator on 2017/8/16.
 */
var express = require('express');
var router = express.Router();

/* GET 交易工具 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'交易工具_优质交易商-选财外汇fmtxt.com',keywords:'交易工具,优质交易商',description: '交易工具，优质交易商'};
    res.render('traders/tools', { title: '交易工具',seo:seoObj});
});

module.exports = router;