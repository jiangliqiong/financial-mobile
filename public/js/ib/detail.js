define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	require('zeptoAnimate');
	var DETAIL={
		    qrcode : new QRCode("qrcode"),
				customerId: '',
				userId: '',
        init: function(){
					PUBLIC.checkLogin(function(res){
						var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
								DETAIL.userId = id;
								DETAIL.customerId = id;
								DETAIL.bind();
								DETAIL.showIcon();
					})
        },
				bind: function() {
           //显示更多简介
					 $('body').on('click', '.show-detail-descr',function() {
             if($(this).hasClass('up')) {
							 $('.describe-content p').css('display','-webkit-box');
							 $('.show-detail-descr').removeClass('up');
						 }else {
							 $('.describe-content p').css('display','block');
							 $('.show-detail-descr').addClass('up');
						 }
					 })
					 //分享点击事件
					 $('body').on('click','.share-btn',DETAIL.showShareHandle);
					 //取消分享
					 $('body').on('click','.qrcodeLayerBox .closeBtn',DETAIL.hideShareHandle);
					 //开户
					 $('body').on('click','.ib-detail-btn a',DETAIL.openAccount);
				},
				//开户
				openAccount: function() {
					 var referer = location.href;
					 var userId = DETAIL.userId;
					 var ref = $(this).attr('data-href');
					 if( userId == -1 ) {
						 window.location.href = ref;
						 return false;
					 };
					 var brokerId = $(this).attr('data-broker');
					 var ibId = $(this).attr('data-ib');
					 var brokerName = $('#detail-ib-name').text();
					commonMethod.hasAccount(userId,brokerId,ibId,ref,brokerName);
				},
        //简介超出
        showIcon: function() {
          var _height = $('.describe-content p').height();
          if(_height > 80) {
						$('.describe-slightly').show();
            $('.show-detail-descr').css('display','inline-block');
          }
        },
				//分享按钮点击事件
				showShareHandle:function () {
						$('.qrcodeLayerBox').show().find('.qrcodeMask').show();
						$('.qrcodeLayer').show().animate({opacity:1},200);
						var _url = window.location.href;
						if(DETAIL.customerId&&DETAIL.customerId !=-1) {
							if(_url.indexOf('shareId')==-1) {
								_url = _url + '&shareId='+DETAIL.customerId;
							}else {
								_url = commonMethod.replaceParamVal(_url,'shareId',DETAIL.customerId);
							}
						}else {
							if(_url.indexOf('shareId')!=-1) {
								_url = commonMethod.replaceParamVal(_url,'shareId','');
							}
						}
						DETAIL.qrcode.makeCode(_url);
				},
				//取消分享事件
				hideShareHandle:function () {
						$('.qrcodeLayerBox').hide().find('.qrcodeMask').hide();
						$('.qrcodeLayer').animate({opacity:0},150,'',function () {
								$('.qrcodeLayer').hide();
						});
				}
			}
	module.exports=DETAIL.init();
})
