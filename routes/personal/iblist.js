var ibList = function(app) {
  app.get('/personal/iblist.html', function (req, res) {
      var seoObj = {title:'变更代理_个人中心-选财外汇fmtxt.com',keywords:'变更代理，个人中心',description: '变更代理，个人中心'};
      res.render('personal/iblist', { title: '变更代理',seo:seoObj });
  });
}
module.exports = ibList;
