var IBapply = function(app) {
  app.get('/ibApply/apply.html', function (req, res) {
    res.render('ibapply/apply');
  });
}
module.exports = IBapply;
