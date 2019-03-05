/**
 * Created by Administrator on 2017/8/15.
 */
;$(function () {
    var tradersActivity =  {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result ){
                    tradersActivity.user = res.result;
                }
                tradersActivity.init();
            },function () {
                tradersActivity.init();
            })
        },
        init : function () {
            tradersActivity.activityListInit();
            tradersActivity.bindEvent();
            tradersActivity.rebateInit();
            tradersActivity.scrollTo();
        },
        rebateInit:function () {
            var brokerId = commonMethod.getUrlParameter('brokerId');
            wapApi.getBrokerInfo.url = fx_path + '/front/broker/'+brokerId+'.do'
            wapApi.$ajax(wapApi.getBrokerInfo,function (res) {
                if( res.result && res.result.broker ){
                    var broker = res.result.broker;
                    var customer_back = broker.customer_back ? broker.customer_back : 0;
                    var ib_back = broker.ib_back ? broker.ib_back : 0;
                    if( tradersActivity.user && tradersActivity.user.type == 2){
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
        activityListInit:function () {
            $('.loading').show();
            var brokerId = commonMethod.getUrlParameter('brokerId');
            wapApi.getBrokerActivityList.data = {broker_id:brokerId};
            wapApi.$ajax(wapApi.getBrokerActivityList,function (res) {
                $('.loading').hide();
                $('.loadfail').addClass('fxHidden').removeClass('fxVisible');
                if( res.result && res.result.code == 10000 && res.result.obj.length > 0){
                    var accountInfoList = {list:res.result.obj};
                    var html = $.tppl(document.getElementById('activityListTml').innerHTML, accountInfoList);
                    $('#activityListBox').html(html);
                    tradersActivity.calculateHeight();
                    $('.nodata').addClass('fxHidden').removeClass('fxVisible');
                    $('.activityContent').show();
                }else{
                    $('.nodata').addClass('fxVisible').removeClass('fxHidden');
                    $('.activityContent').hide();
                }
            },function (error) {
                $('.loadfail').addClass('fxVisible').removeClass('fxHidden');
                $('.loading').hide();
                $('.activityContent').hide();
            })
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
        bindEvent : function () {
            $('body').on('click','.activityContent .upDownIcon',tradersActivity.upDown);
            $('body').on('click','.openAccountBtn',tradersActivity.openTwoJudge);
        },
        upDown: function () {
            var flag1 = $(this).hasClass('down');
            var flag2 = $(this).hasClass('up');
            if(flag1 && !flag2){
                $(this).parent().siblings('.extend').css('height','auto');
                $(this).addClass('up').removeClass('down').html('&#xe659;');
                $(this).parent().parent().siblings().find('.upDownIcon').addClass('down').removeClass('up').html('&#xe64b;');
                $(this).parent().parent().siblings().find('.extend').css('height','2rem');
            }else{
                $(this).parent().siblings('.extend').css('height','2rem');
                $(this).addClass('down').removeClass('up').html('&#xe64b;');
            }
        },
        //二次开户判断
        openTwoJudge:function () {
            var userId = tradersActivity.user.id,
                brokerId = commonMethod.getUrlParameter('brokerId'),
                brokerName = $(this).data('brokername'),
                shareId = commonMethod.getUrlParameter('shareId'),
                ref = '../openAccount/check.html?type=customer&brokerId=' + brokerId;

            if( shareId ) ref = ref + '&shareId=' + shareId;
            if(userId != -1){
                commonMethod.hasAccount(userId,brokerId,'',ref,brokerName);
            }else{
                window.location.href = ref;
            }
        },
        calculateHeight:function () {
            var dom = $(".activityContent .content");
            for(var i = 0; i < dom.length; i++){
                if($(dom[i]).find('span').height() >= 185){
                    $(dom[i]).css('height','2rem').addClass("extend");
                    $(dom[i]).next().show();
                }else{
                    $(dom[i]).css('max-height','2rem');
                }
            }
        }
    }
    tradersActivity.getLoginStatus();
})
