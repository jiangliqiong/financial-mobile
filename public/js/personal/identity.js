define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	require('zeptoAnimate');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	var Identity={
		    customerId: '',
        init:function(){
					PUBLIC.checkLogin(function(res){
						var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
								Identity.customerId= id;
                if(id && id != '-1') {
									Identity.bind();
									Identity.isOpen();
									Identity.getImg();
								}else {
									location.href='/';
									return false;
								}
					})
        },
				bind: function() {
					//上传图片
					$('body').on('change','.file-pic',Identity.uploadPicture);
					$(".uploadIframeBox").load(function() {
						var id = $(this).attr('data-id');
						$('.img-loading'+id).hide();
						var oid=$(this).attr("id");
						try {
							var subiframe = document.getElementById(oid).contentWindow.document.body;
							var obj = $.parseJSON($(subiframe).text());
							if (obj.code == 200 && obj.res) {
								 $('.ib-upload-pic'+id).attr('src',obj.url).show();
								 //两张
								 var filePic1 = $('.ib-upload-pic1').attr('src');
								 var filePic2 = $('.ib-upload-pic2').attr('src');
								 if(filePic1&&filePic2) {
									 	 $('.upload-sure').removeClass('disabled');
								 }
							} else {
								 $('body').mildHintLayer({type:2,msg:'上传图片失败'});
							};
						}catch(e) {
								 $('body').mildHintLayer({type:2,msg:'上传图片失败'});
						}
					});
					//保存
					$('body').on('click','.upload-sure',Identity.saveMsg)
					//查看大图
					$('body').on('click','.upload-cover',function() {
						var imgUrl = $(this).parent().find('img').attr('src');
						$('body').showImgLayer({
							html: '<img src="'+imgUrl+'" />'
						});
					})
				},
				//上传图片
				uploadPicture: function() {
					  var id = $(this).attr('data-id');
						$('.img-loading'+id).show();
						$(this).parent().submit();
						$(this).val('');
				},
				//保存
				saveMsg: function() {
					if($(this).hasClass('disabled')) {
						return false;
					};
					var image_url1 = $('.ib-upload-pic1').attr('src');
					var image_url2 = $('.ib-upload-pic2').attr('src');
					$.ajax({
						type: 'get',
						url: forex+'/personal/new-update-customer-byId.do?format=json&jsoncallback=?',
						dataType: 'jsonp',
						data: {
              customer_id: Identity.customerId,
							image_url1: image_url1,
							image_url2: image_url2
						},
						success: function(data) {
              if(data.code == 0 && data.result.code == 0) {
								 $('body').mildHintLayer({type:1,msg:'证件照片上传成功！'});
								 setTimeout(function(){
                   window.location.href ='/personal/basicInfo.html';
								 },2000)
							}else {
								 $('body').mildHintLayer({type:2,msg:'证件照片上传失败！'});
							}
						}
					})
				},
				//获取是否认证
				isOpen: function() {
					$.ajax({
						type: 'get',
						url: forex+'/front/is-opened-customer.do?format=json&jsoncallback=?',
						dataType: 'jsonp',
						data: {
							customer_id: Identity.customerId
						},
            success: function(data) {
							//已认证
              if(data.result.code == 10001) {
								$('.upload-cover').show();
								$('.upload-sure-box').hide();
							}else {//未认证
								$('.upload-cover').hide();
								$('.upload-sure-box').show();
							}
						}
					})
				},
				//获取证件照片
				getImg: function() {
					$.ajax({
						type: 'get',
						url: forex+'/personal/find-customer-all-byId.do?format=json&jsoncallback=?',
						dataType: 'jsonp',
						data: {
             customer_id: Identity.customerId
						},
						success: function(data) {
               var msg = data.result.obj,
							     isChecked = msg.is_checked;
							 var tip = '请上传有效身份证（正反面各一张）';
							 msg.image_url1?$('.ib-upload-pic1').attr('src',msg.image_url1):'';
							 msg.image_url2?$('.ib-upload-pic2').attr('src',msg.image_url2):'';
							 if(msg.image_url1 && msg.image_url2) {
								 $('.upload-sure').removeClass('disabled');
							 };
							 //0:未实名认证 1：已实名认证
               if(isChecked == 1 && msg.lastName && msg.firstName) {
								 var firstName = msg.firstName.replace(/.(?=)/g, '*');
								 tip = '请上传<span>'+firstName+msg.lastName+'</span>的有效身份证（正反面各一张）'
							};
							$('.upload-tip').html(tip);
						}
					})
				}
			}
	module.exports=Identity.init();
})
