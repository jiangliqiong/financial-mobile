define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	require('zeptoAnimate');
	require('tppl');
	var INDEX={
		    qrcode : new QRCode("qrcode"),
				customerId: '',
        init: function(){
					PUBLIC.checkLogin(function(res){
						var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
								INDEX.customerId = id;
								INDEX.bind();
								INDEX.scrollTo();
								INDEX.getStrategyList();
					});
        },
				bind: function() {
					 //分享点击事件
					 $('body').on('click','.share-btn',INDEX.showShareHandle);
					 //取消分享
					 $('body').on('click','.qrcodeLayerBox .closeBtn',INDEX.hideShareHandle);
					 //QQ链接
					 $('body').on('click','.qq-link',INDEX.checkQQ);
					 //评论
					 $('body').on('click','.commentBtn',INDEX.commentList)
				},
				//评论
				commentList: function() {
					var commentId = PUBLIC.getQueryString('ibId');
					if(INDEX.customerId && INDEX.customerId != -1) {
						//commentStatus: 0 交易商 1 代理商
	          location.href = '/comment/list.html?commentId='+commentId+'&commentStatus=1';
					}else {
						var referer = location.href;
						location.href = '/login.html?ref=' + Base64.encode(referer);
					}
				},
				//qq检测
				checkQQ: function() {
					var userAgentInfo = navigator.userAgent;
					var isAndroid = userAgentInfo.indexOf('Android') > -1 || userAgentInfo.indexOf('Adr') > -1;//android终端
					var isiOS = !!userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
					var qqId = $(this).attr('data-qq');

					var loadDateTime = new Date();
					var checkTime = setTimeout(function () {
							var timeOutDateTime = new Date();
							if (!loadDateTime || timeOutDateTime - loadDateTime <5010) {
									if(isAndroid) {
									 location.href="https://qd.myapp.com/myapp/qqteam/AndroidQQ/mobileqq_android.apk";
									}else if(isiOS) {
									 location.href="https://itunes.apple.com/cn/app/qq/id444934666?mt=8";
									}else {
									 location.href="mqqwpa://im/chat?chat_type=wpa&uin="+qqId+"&version=1&src_type=web&web_src=bjhuli.com";
								 };
							}
							clearTimeout(checkTime);
						},5000);
					location.href = "mqqwpa://im/chat?chat_type=wpa&uin="+qqId+"&version=1&src_type=web&web_src=bjhuli.com";
				},
				//分享按钮点击事件
				showShareHandle:function () {
						$('.qrcodeLayerBox').show().find('.qrcodeMask').show();
						$('.qrcodeLayer').show().animate({opacity:1},200);
						var _url = window.location.href;
						if(INDEX.customerId&&INDEX.customerId !=-1) {
							if(_url.indexOf('shareId')==-1) {
								_url = _url + '&shareId='+INDEX.customerId;
							}else {
								_url = commonMethod.replaceParamVal(_url,'shareId',INDEX.customerId);
							}
						}else {
							if(_url.indexOf('shareId')!=-1) {
								_url = commonMethod.replaceParamVal(_url,'shareId','');
							}
						}
						INDEX.qrcode.makeCode(_url);
				},
				//取消分享事件
				hideShareHandle:function () {
						$('.qrcodeLayerBox').hide().find('.qrcodeMask').hide();
						$('.qrcodeLayer').animate({opacity:0},150,'',function () {
								$('.qrcodeLayer').hide();
						});
				},
				//页面滚动，头部逐渐色变
				scrollTo:function () {
						window.onscroll = function(){
								var topHeight = document.documentElement.scrollTop || document.body.scrollTop;
								var xmHeight = $('.index-banner').height();
								if(topHeight > xmHeight){
									  var IbName = $('.index-info-name').text();
									  $('.topbar span').text(IbName);
										$('.topbar').css("background",'-webkit-linear-gradient(304deg, #094494, #0a1f61)');
								}else{
										var opacity = (1/xmHeight)*topHeight;
										$('.topbar').css("background",'rgba(9,68,148,'+ opacity +')');
										$('.topbar span').text('');
								}
						}
				},
				//获取IB信息
				getIbMsg: function() {
					var ibId = PUBLIC.getQueryString('ibId');
					$.ajax({
						type: 'get',
						url: forex + '/front/find-introducing_broker-details.do?format=json&jsoncallback=?',
						data: {
             ibId: ibId
						},
						dataType: 'jsonp',
						success: function(data) {
              if(data.code == 0 && data.result.obj) {
								var count = data.result.obj.count;
								$('.commentBtn .num').text(count);
							}
						}
					})
				},
				//喊单滚动
				strategyScroll: function() {
					var ul = $('.strategy-list ul');
					var strategyHtml = ul.html();
					var original = $('.strategy-list ul li').length;
					strategyHtml = strategyHtml + strategyHtml;
					ul.html(strategyHtml);
					var top = 0;
					var height = $('.strategy-list').height();
					var end = original * height;
					setInterval(function() {
						 top = top + height;
             ul.animate({top: -top},function() {
							 if(top == end) {
								 ul.css('top', 0);
								 top = 0;
							 }
						 })
					},3000)
				},
				//获取喊单列表
				getStrategyList: function() {
					var ibId = PUBLIC.getQueryString('ibId');
					$.ajax({
						type: 'get',
						url: forex + '/front/find-fx-tactics-ib.do?format=json&jsoncallback=?',
						data: {
							ib_id: ibId
						},
						dataType: 'jsonp',
						success: function(data) {
							var obj = data.result.obj;
							if(obj && obj.length > 0) {
								var list = {list:obj};
								var html = $.tppl(document.getElementById('strategyTml').innerHTML, list);
								$('.strategy-list ul').html(html);
								$('.strategy').show();
								if(obj.length > 1) {
									INDEX.strategyScroll();
								}
							}else {
								$('.strategy').hide();
							}
						}
					})
				}
			}
	module.exports=INDEX.init();
})
