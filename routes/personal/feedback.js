/**
 * Created by Administrator on 2017/8/21.
 */
var express = require('express');
var router = express.Router();

/* GET 个人中心-意见反馈 page. */
router.get('/', function(req, res, next) {
    var seoObj = {title:'意见反馈_个人中心-选财外汇fmtxt.com',keywords:'意见反馈，个人中心',description: '意见反馈，个人中心'};
    res.render('personal/feedback', { title: '意见反馈'});
});

module.exports = router;