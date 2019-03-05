/**
 * Created by Administrator on 2017/9/28.
 */
var express = require('express');
var router = express.Router();

/* GET 交易商【关于我们】 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'品牌优势_优质交易商-选财外汇fmtxt.com',keywords:'品牌优势，优质交易商',description: '品牌优势，优质交易商'};
    res.render('traders/advantage', { title: '品牌优势',seo:seoObj});
});

module.exports = router;