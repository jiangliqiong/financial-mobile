var Common = require('../../config.js');
var request = require('request-promise');
var tdk = require('../../data/seo.js');
var url = Common.basePath;

var kGList = function(app) {
  app.get('/knowledges/list.html', function (req, res) {
    var field = req.query;
    var api1 = request({url:url+'/front/find-education-list.do?dict_key='+field.dict_key,gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise.all([api1]).then(function(results) {
        var kgList = JSON.parse(results[0]).result.obj;
        //tdk
        var dictKey = field.dict_key;//1:入门基础知识,2:各国货币介绍,3:基本面分析,4:技术分析宝典,5:外汇实盘操作
        var tdkType = {
          '1': 'knowledge',
          '2': 'currency',
          '3': 'analysis',
          '4': 'technology',
          '5': 'operation'
        };
        var tdk_title = tdk[tdkType[dictKey]].title;
        var tdk_keywords = tdk[tdkType[dictKey]].keywords;
        var tdk_description = tdk[tdkType[dictKey]].description;
        var tdkMap = {
          title: tdk_title,
          keywords: tdk_keywords,
          description: tdk_description
        };
        //处理显示的详情去掉HTML标签
        var reg = /^(\n)|(\t)|(\r)|<\/?[^>]*>|\s*$/g;
        for (var i =0;i<kgList.length;i++) {
          var kgData = kgList[i];
          var kgContent = kgData.video_content;
          kgContent = kgContent.replace(reg,'');
          kgList[i].video_content = kgContent;
        };
        res.render('knowledges/list', { title: field.name, kgList: kgList, kgType: field.name, tdk: tdkMap });
    }).catch(function(data){
      res.render('knowledges/list', { title: field.name });
    });
  });
}
module.exports = kGList;
