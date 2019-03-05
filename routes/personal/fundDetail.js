/**
 * Created by Administrator on 2017/8/22.
 */
var express = require('express');
var router = express.Router();

/* GET 个人中心-资金出入明细 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'资金出入明细_个人中心-选财外汇fmtxt.com',keywords:'资金出入明细，个人中心',description: '资金出入明细，个人中心'};
    res.render('personal/fundDetail', { title: '资金出入明细',seo: seoObj});
});

module.exports = router;