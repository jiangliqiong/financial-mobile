var Common = require('../../config.js');
var request = require('request-promise');
var tdk = require('../../data/seo.js');
var url = Common.basePath;

var IBlist = function(app) {
  app.get('/ib/list.html', function (req, res) {
    var api1 = request({url:url+'/front/find-introducing_broker-list.do',gzip:true,headers:{'User-Agent': 'chrome'}});
    var api2 = request({url:url+'/front/find-province-list.do',gzip:true,headers:{'User-Agent': 'chrome'}});
    var api3 = request({url:url+'/front/find-broker-list.do',gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise
    .all([api1,api2,api3])
    .then(function(results) {
        var listData = JSON.parse(results[0]).result.obj;
        var area = JSON.parse(results[1]).result.obj;
        var plat = JSON.parse(results[2]).result.obj;
        //tdk
        var tdk_title = tdk.ibList.title;
        var tdk_keywords = tdk.ibList.keywords;
        var tdk_description = tdk.ibList.description;
        var tdkMap = {
          title: tdk_title,
          keywords: tdk_keywords,
          description: tdk_description
        };
        res.render('ib/ibList', { title: '代理交易商', listData: listData, plat: plat, area: area,tdk: tdkMap });
    });
  });
}
module.exports = IBlist;
