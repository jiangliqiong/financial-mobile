define(function(require, exports, module) {
  var PUBLIC = require('publicFn');
  require('zeptoAnimate');
  require('tppl');
  //接口前缀
  var forex = PUBLIC.getUrlHeader()['forex'];
  var bankMap = {
    '0801030000': 'nyyh',
    '0801020000': 'gsyh',
    '0801040000': 'zgyh',
    '0801050000': 'jsyh',
    '0803050000': 'msyh',
    '0801000000': 'yzcx',
    '0804100000': 'payh',
    '0803030000': 'gdyh',
    '0803060000': 'gfyh',
    '0803020000': 'zxyh',
    '0803090000': 'xyyh',
    '0803040000': 'hxyh',
    '0803080000': 'zsyh',
    '0803100000': 'pfyh',
    '0803010000': 'jtyh'
  };
  var BANK = {
    customerId: '',
    bankData: [],
    isChecked: 1, //是否已经认证
    init: function() {
      PUBLIC.checkLogin(function(res) {
        var id = res.result ? res.result.id : '',
          type = res.result ? res.result.type : '';
        BANK.customerId = id;
        if (id && id != '-1') {
          BANK.bind();
          BANK.showStatus();
          BANK.getBankCardList();
          BANK.getBankList();
        } else {
          location.href = '/';
          return false;
        }
      })
    },
    bind: function() {
      //设为默认银行卡
      $('body').on('click', '.set-default-btn', BANK.setDefaultBank);
      //添加银行卡
      $('body').on('click', '.add-bank-btn', BANK.addBankCard)
      //返回上一级
      $('body').on('click', '.back-cover', BANK.bankBack)
      //城市选择
      BANK.citySelect();
      BANK.bankSelect();
      //必填检测
      $('body').on('keyup', 'input[required]', BANK.checkSend)
      //提交开户
      $('body').on('click', '.save', BANK.checkBankStatus)
			//查看授权
			$('body').on('click','#a_mask',BANK.agreement)
      //修改手机号
      $('body').on('click','.rest-mobile-btn',BANK.restMobile)
    },
    restMobile: function() {
       var accountId = $(this).attr('data-account');
       window.location.href = '/bank/restMobile.html?account_id='+accountId+'&customer_id='+BANK.customerId;
    },
    //显示状态
    showStatus: function() {
      var status = PUBLIC.getQueryString('status');
      //添加状态
      if(status == 1) {
        BANK.addBankCard();
      }
    },
		//查看授权
		agreement: function() {
			var bankId = $('#bank_id').val(); //银行ID
			if (bankId == -1) {
				$('body').mildHintLayer({
					type: 2,
					msg: '请选择开户行'
				});
				return false;
			};
			var isOk = BANK.checkReg();
			if (!isOk) {
				return false;
			};
			$('.show-protocol').show();
			$('form').hide();
			$('.topbar span').text('银行卡转账授权协议');
			$('.back-cover').addClass('agreement');
			//数据填充
			var proName = '';
			var proId = '';
			var proAccount = '';
			var bankName = '';
			if(BANK.isChecked == 1) {
				var bankAccount = $('#special_bank').val().replace(/\s*/g, ''); //银行卡号
				var bankId = $('#bank_id').val(); //银行ID
				proName = $('#realNamed_name').val();
        proId = $('#realNamed_id').val();
			}else {
				var xing = $('input[name="xing"]').val();
        var ming = $('input[name="ming"]').val();
        proName = xing + ' ' + ming;
				proId = $('input[name="idnumber"]').val();
			};
			proAccount = $('#special_bank').val();
			bankName = $('.add-address .show dl dt').text();
			$('.pro_name').text(proName);
			$('.pro_id').text(proId);
			$('.pro_account').text(proAccount);
			$('.pro_bankName').text(bankName);
		},
    //获取银行列表
    getBankList: function() {
      $.ajax({
        type: 'post',
        url: forex + '/bank/bank-list.do',
        contentType: "application/x-www-form-urlencoded",
        success: function(data) {
          if (data.code == 0 && data.result.code == 0) {
            var obj = data.result.obj;
            $(obj).each(function(i, o) {
              var bankName = o.chinese_name;
              var restrict_per = (o.restrict_per / 10000).toFixed(0);
              var restrict_day = (o.restrict_day / 10000).toFixed(0);
              var restrict_month = (o.restrict_month / 10000).toFixed(0);
              if (bankName.length >= 6) {
                bankName = bankName.slice(2);
              };
              var bankObj = {
                id: o.bank_id,
                bankno: o.bank_no,
                bankname: bankName,
                restrict_day: restrict_day,
                restrict_month: restrict_month,
                restrict_per: restrict_per,
                value: '<dl><dt>' + bankName + '</dt><dd><span>单笔限额:' + restrict_per + '万元</span><span>日限额:' + restrict_day + '万元</span><span>月限额:' + restrict_month + '万元</span></dd></dl>'
              };
              BANK.bankData.push(bankObj)
            })
          }
        }
      })
    },
    requiredCheck: function() {
      var isOk = true;
      var inputArr = $('input[required]');
      $(inputArr).each(function(i, o) {
        var _name = $(o).attr('name');
        var _val = $(o).val();
        var _pro = $(o).attr('pro-id');
        var _city = $(o).attr('city-id');
        //城市选择
        if (_name == 'city-name') {
          if (!_pro) {
            isOk = false;
            return false;
          }
        } else {
          if (_val == '') {
            isOk = false;
            return false;
          }
        }
      });
      return isOk;
    },
    checkSend: function() {
      var isOk = BANK.requiredCheck();
      if (isOk) {
        $('.save').removeClass('disabled');
      } else {
        $('.save').addClass('disabled');
      }
    },
    bankBack: function() {
			if($(this).hasClass('agreement')) {
				$('.show-protocol').hide();
				$('form').show();
				$('.topbar span').text('填写银行卡信息');
				$('.back-cover').removeClass('agreement');
			}else {
				$('.topbar span').text('银行卡');
				$('.add-bank-edit').hide();
	      $('.bank-list').show();
	      $('.topbar').css('z-index', '999');
	      $(this).hide();
			}
    },
    //获取已绑定银行卡列表
    getBankCardList: function() {
      $.ajax({
        type: 'get',
        url: forex + '/front/find-bank-account-detail.do?format=json&jsoncallback=?',
        data: {
          customer_id: BANK.customerId
        },
        dataType: 'jsonp',
        success: function(data) {
          if (data.result.code == 0) {
            var bank = data.result.obj;
            var arr = [];
            if (bank.length > 0) {
              $(bank).each(function(i, o) {
                o.is_default ? arr.unshift(o) : arr.push(o);
              });
              var data = {
                banks: arr,
                bankMap: bankMap
              };
              var compiled = _.template($('#tpl').html());
              $('#banks').html(compiled(data));
            }
          }

        }
      })
    },
    //设为默认银行卡
    setDefaultBank: function() {
      var _this = $(this);
			if(_this.text() == '默认') {
				return false;
			};
      var data = _this.attr('data-json');
      data = JSON.parse(data);
      $.ajax({
        type: 'get',
        url: forex + '/front/modify-bank-account-default.do?format=json&jsoncallback=?',
        data: data,
        dataType: 'jsonp',
        success: function(data) {
          if (data.code == 0 && data.result.code == 0) {
            $('#banks li').removeClass('active');
            _this.parents('li').addClass('active');
            $('body').mildHintLayer({
              type: 1,
              msg: '设置成功！'
            });
          } else {
            $('body').mildHintLayer({
              type: 2,
              msg: '设置失败！'
            });
          }
        }
      })
    },
    //添加银行卡
    addBankCard: function() {
      $('.back-cover').show();
      $('.topbar').css('z-index', '400');
			$('.topbar span').text('填写银行卡信息');
      $.ajax({
        type: 'get',
        url: forex + '/personal/find-customer-all-byId.do?format=json&jsoncallback=?',
        data: {
          customer_id: BANK.customerId
        },
        dataType: 'jsonp',
        success: function(data) {
          $('.add-bank-edit').show();
          $('.bank-list').hide();
          if (data.result.code == 0) {
            var obj = data.result.obj;
            BANK.isChecked = obj.is_checked;
            if (obj.is_checked == 1) {
              $('.notBind').remove();
              $('.hasRealNamed').show();
              $('#realNamed_name').val(obj.name);
              $('#realNamed_id').val(obj.idnumber);
            } else {
              $('.hasRealNamed').remove();
            }
          } else {
            $('body').mildHintLayer({
              type: 2,
              msg: '服务器开了个小差'
            });
          }
        }
      })
    },
    //城市选择
    citySelect: function() {
      var areaData1 = function(callback) {
        wapApi.getProvince.data.cityid = '01';
        wapApi.$ajax(wapApi.getProvince, function(data) {
          callback(formData(data));
        })
      };
      var areaData2 = function(areaData1, callback) {
        wapApi.getProvince.data.cityid = areaData1;
        wapApi.$ajax(wapApi.getProvince, function(data) {
          callback(formData(data));
        })
      };

      function formData(data) {
        var arr = [];
        for (var i = 0; i < data.result.length; i++) {
          arr[i] = {
            "id": "",
            "value": ""
          };
          arr[i].id = data.result[i].cityid;
          arr[i].value = data.result[i].name;
        }
        return arr;
      }
      var selectAreaDom = $('#selectArea');
      $('body').on('click', '#selectArea', function() {
        var oneLevelId = selectAreaDom.attr('data-province');
        var twoLevelId = selectAreaDom.attr('data-city');
        var iosSelect = new IosSelect(2, [areaData1, areaData2], {
          title: '地区选择',
          itemHeight: 35,
          relation: [1, 1],
          oneLevelId: oneLevelId,
          twoLevelId: twoLevelId,
          callback: function(selectOneObj, selectTwoObj) {
            $('.holder span').text(selectOneObj.value + ' ' + selectTwoObj.value);
            $('.holder').removeClass('no-chose');
            $('#city-msg').attr('pro-id', selectOneObj.id).attr('city-id', selectTwoObj.id);
            BANK.checkSend();
          }
        });
      })
    },
    //银行选择
    bankSelect: function() {
      var selectAreaDom = $('.card-address');
      $('body').on('click', '.card-address', function() {
        var oneLevelId = selectAreaDom.attr('data-province');
        var iosSelect = new IosSelect(1, [BANK.bankData], {
          itemHeight: 47,
          relation: [1, 1],
          closeText: '返回',
          //itemShowCount: 5,                    // 每一列显示元素个数，超出将隐藏
          oneLevelId: oneLevelId,
          callback: function(selectOneObj) {
            $('#bank_id').val(selectOneObj.id);
            var bankNo = selectOneObj.bankno;
            var bankName = bankMap[bankNo];
            var bankMsg = selectOneObj;
            var html = $.tppl(document.getElementById('bankTpl').innerHTML, bankMsg);
            $('.card-address .show').html(html).show().prev().hide();
          }
        });
      })
    },
    //检测银行卡是否被绑定
    checkBankStatus: function() {
      var bankAccount = $('#special_bank').val().replace(/\s*/g, '');
			var _this = $(this);
      if(_this.hasClass('disabled')) {
        return false;
      }
      $.ajax({
        type: 'post',
        url: forex + '/bank/is-bank-card-repeat.do',
        data: {
          customer_id: BANK.customerId,
          bank_account: bankAccount
        },
        success: function(data) {
          if (data.code == 0 && data.result.code == 0) {
						if(_this.hasClass('agreement')) {
              BANK.agreement();
						}else {
							BANK.sendAddCard();
						}
          } else {
            $('body').mildHintLayer({
              type: 2,
              msg: '此银行卡号已被使用，请重新填写'
            });
          }
        }
      })
    },
    //提交前正则匹配
    checkReg: function() {
      var isOk = true;
      var reg = {
        xing: /^[\u4e00-\u9fa5]{1,6}$/, // 姓最多6位汉字
        ming: /^[\u4e00-\u9fa5]{1,10}$/, // 名最多10位汉字
        idnumber: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
				bank_account: /^\d{12,19}$/, // 银行卡号在12到19位之间
        reserved_phone: /^1\d{10}$/ // 手机号码验证包含了最新的大王卡
      };
      var errorMsg = {
        xing: '姓氏输入无效，请重新输入', // 姓最多6位汉字
        ming: '名字输入无效，请重新输入', // 名最多10位汉字
        bank_account: '请输入正确的银行卡号', // 银行卡号在12到19位之间
        idnumber: '请输入正确的身份证号码',
				reserved_phone: '请输入正确的手机号' // 手机号码验证包含了最新的大王卡
      };
      var checkInput = $('input[checked]');
      $(checkInput).each(function(i, o) {
        var name = $(o).attr('name');
        var val = $(o).val();
				if(name == 'bank_account') {
					val = val.replace(/\s*/g, '');
				}
        if (!reg[name].test(val)) {
          isOk = false;
          $('body').mildHintLayer({
            type: 2,
            msg: errorMsg[name]
          });
          return false;
        }
      });
      return isOk;
    },
    //提交
    sendAddCard: function() {
      if ($('.save').hasClass('isSend')) {
        return false;
      };
			var _type = PUBLIC.getQueryString('type');
      var bankAccount = $('#special_bank').val().replace(/\s*/g, ''); //银行卡号
      var bankId = $('#bank_id').val(); //银行ID
      var province = $('#city-msg').attr('pro-id'); //省份ID
      var cityId = $('#city-msg').attr('city-id'); //城市ID
      var reservedPhone = $('#reserved-phone').val(); //预留手机号
      if (bankId == -1) {
        $('body').mildHintLayer({
          type: 2,
          msg: '请选择开户行'
        });
        return false;
      };
      var isOk = BANK.checkReg();
      if (!isOk) {
        return false;
      };
      //已认证
      if (BANK.isChecked == 1) {
        var prame = {
          main_key: 'f059b0284da834b3439fe01a309dd82a',
          bank_id: bankId,
          customer_id: BANK.customerId,
          bank_account: bankAccount,
          province: province,
          city_id: cityId,
          reserved_phone: reservedPhone,
          type: 1 //不需要验证码则不传
        };
      } else {
        var xing = $('input[name="xing"]').val();
        var ming = $('input[name="ming"]').val();
        var idnumber = $('input[name="idnumber"]').val();
        var account_name = xing + '/' + ming;
        var prame = {
          main_key: 'f059b0284da834b3439fe01a309dd82a',
          bank_id: bankId,
          customer_id: BANK.customerId,
          xing: xing,
          ming: ming,
          idnumber: idnumber,
          account_name: account_name,
          bank_account: bankAccount,
          province: province,
          city_id: cityId,
          reserved_phone: reservedPhone,
          type: 1 //不需要验证码则不传
        };
      }
      $.ajax({
        type: 'post',
        url: forex + '/bank/new-binding-bank-card.do',
        data: prame,
        beforeSend: function() {
          $('.save').addClass('isSend');
        },
        success: function(data) {
          $('.save').removeClass('isSend');
          if (data.code == 0 && data.result.code == 0) {
            var accountId = data.result.obj.account_id;
						if(_type) {
              if(_type == 1) {
                window.location.href="/bank/withdraw.html";
              }else if(_type == 2) {
                window.location.href="/bank/withdraw.html?id="+accountId;
              }
						}else {
							BANK.getBankCardList();
							$('body').mildHintLayer({
								type: 1,
								msg: '银行卡绑定成功'
							});
							setTimeout(function() {
								$('.back-cover').hide();
								$('.topbar').css('z-index', '999');
								$('.add-bank-edit').hide();
								$('.bank-list').show();
							}, 2000)
						}
          } else {
            if (JSON.stringify(data).indexOf("leftTimes") != -1) {
              var leftTimes = data.result.obj.leftTimes;
              if (leftTimes > 0) { // 还有剩余，需要区分是不是银行和银行卡号不匹配
                if (data.result.code === 1003) { // 银行和银行卡号不匹配
                  $('body').mildHintLayer({
                    type: 2,
                    msg: '该银行卡号所属银行与您选择的银行不一致，您当日还剩' + leftTimes + '次绑卡机会'
                  });
                } else {
                  $('body').mildHintLayer({
                    type: 2,
                    msg: '验证失败，您当日还剩' + leftTimes + '次绑卡机会'
                  });
                }
              } else { // 5次剩余机会已经用完
                $('body').mildHintLayer({
                  type: 2,
                  msg: '您当日的5次绑卡机会已用完，请明天重试。'
                });
              }
            } else {
              var errorMsg = data.result.detail ? data.result.detail : '银行卡绑定失败';
              $('body').mildHintLayer({
                type: 2,
                msg: errorMsg
              });
            }
          }
        }
      })
    }
  }
  module.exports = BANK.init();
})
