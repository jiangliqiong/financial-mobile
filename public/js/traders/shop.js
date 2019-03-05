/**
 * Created by Administrator on 2017/8/14.
 */
/**
 * Created by Administrator on 2017/8/16.
 */
;$(function () {
    var tradersShop = {
        user: null,
        qrcode : new QRCode("qrcode"),
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result ){
                    tradersShop.user = res.result;
                }
                tradersShop.init();
            },function () {
                tradersShop.init();
            })
        },
        init : function () {
            tradersShop.bannerInit();
            tradersShop.bindEvent();
            tradersShop.scrollTo();
            tradersShop.rebateInit();
            //代理交易商按钮初始化
            tradersShop.agentBrokerBtnInit(tradersShop.user);
            tradersShop.getCommentNum();
        },

        rebateInit:function () {
            var ib_back = $('.showRebate').data('ibback') ? $('.showRebate').data('ibback') : 0;
            var customer_back = $('.showRebate').data('customerback') ? $('.showRebate').data('customerback') : 0;
            if( tradersShop.user && tradersShop.user.type == 2){
                $('.tradeAndIbRebate').css('display','block').children('.traderRebate').find('.val').text(customer_back);
                $('.tradeAndIbRebate').children('.ibRebate').find('.val').text(ib_back);
                $('.tradeRebate').remove();
            }else{
                $('.tradeRebate').css('display','block').find('.val').text(customer_back);
                $('.tradeAndIbRebate').remove();
            }
        },
        //代理交易商按钮初始化
        agentBrokerBtnInit:function (user) {
            if(user && user.type == 2){
                var brokerId = $('.agentTraderBtn').data('brokerid');
                wapApi.agentBrokerValid.data = {"customer_id":user.id,"broker_id":brokerId};
                wapApi.$ajax(wapApi.agentBrokerValid,function (res) {
                    if(res.result.code == 10001){
                        $('.agentTraderBtn').html('已代理').addClass('disabled');
                    }else{
                        $('.agentTraderBtn').html('<span>代理此<br/>交易商</span>').addClass('active');
                    }
                })
            }else{
                $('.agentTraderBtn').html('<span>代理此<br/>交易商</span>').addClass('active');
            }
        },
        bannerInit: function () {
            var banner = $('.swiper-container').swiper({
                loop: true,
                autoplay: 2000,
                speed: 2000,
                autoplayDisableOnInteraction : false,
                pagination : '.swiper-pagination'
            });
        },
        bindEvent : function () {
            //分享点击事件
            $('body').on('click','.shareBtn',tradersShop.showShareHandle);
            //取消分享
            $('body').on('click','.qrcodeLayerBox .closeBtn',tradersShop.hideShareHandle);
            //代理交易商按钮
            $('body').on('click','.agentTraderBtn',tradersShop.agentTraderBtn);
            //马上开户
            $('body').on('click','.openAccountBtn',tradersShop.openTwoJudge);
            //评论
            $('body').on('click','.commentBtn',tradersShop.commentList)
        },
        //跳转评论
        commentList: function() {
            var commentId = commonMethod.getUrlParameter('brokerId');
            //commentStatus: 0 交易商 1 代理商
            location.href = '/comment/list.html?commentId='+commentId+'&commentStatus=0';
        },
        //分享按钮点击事件
        showShareHandle:function () {
            $('.qrcodeLayerBox').show().find('.qrcodeMask').show();
            $('.qrcodeLayer').show().animate({opacity:1},200);
            var _url = window.location.href;
            if( tradersShop.user && tradersShop.user.id != -1 ){
                if(_url.indexOf('shareId') < 0){
                    _url = _url + '&shareId=' + tradersShop.user.id;
                }else{
                    _url = commonMethod.replaceParamVal(_url,'shareId',tradersShop.user.id);
                }
            }else{
                if(_url.indexOf('shareId') != -1){
                    _url = commonMethod.replaceParamVal(_url,'shareId','');
                }
            }
            tradersShop.qrcode.makeCode(_url);
            // var url = fx_path + '/customer/getQrCode.do?url=' +_url+ '&qrCodeSize=410&imageFormat=jpeg&fileStream=f059b0284da834b3439fe01a309dd13a';
            // $('#qrcode img').attr('src', url);
        },
        //取消分享事件
        hideShareHandle:function () {
            $('.qrcodeLayerBox').hide().find('.qrcodeMask').hide();
            $('.qrcodeLayer').animate({opacity:0},150,'',function () {
                $('.qrcodeLayer').hide();
            });
        },
        //页面滚动，头部逐渐色变
        scrollTo:function () {
            window.onscroll = function(){
                var topHeight = document.documentElement.scrollTop || document.body.scrollTop;
                var xmHeight = $('.xm').height();
                if(topHeight > xmHeight){
                    $('.topbar').css("background",'-webkit-linear-gradient(304deg, #094494, #0a1f61)');
                }else{
                    var opacity = (1/xmHeight)*topHeight;
                    $('.topbar').css("background",'rgba(9,68,148,'+ opacity +')');
                }
            }
        },
        agentTraderBtn:function () {
            var brokerid = $('.agentTraderBtn').data('brokerid');
            if($(this).hasClass('active')){
                if( tradersShop.user ){
                    if( tradersShop.user.id == -1 ){
                        window.location.href = '/login.html?ref=' + Base64.encode(window.location.href);
                    }else{
                        if( tradersShop.user.type == 1 ){
                            tradersShop.ibQualiValid();
                        }else if( tradersShop.user.type == 2 ){
                            window.location.href = '../ibApply/apply.html?id='+brokerid;
                        }
                    }
                }else{
                    window.location.href = '/login.html?ref=' + Base64.encode(window.location.href);
                }
            }
        },
        //根据用户信息判断用户是否具有IB资格
        ibQualiValid:function () {
            wapApi.ibQualiValid.data = {"customer_id":tradersShop.user.id};
            wapApi.$ajax(wapApi.ibQualiValid,function (res) {
                if( res.result.code == 10101 ){
                    window.location.href = '../ibApply/fail.html';
                }else if(res.result.code == 10102){
                    window.location.href = '../ibApply/qualified.html';
                }
            })
        },
        //二次开户判断
        openTwoJudge:function () {
            var userId = tradersShop.user.id,
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
        getCommentNum: function() {
           var commentId = commonMethod.getUrlParameter('brokerId');
           var url = fx_path + '/front/find-fx-comment-page.do?comment_id='+commentId+'&comment_status=0&pageNum=1&pageSize=10';
           $.getJSON(url,function(res) {
              if(res.code == 0 && res.result.code == 10000 && res.result.obj) {
                var total = res.result.obj.total?res.result.obj.total:0;
                Number(total) > 999 ? total = 999:total;
                $('.commentBtn .num').text(total+'条评论');
              }
           })
        }
    }
    tradersShop.getLoginStatus();
})
