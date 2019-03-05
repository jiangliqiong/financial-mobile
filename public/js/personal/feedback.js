/**
 * Created by Administrator on 2017/8/21.
 */
;$(function () {
    var personalFeedback = {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 ){
                    personalFeedback.user = res.result;
                    personalFeedback.init();
                }else{
                    window.location.href = '/index.html';
                }
            },function () {
                window.location.href = '/index.html';
            })
        },
        init:function () {
            personalFeedback.bindEvent();
        },
        bindEvent:function () {
            $('body').on('keyup','.contentBox textarea',personalFeedback.textareaKeyup);
            $('body').on('click','.submitBtn',personalFeedback.submitFeedback);
        },
        textareaKeyup:function () {
            if(!$.trim($(this).val())){
                $('.submitBtn').removeClass('active');
            }else{
                $('.submitBtn').addClass('active');
            }
        },
        submitFeedback:function () {
            if(!$('.submitBtn').hasClass('active')){
                return false;
            }
            if($('.mildHintBox').length > 0){
                return false;
            }
            var _this = this;
            var content = $('.contentBox textarea').val();
            if(content.length <= 0){
                $(_this).mildHintLayer({type:3,msg:'请填写意见反馈'});
                return false;
            }
            var param = {
                "customer_id": personalFeedback.user.id,
                "problem_description": content,
                "table_type": 1
            }
            if($(_this).hasClass('noclick')){
                return false;
            }
            $(_this).addClass('noclick');
            $.ajax({
                async:false,
                url: fx_path + '/front/add-customer-back.do',
                type: 'post',
                dataType:'json',
                data: param,
                success:function(data){
                    $(_this).removeClass('noclick');
                    if(data.code == "0" && data.result.code == "0"){
                        $(_this).mildHintLayer({type:1,msg:'提交成功',ref:'index.html'});
                    }else{
                        $(_this).mildHintLayer({type:2,msg:'提交失败'});
                    }
                },
                error:function(error){
                    $(_this).mildHintLayer({type:2,msg:'提交失败'});
                }
            });
        }
    }
    personalFeedback.getLoginStatus();
})
