var ibIdentity = function(app) {
  app.get('/personal/identity.html', function (req, res) {
      var seoObj = {title:'证件照片_个人中心-选财外汇fmtxt.com',keywords:'证件照片，个人中心',description: '证件照片，个人中心'};
      res.render('personal/identity',{ title: '证件照片',seo:seoObj});
  });
}
module.exports = ibIdentity;
