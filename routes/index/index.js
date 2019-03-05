var express = require('express');
var common = require('../../config');
var seo = require('../../data/seo');
var router = express.Router();
var request = require('request-promise');
/* GET home page. */
router.get('/', function(req, resa, next) {
    // var api1 = request({url:common.adPath+'/adv/api/advInfo?pos_code=fx_m_index_1_img',gzip:true,headers:{'User-Agent': 'chrome'}});
	var api2 = request({url:common.basePath+'/front/find-common-broker-list.do?total=100',gzip:true,headers:{'User-Agent': 'chrome'}});
	var api3 = request({url:common.basePath+'/front/find-recommend-position-code.do?position=wap_exchange_index_video',gzip:true,headers:{'User-Agent': 'chrome'}});
	var api4 = request({url:common.basePath+'/front/find-parameter-broker-list.do',gzip:true,headers:{'User-Agent': 'chrome'}});
	var api5 = request({url:common.basePath+'/front/find-recommend-position-code.do?position=wap_exchange_index_ib',gzip:true,headers:{'User-Agent': 'chrome'}});
	var api6 = request({url:common.spiderPath+'/finance-spider/exchange/fx-strategy',gzip:true,headers:{'User-Agent': 'chrome'}});
	var flag = req.query.flag;
	Promise
	    .all([api2,api3,api4,api5,api6])
	    .then(function(results) {
	    	// var bannerList = JSON.parse(results[0]).data;
	    	// 	for(var i = 0; i < bannerList.length; i++){
      //           bannerList[i].index = i;
      //   	}
        	var brokerInfo = "";
        	var listData = JSON.parse(results[0]).result;
        	var videoData = JSON.parse(results[1]).result.obj;
        	var newArr = JSON.parse(results[2]).result.obj;
        	var ibList = JSON.parse(results[3]).result.obj;
					var strategy = JSON.parse(results[4]).data;
        	var newArrData = [];
        	for(var k = 0; k < 6; k++){
               newArrData[k] = newArr[k];
        	}
            var listArr  = [];

			for(var j = 0; j < Math.ceil(listData.obj.length/6);j++){
				listArr[j] = [];
				for(var i = 0; i < 6;i++){
				   listArr[j][i] = "";
			    }
			}
			for(var i = 0; i<listData.obj.length;i++){
				if(listData.obj[i]){
					listArr[parseInt(i/6)][i%6] = listData.obj[i];
				}

			    listArr[parseInt(i/6)][i%6].regulatorN="";
			    var lenr = listArr[parseInt(i/6)][i%6].regulator.split("/");
			    for(var k=0;k<lenr.length;k++){
			    	for(var m = 0; m < listArr[parseInt(i/6)][i%6].regulatorList.length;m++){
			    		var regName = listArr[parseInt(i/6)][i%6].regulatorList[m].regulator_name;
			    		if(lenr.length==1){
			    			listArr[parseInt(i/6)][i%6].regulatorN += regName;
			    		}else{
			    			if(m==0){
			    				listArr[parseInt(i/6)][i%6].regulatorN += regName;
			    			}else{
			    				listArr[parseInt(i/6)][i%6].regulatorN += "/"+regName;
			    			}
			    		}
			        }
			    }
			}
			for(var d = 0;d<listArr.length;d++){
				for(var m=0;m<listArr[d].length;m++){
					if(!listArr[d][m]){
						listArr[d][m] = listArr[0][m];
					}
				}
			}
		resa.render('index/index', {flag:flag,footOn:'index',list:listArr,hotList:newArrData,videoList:videoData,ibList:ibList,seo:seo.home,strategy:strategy});
	}).catch(function(result){

	})
})
module.exports = router;
