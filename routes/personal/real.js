var IBapply = function(app) {
  app.get('/personal/real.html', function (req, res) {
      var seoObj = {title:'实名认证_个人中心-选财外汇fmtxt.com',keywords:'实名认证，个人中心',description: '实名认证，个人中心'};
      res.render('personal/real',{ title: '实名认证',seo:seoObj});
  });
}
module.exports = IBapply;
