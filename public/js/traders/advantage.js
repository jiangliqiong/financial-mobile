/**
 * Created by Administrator on 2017/9/28.
 */
;$(function () {
    var tradersAdvantage = {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result ){
                    tradersAdvantage.user = res.result;
                }
                tradersAdvantage.init();
            },function () {
                tradersAdvantage.init();
            })
        },
        init : function () {
            tradersAdvantage.advantageInit();
            tradersAdvantage.bindEvent();
        },
        bindEvent:function () {
            $('body').on('click','.openAccountBtn',tradersAdvantage.openTwoJudge);
        },
        //二次开户判断
        openTwoJudge:function () {
            var userId = tradersAdvantage.user.id,
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
        advantageInit : function () {
            $('.loading').show();
            var brokerId = commonMethod.getUrlParameter('brokerId');
            wapApi.getBrokerInfo.url = fx_path + '/front/broker/'+brokerId+'.do';
            wapApi.$ajax(wapApi.getBrokerInfo,function (res) {
                $('.loading').hide();
                $('.loadfail').addClass('fxHidden').removeClass('fxVisible');
                if( res.result && res.result.broker ){
                    var broker = res.result.broker;
                    //品牌优势
                    var brandAdvantage = broker.brand_advantage;

                    $('.openAccountBtn').data('brokername',broker.chinese_name);
                    var customer_back = broker.customer_back ? broker.customer_back : 0;
                    var ib_back = broker.ib_back ? broker.ib_back : 0;
                    tradersAdvantage.rebateInit(customer_back,ib_back);
                    if(!brandAdvantage){
                        $('.nodata').addClass('fxVisible').removeClass('fxHidden');
                    }else{
                        $('.nodata').addClass('fxHidden').removeClass('fxVisible');
                        $('.content').css('display','block');
                        $('.area').html(brandAdvantage);
                    }
                }else{
                    $('.nodata').addClass('fxVisible').removeClass('fxHidden');
                }
            },function () {
                $('.loadfail').addClass('fxVisible').removeClass('fxHidden');
                $('.loading').hide();
            })
        },
        rebateInit:function (customer_back,ib_back) {
            if( tradersAdvantage.user && tradersAdvantage.user.type == 2){
                $('.tradeAndIbRebate').css('display','block').children('.traderRebate').find('.val').text(customer_back);
                $('.tradeAndIbRebate').children('.ibRebate').find('.val').text(ib_back);
                $('.tradeRebate').remove();
            }else{
                $('.tradeRebate').css('display','block').find('.val').text(customer_back);
                $('.tradeAndIbRebate').remove();
            }
        }
    }
    tradersAdvantage.getLoginStatus();
})