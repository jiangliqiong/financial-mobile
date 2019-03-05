var Common = require('../../config.js');
var request = require('request-promise');
var tdk = require('../../data/seo.js');
var url = Common.basePath;
var IndexData = {};

var IBindex = function(app) {
  app.get('/ib/index.html', function (req, res) {
    var banner = 'banner0';
    var fieldMap = req.query;
    var shareId = fieldMap.shareId?fieldMap.shareId:'';
    var api1 = request({url:url+'/front/find-introducing_broker-details.do?ibId='+fieldMap.ibId,gzip:true,headers:{'User-Agent': 'chrome'}});
    var api2 = request({url:url+'/front/find_broker-list.do?ibId='+fieldMap.ibId,gzip:true,headers:{'User-Agent': 'chrome'}});
    var api3 = request({url:url+'/front/find-fx-tactics-ib.do?ib_id='+fieldMap.ibId,gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise.all([api1, api2, api3]).then(function(results) {
        var msg = JSON.parse(results[0]).result.obj;
        var list = JSON.parse(results[1]).result.obj;
        var strategy = JSON.parse(results[2]).result.obj;
        for (var i = 0;i<strategy.length;i++) {
          strategy[i]['content'] = strategy[i]['content'].replace(/[\u4E00-\u9FA5]/g,'');
        };
        //评分
        if(msg.recommending_index) {
          var score = Number(msg.recommending_index).toFixed(1);
        }else {
          var score = '0.0';
        };
        //随机bannaer图
        var num = Math.random();
        num = Math.floor(num * 8);
        banner = 'banner'+num;
        //tdk
        var name = msg.ib_name?msg.ib_name:'';
        var tdk_title = name + tdk.ibDetail.title;
        var tdk_description = name + tdk.ibDetail.description;
        var tdk_keywords = name + tdk.ibDetail.keywords;
        var tdkMap = {
          title: tdk_title,
          description: tdk_description,
          keywords: tdk_keywords
        };
        msg.count?msg.count:msg.count = 0;
        msg.count>999?msg.count=999:msg.count;
        res.render('ib/index', { title: '', data: msg, list: list, shareId: shareId, ibId: fieldMap.ibId, score: score, banner: banner,tdk: tdkMap, strategy: strategy });
    });
  });
}
module.exports = IBindex;
