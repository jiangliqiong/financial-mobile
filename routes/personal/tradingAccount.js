/**
 * Created by Administrator on 2017/8/21.
 */
var express = require('express');
var router = express.Router();

/* GET 个人中心-交易账户 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'交易账户_个人中心-选财外汇fmtxt.com',keywords:'交易账户，个人中心',description: '交易账户，个人中心'};
    res.render('personal/tradingAccount', { title: '交易账户',footOn:'tradeAccount',seo:seoObj});
});

module.exports = router;