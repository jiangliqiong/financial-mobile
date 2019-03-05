var IBapply = function(app) {
  app.get('/forget.html', function (req, res) {
      var seoObj = {title:'忘记密码-选财外汇fmtxt.com',keywords:'忘记密码',description: '忘记密码'};
      res.render('login/forget',{ title: '忘记密码',seo:seoObj});
  });
}
module.exports = IBapply;
