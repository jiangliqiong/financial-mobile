/**
 * Created by Administrator on 2017/9/9.
 */
;$(function () {
    var login = {
        init:function () {
            $('.registerBtn').attr('href','/register.html?ref=' + commonMethod.getUrlParameter('ref'));
            login.bindEvent();
        },
        bindEvent:function () {
            //切换登录方式
            $('body').on('click','.codeLogin,.passwordLogin',login.switchLoginType)
            $('body').on('input','.formInput',login.showClearBtn);
            $('body').on('focus','.formInput',login.showClearBtn);
            $('body').on('blur','.formInput',login.hideClearBtn);
            //清空输入框
            $('body').on('tap','.clearIcon',login.clearInput);
            $('body').on('doubleTap','.clearIcon',login.clearInput);
            //登录
            $('body').on('click','.loginBtn',login.logOn);

            /**
             * 验证登录
             */
            $('body').on('input','#telephone',login.codeBtnStatus);
            $('body').on('input','#telephone,#code',login.codeLoginBtnStatus);
            $('body').on('click','#codeBtn',login.getLoginCode);
            /**
             * 密码登录
             */
            $('body').on('input','#telephone,#password',login.passwordLoginBtnStatus);
        },
        switchLoginType:function () {
            var className = this.className;
            if(className == 'codeLogin'){
                $('.codeBox').css('display','block');
                $('.passwordBox').css('display','none');
                $('.codeBtn').css('display', 'block');
                $('.loginBtn').removeClass('on').data('type','1');
                $('#telephone').removeClass('telephone_pass').next('.clearIcon').removeClass('clearIcon_pass');
            }else{
                $('.codeBox').css('display','none');
                $('.passwordBox').css('display','block');
                $('.codeBtn').css('display', 'none');
                $('.loginBtn').removeClass('on').data('type','2');
                $('#telephone').addClass('telephone_pass').next('.clearIcon').addClass('clearIcon_pass');
            }
            className == 'codeLogin' ? $('.mark').addClass('left').removeClass('right') : $('.mark').addClass('right').removeClass('left');
            $('.loginForm')[0].reset();
            $('#codeBtn').removeClass('on');
        },
        showClearBtn:function () {
            if(this.value) $(this).siblings('.clearIcon').css('display','block');
        },
        hideClearBtn:function () {
            $(this).siblings('.clearIcon').css('display','none');
        },
        clearInput:function (e) {
            e.preventDefault();
            $(this).siblings('.formInput').val('').focus().trigger('input');
        },
        /**
         * 验证登录
         */
        codeBtnStatus:function () {
            var val = this.value;
            /^1\d{10}$/.test(val) && $('#codeBtn').text() == '获取验证码' ? $('#codeBtn').addClass('on') : $('#codeBtn').removeClass('on');
        },
        codeLoginBtnStatus:function () {
            var type = $('.loginBtn').data('type');
            if(type == 1){
                var tel = $('#telephone').val(),code = $('#code').val();
                tel && code ? $('.loginBtn').addClass('on') : $('.loginBtn').removeClass('on');
            }
        },
        getLoginCode:function () {
            var _this = this;
            if(!$(_this).hasClass('on')) return false;
            var tel = $('#telephone').val();
            if( !(/^1\d{10}$/.test(tel)) ){
                $('body').mildHintLayer({type:2,msg:'请输入正确的手机号'});
                return false;
            }
            if($(_this).hasClass('noclick')) return false;
            $(_this).addClass('noclick');
            wapApi.getCheckCode.data = {mobile: $('#telephone').val()}
            wapApi.$ajax(wapApi.getCheckCode,function (res) {
                $(_this).removeClass('noclick');
                if(res.code == 10000){
                    login.getCode('id','codeBtn',60,'on','');
                }else if(res.code == 90000){
                    $(_this).mildHintLayer({type:3,msg:'客户端发送短信频繁'});
                }else{
                    $(_this).mildHintLayer({type:2,msg:'服务器开了点小差'});
                }
            },function () {
                $(_this).removeClass('noclick');
                $(_this).mildHintLayer({type:2,msg:'服务器开了点小差'});
            })
        },
        passwordLoginBtnStatus:function () {
            var type = $('.loginBtn').data('type');
            if(type == 2){
                var tel = $('#telephone').val(),pass = $('#password').val();
                tel && pass ? $('.loginBtn').addClass('on') : $('.loginBtn').removeClass('on');
            }
        },

        //获取验证码的时间控制(type:id/class->选择器的类型； selector:选择器字符串； time：间隔时间;active：可点击时的样式，unactive：不可点击时的样式)
        getCode: function(type,selector,time,active,unactive){
            var _btn = type == 'id'? $('#'+selector) : $('.'+selector);
            _btn.prop('disabled',true).removeClass(active).addClass(unactive);
            _btn.html('<span class="intervalTime">'+time+'</span>s');
            var getCodeTimeFn=setInterval(function(){
                var _t = $('.intervalTime').text();
                _t --;
                if(_t == 0) {
                    var tel = $('#telephone').val();
                    if((/^1\d{10}$/.test(tel))){
                        _btn.html('获取验证码').removeAttr("disabled").removeClass(unactive).addClass(active);
                    }else{
                        _btn.html('获取验证码').removeAttr("disabled");
                    }
                    clearInterval(getCodeTimeFn);
                }else {
                    $('.intervalTime').text(_t);
                }
            },1000);
        },
        codeInputValid:function () {
            var tel = $('#telephone').val(),code = $('#code').val();
            if( !tel ){
                $('body').mildHintLayer({type:2,msg:'请输入手机号'});
                return false;
            }
            if( !(/^1\d{10}$/.test(tel)) ){
                $('body').mildHintLayer({type:2,msg:'请输入正确的手机号'});
                return false;
            }
            if( !code ){
                $('body').mildHintLayer({type:2,msg:'请输入验证码'});
                return false;
            }
            return true;
        },
        passwordInputValid:function () {
            var tel = $('#telephone').val(),pass = $('#password').val();
            if( !tel ){
                $('body').mildHintLayer({type:2,msg:'请输入手机号'});
                return false;
            }
            if( !(/^1\d{10}$/.test(tel)) ){
                $('body').mildHintLayer({type:2,msg:'请输入正确的手机号'});
                return false;
            }
            if( !pass ){
                $('body').mildHintLayer({type:2,msg:'请输入密码'});
                return false;
            }
            if( !(/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,18}$/.test(pass)) ){
                $('body').mildHintLayer({type:2,msg:'密码格式错误'});
                return false;
            }
            return true;
        },
        logOn:function () {
            var _this = this,referer = Base64.decode(commonMethod.getUrlParameter('ref'));
            if(!$(_this).hasClass('on')) return false;
            var type = $(_this).data('type');
            if(type == 1){
                if(login.codeInputValid()){
                    if($(_this).hasClass('noclick')) return false;
                    $(_this).addClass('noclick');
                    wapApi.userLogin.data = {mobile: $('#telephone').val(),code:code = $('#code').val()};
                    wapApi.$ajax(wapApi.userLogin,function (res) {
                        $(_this).removeClass('noclick');
                        if(res.code == 10000){
                            var Days = 30;
                            var exp = new Date();
                            exp.setTime(exp.getTime() + Days*24*60*60*1000);
                            document.cookie = 'isKeepAlive' + "="+ 1 + ";expires=" + exp.toGMTString()+ ";domain=" + "fmtxt.com" + ";path=" + "/" + "; ";
                            if(referer) window.location.href = referer;
                        }
                    },function (res) {
                        $(_this).removeClass('noclick');
                        if(res.code == 90000){
                            $(_this).mildHintLayer({type:2,msg:"服务器开了点小差"});
                        }else{
                            $(_this).mildHintLayer({type:2,msg:res.msg});
                        }
                    })
                }
            }else if(type == 2){
                if(login.passwordInputValid()){
                    if($(_this).hasClass('noclick')) return false;
                    $(_this).addClass('noclick');
                    wapApi.userLogin.data = {mobile: $('#telephone').val(),pwd:$('#password').val()};
                    wapApi.$ajax(wapApi.userLogin,function (res) {
                        $(_this).removeClass('noclick');
                        if(res.code == 10000){
                            var Days = 30;
                            var exp = new Date();
                            exp.setTime(exp.getTime() + Days*24*60*60*1000);
                            document.cookie = 'isKeepAlive' + "="+ 1 + ";expires=" + exp.toGMTString()+ ";domain=" + "fmtxt.com" + ";path=" + "/" + "; ";
                            if(referer) window.location.href = referer;
                        }
                    },function (res) {
                        $(_this).removeClass('noclick');
                        if(res.code == 90000){
                            $(_this).mildHintLayer({type:2,msg:"服务器开了点小差"});
                        }else{
                            $(_this).mildHintLayer({type:2,msg:res.msg});
                        }
                    })
                }
            }
        }
    }
    login.init();
})
