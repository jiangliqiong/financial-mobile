/**
 * Created by Administrator on 2017/8/20.
 */
;$(function () {
    var personalIndex = {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 ){
                    personalIndex.user = res.result;
                    var phone = commonMethod.encryptPhone(res.result.phone);
                    var type = res.result.type;
                    $('.customer .phone').html('欢迎您： ' + phone);
                    type == '1' ? $('.identity').html('投资人') : $('.identity').html('IB代理商');
                    personalIndex.init();
                }else{
                    window.location.href = '/index.html';
                }
            },function () {
                window.location.href = '/index.html';
            })
        },
        init:function () {
            if(personalIndex.user.type == 2){
                personalIndex.getAgentTraderCount();
                personalIndex.agentInfoIsComplete();
                personalIndex.getStrategy();
            }
            personalIndex.getOpenAccountCount();
            personalIndex.basicInfoIsComplete();
            personalIndex.getBankCardCount();
            personalIndex.getLastRebate();
            personalIndex.getAccountBalance();
            personalIndex.bindEvent();
            personalIndex.scrollTo();
        },
        bindEvent:function () {
            $('body').on('click','#withdrawBtn',personalIndex.withdrawCash);
        },
        withdrawCash:function () {
            wapApi.getBankCardList.data = {customer_id: personalIndex.user.id};
            wapApi.$ajax(wapApi.getBankCardList,function (res) {
                if(res.result && res.result.code == 0 && res.result.obj && res.result.obj.length > 0){
                    window.location.href = '../bank/withdraw.html';
                }else{
                    $(this).confirmLayer({
                        type: 2,
                        msg: '您的账户还未绑定银行卡，请添加后提现',
                        leftBtn: '取消',
                        rightBtn: '立即添加',
                        yes:function () {
                            window.location.href = '/personal/bank.html?type=2&status=1';
                        }
                    });
                }
            })
        },
        //代理交易商个数
        getAgentTraderCount:function () {
            $('#agentTraderLi').show();
            wapApi.getAgentTraderCount.data = {customer_id:personalIndex.user.id};
            wapApi.$ajax(wapApi.getAgentTraderCount,function (res) {
                if( res.result && res.result.code == 10000 && commonMethod.getJsonLength(res.result.obj) > 0){
                    var text = res.result.obj.count ? res.result.obj.count + '家' : '';
                    $('#agentTraderCount').html(text);
                }
            })
        },
        //开户数
        getOpenAccountCount:function () {
            wapApi.getOpenAccountCount.data = {customer_id:personalIndex.user.id};
            wapApi.$ajax(wapApi.getOpenAccountCount,function (res) {
                if( res.result && res.result.code == 10000 && commonMethod.getJsonLength(res.result.obj) > 0){
                    var text = res.result.obj.count ? res.result.obj.count + '个开户成功' : '';
                    $('#openAccountCount').html(text);
                }
            })
        },
        //基本信息是否完整
        basicInfoIsComplete: function(){
            wapApi.basicInfoIsComplete.data = {customer_id:personalIndex.user.id};
            wapApi.$ajax(wapApi.basicInfoIsComplete,function (res) {
                if( res.result ){
                    if( res.result.code == 10000 ){
                        $('#basicInfoComplete').html('已完善');
                    }else if( res.result.code == 10001 ){
                        $('#basicInfoComplete').html('待完善');
                    }
                }
            })
        },
        //代理信息是否完整
        agentInfoIsComplete: function(){
            $('#agentInfoLi').show();
            wapApi.agentInfoIsComplete.data = {customer_id:personalIndex.user.id};
            wapApi.$ajax(wapApi.agentInfoIsComplete,function (res) {
                if( res.result ){
                    if( res.result.code == 10000 ){
                        $('#agentInfoComplete').html('已完善');
                    }else if( res.result.code == 10001 ){
                        $('#agentInfoComplete').html('待完善');
                    }
                }
            })
        },
        //银行卡数
        getBankCardCount:function () {
            wapApi.getBankCardCount.data = {customer_id:personalIndex.user.id};
            wapApi.$ajax(wapApi.getBankCardCount,function (res) {
                if( res.result && res.result.code == 10000 && commonMethod.getJsonLength(res.result.obj) > 0){
                    var text = res.result.obj.count ? res.result.obj.count + '张' : '';
                    $('#bankCardCount').html(text);
                }
            })
        },
        //最近一次返佣金额
        getLastRebate:function () {
            wapApi.getLastRebate.data = {customer_id:personalIndex.user.id};
            wapApi.$ajax(wapApi.getLastRebate,function (res) {
                if( res.result && res.result.code == 10000 && commonMethod.getJsonLength(res.result.obj) > 0){
                    var money = res.result.obj.money != null ? res.result.obj.money : '';
                    $('#recentlyRebate').html(money);
                }
            })
        },
        //策略信息
        getStrategy: function() {
          $('.strategy-li').show();
          wapApi.getIbBasicInfo.data = {customer_id:personalIndex.user.id};
          wapApi.$ajax(wapApi.getIbBasicInfo,function (res) {
              if( res.result && res.result.code == 10000 && commonMethod.getJsonLength(res.result.obj) > 0){
                  var ibId = res.result.obj.ib_id != null ? res.result.obj.ib_id : '';
                  wapApi.getVarietiesList.data = {ib_id:ibId};
                  wapApi.$ajax(wapApi.getVarietiesList,function (res) {
                      if( res.result && res.result.code == 10000){
                          var num = res.result.obj.length != null ? res.result.obj.length : '0';
                          $('#strategyNum').html(num+'条');
                      }
                  })
              }
          })
        },
        //账户返佣
        getAccountBalance:function () {
            wapApi.getAccountBalance.data = {customer_id:personalIndex.user.id};
            wapApi.$ajax(wapApi.getAccountBalance,function (res) {
                if( res.result && res.result.code == 0 && commonMethod.getJsonLength(res.result.obj) > 0){
                    var item = res.result.obj;
                    $('#balance').text(item.balance_money ? item.balance_money : '0.00');
                    $('#cumulativeTradeRebate').text(item.total_account_money ? item.total_account_money : '0.00');
                    $('#cumulativeAgentRebate').text(item.ib_total_account_money ? item.ib_total_account_money : '0.00');
                }
            })
        },
        //页面滚动，头部逐渐色变
        scrollTo:function () {
            window.onscroll = function(){
                var topHeight = document.documentElement.scrollTop || document.body.scrollTop;
                var xmHeight = $('.module1').height();
                if(topHeight > xmHeight){
                    $('.title').css("background",'-webkit-linear-gradient(304deg, #094494, #0a1f61)');
                }else{
                    var opacity = (1/xmHeight)*topHeight;
                    $('.title').css("background",'rgba(9,68,148,'+ opacity +')');
                }
            }
        }
    }
    personalIndex.getLoginStatus();
})
