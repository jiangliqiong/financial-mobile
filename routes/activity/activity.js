var Common = require('../../config.js');
var request = require('request-promise');
var tdk = require('../../data/seo.js');
var url = Common.basePath;

var activity = function(app) {
  app.get('/noviciate/100activity.html', function (req, res) {
    var api1 = request({url:url+'/front/find-introducing_broker-list.do',gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise
    .all([api1])
    .then(function(results) {
        var listData = JSON.parse(results[0]).result.obj;
        res.render('activity/activity', { title: '交易送Kindle' });
    });
  });
  app.get('/activity/hzacy17120901.html', function (req, res) {
    res.render('activity/salon', { title: '选财商城沙龙活动' });
  });
}
module.exports = activity;
