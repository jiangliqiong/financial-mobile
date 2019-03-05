/**
 * Created by Administrator on 2017/8/21.
 */
;$(function () {
    var personalTradingAccount = {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 ){
                    personalTradingAccount.user = res.result;
                    personalTradingAccount.init();
                }else{
                    window.location.href = '/index.html';
                }
            },function () {
                window.location.href = '/index.html';
            })
        },
        init:function () {
            personalTradingAccount.accountInfoListInit();
            personalTradingAccount.bindEvent();
        },
        bindEvent:function () {
            $('body').on('click','.unbindBtn',personalTradingAccount.accountUnbind);
            $('body').on('click','.changeBtn',personalTradingAccount.accountChange)
        },
        //账户解除绑定
        accountUnbind:function () {
            if($('.mildHintBox').length > 0) return false;
            var _this = this,openId = $(_this).data('openid'),platback = $(_this).data('platback');
            $(_this).confirmLayer({
                type: 1,
                title: '提示',
                msg: '<p class="hintMsg">您的此交易账户解除现有代理关系后将不再享有该IB代理商提供的交易返佣及其他服务，解除成功后相关交易返佣按平台直接开户返佣计算，您确定要解除吗？</p><p class="rebate">每手返佣: '+platback+'美元</p>',
                yes:function () {
                    wapApi.changeAgent.data = {open_id:openId,ib_id:"",change_type:2};
                    wapApi.$ajax(wapApi.changeAgent,function (res) {
                        if( res.result && res.result.code == 10000 ){
                            $(_this).parent().siblings('.hintBox').css('display','block').children('.hintText').html('已申请解除代理，下一结算周期生效。');
                            $('body').mildHintLayer({type:1,msg:'您的此交易商账户已解除现有代理关系，自下一结算周期开始，交易（以平仓计）相应返佣将获得平台直接开户返佣。'});
                        }else{
                            $('body').mildHintLayer({type:3,msg:'对不起，该账户距离您上次IB代理商变更还不到24小时，请稍后再操作！'});
                        }
                    },function (error) {
                        $('body').mildHintLayer({type:2,msg:'解除失败'});
                    })
                }
            })
        },
        accountChange:function () {
            var openId = $(this).data('openid'),
                _url = $(this).data('href');
            wapApi.isIbChanged.data = {open_id: openId};
            wapApi.$ajax(wapApi.isIbChanged,function (res) {
                if( res.result && res.result.code == 10000){
                    window.location.href = _url;
                }else if(res.result && res.result.code == 10001){
                    $('body').mildHintLayer({type:3,msg:'对不起，该账户距离您上次IB代理商变更还不到24小时，请稍后再操作！'});
                }
            })
        },
        //账户信息
        accountInfoListInit:function () {
            $('.loading').show();
            wapApi.getAccountInfoList.data = {customer_id: personalTradingAccount.user.id};
            wapApi.$ajax(wapApi.getAccountInfoList,function (res) {
                $('.loading').hide();
                $('.loadfail').addClass('fxHidden').removeClass('fxVisible');
                if( res.result && res.result.code == 10000 && res.result.obj.length > 0){
                    var accountInfoList = {list:res.result.obj};
                    var html = $.tppl(document.getElementById('accountInfoListTml').innerHTML, accountInfoList);
                    $('#accountInfoListBox').html(html);
                    $('.nodata').addClass('fxHidden').removeClass('fxVisible');
                }else{
                    $('.nodata').addClass('fxVisible').removeClass('fxHidden');
                    $('.contentBox').hide();
                }
            },function (error) {
                $('.loadfail').addClass('fxVisible').removeClass('fxHidden');
                $('.loading').hide();
                $('.contentBox').hide();
            })
        }
    }
    personalTradingAccount.getLoginStatus();
})