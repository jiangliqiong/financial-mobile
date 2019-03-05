var Common = require('../../config.js');
var request = require('request-promise');
var url = Common.basePath;
var isStatus = false;
var ibChangeRes = function(app) {
  app.get('/personal/ibChangeRes.html', function (req, res) {
    var seoObj = {title:'变更代理_个人中心-选财外汇fmtxt.com',keywords:'变更代理，个人中心',description: '变更代理，个人中心'};
    var ibId = req.query.ibId;
    var openId = req.query.openId;
    var api1 = request({url:url+'/personal/fx-ib-open-change.do?change_type=1&ib_id='+ibId+'&open_id='+openId,gzip:true,headers:{'User-Agent': 'chrome'}});
    var api2 = request({url:url+'/front/find-parameter-broker-list.do',gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise.all([api1, api2]).then(function(results) {
        var ibChangeMsg = JSON.parse(results[0]);
        if(ibChangeMsg.code == 0) {
					if(ibChangeMsg.result.code == 10000) {
             isStatus = true;
					}else {
             isStatus = false;
					}
				}else {
             isStatus = false;
				}
        var data = JSON.parse(results[1]);
        if(data.code == 0&&data.result.code == 0) {
          var list = data.result.obj;
        }else {
          var list = [];
        }
        res.render('personal/ibChangeRes', { title: '变更代理', list: list, status: isStatus,seo:seoObj });
    }).catch(function(){
        res.render('personal/ibChangeRes', { title: '变更代理', status: isStatus, seo: seoObj});
    });
  });
}
module.exports = ibChangeRes;
