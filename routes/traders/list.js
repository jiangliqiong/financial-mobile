/**
 * Created by Administrator on 2017/8/10.
 */
var express = require('express');
var router = express.Router();
var request = require('request-promise');
var config = require('../../config.js');
var fxPath = config.basePath;
var seo = require('../../data/seo.js');

/* GET 交易商列表 page. */
router.get('/', function(req, res, next) {
    //点差
    var dianchaData,gangganData,guojiaData,leixingData,brokerList,requestFailClass = 'fxHidden',noDataClass = 'fxHidden',cannotRequestCount = 0;
    var request1 = request({url: fxPath + '/front/find-min_point-list.do',gzip:true,headers:{'User-Agent': 'chrome'}}, function(error, response, body) {
        var data =  JSON.parse(body);
        if (!error && response.statusCode == 200 && data.code == 0) {
            if( data.result && data.result.code == 0 ){
                dianchaData = data.result.obj;
            }
        }else{
            cannotRequestCount++;
        }
    })
//杠杆
    var request2 = request({url: fxPath + '/front/find-max_leverage-list.do',gzip:true,headers:{'User-Agent': 'chrome'}}, function(error, response, body) {
        var data =  JSON.parse(body);
        if (!error && response.statusCode == 200 && data.code == 0) {
            if( data.result && data.result.code == 0 ){
                gangganData = data.result.obj;
            }
        }else{
            cannotRequestCount++;
        }
    })
//国家
    var request3 = request({url: fxPath + '/front/find-country-list.do',gzip:true,headers:{'User-Agent': 'chrome'}}, function(error, response, body) {
        var data =  JSON.parse(body);
        if (!error && response.statusCode == 200 && data.code == 0) {
            if( data.result && data.result.code == 0 ){
                guojiaData = data.result.obj;
            }
        }else{
            cannotRequestCount++;
        }
    })
//类型
    var request4 = request({url: fxPath + '/front/find-type-list.do',gzip:true,headers:{'User-Agent': 'chrome'}}, function(error, response, body) {
        var data =  JSON.parse(body);
        if (!error && response.statusCode == 200 && data.code == 0) {
            if( data.result && data.result.code == 0 ){
                leixingData = data.result.obj;
            }
        }else{
            cannotRequestCount++;
        }
    })

//交易商列表
    var request5 = request({url: fxPath + '/front/find-parameter-broker-list.do',gzip:true,headers:{'User-Agent': 'chrome'}}, function(error, response, body) {
        var data =  JSON.parse(body);
        if (!error && response.statusCode == 200 && data.code == 0) {
            if( data.result && data.result.code == 0){
                brokerList = data.result.obj;
                console.log(brokerList.length);
                if(brokerList && brokerList.length > 0){
                    noDataClass = 'fxHidden';
                }else{
                    noDataClass = 'fxVisible';
                }
            }
        }else{
            cannotRequestCount++;
        }
    })
    Promise.all([request1,request2,request3,request4,request5]).then(function(result) {
            if( cannotRequestCount > 0 ){
                requestFailClass = 'fxVisible';
                noDataClass = 'fxHidden';
                res.render('traders/list', {dianchaItems: [],
                    gangganItems: [],
                    guojiaData: [],
                    leixingData: [],
                    brokerList: [],
                    noDataClass: noDataClass,
                    requestFailClass: requestFailClass,
                    title: '交易商列表',
                    seo: seo.dealerList});
            }else{
                res.render('traders/list', {dianchaItems: dianchaData,
                    gangganItems: gangganData,
                    guojiaData: guojiaData,
                    leixingData: leixingData,
                    brokerList: brokerList,
                    noDataClass: noDataClass,
                    requestFailClass: requestFailClass,
                    title: '交易商列表',
                    seo: seo.dealerList});
            }
    });
});
module.exports = router;
