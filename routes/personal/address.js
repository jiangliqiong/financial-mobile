/**
 * Created by Administrator on 2017/8/22.
 */
var express = require('express');
var router = express.Router();

/* GET 个人中心-地址输入 page. */
router.get('/', function(req, res, next) {
    var type = req.query.type;
    var title = type == 'ib' ? '办公所在地' :'地址';
    var seoObj = {title:title + '_个人中心-选财外汇fmtxt.com',keywords:title + '，个人中心',description: title + '，个人中心'};
    res.render('personal/address', { title: title,seo:seoObj});
});

module.exports = router;