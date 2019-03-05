var strategy = function(app) {
  app.get('/personal/strategy.html', function (req, res) {
    res.render('personal/strategy', {title: '策略信息'});
  });
}
module.exports = strategy;
