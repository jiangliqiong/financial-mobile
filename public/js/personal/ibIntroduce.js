/**
 * Created by Administrator on 2017/8/21.
 */
;$(function () {
    var personalIbIntroduce = {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 && res.result.type == 2){
                    personalIbIntroduce.user = res.result;
                    personalIbIntroduce.init();
                }else{
                    window.location.href = '/index.html';
                }
            },function () {
                window.location.href = '/index.html';
            })
        },
        init:function () {
            personalIbIntroduce.ibIntroduceInit();
            personalIbIntroduce.bindEvent();
        },
        bindEvent:function () {
            $('body').on('keyup','.contentBox textarea',personalIbIntroduce.textareaKeyup);
            $('body').on('click','.contentBox .submitBtn',personalIbIntroduce.submitIbIntroduce)
        },
        textareaKeyup:function () {
            if(!$.trim($(this).val()) /*|| $(this).val() == $('.submitBtn').data('introduce')*/){
                $('.submitBtn').removeClass('active');
            }else{
                $('.submitBtn').addClass('active');
            }
            var count = $(this).val().length;
            if( count >= 5000){
                $('body').mildHintLayer({type:3,msg:'您的输入已达上限'});
            }
        },
        //代理上介绍初始化
        ibIntroduceInit:function () {
            wapApi.getIbBasicInfo.data = {customer_id:personalIbIntroduce.user.id};
            wapApi.$ajax(wapApi.getIbBasicInfo,function (res) {
                if(res.result && res.result.code == 10000 && commonMethod.getJsonLength(res.result.obj) > 0) {
                    var info = res.result.obj;
                    $('.contentBox textarea').val(info.ib_introduce);
                    $('.submitBtn').get(0).dataset['introduce'] = info.ib_introduce;
                    if($('.contentBox textarea').val() != '') $('.submitBtn').addClass('active');
                }
            })
        },
        //提交代理商简介
        submitIbIntroduce:function () {
            if(!$('.submitBtn').hasClass('active')){
                return false;
            }
            var _this = this;
            if($(_this).hasClass('noclick')){
                return false;
            }
            $(_this).addClass('noclick');
            var content = $('.contentBox textarea').val();
            if(content.length <= 0){
                $(_this).mildHintLayer({type:3,msg:'请填写代理商介绍'});
                return false;
            }
            var param = {
                customer_id: personalIbIntroduce.user.id,
                ib_introduce: content
            }
            wapApi.updateIbBasicInfoSingle.data = param;
            wapApi.$ajax(wapApi.updateIbBasicInfoSingle,function (res) {
                if(res.result && res.result.code == 10000) {
                    window.location.href = 'ibmsg.html';
                }else{
                    $(_this).mildHintLayer({type:2,msg:'提交失败'});
                }
            },function (error) {
                $(_this).mildHintLayer({type:2,msg:'提交失败'});
            })
        }
    }
    personalIbIntroduce.getLoginStatus();
})
