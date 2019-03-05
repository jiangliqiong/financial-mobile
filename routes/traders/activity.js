/**
 * Created by Administrator on 2017/8/15.
 */
var express = require('express');
var router = express.Router();
/* GET 交易商【优惠活动】 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'优惠活动_优质交易商-选财外汇fmtxt.com',keywords:'优惠活动，优质交易商',description: '优惠活动，优质交易商'};
    res.render('traders/activity', { title: '优惠活动',seo:seoObj});
});

module.exports = router;