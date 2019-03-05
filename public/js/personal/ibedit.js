define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	require('tppl');
	require('zeptoAnimate');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	var fieldMap = {
		'name': 'ib_name',
		'phone': 'service_telephone',
		'email': 'service_mailbox',
		'qq': 'service_QQ',
		'url': 'offical_website',
		'pic': 'image_url1'
	};
	var basicMap = {
		'email': 'email'
	};
	var customerId;
	var IbMsg={
        init:function(){
					PUBLIC.checkLogin(function(res){
						var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
								customerId= id;
                if(id && id != '-1') {
									IbMsg.bind();
									IbMsg.getInfo();
								}else {
									location.href='/';
									return false;
								}
					})
        },
				bind: function() {
					//修改信息
					$('body').on('click','.ib-edit-btn',IbMsg.saveIbMsg)
					//检测内容修改
					$('body').on('keyup','.ib-edit-main input',IbMsg.IbMsgKeyUp)
					//上传图片
					$('body').on('change','.file-pic',IbMsg.uploadPicture);
					$("#uploadIframe").load(function() {
						$('.img-loading').hide();
						var oid=$(this).attr("id");
						try {
							var subiframe = document.getElementById(oid).contentWindow.document.body;
							var obj = $.parseJSON($(subiframe).text());
							if (obj.code == 200 && obj.res) {
								 $('.ib-upload-pic').attr('src',obj.url).show();
								 $('.ib-upload-btn').hide();
								 $('.ib-edit-btn').removeClass('ib-disabled');
							} else {
								 $('body').mildHintLayer({type:2,msg:'上传图片失败'});
							};
						}catch(e) {
                 			$('body').mildHintLayer({type:2,msg:'上传图片失败'});
						}
					});
					//官方网址处理
					$('body').on('focus','.ib-val-url',function() {
						if($(this).val()=='') {
							$(this).val('https://');
						}
					})
					//营业执照查看大图
					$('body').on('click','.cover-pic',function() {
						var imgUrl = $('.ib-upload-pic').attr('src');
						$('body').showImgLayer({
							html: '<img src="'+imgUrl+'" />'
						});
					})
				},
				//上传图片
				uploadPicture: function() {
					$('.img-loading').show();
					$(this).parent().submit();
					$(this).val('');
				},
				IbMsgKeyUp: function() {
                    IbMsg.setBtnStatus($(this));
				},
				setBtnStatus:function (_$this) {
        			if(!_$this) return false;
                    var val = _$this.val();
                    var oldVal = _$this.attr('data-val');
                    var $btn = _$this.parents('.ib-edit-box').find('.ib-edit-btn');
                    if(val == '') {
                        $btn.addClass('ib-disabled');
                    }else {
                        $btn.removeClass('ib-disabled');
                    }
                },
				showEdit: function(obj) {
					if(obj.isImg) {
            			$('.ib-edit-pic').show();
						if(obj.val) {
							$('.ib-upload-pic').attr('src',obj.val).show();
							$('.ib-upload-btn').hide();
						}else {
							$('.ib-upload-btn').show();
						}
					}else if(obj.isUrl) {
						$('.ib-edit-'+obj.type).show().find('input').val(obj.val).attr('data-val',obj.val);
                        IbMsg.setBtnStatus($('.ib-edit-'+obj.type).find('input'));
					}else {
						$('.ib-edit-'+obj.type).show().find('input').val(obj.val).attr('data-val',obj.val).focus();
                        IbMsg.setBtnStatus($('.ib-edit-'+obj.type).find('input'));
					}
				},
				getInfo: function() {
					var userType = PUBLIC.getQueryString('type');
					//代理交易商
					if(userType == 'ib') {
             			IbMsg.ibMsgEdit()
					}else if(userType == 'basic') {//投资商
             			IbMsg.basicMsgEdit()
					}
				},
				//获取投资商信息
				basicMsgEdit: function() {
					var field = PUBLIC.getQueryString('field');
					$.ajax({
						type: "get",
						url: forex+'/personal/find-customer-all-byId.do?format=json&jsoncallback=?',
						async: true,
						dataType: 'jsonp',
						data: {
							customer_id: customerId
						},
						success: function(data) {
							if(data.result.code == 0) {
								 var msg = data.result.obj;
								 var val = msg[basicMap[field]]?msg[basicMap[field]]:'';
								 IbMsg.showEdit({
									 type: field,
									 val: val
								 });
							}
						}
					});
				},
				//获取ib信息
				ibMsgEdit: function() {
					var field = PUBLIC.getQueryString('field');
					$.ajax({
						type: "get",
						url: forex+'/personal/find-ib-base-info.do?format=json&jsoncallback=?',
						async: true,
						dataType: 'jsonp',
						data: {
							customer_id: customerId
						},
						success: function(data) {
							if(data.result.code == 10000) {
								 var msg = data.result.obj;
								 var val = msg[fieldMap[field]]?msg[fieldMap[field]]:'';
								 if(field == 'pic') {
									 var isImg = true;
									 val = msg.image_url1;
								 }else {
									 var isImg = false;
								 };
								 //官方网址做特别处理
								 if(field == 'url') {
									 var isUrl = true;
								 }else {
									 var isUrl = false;
								 };
								 IbMsg.showEdit({
									 type: field,
									 val: val,
									 isImg: isImg,
									 isUrl: isUrl
								 });
							}
						}
					});
				},
				//检测
				checkForMat: function(type,val) {
					var regMap = {
						'service_telephone': /^\+?[0-9\-]*$/,
						'service_mailbox': /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
						'email': /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
						'service_QQ': /^[1-9]\d{4,10}$/,
						'offical_website': /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/,
						'ib_name': /^[\u4E00-\u9FA5A-Za-z0-9]+$/
					};
					var errorTip = {
						'service_telephone': '请输入正确的电话号码！',
						'service_mailbox': '请输入正确的邮箱地址！',
						'email': '请输入正确的邮箱地址！',
						'service_QQ': '请输入正确格式的QQ号码！',
						'offical_website': '请输入正确的网址地址！',
						'ib_name': '代理商名称只允许输入中文、数字或者英文！'
					}
					var reg = regMap[type];
					if(reg) {
						var status = reg.test(val);
					}else {
						var status = true;
					}
					var result = {
						status: status,
						msg: errorTip[type]
					};
					return result;
				},
				//更改个人信息
				saveBasicMsg: function() {
					var field = PUBLIC.getQueryString('field');
					var val = $('.ib-val-'+field).val();
					var fieldName = basicMap[field];
					var qs = {
						customer_id: customerId,
						modify_user: customerId,
						update_type: 2 //字段必填
					};
					qs[fieldName] = val;
					var isOk = IbMsg.checkForMat(fieldName,val);
					if(!isOk.status) {
						$('body').mildHintLayer({type:2,msg: isOk.msg});
						return false;
					};
					$.ajax({
						type: "get",
						url: forex+'/personal/update-customer-byId.do?format=json&jsoncallback=?',
						async: true,
						dataType: 'jsonp',
						data: qs,
						success: function(data) {
							if(data.result.code == 0) {
                location.href = '/personal/basicInfo.html';
							}else {
								$('body').mildHintLayer({type:2,msg:data.result.detail?data.result.detail:'参数错误！'});
							}
						}
					});
				},
				//更改ib信息
				saveIbMsg: function() {
					var type = PUBLIC.getQueryString('type');
					var field = PUBLIC.getQueryString('field');
					if($(this).hasClass('ib-disabled')) {
						return false;
					};
					//投资人
					if(type == 'basic') {
            IbMsg.saveBasicMsg()
						return false;
					};
					if(field == 'pic') {
						var val = $('.ib-upload-pic').attr('src');
					}else {
						var val = $('.ib-val-'+field).val();
					}
					var fieldName = fieldMap[field];
					var qs = {
						customer_id: customerId
					};
					qs[fieldName] = val;
					var isOk = IbMsg.checkForMat(fieldName,val);
					if(!isOk.status) {
						$('body').mildHintLayer({type:2,msg: isOk.msg});
						return false;
					};
					$.ajax({
						type: "get",
						url: forex+'/personal/update-introducing-broker-info-single.do?format=json&jsoncallback=?',
						async: true,
						dataType: 'jsonp',
						data: qs,
						success: function(data) {
							if(data.result.code == 10000) {
                location.href = '/personal/ibmsg.html';
							}else {
								$('body').mildHintLayer({type:2,msg:data.result.detail?data.result.detail:'参数错误！'});
							}
						}
					});
				}
			}
	module.exports=IbMsg.init();
})
