/**
 * Created by Administrator on 2017/8/22.
 */
;$(function () {
    var personalFundDetail = {
        pageNum: 1,
        loading: false, //数据在加载中滚动不再请求数据
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 ){
                    personalFundDetail.user = res.result;
                    personalFundDetail.init();
                }else{
                    window.location.href = '/index.html';
                }
            },function () {
                window.location.href = '/index.html';
            })
        },
        init:function () {
            //资金出入明细信息
            personalFundDetail.getFundOutInDetail();
        },
        scrollTo:function () {
            window.onscroll = function(){
                //滚动条距离顶部距离
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                //内容高度
                var heihgt =  $(document).height();
                //屏幕高度
                var screenHeight = $(this).height();
                if(heihgt > 3200 && scrollTop > 100){
                    scrollToTopIcon.addScrollBtn();
                }else{
                    scrollToTopIcon.removeScrollBtn();
                }

                if(scrollTop + screenHeight + 100 >= heihgt){
                    if(personalFundDetail.pageNum > 0 && !personalFundDetail.loading ){
                        personalFundDetail.loading = true;
                        personalFundDetail.pageNum++;
                        $('.loadingMore').css('display','block');
                        setTimeout(function () {
                            personalFundDetail.loadFundOutInDetail();
                        },1000)
                    }
                }
            }
        },
        //首屏获取资金出入明细信息
        getFundOutInDetail:function () {
            $('.loading').show();
            $('#fundOutInDetailBox').empty();
            wapApi.getFundOutInDetail.data = {customer_id:personalFundDetail.user.id,pageNum:personalFundDetail.pageNum,pageSize:10};
            wapApi.$ajax(wapApi.getFundOutInDetail,function (res) {
                $('.loading').hide();
                $('.loadfail').addClass('fxHidden').removeClass('fxVisible');
                if( res.result && res.result.code == 10000 && res.result.obj.length > 0){
                    var result = res.result.obj;
                    personalFundDetail.renderFundOutInDetail(result);
                    setTimeout(personalFundDetail.scrollTo,0);
                    $('.nodata').addClass('fxHidden').removeClass('fxVisible');
                    if(res.result.obj.length < 10){
                        $('.loadingMore').css('display','block').html('已经没有数据了');
                    }
                }else{
                    $('.nodata').addClass('fxVisible').removeClass('fxHidden');
                }
            },function (res) {
                $('.loadfail').addClass('fxVisible').removeClass('fxHidden');
                $('.loading').hide();
            })
        },
        //滚动到底部加载数据
        loadFundOutInDetail:function () {
            wapApi.getFundOutInDetail.data = {customer_id:personalFundDetail.user.id,pageNum:personalFundDetail.pageNum,pageSize:10};
            wapApi.$ajax(wapApi.getFundOutInDetail,function (res) {
                if( res.result && res.result.code == 10000 && res.result.obj.length > 0){
                    var result = res.result.obj;
                    personalFundDetail.renderFundOutInDetail(result);
                }else{
                    personalFundDetail.pageNum = 0;
                    $('.loadingMore').html('已经没有数据了');
                }
                personalFundDetail.loading = false;
            })
        },
        //渲染页面
        renderFundOutInDetail:function (result) {
            for(var i = 0; i < result.length; i++){
                var money = result[i].money;
                var unit = money && money.slice(0,1);
                var value = money && money.slice(1,money.length);
                //字符串截取两位小数
                result[i].temporary_money = unit + Number(value).toFixed(2);
                result[i].temporary_balance_money = Number(result[i].balance_money).toFixed(2);
            }
            var fundOutInDetail = {list:result};
            var html = $.tppl(document.getElementById('fundOutInDetailTml').innerHTML, fundOutInDetail);
            $('#fundOutInDetailBox').append($(html));
        }
    }
    personalFundDetail.getLoginStatus();
})