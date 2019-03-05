/**
 * Created by Administrator on 2017/8/14.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config.js');
var fxPath = config.basePath;
var seo = require('../../data/seo.js');

/* GET 交易商店铺 page. */
router.get('/', function(req, res, next) {
    var brokerId = req.query.brokerId,shareId = req.query.shareId;
    var brokerInfo,title;
    request({url: fxPath + '/front/broker/'+brokerId+'.do',gzip:true,headers:{'User-Agent': 'chrome'}}, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data =  JSON.parse(body);
            if(data.code == 0 && data.result && data.result.broker){
                brokerInfo = data.result.broker;
                var regulatorList = brokerInfo.regulatorList,regulators = '';
                for(var i = 0; i < regulatorList.length; i++){
                    var regulator_name = regulatorList[i].regulator_name;
                    regulators += regulator_name + '、';
                }
                regulators = regulators.slice(0,regulators.length - 1);
                brokerInfo.regulators = regulators;
                title = brokerInfo.chinese_name;
                //seo拼接
                seo.dealerShop.title = brokerInfo.chinese_name + '_外汇交易商-选财外汇fmtxt.com';
                seo.dealerShop.keywords = brokerInfo.chinese_name + ',外汇交易商';
                var reg = /^(\n)|(\t)|(\r)|<\/?[^>]*>|\s*$/g;
                if(brokerInfo.brand_introduce){
                    var brand_introduce = brokerInfo.brand_introduce.replace(reg,'');
                    seo.dealerShop.description = brand_introduce.slice(0,80);
                }
                res.render('traders/shop', { item: brokerInfo, title: title,shareId: shareId,seo:seo.dealerShop});
            }
        }
    })
});

module.exports = router;
