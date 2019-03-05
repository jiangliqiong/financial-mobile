/**
 * Created by Administrator on 2017/9/9.
 */
;$(function () {
    var register = {
        init:function () {
            register.bind();
        },
        regMap: {
          phoneNum: /^1\d{10}$/, // 手机号码验证包含了最新的大王卡
          password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/, // 6-18位，数字字母的密码
          validateCode: /^\d{6}$/ // 验证码的匹配规则
        },
        errorMsg: {
          phoneNum: '请输入正确的手机号码',
          password: '登录密码必须为6-18位的数字和字母组合',
          validateCode: '请输入正确的短信验证码',
          confirmPassword: '两次输入的密码必须一致'
        },
        bind: function() {
          //号码检测
          $('body').on('keyup','#phoneNum',register.checkPhone)
          //获取短信验证码
          $('body').on('click','#getCode',register.getSmsCode)
          //必填检测
          $('body').on('keyup','input[required]',function() {
            if($(this).val()) {
              $(this).next('.icon-clean').show();
            }else {
              $(this).next('.icon-clean').hide();
            }
             var isOk = register.required();
             if(isOk) {
               $('.save').removeClass('disabled');
             }else {
               $('.save').addClass('disabled');
             }
          });
          $('body').on('focus','input[required]',function() {
             var _this = $(this);
             if(_this.val()) {
               _this.next('.icon-clean').show();
             }else {
               setTimeout(function(){
                 _this.next('.icon-clean').hide();
               },50);
             }
          });
          $('body').on('blur','input[required]',function() {
            var _this = $(this);
             setTimeout(function(){
               _this.next('.icon-clean').hide();
             },50);
          });
          //清除
          $('body').on('click','.icon-clean',function() {
            $(this).prev('input').val('').focus();
            $(this).hide();
          })
          //注册
          $('body').on('click','.save',register.toRegister)
          //查看条款
          $('body').on('click','#jumpIframe',register.jumpIframe)
          $('body').on('click','.back-register',function() {
            $('.text-protocol').hide();
            $('.back-register').hide();
            $('.topbar span').text('注册');
          })
        },
        //查看
        jumpIframe: function() {
          $('.back-register').show();
          $('.text-protocol').show();
          $('.topbar span').text('选财外汇服务条款');
        },
        //提交检测
        checkRequired: function() {
          var isOk = true;
          var input = $('input[required]');
          $(input).each(function(i,o) {
            var name = $(o).attr('name');
            var reg = register.regMap[name];
            var val = $(o).val();
            if(reg) {
              if(!reg.test(val)) {
                  $('body').mildHintLayer({type:2,msg:register.errorMsg[name]});
                  isOk = false;
                  return false;
              }
            }else {
              //二次密码校对
              if(name == 'confirmPassword') {
                var password = $('#password').val();
                if(val != password) {
                  $('body').mildHintLayer({type:2,msg:'两次输入的密码必须一致'});
                  isOk = false;
                  return false;
                }
              }
            }
          });
          return isOk;
        },
        toRegister: function() {
          if($(this).hasClass('disabled')) {
            return false;
          };
          var isAllOk = register.checkRequired();
          var referer = Base64.decode(commonMethod.getUrlParameter('ref'));
          if(isAllOk) {
            var mobile = $('#phoneNum').val();
            var pwd = $('#password').val();
            var code = $('#smsCode').val();
            $.ajax({
              type: 'get',
              url: fx_path+'/wap/customer/registry.do?format=json&jsoncallback=?',
              data: {
                mobile: mobile,
                pwd : pwd,
                code: code
              },
              dataType: 'jsonp',
              success: function(data) {
                 if(data.code == '10000') {
                   if(referer) {
                    var Days = 30;
                    var exp = new Date();
                    exp.setTime(exp.getTime() + Days*24*60*60*1000);
                    document.cookie = 'isKeepAlive' + "="+ 1 + ";expires=" + exp.toGMTString()+ ";domain=" + "fmtxt.com" + ";path=" + "/" + "; ";
                    window.location.href = referer;
                   }else {
                    window.location.href = '/';
                   }
                 }else if(data.code == '40000'){
                   $('body').mildHintLayer({type:2,msg:'该手机号已注册会员'});
                 }else if(data.code == '30000'){
                   $('body').mildHintLayer({type:2,msg:'您输入的短信验证码错误或过期'});
                 }else {
                   $('body').mildHintLayer({type:2,msg:'注册失败'});
                 }
              }
            })
          }
        },
        required: function() {
          var isOk = true;
          var input = $('input[required]');
          $(input).each(function(i,o) {
            if($(o).val()=='') {
                isOk = false;
            }
          });
          return isOk;
        },
        //号码检测
        checkPhone: function() {
          var val = $(this).val();
          var reg = register.regMap.phoneNum;
          if(reg.test(val)) {
            $('#getCode').removeClass('disabled');
          }else {
            $('#getCode').addClass('disabled');
          }
        },
        //发送短信验证码
        getSmsCode: function() {
          if($(this).hasClass('disabled')) {
            return false;
          }else {
            var mobile = $('#phoneNum').val();
            $.ajax({
              type: 'get',
              url: fx_path+"/wap/customer/create-phone-code.do?format=json&jsoncallback=?",
              data: {
                mobile: mobile
              },
              dataType: 'jsonp',
              beforeSend: function() {
                 $('#getCode').addClass('disabled').text('60s');
                 var num = 60;
                 var sendTime = setInterval(function(){
                    num --;
                    if(num == 0) {
                      $('#getCode').removeClass('disabled').text('获取验证码');
                      clearInterval(sendTime);
                    }else {
                      $('#getCode').text(num+'s');
                    }
                 },1000)
              },
              success: function(data) {
                 if(data.code == 10000) {
                   $('body').mildHintLayer({type:1,msg:'验证码已发送'});
                 }else if(data.code == 90000){
                   $('body').mildHintLayer({type:2,msg:'验证码发送过于频繁'});
                 }else if(data.code == 90001){
                   $('body').mildHintLayer({type:2,msg:'短信接口异常'});
                 }else {
                   $('body').mildHintLayer({type:2,msg:'验证码发送失败'});
                 }
              }
            })
          }
        }
    }
    register.init();
})
