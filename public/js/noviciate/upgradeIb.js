/**
 * Created by Administrator on 2017/9/18.
 */
;$(function () {
    var upgradeIb ={
        user: null,
        showBtn:function(){
            if(window.location.href.indexOf("index.html")>-1){
                $(".btn").show();
            }
        },
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result ){
                    upgradeIb.user = res.result;
                }
                upgradeIb.init();
            },function () {
                upgradeIb.init();
            })
        },
        init:function () {
            upgradeIb.showBtn();
            upgradeIb.getIntroducerInfo();
            upgradeIb.bindEvent();
        },
        bindEvent:function () {
            $('body').on('click','#checkMore',upgradeIb.checkMore);
        },
        checkMore:function () {
            var dom = $('#friendsBox li');
            if(dom.length > 3){
                if(this.text == '展开查看更多'){
                    $('#friendsBox li').show();
                    this.text = '收起';
                }else{
                    $('#friendsBox li').slice(3,dom.length).hide();
                    this.text = '展开查看更多';
                }
            }
        },
        getIntroducerInfo:function () {
            if(upgradeIb.user && upgradeIb.user.id != -1){
                wapApi.getIntroducerInfo.data = {"open_introducer":upgradeIb.user.id,"broker_id":''};
                wapApi.$ajax(wapApi.getIntroducerInfo,function (res) {
                    if(res.result && res.result.code == 10000 && res.result.obj && res.result.obj.length){
                        var list = res.result.obj;
                        for(var i = 0; i < list.length; i++){
                            i >= 3 ? list[i].hidden = 'hidden' : list[i].hidden = '';
                        }
                        if(list.length > 3) $('#checkMore').css('display','block');
                        var html = $.tppl(document.getElementById('friendstml').innerHTML, {list: list});
                        $('#friendsBox').empty().append($(html));
                    }else{
                        $('.intro').hide();
                    }
                },function () {
                    $('.intro').hide();
                })
            }else{
                $('.intro').hide();
            }
        }
    }
    upgradeIb.getLoginStatus();
})
