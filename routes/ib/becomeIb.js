var Common = require('../../config.js');
var request = require('request-promise');
var url = Common.basePath;

var IBresult = function(app) {
  app.get('/ib/result.html', function (req, res) {
    var fieldMap = req.query;
    var api1 = request({url:url+'/personal/customer-broker-valid.do?customer_id='+fieldMap.customer_id+'&broker_id='+fieldMap.broker_id,gzip:true,headers:{'User-Agent': 'chrome'}});
    var api2 = request({url:url+'/front/add-agents.do?customer_id='+fieldMap.customer_id+'&broker_id='+fieldMap.broker_id+'&default_back='+fieldMap.back,gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise.all([api1]).then(function(results){
      var checkData = JSON.parse(results[0]).result;
      if(checkData&&checkData.code == 10000) {
            Promise.all([api2]).then(function(res2){
                var addDate = JSON.parse(res2[0]).result;
                if(addDate.code == 10000) {
                  res.render('ibapply/bcTrue', { title: '代理交易商', agentsId: addDate.obj.agents_id, ibName: fieldMap.ib_name });
  							}else if( addDate.code == 40103 ) {
                  res.render('ibapply/bcFalse', { title: '代理交易商', agentsId: addDate.obj.agents_id, isfull: true });
                }else {
  								res.render('ibapply/bcFalse', { title: '代理交易商', brokerId: fieldMap.broker_id });
  							}
            }).catch(function(){
              res.render('ibapply/bcFalse', { title: '代理交易商', brokerId: fieldMap.broker_id });
            });
      }else if(checkData&&checkData.code == 10001) {//已代理
            res.render('ibapply/bcFalse', { title: '代理交易商', brokerId: fieldMap.broker_id });
      }else {
           res.render('ibapply/bcFalse', { title: '代理交易商', brokerId: fieldMap.broker_id });
      }
    }).catch(function(){
      res.render('ibapply/bcFalse', { title: '代理交易商', brokerId: fieldMap.broker_id });
    });
  });
}
module.exports = IBresult;
