var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var request = require('request');
var proxy = require('http-proxy-middleware');

var login = require('./routes/login/login');
//优质交易尚
var tradersList = require('./routes/traders/list');
var tradersShop = require('./routes/traders/shop');
var tradersAbout = require('./routes/traders/about');
var tradersAdvantage = require('./routes/traders/advantage');
var tradersTrade = require('./routes/traders/trade');
var tradersActivity = require('./routes/traders/activity');
var tradersTools = require('./routes/traders/tools');
//个人中心
var personalIndex = require('./routes/personal/index');
var personalFeedback = require('./routes/personal/feedback');
var personalIbIntroduce = require('./routes/personal/ibIntroduce');
var personalTradingAccount = require('./routes/personal/tradingAccount');
var personalAgentTrader = require('./routes/personal/agentTrader');
var personalFundDetail = require('./routes/personal/fundDetail');
var personalBasicInfo = require('./routes/personal/basicInfo');
var personalAddress = require('./routes/personal/address');

//资金提现
var bankWithdraw = require('./routes/bank/withdraw');
var bankSuccess = require('./routes/bank/success');
var bankFailure = require('./routes/bank/failure');
var bankSelectCard = require('./routes/bank/selectCard');

//监管机构
var supervisionList = require('./routes/supervision/list');
var supervisionDetails = require('./routes/supervision/details');

//财经日历
var calendarIndex = require('./routes/calendar/index');

//如何成为ib代理商
var novUpgradeIb = require('./routes/noviciate/upgradeIb');

var openAccount = require('./routes/openAccount/index');
var openResult = require('./routes/openAccount/result');
var openList = require('./routes/openAccount/list');
var index = require('./routes/index/index');
var openCheck = require('./routes/openAccount/check');
var openMap = require('./routes/openAccount/map');
var test = require('./routes/openAccount/result1');

//ib代理商
var ibDetail = require('./routes/ib/detail');
//ib代理商列表
var ibList = require('./routes/ib/list');
//ib主页
var ibIndex = require('./routes/ib/index');
//ib代理申请详情
var ibApply = require('./routes/ibApply/apply');
//ib个人中心-代理商详情
var ibShopInfo = require('./routes/personal/shopinfo');
//ib个人中心-变更代理
var perlIbList = require('./routes/personal/iblist');
//ib个人中心-变更结果
var ibchangeResult= require('./routes/personal/ibChangeRes');
//代理申请失败
var ibFail = require('./routes/ibApply/fail');
//ib个人中心-ib信息
var perIbMsg = require('./routes/personal/ibmsg');
//ib个人中心-编辑
var perIbEdit = require('./routes/personal/ibedit');
//代理身份申请成功
var ibApplySuccess = require('./routes/ibApply/success');
//代理其他页面
var ibTotal = require('./routes/ib/ibTotal');
//申请代理结果
var ibResult = require('./routes/ib/becomeIb');
//外汇大课堂首页
var KGhome = require('./routes/knowledges/home');
//外汇大课堂列表页
var KGList = require('./routes/knowledges/list');
//外汇大课堂详情页
var KGDetail = require('./routes/knowledges/detail');
//注册
var Register = require('./routes/login/register');
//忘记密码
var Forget = require('./routes/login/forget');
//基本信息-修改手机号
var restMobile = require('./routes/personal/restMobile');
//基本信息-修改密码
var restPwd = require('./routes/personal/restPwd');
//基本信息-实名认证
var real = require('./routes/personal/real');
//基本信息-证件照片
var identity = require('./routes/personal/identity');
//基本信息-证件照片
var bank = require('./routes/bank/bank');
//银行卡-预留手机更换
var bankRestMobile = require('./routes/bank/restMobile');
//评论列表
var comment = require('./routes/comment/list');
//开户送Kindle
var activity = require('./routes/activity/activity');
//策略信息
var strategy = require('./routes/personal/strategy');
//发布策略信息
var sendStrategy = require('./routes/personal/sendStrategy');

var app = express();
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch:true,
    noCache: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login.html', login);

//接口转发
//上传图片
//app.use('/api/upload', proxy({target: 'https://fx.fmtxt.com/api/upload', changeOrigin: true}));

//优质交易商
app.use('/traders/list.html', tradersList);
app.use('/traders/shop.html', tradersShop);
app.use('/traders/about.html', tradersAbout);
app.use('/traders/advantage.html', tradersAdvantage);
app.use('/traders/trade.html', tradersTrade);
app.use('/traders/activity.html', tradersActivity);
app.use('/traders/tools.html', tradersTools);
//个人中心
app.use('/personal/index.html', personalIndex);
app.use('/personal/feedback.html', personalFeedback);
app.use('/personal/ibIntroduce.html', personalIbIntroduce);
app.use('/personal/tradingAccount.html', personalTradingAccount);
app.use('/personal/agentTrader.html', personalAgentTrader);
app.use('/personal/fundDetail.html', personalFundDetail);
app.use('/personal/basicInfo.html', personalBasicInfo);
app.use('/personal/address.html', personalAddress);
//资金提现
app.use('/bank/withdraw.html',bankWithdraw);
app.use('/bank/success.html',bankSuccess);
app.use('/bank/failure.html',bankFailure);
app.use('/bank/selectCard.html',bankSelectCard);
//监管机构
app.use('/supervision/list.html', supervisionList);
app.use('/supervision/details.html', supervisionDetails);

//财经日历
app.use('/calendar/index.html', calendarIndex);

//如何成为ib代理商
app.use('/noviciate/upgradeIb.html', novUpgradeIb);

//IB推广页
app.use('/noviciate/index.html', novUpgradeIb);

app.use('/index.html', index);
app.use('/', index);
app.use('/openAccount/test.html', test);
app.use('/openAccount/check.html', openCheck);
app.use('/openAccount/index.html', openAccount);
app.use('/openAccount/result.html', openResult);
app.use('/openAccount/list.html', openList);
app.use('/openAccount/map.html', openMap);

ibDetail(app);
ibList(app);
ibIndex(app);
ibApply(app);
ibShopInfo(app);
perlIbList(app);
ibchangeResult(app);
ibFail(app);
perIbMsg(app);
perIbEdit(app);
ibApplySuccess(app);
ibTotal(app);
ibResult(app);
KGhome(app);
KGList(app);
KGDetail(app);
Register(app);
Forget(app);
restMobile(app);
restPwd(app);
real(app);
identity(app);
bank(app);
bankRestMobile(app);
comment(app);
activity(app);
strategy(app);
sendStrategy(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = {};
  err.status = 404;
  next(err);
});

app.use(function(req, res, next) {
  var err = {};
  err.status = 500;
  next(err);
});

app.use(function(req, res, next) {
  var err = {};
  err.status = 502;
  next(err);
});

app.use(function(req, res, next) {
  var err = {};
  err.status = 504;
  next(err);
});


app.use(function(req, res, next) {
  var err = {};
  err.status = 403;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err:err;

  // render the error page
  res.status(err.status);
  res.render('error',{error:err,title:err.status});
});

module.exports = app;
