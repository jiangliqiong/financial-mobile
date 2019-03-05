/**
 * Created by Administrator on 2017/8/21.
 */
var express = require('express');
var router = express.Router();

/* GET 个人中心-代理交易商 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'代理交易商_个人中心-选财外汇fmtxt.com',keywords:'代理交易商，个人中心',description: '代理交易商，个人中心'};
    res.render('personal/agentTrader', { title: '代理交易商',seo:seoObj});
});

module.exports = router;