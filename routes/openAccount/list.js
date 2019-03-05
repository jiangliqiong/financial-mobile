var express = require('express');
var router = express.Router();
var request = require('request-promise');
var common = require('../../config');
var seo = require('../../data/seo');

/* GET home page. */
router.get('/', function(req, resa, next) { 
    var brokerId = req.query.brokerId;
    var api1 = request({url:common.basePath+'/front/find-parameter-broker-list.do',gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise.all([api1]).then(function(results) {
        var listData = JSON.parse(results[0]);
        var data = "";
        if(listData && listData.code==0){
            if(listData.result.code==0){
                for(var i = 0; i < listData.result.obj.length; i++ ){
                    listData.result.obj[i].i = i;
                }
                data = listData.result.obj;
            }
        }
        resa.render('openAccount/list', { title: '外汇开户',data:data,brokerId:brokerId,seo:seo.openList});
    })
});
module.exports = router;