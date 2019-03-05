/**
 * Created by Administrator on 2017/9/9.
 */
var express = require('express');
var router = express.Router();

/* GET 提现申请 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'登录-选财外汇fmtxt.com',keywords:'登录',description: '登录'};
    res.render('login/login', { title: '',seo:seoObj});
});

module.exports = router;