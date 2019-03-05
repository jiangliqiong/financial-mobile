var express = require('express');
var router = express.Router();
var request = require('request-promise');
var common = require('../../config');
var seo = require('../../data/seo');
/* GET home page. */


router.get('/', function(req, resa, next) {
	var brokerId = req.query.brokerId;
    if(req.query.type){
       var reftype = req.query.type; 
    }else{
       var reftype = ""; 
    }
	var api1 = request({url:common.basePath+'/front/broker/'+brokerId+'.do',gzip:true,headers:{'User-Agent': 'chrome'}});
	Promise.all([api1]).then(function(results) {
    	var brokerInfo = JSON.parse(results[0]);
    	if(brokerInfo && brokerInfo.code==0){
    		if(brokerInfo.result){
    			brokerInfo = brokerInfo.result.broker;
    		}else{
    			brokerInfo = "";
    		}
    	}
        resa.render('openAccount/index', { title: '外汇开户',brokerInfo: brokerInfo,seo:seo.openAccount,reftype:reftype});
	}).catch(function(datas){
		brokerInfo = "";
		resa.render('openAccount/index', { title: '外汇开户',brokerInfo: brokerInf,seo:seo.openAccount,reftype:reftype});
	})
});

module.exports = router;
