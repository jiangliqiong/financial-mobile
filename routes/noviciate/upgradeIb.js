/**
 * Created by Administrator on 2017/9/18.
 */
var express = require('express');
var router = express.Router();

/* GET 提现申请 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'升级为IB代理商-选财外汇fmtxt.com',keywords:'升级为IB代理商',description: '升级为IB代理商'};
    res.render('noviciate/upgradeIb', { title: '升级为IB代理商',seo:seoObj});
});

module.exports = router;