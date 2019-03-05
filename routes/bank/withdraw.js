/**
 * Created by Administrator on 2017/9/7.
 */
var express = require('express');
var router = express.Router();

/* GET 提现申请 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'提现申请-选财外汇fmtxt.com',keywords:'提现申请',description: '提现申请'};
    res.render('bank/withdraw', { title: '提现申请',seo:seoObj});
});

module.exports = router;