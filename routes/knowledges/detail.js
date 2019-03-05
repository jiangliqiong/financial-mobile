var Common = require('../../config.js');
var request = require('request-promise');
var tdk = require('../../data/seo.js');
var url = Common.basePath;

var kGDetail = function(app) {
  app.get('/knowledges/detail.html', function (req, res) {
    var field = req.query;
    var api1 = request({url:url+'/front/find-education-details.do?education_id='+field.educationId,gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise.all([api1]).then(function(results) {
        var kgVideo = JSON.parse(results[0]).result.obj;
        //获取视频ID
        var ft = kgVideo.education_url.indexOf('?');
        var url = kgVideo.education_url.substr(ft);
        var urlMap = new Object();
        if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
             urlMap[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
          }
        };
        //tdk
        var tdk_title = kgVideo.education_name+'，外汇大课堂-选财外汇fmtxt.com';
        var tdk_keywords = kgVideo.education_name;
        var tdk_description = kgVideo.education_name;
        var tdkMap = {
          title: tdk_title,
          keywords: tdk_keywords,
          description: tdk_description
        };
        res.render('knowledges/detail', { title: field.name?field.name:'经典视频课程', kgVideo: kgVideo, kgVideoId: urlMap['vid'],tdk: tdkMap });
    }).catch(function(data){
      res.render('knowledges/detail', { title: field.name?field.name:'经典视频课程' });
    });
  });
}
module.exports = kGDetail;
