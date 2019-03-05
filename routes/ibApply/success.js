var Common = require('../../config.js');
var request = require('request-promise');
var url = Common.basePath;
var IBapplySuccess = function(app) {
  app.get('/ibapply/success.html', function (req, res) {
    var api1 = request({url:url+'/front/find-parameter-broker-list.do',gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise.all([api1]).then(function(results) {
        var data = JSON.parse(results[0]);
        if(data.code == 0&&data.result.code == 0) {
          var list = data.result.obj;
        }else {
          var list = [];
        };
        res.render('ibapply/success', { title: '申请代理身份', list: list });
    }).catch(function(){
        res.render('ibapply/success', { title: '申请代理身份'});
    });
  });
}
module.exports = IBapplySuccess;
