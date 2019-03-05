var ibEdit = function(app) {
  app.get('/personal/ibedit.html', function (req, res) {
    var fieldMap = req.query;
    var titleMap = {
      'name': '代理商名称',
      'ibedit': '客服电话',
      'email': '客服邮箱',
      'qq': '客服QQ',
      'url': '官方网址',
      'phone': '客服电话',
      'pic': '营业执照'
    };
    if(fieldMap.status) {
      var picStatus = fieldMap.status
    }else {
      var picStatus = '';
    }
      var seoObj = {title: titleMap[fieldMap.field] + '_个人中心-选财外汇fmtxt.com',keywords:titleMap[fieldMap.field] + '，个人中心',description: titleMap[fieldMap.field] + '，个人中心'};
    res.render('personal/ibedit', {title: titleMap[fieldMap.field],picStatus: picStatus,seo:seoObj});
  });
}
module.exports = ibEdit;
