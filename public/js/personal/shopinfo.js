define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	require('tppl');
	require('zeptoAnimate');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	var customerId;
	var ShopInfo={
        init:function(){
					PUBLIC.checkLogin(function(res){
						var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
								customerId = id;
								if(id && id != '-1') {
									ShopInfo.bind();
									ShopInfo.getInfo();
								}else {
									location.href='/';
									return false;
								}
					})
        },
				bind: function() {
          //添加奖励
					$('body').on('click','.ib-add-reward',ShopInfo.addReward)
					//删除奖励
					$('body').on('click','.close-reward',ShopInfo.delReward)
					//代理开关
					$('body').on('click','.ib-status-switch',ShopInfo.switchFn)
					//奖励获失焦
					$('body').on('focus','.ib-reward-list input',ShopInfo.rewardFocus)
					$('body').on('blur','.ib-reward-list input',ShopInfo.rewardBlur)
					//保存
					$('body').on('click','.save-btn',ShopInfo.saveMsg)
					$('body').on('blur','.default-val',function() {
						var _val = $(this).val();
						var isOk = ShopInfo.checkVal(_val);
						if(!isOk) {
							$(this).val('').focus();
						}else {
							var newVal = Number(_val.toString().match(/^\d+(?:\.\d{0,1})?/))
							$(this).val(Number(newVal).toFixed(1));
						}
					});
					$('body').on('click','.shop-info-back',ShopInfo.checkChange)
				},
				checkChange: function() {
					var isChange = false;
				  $('input').each(function(i,o) {
						var old = $(this).attr('data-val')?$(this).attr('data-val'):'';
						var now = $(this).val();
						if (old != now) {
              isChange = true;
						}
					});
					if (isChange) {
						$('body').confirmLayer({
							type: 2,
							title: '提示',
							msg:'是否要保存这次修改？',
							leftBtn:'不保存',
							rightBtn: '保存',
							yes:function (obj) {
								ShopInfo.saveMsg();
							},
							cancel:function () {
								window.history.back(-1);
							}
						})
					}else {
						window.history.back(-1);
					}
				},
				checkVal: function(val) {
					var reg = /^\d+(\.\d+)?$/;
					return reg.test(val);
				},
				//保存
				saveMsg: function() {
					var agentId = PUBLIC.getQueryString('agents_id');
					var ibBrokerRewardList = [];
					var default_back = $('.default-val').val();
					var customize_back = $('.default-val').attr('data-customize');
					if(!default_back) {
						$('body').mildHintLayer({type:2,msg: '若您无法给予投资人返佣，请填写“0”！'});
						return false;
					};
					if(Number(default_back)>Number(customize_back)) {
						$('body').mildHintLayer({type:2,msg: '您对投资人的返佣奖励不可高于平台给予您的返佣值！'});
						return false;
					};
					$('.ib-reward-list input').each(function(i, input) {
						!$.trim(input.value) || ibBrokerRewardList.push({
							reword_content: input.value
						});
					});
					ibBrokerRewardList = JSON.stringify(ibBrokerRewardList);
          $.ajax({
						type: 'get',
						url: forex+'/front/add-broker-reward.do',
						dataType: 'json',
						data: {
              agents_id: agentId,
							default_back: default_back,
							modify_user: customerId,
							ibBrokerRewardList: ibBrokerRewardList
						},
						success: function(data) {
                 if(data.code == 0 && data.result.code == 0) {
									 location.href = "/personal/agentTrader.html";
								 }else {
									 $('body').mildHintLayer({type:2,msg: data.result.detail?data.result.detail:'修改失败'});
								 }
						}
					})
				},
				//添加奖励
				addReward: function() {
					var rewardLength = $('.ib-reward-box .ib-reward-list').length;
					var rewardTml = $('#rewardTml').html();
					if(rewardLength < 3) {
						$('.ib-reward-btn-box').before(rewardTml);
						$('.ib-add-reward').removeClass('no-reward');
						if(rewardLength == 2) {
							$('.ib-add-reward').hide();
						}
					}
				},
				//删除奖励
				delReward: function(event) {
					var _this = $(this);
					$('body').confirmLayer({
								type: 2,
								title: '提示',
								msg: '确定要删除这条信息吗？',
								yes:function () {
									var rewardLength = $('.ib-reward-box .ib-reward-list').length;
									_this.parents('.ib-reward-list').remove();
									$('.ib-add-reward').show();
									if(rewardLength == 1) {
										$('.ib-add-reward').addClass('no-reward');
									}
									event.stopPropagation();
								}
						})
				},
				//代理开关
				switchFn: function() {
					 var _this = $(this);
					 if(_this.hasClass('on')) {
						 $('body').confirmLayer({
									 type: 1,
									 title: '提示',
									 msg: '<div style="text-align:left">暂停代理后，该交易商代理信息将不再显示在您的主页中，但该交易商相关开户账户将依然有效，且将依然返佣到您的账户！</div>',
									 yes:function () {
										 ShopInfo.switchAjax('cancel',function() {
											 _this.removeClass('on');
										 });
									 }
							 })
					 }else {
						 $('body').confirmLayer({
									 type: 1,
									 title: '提示',
									 msg: '<div style="text-align:left">恢复代理后，该代理信息将继续在您的主页中展示，接受投资人申请开户！</div>',
									 yes:function () {
										 ShopInfo.switchAjax('recover',function() {
											_this.addClass('on');
										});
									 }
							 })
					 }
				},
				//代理开关事件
				switchAjax: function(type,callback) {
					 var agentId = PUBLIC.getQueryString('agents_id');
					 if(type == 'cancel') {
						 var url = '/front/cancel-agents.do';
						 var stauts = 3;
					 }else {
						 var url = '/front/recover-agents.do';
						 var stauts = 1;
					 };
           $.ajax({
						 type: 'get',
						 url: forex+url+'?format=json&jsoncallback=?',
						 data: {
               agents_id: agentId,
							 status: stauts,
							 modify_user: customerId
						 },
						 dataType: 'jsonp',
						 success: function(data) {
                if(data.code == 0 && data.result.code == 0) {
                    callback();
								}else {
                    $('body').mildHintLayer({type:2,msg: data.result.detail?data.result.detail:'系统错误'});
								}
						 }
					 })
				},
				//奖励获焦
				rewardFocus: function() {
					$(this).parents('.ib-reward-list').addClass('edit');
				},
				//奖励失焦
				rewardBlur: function() {
					var _this = $(this);
					setTimeout(function(){
						_this.parents('.ib-reward-list').removeClass('edit');
					},50)
				},
				//获取信息
				getInfo: function() {
					var agentId = PUBLIC.getQueryString('agents_id');
					if(!agentId) {
						return false;
					}else {
						$.ajax({
							url: forex+'/front/view-broker-reward-web.do?format=json&jsoncallback=?',
							type: 'get',
							data: {
                agents_id: agentId
							},
							dataType: 'jsonp',
							success: function(data) {
                 var info = data.result.obj;
								 var html = $.tppl(document.getElementById('shop-info-tml').innerHTML, info);
								 $('#shop-info').html(html);
							}
						})
					}
				}
			}
	module.exports=ShopInfo.init();
})
