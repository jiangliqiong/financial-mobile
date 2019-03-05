/**
 * Created by Administrator on 2017/8/16.
 */
;$(function () {
    var tradersTools = {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result ){
                    tradersTools.user = res.result;
                }
                tradersTools.init();
            },function () {
                tradersTools.init();
            })
        },
        init : function () {
            tradersTools.loadBtnInit();
            tradersTools.rebateInit();
            tradersTools.bindEvent();
        },
        loadBtnInit: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (/android/.test(ua)) {
                $('.androidLoad').css('display','block');
            } else if (/iphone|ipad|ipod/.test(ua)){
                $('.iosLoad').css('display','block');
            }
        },
        rebateInit:function () {
            var brokerId = commonMethod.getUrlParameter('brokerId');
            wapApi.getBrokerInfo.url = fx_path + '/front/broker/'+brokerId+'.do'
            wapApi.$ajax(wapApi.getBrokerInfo,function (res) {
                if( res.result && res.result.broker ){
                    var broker = res.result.broker;
                    var customer_back = broker.customer_back ? broker.customer_back : 0;
                    var ib_back = broker.ib_back ? broker.ib_back : 0;
                    if( tradersTools.user && tradersTools.user.type == 2){
                        $('.tradeAndIbRebate').css('display','block').children('.traderRebate').find('.val').text(customer_back);
                        $('.tradeAndIbRebate').children('.ibRebate').find('.val').text(ib_back);
                        $('.tradeRebate').remove();
                    }else{
                        $('.tradeRebate').css('display','block').find('.val').text(customer_back);
                        $('.tradeAndIbRebate').remove();
                    }
                    $('.openAccountBtn').data('brokername',broker.chinese_name);
                }
            })
        },
        bindEvent : function () {
            $('body').on('click','.androidLoad',tradersTools.androidLoad);
            $('body').on('click','.iosLoad',tradersTools.iosLoad);
            $('body').on('click','.openAccountBtn',tradersTools.openTwoJudge)
        },
        androidLoad: function (e) {
            var ua = navigator.userAgent.toLowerCase();
            if (/android/.test(ua)) {
                // window.location.href ="http://www.gwfx.com/download/metatrader4.apk";
            }else{
                e.preventDefault();
                return false;
            }
        },
        iosLoad:function (e) {
            var ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {
                // window.location.href ="https://itunes.apple.com/cn/app/metatrader-4/id496212596?mt=8";
            }else{
                e.preventDefault();
                return false;
            }
        },
        //二次开户判断
        openTwoJudge:function () {
            var userId = tradersTools.user.id;
            if(userId != -1){
                var brokerId = commonMethod.getUrlParameter('brokerId'),
                    brokerName = $(this).data('brokername'),
                    shareId = commonMethod.getUrlParameter('shareId'),
                    ref = '../openAccount/check.html?type=customer&brokerId=' + brokerId;
                if( shareId ) ref = ref + '&shareId=' + shareId;

                commonMethod.hasAccount(userId,brokerId,'',ref,brokerName);
            }else{
                window.location.href = '/login.html?ref=' + Base64.encode(window.location.href);
            }
        }
    }
    tradersTools.getLoginStatus();
})