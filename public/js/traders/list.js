/**
 * Created by Administrator on 2017/8/14.
 */
;$(function () {
    var tradersList =  {
        user: null,
        leixingHistory: [0],
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result ){
                    tradersList.user = res.result;
                }
                tradersList.init();
            },function () {
                tradersList.init();
            })
        },
        init : function () {
            //绑定事件
            tradersList.bindEvent();
            tradersList.scrollTo();
            tradersList.rebateInit(tradersList.user);
        },

        rebateInit:function (user) {
            var rebateTypeDom = $('.rebateType');
            for(var i = 0; i < rebateTypeDom.length; i++){
                if(user && user.type == 2){
                    var ibBack = $(rebateTypeDom[i]).data('ibback') ? $(rebateTypeDom[i]).data('ibback') : '0';
                    $(rebateTypeDom[i]).find('.liLabel').text('代理返佣：');
                    $(rebateTypeDom[i]).find('.liValue').text('$'+ ibBack + '/每手');
                }else{
                    var customerBack = $(rebateTypeDom[i]).data('customerback') ? $(rebateTypeDom[i]).data('customerback') : '0';
                    $(rebateTypeDom[i]).find('.liLabel').text('外汇返佣：');
                    $(rebateTypeDom[i]).find('.liValue').text('$'+ customerBack + '/每手');
                }
            }
        },
        scrollTo:function () {
            window.onscroll = function(){
                var t = document.documentElement.scrollTop || document.body.scrollTop;
                var heihgt =  document.body.scrollHeight;
                if(heihgt > 3200 && t > 50){
                    scrollToTopIcon.addScrollBtn();
                }else if(t < 50){
                    scrollToTopIcon.removeScrollBtn();
                }
            }
        },
        bindEvent : function () {
            $('body').on('click','.defaultIndex',tradersList.defaultSort);
            $('body').on('click','.filtration h4',tradersList.filterSort);
            $('.filterDiv ul#dianchaUl li,.filterDiv ul#gangganUl li,.filterDiv ul#guojiaUl li').on('click',tradersList.chooseCondition);
            $('.filterDiv ul#leixingUl li').on('click',tradersList.chooseLeixingCondition);
            $('body').on('click','.filterDiv .resetBtn',tradersList.resetChooseCondition);
            $('body').on('click','.filterDiv .finishBtn',tradersList.finishChooseCondition);
            $('body').on('click','.mask',tradersList.hideFilter);
        },
        //默认排序
        defaultSort : function(e){
            var flag = $(this).hasClass("filterActive");
            if(!flag){
                $(this).addClass("filterActive").siblings().removeClass("filterActive");
                $(".filterDiv").css('height','0');
                $(".mask").hide();
                tradersList.filterBrokerList("","","","");
                $('.filterDiv').find('.quanbu').addClass('liactive').siblings().removeClass('liactive');
                tradersList.leixingHistory = [0];
            }
        },
        //点差，杠杆，国家，类型的下拉列表
        filterSort: function (e) {
            if( $('.loadfail').hasClass('fxHidden') ) {
                $(this).addClass('filterActive').find('.downIcon').addClass('on');
                $(this).siblings('h4').find('.downIcon').removeClass('on')
                var id = $(this).find('.downIcon').attr('id');
                if(id == 'leixing'){
                    $(".filterDiv").find("#" + id + "Ul").show().siblings('ul').hide();
                    $('.filterDiv .btnBox').addClass('show');
                }else{
                    $(".filterDiv").find("#" + id + "Ul").show().siblings('ul').hide();
                    $('.filterDiv .btnBox').removeClass('show');
                }
                if($(".filterDiv").height() <= 1){
                    var heightUl = $("#" + id + "Ul").height(),
                        heightBtn = $(".filterDiv .btnBox").height(),
                        height = heightUl + heightBtn;
                    $(".filterDiv").css('height',height+'px');
                }else{
                    $(".filterDiv").css('height','auto');
                }
                $(".mask").show();
                var dom = $(this).find('.downIcon').addClass('on').parent().siblings('h4').find('.downIcon');
                for(var d = 0; d < dom.length; d++){
                    var id = dom[d].id;
                    tradersList.chooseStatus(id);
                }
            }
        },
        //类型的条件选择
        chooseLeixingCondition:function () {
            if($(this).hasClass('quanbu')){
                $(this).addClass("liactive").siblings().removeClass("liactive");
            }else{
                if($(this).hasClass('liactive')){
                    $(this).removeClass("liactive");
                    var dom = $(this).siblings('.liactive');
                    if(dom.length <= 0){
                        $(this).siblings('.quanbu').addClass('liactive');
                    }
                }else{
                    $(this).addClass("liactive").siblings('.quanbu').removeClass("liactive");
                }
            }
        },
        //类型不点击完成按钮，选中状态恢复
        leixingRecovery:function () {
            $(".filterDiv").find("#leixingUl").find('li').removeClass('liactive');
            for(var i = 0; i < tradersList.leixingHistory.length; i++){
                $(".filterDiv").find("#leixingUl").find('li').eq(tradersList.leixingHistory[i]).addClass('liactive');
            }
        },
        //点差，杠杆，国家的条件选择
        chooseCondition : function (e) {
            if(!$(this).hasClass('liactive')){
                $(this).addClass("liactive").siblings().removeClass("liactive");
                tradersList.arrangeChooseCondition();
            }
            tradersList.packUp();
        },
        resetChooseCondition:function () {
            $('#leixingUl').find('.quanbu').addClass('liactive').siblings().removeClass("liactive");
        },
        finishChooseCondition:function () {
            tradersList.leixingHistory = [];
            var dom = $('#leixingUl').find('.liactive');
            for(var i = 0; i < dom.length; i++){
                tradersList.leixingHistory.push($(dom[i]).index());
            }
            tradersList.arrangeChooseCondition();
            $(".filterDiv").css('height','0px');
            $(".mask").hide();
            tradersList.chooseStatus('leixing');
        },
        hideFilter: function (e) {
            tradersList.packUp();
        },
        packUp:function () {
            tradersList.leixingRecovery();
            $(".filterDiv").css('height','0px');
            $(".mask").hide();
            var id = $('.filtration').find('.on').attr('id');
            tradersList.chooseStatus(id);
        },
        //判断条件状态
        chooseStatus:function (id) {
            if(id){
                $('#' + id).removeClass('on');
                var hasClass = $('.filterDiv #'+id+'Ul').find('.quanbu').hasClass('liactive');
                hasClass ? $('#' + id).parent().removeClass('filterActive') : $('#' + id).parent().addClass('filterActive');
            }
        },

        arrangeChooseCondition:function () {
            //点差
            var dianchaText = $('#dianchaUl').find('.liactive').text();
            var min_point =  dianchaText == "全部" ? '' : dianchaText;
            //杠杆
            var gangganText = $('#gangganUl').find('.liactive').text();
            var max_leverage =  gangganText == "全部" ? '' : gangganText;
            //国家
            var guojiaText = $('#guojiaUl').find('.liactive').text();
            var country =  guojiaText == "全部" ? '' : guojiaText;
            //类型
            var dom = $('#leixingUl').find('.liactive'),managing_mode = '';
            for(var i = 0; i < dom.length; i++){
                var leixingText = $(dom[i]).text();
                if(leixingText == '全部'){
                    break;
                }else{
                    managing_mode = managing_mode + "/" + $(dom[i]).text();
                }
            }
            if(managing_mode){
                managing_mode = managing_mode.slice(1,managing_mode.length);
            }

            //渲染交易商列表
            tradersList.filterBrokerList(min_point,max_leverage,country,managing_mode);
            if(dianchaText == "全部" && gangganText == "全部" && guojiaText == "全部" && leixingText == "全部"){
                $('.filtration .defaultIndex').addClass('filterActive');
            }else{
                $('.filtration .defaultIndex').removeClass('filterActive');
            }
        },

        //筛选交易商列表
        filterBrokerList: function (min_point,max_leverage,country,managing_mode) {
            $('.loading').show();
            $('#borkerListBox').empty();
            wapApi.getBrokerList.data = {min_point:min_point, max_leverage:max_leverage, country:country, managing_mode:managing_mode}
            wapApi.$ajax(wapApi.getBrokerList,function (res) {
                $('.loading').hide();
                $('.loadfail').addClass('fxHidden').removeClass('fxVisible');
                if( res.result && res.result.code == 0 && res.result.obj.length > 0){
                    var brokerList = res.result.obj;
                    for(var i = 0; i < brokerList.length; i++){
                        if(tradersList.user && tradersList.user.type == 2){
                            brokerList[i].rebate = brokerList[i].ib_back;
                            brokerList[i].rebateText = '代理返佣：';
                        }else{
                            brokerList[i].rebate = brokerList[i].customer_back;
                            brokerList[i].rebateText = '外汇返佣：';
                        }
                    }
                    var brokers = {list:brokerList};
                    var html = $.tppl(document.getElementById('brokerListTml').innerHTML, brokers);
                    $('#borkerListBox').html(html);
                    $('.nodata').addClass('fxHidden').removeClass('fxVisible');
                }else{
                    $('.nodata').addClass('fxVisible').removeClass('fxHidden');
                }
            },function (res) {
                $('.loadfail').addClass('fxVisible').removeClass('fxHidden');
                $('.loading').hide();
            })
        }
    }
    tradersList.getLoginStatus();
})
