/**
 * Created by Administrator on 2017/8/22.
 */
var express = require('express');
var router = express.Router();

/* GET 个人中心-基本信息 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'基本信息_个人中心-选财外汇fmtxt.com',keywords:'基本信息，个人中心',description: '基本信息，个人中心'};
    res.render('personal/basicInfo', { title: '基本信息',seo:seoObj});
});

module.exports = router;