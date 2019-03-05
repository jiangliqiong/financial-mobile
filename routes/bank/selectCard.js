/**
 * Created by Administrator on 2017/9/30.
 */
var express = require('express');
var router = express.Router();

/* GET 提现申请 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'选择银行卡-选财外汇fmtxt.com',keywords:'选择银行卡',description: '选择银行卡'};
    res.render('bank/selectCard', { title: '选择银行卡',seo:seoObj});
});

module.exports = router;