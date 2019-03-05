define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	require('tppl');
	require('zeptoAnimate');
	var customerId;
	var Apply={
        init:function(){
          Apply.bind();
					PUBLIC.checkLogin(function(res){
						var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
								customerId= id;
								Apply.getMsg({
									uerType: type,
									userId: id
								});
								Apply.getOpenList({
									userId: id
								});
					})
        },
				bind: function() {
					//关闭tip
           $('body').on('click','.reward-close',function() {
               $('.reward-img-tip').remove();
					 });
					 //提交申请
					 $('body').on('click','.ib-apply-sure',Apply.applyFn)
					 //跳转登录
					 $('body').on('click','.ib-to-login',function() {
						   var referer = location.href;
						   window.location.href = '/login.html?ref=' + Base64.encode(referer);
					 });
					 //
					 $('body').on('focus','.reward-val',function(){
						 $('.unit').css('color','#000');
						 $('.ib-apply-btn-box').css('z-index','-1');
						 $('.topbar').css('z-index','-1');
					 })
					 $('body').on('blur','.reward-val',function(){
						 if($('.reward-val').val()=='') {
							  $('.unit').css('color','#959595');
						 }else {
							  $('.unit').css('color','#000');
						 }
						 $('.ib-apply-btn-box').css('z-index','2');
						 $('.topbar').css('z-index','2');
					 })
				},
				//提交申请前检测
				applyFn: function() {
					var defaultRebate = $('.ib-rebate').attr('data-rebate');
					var rewardVal = $('.reward-val').val();
					var reg1 = /^\d+(\.([0-9]|\d{0,1}))?$/;
					var reg2 = /^\d+(\.\d+)?$/;
					if(Number(rewardVal)>Number(defaultRebate)) {
						$('body').mildHintLayer({type:2,msg:'您对投资人的返佣奖励不可高于平台给予您的返佣值！'});
						return false;
					}else if(!reg2.test(rewardVal)){
						$('body').mildHintLayer({type:2,msg:'您填写的投资人奖励信息不正确，请重新输入'});
						return false;
					}else if (!reg1.test(rewardVal)){
						$('body').mildHintLayer({type:2,msg:'小数点后只能有一位数字'});
						return false;
					}else if(rewardVal == '') {
						$('body').mildHintLayer({type:2,msg:'请输入返佣奖励'});
						return false;
					};
					// rewardVal = Number(rewardVal.toString().match(/^\d+(?:\.\d{0,1})?/))
					// rewardVal = Number(rewardVal).toFixed(1);
					var broker_id = PUBLIC.getQueryString('id');
					var ib_name = $('.ib-name-val').text();
					var back = rewardVal;
					location.href = '/ib/result.html?customer_id='+customerId+'&broker_id='+broker_id+'&back='+back+'&ib_name='+ib_name;
				},
				//获取交易商信息
				getMsg: function(obj) {
					var broker_id = PUBLIC.getQueryString('id');
					$.ajax({
						type: 'get',
						url: forex+'/front/broker/'+broker_id+'.do?format=json&jsoncallback=?',
						dataType: 'jsonp',
						success: function(data) {
							var broker = data.result.broker;
							var userInfo ={
								'uerType': obj.uerType
							};
							if(obj.userId&&obj.userId!=-1) {
							  broker.isLogin = true;
							}else {
								broker.isLogin = false;
							}
			        if(userInfo.uerType == 1) {
			          broker.rakeBack = parseFloat(broker.customer_back);
			        }else if(userInfo.uerType == 2) {
			          broker.rakeBack = parseFloat(broker.ib_back);
			        }else {
								broker.rakeBack = parseFloat(broker.customer_back);
							}
							//全部显示customer_back
							broker.rakeBack = parseFloat(broker.customer_back);
							broker.rakeBack = broker.rakeBack?broker.rakeBack:'0.0';
							broker = {
								'broker': broker
							};
							 var html = $.tppl(document.getElementById('applyTml').innerHTML, broker);
							 $('#apply').html(html);
							 $('.ib-apply-btn-box').show();
							 $('.topbar span').text(broker.broker.chinese_name);
						}
					})
				},
				//获取开户列表
				getOpenList: function(obj) {
					 var broker_id = PUBLIC.getQueryString('id');
					 var customer_id = obj.userId;
           $.ajax({
						 type: 'get',
						 url: forex+'/personal/find-open-by-introducer.do?format=json&jsoncallback=?',
						 dataType: 'jsonp',
						 data: {
               broker_id: broker_id,
							 open_introducer: customer_id
						 },
						 success: function(data) {
					      if(data.result.code == 10000) {
									var list = {
									 'list': data.result.obj
								 };
									var html = $.tppl(document.getElementById('applyList').innerHTML, list);
									$('#ib-apply-list').html(html);
								}
						 }
					 })
				}
			}
	module.exports=Apply.init();
})
