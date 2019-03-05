/**
 * Created by Administrator on 2017/8/20.
 */
var express = require('express');
var router = express.Router();

/* GET 个人中心首页 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'个人中心-选财外汇fmtxt.com',keywords:'首页，个人中心',description: '首页，个人中心'};
    res.render('personal/index', { title: '个人中心',footOn:'personal',seo:seoObj});
});

module.exports = router;