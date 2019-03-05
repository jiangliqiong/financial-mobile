var ibMsg = function(app) {
  app.get('/personal/ibmsg.html', function (req, res) {
      var seoObj = {title:'代理信息_个人中心-选财外汇fmtxt.com',keywords:'代理信息，个人中心',description: '代理信息，个人中心'};
      res.render('personal/ibmsg', { title: '代理信息',seo:seoObj });
  });
}
module.exports = ibMsg;
