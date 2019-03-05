/**
 * Created by Administrator on 2017/9/8.
 */
var express = require('express');
var router = express.Router();

/* GET 提现申请 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'提现申请_成功-选财外汇fmtxt.com',keywords:'提现申请成功',description: '提现申请成功'};
    res.render('bank/success', { title: '提现申请',seo:seoObj});
});

module.exports = router;