/**
 * Created by Administrator on 2017/8/15.
 */
var express = require('express');
var router = express.Router();

/* GET 交易商【关于我们】 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'关于我们_优质交易商-选财外汇fmtxt.com',keywords:'关于我们，优质交易商',description: '关于我们，优质交易商'};
    res.render('traders/about', { title: '关于我们',seo:seoObj});
});

module.exports = router;
