/**
 * Created by Administrator on 2017/8/21.
 */
;$(function () {
    var personalAgentTrader = {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 && res.result.type == 2 ){
                    personalAgentTrader.user = res.result;
                    personalAgentTrader.init();
                }else{
                    window.location.href = '/index.html';
                }
            },function () {
                window.location.href = '/index.html';
            })
        },
        init:function () {
            personalAgentTrader.getAgentsBrokerList();
            personalAgentTrader.bindEvent();
        },
        bindEvent:function () {
            //代理状态按钮
            $('body').on('click','.statusBtn',personalAgentTrader.statusBtn);
        },
        //代理状态按钮
        statusBtn: function () {
            event.preventDefault();
            if($('.mildHintBox').length > 0){
                return false;
            }
            var _this = this;
            var agentsId = $(_this).data('agentid');
            if($(_this).hasClass('open')){
                $(_this).confirmLayer({
                    type: 1,
                    title: '提示',
                    msg: '暂停代理后，该交易商代理信息将不再显示在您的主页中，但该交易商相关开户账户将依然有效，且将依然返佣到您的账户！',
                    yes:function () {
                        wapApi.pauseAgent.data = {agents_id: agentsId ,modify_user:  personalAgentTrader.user.id ,status: 3};
                        wapApi.$ajax(wapApi.pauseAgent,function (res) {
                            if( res.result && res.result.code == 0 ){
                                $('body').mildHintLayer({type:1,msg:'修改成功'});
                                $(_this).addClass('close').removeClass('open');
                                $(_this).prev().text('暂停代理');
                            }else{
                                $('body').mildHintLayer({type:2,msg:'修改失败'});
                            }
                        },function () {
                            $('body').mildHintLayer({type:2,msg:'修改失败'});
                        })
                    }
                })
            }else{
                $(_this).confirmLayer({
                    type: 1,
                    title: '提示',
                    msg: '恢复代理后，该代理信息将继续在您的主页中展示，接受投资人申请开户！',
                    yes:function () {
                        wapApi.recoverAgent.data = {agents_id: agentsId ,modify_user:  personalAgentTrader.user.id ,status: 1};
                        wapApi.$ajax(wapApi.recoverAgent,function (res) {
                            if( res.result && res.result.code == 0 ){
                                $('body').mildHintLayer({type:1,msg:'修改成功'});
                                $(_this).addClass('open').removeClass('close');
                                $(_this).prev().text('代理中');
                            }else{
                                $('body').mildHintLayer({type:2,msg:'修改失败'});
                            }
                        },function () {
                            $('body').mildHintLayer({type:2,msg:'修改失败'});
                        })
                    }
                })
            }
        },

        getAgentsBrokerList:function () {
            $('.loading').show();
            wapApi.getAgentsBrokerList.data = {customer_id: personalAgentTrader.user.id};
            wapApi.$ajax(wapApi.getAgentsBrokerList,function (res) {
                $('.loading').hide();
                $('.loadfail').addClass('fxHidden').removeClass('fxVisible');
                if( res.result && res.result.code == 10000 && res.result.obj.length > 0){
                    var agentBrokerList = {list:res.result.obj};
                    var html = $.tppl(document.getElementById('agentBrokerListTml').innerHTML, agentBrokerList);
                    $('#agentBrokerListBox').html(html);
                    $('.nodata').addClass('fxHidden').removeClass('fxVisible');
                }else{
                    $('.nodata').addClass('fxVisible').removeClass('fxHidden');
                }
            },function (error) {
                $('.loadfail').addClass('fxVisible').removeClass('fxHidden');
                $('.loading').hide();
            })
        }

    }
    personalAgentTrader.getLoginStatus();
})