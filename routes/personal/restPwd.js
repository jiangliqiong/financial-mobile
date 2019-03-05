var IBapply = function(app) {
  app.get('/personal/restPwd.html', function (req, res) {
      var seoObj = {title:'修改密码_个人中心-选财外汇fmtxt.com',keywords:'修改密码，个人中心',description: '修改密码，个人中心'};
      res.render('personal/restPwd',{ title: '修改密码',seo:seoObj});
  });
}
module.exports = IBapply;
