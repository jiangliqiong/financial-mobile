;$(function () {
    var restMoile = {
        init:function () {
            restMoile.bind();
        },
        regMap: {
          phoneNum: /^1\d{10}$/, // 手机号码验证包含了最新的大王卡
          password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/, // 6-18位，数字字母的密码
          validateCode: /^\d{6}$/, // 验证码的匹配规则
          newpassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/
        },
        errorMsg: {
          phoneNum: '请输入正确的手机号码',
          password: '原密码格式错误，请重新输入',
          validateCode: '请输入正确的短信验证码',
          confirmPassword: '两次输入的密码必须一致',
          newpassword: '新密码必须为6-18位的数字和字母组合'
        },
        bind: function() {
          //号码检测
          $('body').on('keyup','#phoneNum',restMoile.checkPhone)
          //获取短信验证码
          $('body').on('click','#getCode',restMoile.getSmsCode)
          //必填检测
          $('body').on('keyup','input[required]',function() {
            if($(this).val()) {
              $(this).next('.icon-clean').show();
            }else {
              $(this).next('.icon-clean').hide();
            }
             var isOk = restMoile.required();
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
          //修改手机号
          $('body').on('click','.save',restMoile.toRestMobile)
        },
        //提交检测
        checkRequired: function() {
          var isOk = true;
          var input = $('input[required]');
          $(input).each(function(i,o) {
            var name = $(o).attr('name');
            var reg = restMoile.regMap[name];
            var val = $(o).val();
            if(reg) {
              if(!reg.test(val)) {
                  $('body').mildHintLayer({type:2,msg:restMoile.errorMsg[name]});
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
        toRestMobile: function() {
          if($(this).hasClass('disabled')) {
            return false;
          };
          var isAllOk = restMoile.checkRequired();
          var referer = Base64.decode(commonMethod.getUrlParameter('ref'));
          if(isAllOk) {
            var originalpwd = $('#userPass').val();
            var newpwd = $('#password').val();
            $.ajax({
              type: 'get',
              url: fx_path+'/wap/customer/modify-pwd.do?format=json&jsoncallback=?',
              data: {
                originalpwd: originalpwd,
                newpwd: newpwd
              },
              dataType: 'jsonp',
              success: function(data) {
                 if(data.code == '10000') {
                   $('body').mildHintLayer({type:1,msg:'登录密码修改成功'});
                   $.getJSON(fx_path+'/wap/customer/logout.do?format=json&jsoncallback=?',function(res){});
                   setTimeout(function(){
                     var referer = '/personal/basicInfo.html';
      						   window.location.href = '/login.html?ref=' + Base64.encode(referer);
                   },1000)
                 }else if(data.code == '20000'){
                   $('body').mildHintLayer({type:2,msg:'修改失败，账户未登录'});
                 }else if(data.code == '40000'){
                   $('body').mildHintLayer({type:2,msg:'修改失败，原密码验证失败'});
                 }else {
                   $('body').mildHintLayer({type:2,msg:'修改失败'});
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
          var reg = restMoile.regMap.phoneNum;
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
    restMoile.init();
})
