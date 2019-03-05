/**
 * Created by Administrator on 2017/9/8.
 */
var express = require('express');
var router = express.Router();

/* GET 提现申请 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'提现申请_失败-选财外汇fmtxt.com',keywords:'提现申请失败',description: '提现申请失败'};
    res.render('bank/failure', { title: '提现申请',seo:seoObj});
});

module.exports = router;