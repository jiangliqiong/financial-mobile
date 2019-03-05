/**
 * Created by Administrator on 2017/8/15.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config.js');
var fxPath = config.basePath;
var seo = require('../../data/seo.js');

/* GET 外汇交易 page. */
router.get('/', function(req, res, next) {
    var brokerId = req.query.brokerId,shareId = req.query.shareId;
    var spreadData = [],inOutData = [],accountTypeData = [],brokerData = [],requestFailClass = 'fxHidden',noDataClass = 'fxHidden',contentBoxClass = 'fxVisible',
        spreadHasData = 'yes',inOutHasdata = 'yes',accountTypeHasData = 'yes';
    request({url: fxPath + '/front/broker/'+brokerId+'.do',gzip:true,headers:{'User-Agent': 'chrome'}}, function(error, response, body) {
        var data =  JSON.parse(body);
        console.log(body);
        if (!error && response.statusCode == 200 && data.code == 0) {
            if(data.result && data.result.fxAskSpread && data.result.fxAskSpread.length > 0){
                spreadData = data.result.fxAskSpread;
            }else{
                contentBoxClass = 'fxHidden';
                noDataClass = 'fxVisible';
                spreadHasData = 'no';
            }
            if(data.result && data.result.fxInOut && data.result.fxInOut.length > 0){
                inOutData = data.result.fxInOut;
            }else{
                inOutHasdata = 'no';
            }
            if(data.result && data.result.account && data.result.account.length > 0){
                accountTypeData = data.result.account;
            }else{
                accountTypeHasData = 'no';
            }

            if(data.result && data.result.broker ){
                brokerData = data.result.broker;
                //seo拼接
                seo.dealerTrade.title = '点差表_账户类型_出入金_' + brokerData.chinese_name + '_外汇交易商-选财外汇fmtxt.com';
                seo.dealerTrade.keywords = brokerData.chinese_name + ',外汇交易商';
                var reg = /^(\n)|(\t)|(\r)|<\/?[^>]*>|\s*$/g;
                if(brokerData.brand_introduce){
                    var brand_introduce = brokerData.brand_introduce.replace(reg,'');
                    seo.dealerTrade.description = brand_introduce.slice(0,80);
                }
            }

        }else{
            requestFailClass = 'fxVisible';
            contentBoxClass = 'fxHidden';
        }

        res.render('traders/trade', {
            spreadItem: spreadData,
            inOutItem: inOutData,
            accountTypeItem: accountTypeData,
            requestFailClass: requestFailClass,
            noDataClass: noDataClass,
            contentBoxClass: contentBoxClass,
            spreadHasData: spreadHasData,
            inOutHasdata: inOutHasdata,
            accountTypeHasData:accountTypeHasData,
            brokerData: brokerData,
            shareId: shareId,
            title: '外汇交易',
            seo:seo.dealerTrade});
    })

});

module.exports = router;
