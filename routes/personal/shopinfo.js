var shopInfo = function(app) {
  app.get('/personal/shopinfo.html', function (req, res) {
      var seoObj = {title:'代理详情_个人中心-选财外汇fmtxt.com',keywords:'代理详情，个人中心',description: '代理详情，个人中心'};
      res.render('personal/shopinfo', { title: '代理详情',seo:seoObj });
  });
}
module.exports = shopInfo;
