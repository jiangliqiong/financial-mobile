var strategy = function(app) {
  app.get('/personal/sendStrategy.html', function (req, res) {
    res.render('personal/sendStrategy', {title: '发布策略信息'});
  });
}
module.exports = strategy;
