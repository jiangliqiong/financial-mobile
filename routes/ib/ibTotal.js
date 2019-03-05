/* GET home page. */
module.exports = function(app) {
  app.get('/ibapply/qualified.html', function (req, res) {
    var fieldMap = req.query;
    var type = fieldMap.type?fieldMap.type:'2';
    res.render('ibapply/qualified', { title: '代理交易商', type: type });
  });
};
