var bank = function(app) {
  app.get('/personal/bank.html', function (req, res) {
      var seoObj = {title:'银行卡-选财外汇fmtxt.com',keywords:'银行卡',description: '银行卡'};
      res.render('bank/bank',{ title: '银行卡',seo:seoObj});
  });
}
module.exports = bank;
