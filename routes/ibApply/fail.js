var Common = require('../../config.js');
var request = require('request-promise');
var url = Common.basePath;
var failData = {};

var failData = function(app) {
  app.get('/ibapply/fail.html', function (req, res) {
    request({url:url+'/personal/ib-qualification-show.do',gzip:true,headers:{'User-Agent': 'chrome'}}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                var remark = [];
                var num=0;
                var rule = [];
                var ruleHtml = [];
                var numMap = {
                  '1': '①',
                  '2': '②',
                  '3': '③'
                };
                var tip;
                for(var i = 0; i<data.result.obj.length;i++) {
                  var o = data.result.obj[i];
                  var _ruleAmout = o.rule_amount - 0;
                  if(_ruleAmout != '0') {
                    remark.push(o.remark);
                    if(o.reule_sign == 'sum_open') {
                      rule.push('成功介绍开户<b>'+o.rule_amount+'</b>个及以上')
                    }
                    if(o.reule_sign == 'lost_introduce') {
                      rule.push('介绍开户账户累计交易量合计<b>'+o.rule_amount+'</b>手以上')
                    }
                    if(o.reule_sign == 'in_introduce') {
                      rule.push('介绍开户账户合计<b>'+o.rule_amount+'</b>美元以上入金')
                    }
                  }
                }
                if(rule.length>1) {
                  var _l = rule.length - 1;
                  var _ico = '；';
                  for(var i =0;i<rule.length;i++) {
                    if(i == _l) {
                       _ico = '';
                    }
                    ruleHtml.push(numMap[i+1]+' '+rule[i]+_ico);
                  }
                  for(var i = 0;i<remark.length;i++) {
                  if(remark[i] == 1) {
                    num ++;
                  }
                };
                if(num>1) {
                  var and = [],or = [];
                  for(var i = 0;i<remark.length;i++) {
                    if(remark[i] == 1) {
                      and.push(numMap[i+1])
                    }else {
                      or.push(numMap[i+1])
                    }
                  };
                  if(or.length) {
                    var _w = ' 或'
                  }else {
                    var _w = '';
                  }
                  tip = '说明：必须满足以上条件'+and.join('且')+_w+or.join('或');
                }else {
                  var ruleNum = [];
                  for(var i = 0;i<remark.length;i++) {
                    ruleNum.push(numMap[i+1]);
                  };
                  tip = '说明：必须满足以上条件'+ruleNum.join('或');
                }
                }else {
                  if(rule.length == 0) {
                      ruleHtml.push('数据获取失败');
                  }else {
                    ruleHtml.push(rule[0]);
                  }
                }
                failData.ruleHtml = ruleHtml;
                failData.length = rule.length;
                failData.tip = tip;
                res.render('ibapply/fail', { data: failData, title: '代理交易商'});
            }
    });
  })
}

module.exports = failData;
