var Common = require('../../config.js');
var request = require('request-promise');
var url = Common.basePath;
var restMobile = function(app) {
  app.get('/bank/restMobile.html', function (req, res) {
    var fieldMap = req.query;
    var bankMap = {
      '0801030000': 'nyyh',
      '0801020000': 'gsyh',
      '0801040000': 'zgyh',
      '0801050000': 'jsyh',
      '0803050000': 'msyh',
      '0801000000': 'yzcx',
      '0804100000': 'payh',
      '0803030000': 'gdyh',
      '0803060000': 'gfyh',
      '0803020000': 'zxyh',
      '0803090000': 'xyyh',
      '0803040000': 'hxyh',
      '0803080000': 'zsyh',
      '0803100000': 'pfyh',
      '0803010000': 'jtyh'
    };
    var api1 = request({url:url+'/front/find-bank-account-detail.do?customer_id='+fieldMap.customer_id+'&type=encrypt',gzip:true,headers:{'User-Agent': 'chrome'}});
    Promise.all([api1]).then(function(results) {
        var data = JSON.parse(results[0]);
        var accountId = fieldMap.account_id;
        var msg = {};
        if(data.code == 0&&data.result.code == 0) {
          var list = data.result.obj;
          for(var i = 0;i< list.length; i++) {
            if(list[i].account_id == accountId) {
              msg = list[i];
            }
          }
        }
        if (msg.chinese_name.length >= 6) {
          msg.chinese_name = msg.chinese_name.slice(2);
        };
        var bankName = bankMap[msg.bank_no];
        res.render('bank/restMobile', { title: '换预留手机号', data: msg , accountId: accountId, bankName: bankName });
    }).catch(function(){
        res.render('bank/restMobile', { title: '服务器开了点小差'});
    });
  });
}
module.exports = restMobile;
