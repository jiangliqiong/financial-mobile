;$(function () {
    var REAL = {
        customer_id: '',
        init:function () {
           REAL.getUserInfo();
           REAL.bind();
        },
        regMap: {
          ft: /^([\u4e00-\u9fa5]{1,6})$/,
          last: /^([\u4e00-\u9fa5]{1,10})$/,
          card: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/
        },
        errorMsg: {
          ft: '姓氏输入无效，请重新输入',
          last: '名字输入无效，请重新输入',
          card: '请输入正确的身份证号码',
        },
        bind: function() {
         //必填检测
         $('body').on('keyup','input[required]',function(){
           if($(this).val()) {
             $(this).next('.icon-clean').show();
           }else {
             $(this).next('.icon-clean').hide();
           }
            var isOk = REAL.required();
            if(isOk) {
              $('#clickToReal').removeClass('disabled');
            }else {
              $('#clickToReal').addClass('disabled');
            }
         })
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
           var isOk = REAL.required();
           if(isOk) {
             $('#clickToReal').removeClass('disabled');
           }else {
             $('#clickToReal').addClass('disabled');
           }
         })
         //提交认证
         $('body').on('click','#clickToReal',REAL.sendReal)
        },
        //提交认证
        sendReal: function() {
          if($(this).hasClass('disabled')) {
            return false;
          };
          var isOk = REAL.checkRequired();
          var name = $('#userFirName').val()+' '+$('#userLasName').val()+'';
          var idnumber = $("#userIdCard").val();
          if(isOk) {
            $.ajax({
              type: 'get',
              url: fx_path+'/front/personal-real-name-certification.do?format=json&jsoncallback=?',
              data: {
                customer_id: REAL.customer_id,
                name: name,
                idnumber: idnumber
              },
              success: function(data) {
                if(data.result.code == '0') {
                  $('body').mildHintLayer({type:1,msg:'实名认证成功!'});
                  REAL.getUserInfo();
                }else if(data.result.code == '1000'){
                  var leftTimes = data.result.obj.leftTimes;
                  if(leftTimes == '0') {
                    var errorMsg = '您当日的5次实名认证机会已用完，请明天重试!';
                  }else {
                    var errorMsg = '请输入正确的身份证号,您当日还剩'+leftTimes+'次认证机会!';
                  };
                  $('body').mildHintLayer({type:2,msg: errorMsg});
                }else {
                  $('body').mildHintLayer({type:2,msg: '抱歉，您的账户信息有误，认证失败!'});
                }
              }
            })
          }
        },
        //正则校对
        //提交检测
        checkRequired: function() {
          var isOk = true;
          var input = $('input[required]');
          $(input).each(function(i,o) {
            var name = $(o).attr('name');
            var reg = REAL.regMap[name];
            var val = $(o).val();
            if(reg) {
              if(!reg.test(val)) {
                  $('body').mildHintLayer({type:2,msg:REAL.errorMsg[name]});
                  isOk = false;
                  return false;
              }
            }
          });
          return isOk;
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
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 ){
                    REAL.customer_id = res.result.id;
                    REAL.init();
                }else{
                    window.location.href = '/index.html';
                }
            },function () {
                window.location.href = '/index.html';
            })
        },
        //获取信息
        getUserInfo: function() {
          $.ajax({
            type: 'get',
            url: fx_path+'/personal/find-customer-all-byId.do?format=json&jsoncallback=?',
            data: {
              customer_id: REAL.customer_id
            },
            success: function(data) {
                var Obj = data.result.obj;
                var isChecked = Obj.is_checked;
                //  0 未实名  || 1 已实名
                if(isChecked == 0) {
                  $('#modi').show()
                }else {
                  $('#show').show();
                  var ftName = Obj.firstName?Obj.firstName.replace(/.(?=)/g, '*'):'';
                  var lastName = Obj.lastName?Obj.lastName:'';
                  var idnumber = Obj.idnumber?Obj.idnumber:'';
                  var h  = '<li class="list0">姓名<span class="fr">'+ftName+lastName+'</span></li>';
                  h += '<li>身份证号<span class="fr">'+idnumber+'</span></li>';
                  h += '<li><a href="/personal/identity.html">证件照片<span class="icon iconfont nextIcon fr">&#xe720;</span><span class="toup">上传照片</span></a></li>';
                  $('#show .down').html(h);
                }
            }
          })
        }
    }
    REAL.getLoginStatus();
})
