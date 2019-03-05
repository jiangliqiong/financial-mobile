var IBapply = function(app) {
  app.get('/register.html', function (req, res) {
      var seoObj = {title:'注册-选财外汇fmtxt.com',keywords:'注册',description: '注册'};
      res.render('login/register',{ title: '注册',seo:seoObj});
  });
}
module.exports = IBapply;
