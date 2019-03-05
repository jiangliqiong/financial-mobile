/**
 * Created by Administrator on 2017/8/21.
 */
var express = require('express');
var router = express.Router();

/* GET 个人中心-意见反馈 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'代理商介绍_个人中心-选财外汇fmtxt.com',keywords:'代理商介绍，个人中心',description: '代理商介绍，个人中心'};
    res.render('personal/ibIntroduce', { title: '代理商介绍',seo:seoObj});
});

module.exports = router;
