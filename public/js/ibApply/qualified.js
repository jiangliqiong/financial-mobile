define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	require('zeptoAnimate');
	var checkMessage = {
		'phone' : '请输入正确的客服电话',
		'email' : '请输入正确的邮箱',
		'qq' : '请输入正确格式的QQ号码',
		'url': '请输入正确的网址地址',
		'name': '代理商名称只允许输入中文、数字或者英文'
	};
	var customerId;
	var Fail={
        init:function(){
					PUBLIC.checkLogin(function(res){
						var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
								customerId= id;
								if(type == 2) {
									window.location.href = '/';
								}
					});
					Fail.bind();
					Fail.countrySelect();
        },
				bind: function() {
					$('body').on('focus','.qualified-form [required]',Fail.checkFocus);
					$('body').on('blur','.qualified-form [required]',Fail.checkBlur);
					//上传图片
					$('body').on('change','.file-pic',Fail.uploadPicture);
					$("#uploadIframe").load(function() {
					 	var oid=$(this).attr("id");
						try {
							var subiframe = document.getElementById(oid).contentWindow.document.body;
						} catch (e) {
							$('#upload input').attr('data-url','');
							$('body').mildHintLayer({type:2,msg:'上传图片失败'});
							return false;
						}
						var obj = $.parseJSON($(subiframe).text());
						$('.upload-pic-box .upload-loading').hide();
						if (obj.code == 200 && obj.res) {
							 $('#upload input').attr('data-url',obj.url);
							 $('.upload-pic-box .upload-ok').css('display','inline-block');
							 $('.upload-pic-box .upload-error').hide();
						} else {
							$('.upload-pic-box .upload-ok').hide();
							$('#upload input').attr('data-url','');
							$('body').mildHintLayer({type:2,msg:'上传图片失败'});
						};
					})
					//提交
					$('body').on('click','.required-btn',Fail.submitFn)
					//输入检测
					$('body').on('keyup','input,textarea',function() {
						var isOk = Fail.requiredCheck();
						if(isOk) {
							$('.required-btn').removeAttr('disabled');
						}else {
							$('.required-btn').attr('disabled','disabled');
						}
					})
				},
				//国家选择
				countrySelect: function() {
					 var showCountryDom = document.querySelector('#showCountry');
					 var selectAreaDom = $('#selectArea');
					 showCountryDom.addEventListener('click', function () {
							 var countryId = showCountryDom.dataset['id'];
							 var coutryName = showCountryDom.dataset['value'];
							 wapApi.getCountry.data.cityflag="1";
							 wapApi.$ajax(wapApi.getCountry,function(data){
										 var arr = [];
											 for(var i=0;i<data.result.length;i++){
												 arr[i] = {"id":"","value":""};
													 arr[i].id = data.result[i].cityid;
													 arr[i].value = data.result[i].name;
											 }
											 var bankSelect = new IosSelect(1,
											 [arr],
											 {
													 container: '.container',
													 title: '国家选择',
													 itemHeight: 50,
													 itemShowCount: 3,
													 oneLevelId: countryId,
													 callback: function (selectOneObj) {
														   $('#showCountry').attr('data-id',selectOneObj.id);
															 $('#showCountry .area-val').text(selectOneObj.value);
															 showCountryDom.dataset['id'] = selectOneObj.id;
															 showCountryDom.dataset['value'] = selectOneObj.value;
															 selectAreaDom.attr('data-province', '');
															 selectAreaDom.attr('data-city', '');
															 $('#selectArea .area-val').html('&nbsp;');
															 var isOk = Fail.requiredCheck();
										 						if(isOk) {
										 							$('.required-btn').removeAttr('disabled');
										 						}else {
										 							$('.required-btn').attr('disabled','disabled');
										 						}
													 }
									 });
							 })
					 });
					 var areaData1 = function(callback) {
							 wapApi.getProvince.data.cityid=$('#showCountry').attr('data-id');
							 wapApi.$ajax(wapApi.getProvince,function(data){
								 callback(formData(data));
							 })
					 };
					 var areaData2 = function (areaData1,callback) {
						 wapApi.getProvince.data.cityid = areaData1;
							 wapApi.$ajax(wapApi.getProvince,function(data){
								 callback(formData(data));
							 })
					 };
					 function formData(data){
								 var arr = [];
									for(var i=0;i<data.result.length;i++){
										 arr[i] = {"id":"","value":""};
											 arr[i].id = data.result[i].cityid;
											 arr[i].value = data.result[i].name;
									 }
								return arr;
					 }
					 selectAreaDom.bind('click', function () {
							 if(!$("#showCountry").attr('data-id')){
								 $("body").mildHintLayer({"type":3,"msg":"请先选择国家"});
								 return;
							 }
							 var oneLevelId = selectAreaDom.attr('data-province');
							 var twoLevelId = selectAreaDom.attr('data-city');
							 var iosSelect = new IosSelect(2,
									 [areaData1 , areaData2],
									 {
											 title: '地区选择',
											 itemHeight: 35,
											 relation: [1, 1],
											 oneLevelId: oneLevelId,
											 twoLevelId: twoLevelId,
											 callback: function (selectOneObj, selectTwoObj) {
													 selectAreaDom.attr('data-province', selectOneObj.id);
													 selectAreaDom.attr('data-city', selectTwoObj.id);
													 $('#selectArea .area-val').text(selectOneObj.value + ' ' + selectTwoObj.value);
													 var isOk = Fail.requiredCheck();
								 						if(isOk) {
								 							$('.required-btn').removeAttr('disabled');
								 						}else {
								 							$('.required-btn').attr('disabled','disabled');
								 						}
											 }
							 });
					 });
				},
				checkFocus: function() {
					 var $label = $(this).parents('li').find('.required-label');
           $label.hide();
				},
				checkBlur: function() {
					var $label = $(this).parents('li').find('.required-label'),
					    val = $(this).val();
					if(!val || val == '') {
						$label.show();
					}
				},
				//上传图片
				uploadPicture: function() {
						$(this).parent().submit();
						$('.upload-pic-box').addClass('upload-success');
						$('.ib-upload-btn span').text('重新上传');
						$('.upload-pic-box .upload-loading').css('display','inline-block');
						$('.upload-pic-box .upload-ok').hide();
						$(this).val('');
				},
				//表单检测
				requiredCheck: function() {
            var $input = $('.qualified-form [required]');
						var isOk = true;
						$input.each(function(i,o) {
							 var _val = $(o).val();
							 var _name = $(o).attr('name');
							 var _label = $(o).parents('li').find('.label-name').text();
               if(!_val && _name!='email' && _name!='url') {
								 isOk = false;
								 return false;
							 };
						});
						//国家
						if(!$('#selectArea').attr('data-province')||!$('#selectArea').attr('data-city')) {
							isOk = false;
							return false;
						}
						return isOk;
				},
				requiredReg: function() {
					var isOk = true;
					var regMap = {
						'phone' : /^\+?[0-9\-]*$/,
						'email' : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
						'qq': /^[1-9]\d{4,10}$/,
						'url':/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/,
						'name': /^[\u4E00-\u9FA5A-Za-z0-9]+$/
					};
					var $input = $('.qualified-form [required]');
					$input.each(function(i,o) {
						 var _val = $(o).val();
						 var _name = $(o).attr('name');
						 var reg = regMap[_name];
						 if(reg&&!reg.test(_val)&&_val) {
							 $('body').mildHintLayer({type:2,msg:checkMessage[_name]});
							 isOk = false;
							 return false;
						 };
					});
					return isOk;
				},
				submitFn: function() {
					  var _this = $(this);
						if(_this.hasClass('isSend')) {
							return false;
						};
            var isReg = Fail.requiredReg();
						if(isReg) {
							var introduce = {
	        			ib_name: $('input[name="name"]').val(),//代理商名称
	        			customer_id: customerId,//用户ID
	        			ib_address: $('input[name="area"]').val(),//详细地址
	        			ib_introduce: $('.textarea-descr').val(),//代理商介绍
	        			service_QQ: $('input[name="qq"]').val(),//客服QQ
	        			service_telephone: $('input[name="phone"]').val(),//客服电话
	        			service_mailbox: $('input[name="email"]').val(),//客服邮箱
	        			offical_website: $('input[name="url"]').val(),//官网地址
	        			image_url1:  $('#upload input').attr('data-url'),//营业执照
								country_id: $('#showCountry').attr('data-id'),
								province_id: $('#selectArea').attr('data-province'),
								city_id: $('#selectArea').attr('data-city')
	        		};
							$.ajax({
								type: 'get',
								url: forex+'/personal/become-ib-apply.do?format=json&jsoncallback=?',
                data: introduce,
								beforeSend: function() {
                   _this.addClass('isSend');
								},
								success: function(data) {
									  _this.removeClass('isSend');
										if(data.code == 0) {
											 if(data.result.code == 10000) {
												 window.location.href = '/ibapply/success.html';
											 }else {
												 if (data.result.code == 30001) {
													 $('body').mildHintLayer({type:2,msg:'参数错误'});
												 }else if (data.result.code == 40001) {
													 $('body').mildHintLayer({type:2,msg:'账户信息有误'});
												 }else if (data.result.code == 40003 || data.result.code == 40004) {
													 $('body').mildHintLayer({type:2,msg:'该名称已存在，请重新输入'});
												 }else if (data.result.code == 40002) {
													 $('body').mildHintLayer({type:2,msg:'系统处理异常，请稍后重试'});
												 }else {
													 $('body').mildHintLayer({type:2,msg:'申请失败'});
												 }
											 }
									 }
									 if(data.code == -1) {
										 $('body').mildHintLayer({type:2,msg:'系统错误'});
									 }
									 if(data.code == -2) {
										 $('body').mildHintLayer({type:2,msg:'系统错误'});
									 }
								},
								error: function(xhr) {
									$('body').mildHintLayer({type:2,msg:JSON.stringify(xhr)});
								}
							})
						}
				}
	};
	module.exports=Fail.init();
})
