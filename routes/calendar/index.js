/**
 * Created by Administrator on 2017/9/2.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config.js');
var seo = require('../../data/seo.js');

/* GET 交易商【财经日历】 page. */
router.get('/', function(req, res, next) {
    var now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        day = now.getDate();
    if(month < 10) month = '0' + month;
    if(day < 10) day = '0' + day;
    var date = year.toString() + month.toString() + day.toString();
    var itemList = new Array(),requestFailClass = 'fxHidden',noDataClass = 'fxHidden',contentClass = 'fxVisible';
    request({url: config.spiderPath + '/finance-spider/exchange/fx-calendar?date=' + date,gzip:true,headers:{'User-Agent': 'chrome'}}, function(error, response, body) {
        var data =  JSON.parse(body);
        console.log(data);
        if (!error && response.statusCode == 200 && data.code == 0) {
            if(data.data && data.data && data.data.financialArr.length > 0){
                var financialArr = data.data.financialArr;
                for(var i = 0; i < financialArr.length; i++){
                    var sameTimeArr = financialArr[i].sameTimeArr;
                    for(var j = 0; j < sameTimeArr.length; j ++){
                        var obj = {};
                        obj.countryName = financialArr[i].countryName;
                        obj.financeflagClass = financialArr[i].financeflagClass;
                        obj.flagClass = financialArr[i].flagClass;
                        obj.time = financialArr[i].time;
                        obj.beforeVal = sameTimeArr[j].beforeVal;
                        obj.dynamicGraphUrl = sameTimeArr[j].dynamicGraphUrl;
                        obj.importanceImgUrl = sameTimeArr[j].importanceImgUrl;
                        obj.predictionVal = sameTimeArr[j].predictionVal;
                        obj.publishVal = sameTimeArr[j].publishVal;
                        obj.target = sameTimeArr[j].target;
                        obj.profitMore = sameTimeArr[j].profit[0] ? sameTimeArr[j].profit[0].profitMore : '';
                        itemList.push(obj);
                    }
                }
                console.log(itemList);
            }else{
                contentClass = 'fxHidden';
                noDataClass = 'fxVisible';
            }
        }else{
            requestFailClass = 'fxVisible';
            contentClass = 'fxHidden';
        }

        res.render('calendar/index', {
            itemList: itemList,
            contentClass: contentClass,
            requestFailClass: requestFailClass,
            noDataClass: noDataClass,
            title: '财经日历',footOn:'calendar',
            seo:seo.calendar});
    })
});

module.exports = router;