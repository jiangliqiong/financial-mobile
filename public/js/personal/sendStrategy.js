define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	require('zeptoAnimate');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	var customerId;
	var STRATEGY={
        init:function(){
					PUBLIC.checkLogin(function(res){
						var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
								customerId= id;
                if(id && id != '-1') {
									STRATEGY.countrySelect();
				 					STRATEGY.bind();
								}else {
									location.href='/';
									return false;
								}
					})
        },
				bind: function() {
					$('body').on('click','.category .rt span', STRATEGY.category);
					$('body').on('keyup','.data ul li input', STRATEGY.highlight);
					$('body').on('click','.data-box.focus .add-num', STRATEGY.algorithm);
					$('body').on('click','.data-box.focus .reduce-num', STRATEGY.algorithm);
					$('body').on('click','.strategy-btn button', STRATEGY.sendStrategy)
				},
				//交易品种
				countrySelect: function() {
					 var showCountryDom = document.querySelector('#showVarieties');
					 var selectAreaDom = $('#selectVarieties');
					 showCountryDom.addEventListener('click', function () {
							 wapApi.getVarieties.data.ib_id="1";
							 wapApi.$ajax(wapApi.getVarieties,function(data){
										 var arr = [];
											 for(var i=0;i<data.result.tacticArr.length;i++){
												 arr[i] = {"id":"","value":""};
													 arr[i].id = data.result.tacticArr[i].dict_key;
													 arr[i].value = data.result.tacticArr[i].dict_value;
											 }
											 var bankSelect = new IosSelect(1,
											 [arr],
											 {
													 container: '.container',
													 title: '交易品种',
													 itemHeight: 50,
													 itemShowCount: 5,
													 callback: function (selectOneObj) {
                              $('.varieties-val').text(selectOneObj.value).css('color','#000');
															$('#showVarieties').attr('data-id',selectOneObj.id);
													 }
									 });
							 })
					 });
				},
				//类别
				category: function() {
					var dataBox = $(this).parent();
					 if($(this).hasClass('active')) {
             return false;
					 };
					 $('.data ul li input').val('');
					 $('.data ul li .data-box').removeClass('focus');
					 $('.category .rt span').removeClass('active');
					 $(this).addClass('active');
           var index = $(this).index();
					 if(index == 0 || index == 1) {
						 $('.val').show();
						 $('.area').hide();
					 }else {
						 $('.area').show();
						 $('.val').hide();
					 }
				},
				//高亮
				highlight: function() {
					var val = $(this).val();
					var dataBox = $(this).parent();
					if(val) {
            $(dataBox).addClass('focus');
					}else {
						$(dataBox).removeClass('focus');
					}
				},
				//增值
				algorithm: function(type) {
				 var input = $(this).parent().find('input');
         var val = input.val();
				 if(val.toString().indexOf('.') > 0) {
					 var length = val.toString().split(".")[1].length;
					 var num = '';
					 for(var i = 0; i < length-1;i++ ) {
             num = num + '0';
					 };
					 if($(this).hasClass('add-num')) {
						val = STRATEGY.accAdd(Number(val),Number('0.'+ num +'1'),length);
					}else {
						val = STRATEGY.Subtr(Number(val),Number('0.'+ num +'1'),length);
					}
				 }else {
					 var length = 0;
					 if($(this).hasClass('add-num')) {
             val = STRATEGY.accAdd(Number(val), 1, 0);
					 }else {
             val = STRATEGY.Subtr(Number(val), 1, 0);
					 }
				 }
				 input.val(val);
			 },
			 //加法
			 accAdd: function(arg1,arg2,fixed) {
				  var r1,r2,m;
				  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
				  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
				  m=Math.pow(10,Math.max(r1,r2))
				  return ((arg1*m+arg2*m)/m).toFixed(fixed);
				},
				//减法
				Subtr:function(arg1,arg2,fixed){
				     var r1,r2,m,n;
				     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
				     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
				     m=Math.pow(10,Math.max(r1,r2));
				     n=(r1>=r2)?r1:r2;
				     return ((arg1*m-arg2*m)/m).toFixed(fixed);
				},
				//发布策略
				sendStrategy: function() {
					var _this = $(this);
					if(_this.hasClass('isSend')) {
						return false;
					};
          var madeVal = $('.data ul li.val input');
					var areaVal = $('.data ul li.area input');
					var type = $('.category .rt span.active').index();
					var content = [];
					var isOk = true;
					var typeMap = {
						'0': '入场',
						'1': '止损',
						'2': '止盈'
					}
					if(type == 2) {
						 var obj = areaVal;
					}else {
             var obj = madeVal;
					};
					var varieties = $('#showVarieties').attr('data-id');
					if(!varieties) {
								$('body').mildHintLayer({type:2,msg:'请选择交易品种'});
								return false;
					};
					$(obj).each(function(i,o) {
						var name = $(o).attr('name');
						var val = $(o).val();
						if(val == '') {
							  isOk = false;
								$('body').mildHintLayer({type:2,msg:'请输入'+name});
								return false;
						}else if(isNaN(val) || val < 0) {
							  isOk = false;
							  $('body').mildHintLayer({type:2,msg:'您输入的数字有误！'});
							  return false;
						}else {
							if(val.toString().indexOf('.') != -1) {
								var length = val.toString().split(".")[1].length;
								if(length > 4) {
									isOk = false;
									$('body').mildHintLayer({type:2,msg:'最多可输入小数点后四位！'});
									return false;
								};
							}
							if(type == 2) {
                content.push(val);
							}else {
								content.push(val+typeMap[i]);
							}
						}
					});
					if(!isOk) {
						return false;
					};
					if(type == 2) {
						//区间
						// if(Number(content[0]) > Number(content[1])) {
						// 	$('body').mildHintLayer({type:2,msg:'起始价不能高于截止价！'});
 					  // 	  return false;
						// };
            var contentVal = content.join('—') + '高抛低吸';
					}else {
            var contentVal = content.join(',');
					};
					var currency = '2';
					$.ajax({
						type: 'get',
						url: forex+'/front/add-fx-tactic.do?format=json&jsoncallback=?',
						data: {
              currency: currency, //货币对
							type: type, //类型
							content: contentVal,
							profit: 0 //盈亏
						},
						beforeSend: function() {
              _this.addClass('isSend');
						},
						success: function(data) {
              if(data.code == 0 && data.result.code == 10000) {
								$('body').mildHintLayer({type:1,msg: '发布成功！'});
								setTimeout(function(){
									window.location.href ='/personal/strategy.html';
									$('.data ul li input').val('');
									_this.removeClass('isSend');
									$('.data-box').removeClass('focus');
									$('.mildHintBox').remove();
									$('#showVarieties').removeAttr('data-id');
									$('.varieties-val').text('请选择交易品种').css('color','#dcdcdc');
								},1500)
							}else {
								$('body').mildHintLayer({type:2,msg: '发布失败！'});
							}
						}
					})
				}
			}
	module.exports=STRATEGY.init();
})
