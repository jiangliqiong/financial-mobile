var IBapply = function(app) {
  app.get('/personal/restMobile.html', function (req, res) {
      var seoObj = {title:'修改注册手机号_个人中心-选财外汇fmtxt.com',keywords:'修改注册手机号，个人中心',description: '修改注册手机号，个人中心'};
      res.render('personal/restMobile',{ title: '修改注册手机号',seo:seoObj});
  });
}
module.exports = IBapply;
