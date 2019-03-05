/**
 * Created by Administrator on 2017/8/15.
 */
;$(function () {
    var tradersTrade =  {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result ){
                    tradersTrade.user = res.result;
                }
                tradersTrade.init();
            },function () {
                tradersTrade.init();
            })
        },
        init : function () {
            tradersTrade.pageInit();
            tradersTrade.bindEvent();
            tradersTrade.scrollTo();
            tradersTrade.rebateInit();
        },
        scrollTo:function () {
            window.onscroll = function(){
                var t = document.documentElement.scrollTop || document.body.scrollTop;
                var heihgt =  document.body.scrollHeight;
                if(heihgt > 3200 && t > 100){
                    scrollToTopIcon.addScrollBtn();
                }else{
                    scrollToTopIcon.removeScrollBtn();
                }
            }
        },
        pageInit: function () {
            var hasFlag = $('.contentBox').data('spreadrecord');
            if(hasFlag == "yes"){
                $('.tradeModule').hide();
                $('.spreadModule').show();
                $('.contentBox').addClass('fxVisible').removeClass('fxHidden');
                $('.norecord').addClass('fxHidden').removeClass('fxVisible');
            }else{
                $('.tradeModule').hide();
                $('.contentBox').addClass('fxHidden').removeClass('fxVisible');
                $('.norecord').addClass('fxVisible').removeClass('fxHidden');
            }
        },

        rebateInit:function () {
            var ib_back = $('.showRebate').data('ibback') ? $('.showRebate').data('ibback') : 0;
            var customer_back = $('.showRebate').data('customerback') ? $('.showRebate').data('customerback') : 0;
            if( tradersTrade.user && tradersTrade.user.type == 2){
                $('.tradeAndIbRebate').css('display','block').children('.traderRebate').find('.val').text(customer_back);
                $('.tradeAndIbRebate').children('.ibRebate').find('.val').text(ib_back);
                $('.tradeRebate').remove();
            }else{
                $('.tradeRebate').css('display','block').find('.val').text(customer_back);
                $('.tradeAndIbRebate').remove();
            }
        },
        bindEvent : function () {
            $('body').on('click','.btnBox li span',tradersTrade.tabSwitch);
            $('body').on('click','.mask',function(){$('.mask').hide();});
            $('body').on('click','.openAccountBtn',tradersTrade.openTwoJudge);
        },
        //导航标签切换
        tabSwitch: function () {
            var flag = $(this).hasClass('tradeActive');
            if(!flag){
                $(this).addClass('tradeActive').parent().siblings('li').children().removeClass('tradeActive');
                if($(this).parent().hasClass('spread')){
                    var hasFlag = $('.contentBox').data('spreadrecord');
                    if(hasFlag == "yes"){
                        $('.tradeModule').hide();
                        $('.spreadModule').show();
                        $('.contentBox').addClass('fxVisible').removeClass('fxHidden');
                        $('.norecord').addClass('fxHidden').removeClass('fxVisible');
                    }else{
                        $('.spreadModule').hide();
                        $('.contentBox').addClass('fxHidden').removeClass('fxVisible');
                        $('.norecord').addClass('fxVisible').removeClass('fxHidden');
                    }
                }
                if($(this).parent().hasClass('inout')){
                    var hasFlag = $('.contentBox').data('inoutrecord');
                    if(hasFlag == "yes"){
                        $('.tradeModule').hide();
                        $('.inoutModule').show();
                        $('.contentBox').addClass('fxVisible').removeClass('fxHidden');
                        $('.norecord').addClass('fxHidden').removeClass('fxVisible');
                    }else{
                        $('.inoutModule').hide();
                        $('.contentBox').addClass('fxHidden').removeClass('fxVisible');
                        $('.norecord').addClass('fxVisible').removeClass('fxHidden');
                    }
                }
                if($(this).parent().hasClass('type')){
                    var hasFlag = $('.contentBox').data('accounttyperecord');
                    if(hasFlag == "yes"){
                        $('.tradeModule').hide();
                        $('.typeModule').show();
                        // $('.mask').show();
                        $('.contentBox').addClass('fxVisible').removeClass('fxHidden');
                        $('.norecord').addClass('fxHidden').removeClass('fxVisible');
                    }else{
                        $('.typeModule').hide();
                        $('.contentBox').addClass('fxHidden').removeClass('fxVisible');
                        $('.norecord').addClass('fxVisible').removeClass('fxHidden');
                    }
                }
            }
        },
        //二次开户判断
        openTwoJudge:function () {
            var userId = tradersTrade.user.id;
            var brokerId = commonMethod.getUrlParameter('brokerId'),
                brokerName = $(this).data('brokername'),
                shareId = commonMethod.getUrlParameter('shareId'),
                ref = '../openAccount/check.html?type=customer&brokerId=' + brokerId;

            if( shareId ) ref = ref + '&shareId=' + shareId;
            if(userId != -1){
                commonMethod.hasAccount(userId,brokerId,'',ref,brokerName);
            }else{
                window.location.href = ref;
            }
        }
    }
    tradersTrade.getLoginStatus();
})