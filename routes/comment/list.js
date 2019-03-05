var Common = require('../../config.js');
var request = require('request-promise');
var url = Common.basePath;

var IBlist = function(app) {
  app.get('/comment/list.html', function (req, res) {
    var fieldMap = req.query;
    var commentId = fieldMap.commentId?fieldMap.commentId:'';
    var commentStatus = fieldMap.commentStatus?fieldMap.commentStatus:'';//0:对交易商评论 1:对代理商评论
    var commentUrl = url+'/front/find-fx-comment-page.do?comment_id='+commentId+'&comment_status='+commentStatus+'&pageNum=1&pageSize=6';
    var api1 = request({url: commentUrl,gzip:true,headers: {'User-Agent': 'chrome'}});
    Promise
    .all([api1])
    .then(function(results) {
        var listData = JSON.parse(results[0]).result.obj;
        var listLength = listData.total?listData.total:0;
        if(listData && listLength > 0) {
          var title = '评论('+listLength+')';
        }else {
          var title = '评论';
        };
        var fxComments = [];
        for(var i = 0;i<listData.fxComments.length;i++) {
          var obj = listData.fxComments[i];
          obj.content = obj.content.replace(/&lt;/g,"<").replace(/&gt;/g,">");
          fxComments.push(obj);
        };
        res.render('comment/list', { title: title, listData: listData.fxComments, isIb: commentStatus});
    });
  });
}
module.exports = IBlist;
