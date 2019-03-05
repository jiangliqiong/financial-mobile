var Common = require('../../config.js');
var request = require('request-promise');
var tdk = require('../../data/seo.js');
var url = Common.basePath;

var kGHome = function(app) {
  app.get('/knowledges/home.html', function (req, res) {
    var api1 = request({url:url+'/front/find-recommend-position-code.do?type=1&position=wap_exchange_classroom_video',gzip:true,headers:{'User-Agent': 'chrome'}});
    var api2 = request({url:url+'/front/find-tab-list.do',gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise.all([api1,api2]).then(function(results) {
        var video = JSON.parse(results[0]).result.obj;
        var kgType = JSON.parse(results[1]).result.obj;
        //tdk
        var tdk_title = tdk.knowledgesIndex.title;
        var tdk_keywords = tdk.knowledgesIndex.keywords;
        var tdk_description = tdk.knowledgesIndex.description;
        var tdkMap = {
          title: tdk_title,
          keywords: tdk_keywords,
          description: tdk_description
        };
        res.render('knowledges/home', { title: '外汇大课堂', video: video, kgType: kgType,tdk: tdkMap });
    }).catch(function(){
      res.render('knowledges/home', { title: '外汇大课堂' });
    });
  });
}
module.exports = kGHome;
