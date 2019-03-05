var Common = require('../../config.js');
var request = require('request-promise');
var tdk = require('../../data/seo.js');
var url = Common.basePath;
var caption;

var IBdetail = function(app) {
  app.get('/ib/detail.html', function (req, res) {
    var fieldMap = req.query;
    var shareId = fieldMap.shareId?fieldMap.shareId:'';
    var api1 = request({url:url+'/front/broker/'+fieldMap.brokerId+'.do',gzip:true,headers:{'User-Agent': 'chrome'}});
    var api2 = request({url:url+'/front/view-broker-reward.do?agents_id='+fieldMap.agId,gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise.all([api1,api2]).then(function(results) {
        var broker = JSON.parse(results[0]).result.broker;
        var caption = JSON.parse(results[1]).result.obj.caption;
        //tdk
        var name = broker.chinese_name?broker.chinese_name:'';
        var tdk_title = name + tdk.dealerShop.title;
        var tdk_keywords = name + tdk.dealerShop.keywords;
        var tdk_description = broker.brand_introduce.substring(0,80);
        var tdkMap = {
          title: tdk_title,
          keywords: tdk_keywords,
          description: tdk_description
        };
        //监管机制
        var regulatorList = broker.regulatorList;
        var regulator = [];
        for(var i = 0;i< regulatorList.length;i++) {
          regulator.push(regulatorList[i].regulator_name);
        };
        regulator = regulator.join('、');
        res.render('ib/detail', { title: broker.chinese_name, broker: broker,regulator: regulator, caption: caption, shareId: shareId ,agentId: fieldMap.agId,ibId: fieldMap.ibId, tdk: tdkMap  });
    }).catch(function(){
      res.render('ib/detail', { title: '404' });
    });
  });
}
module.exports = IBdetail;
