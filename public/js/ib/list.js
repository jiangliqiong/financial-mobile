define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	require('tppl');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	var LIST={
        init:function(){
          LIST.bind();
          LIST.initLabel();
        },
				bind: function() {
            //条件筛选
						$('body').on('click','.ib-condition-box .ib-condition-block',LIST.IbScreen);
						//条件选择高亮
						$('body').on('click','.ib-select-box .ib-list-box span',LIST.screenHeigh);
						//条件重置
						$('body').on('click','.ib-plat-reset', function() {
							var _span = $(this).parents('.ib-select-box').find('.ib-list-box').children('span');
							_span.removeClass('active');
							_span.eq(0).addClass('active');
						});
						//平台选择确认
						$('body').on('click','.ib-plat-ok',function() {
							  var platSpan = $('.ib-plat-list .ib-list-box span.active');
								var dataId = [],dataIndex = [];
								$(platSpan).each(function(i,o) {
									dataId.push($(o).attr('data-id'));
									dataIndex.push($(o).index());
								});
							  $('.ib-condition-block').eq(2).attr('data-select',dataId.join(',')).attr('data-index',dataIndex.join(','))
								$('.ib-select-box').css('height',0);
								$('.back-cover').css('opacity','0').css('z-index','-1')
								if(dataIndex[0] == 0) {
									 LIST.resetHeigh();
								};
								LIST.getIbList();
						});
						//遮罩事件
						$('body').on('click','.back-cover',function() {
							if($('.ib-plat-list').css('height') != '0px' || $('.ib-area-list').css('height') != '0px') {
								var btn = $('.ib-condition-block.active');
							  LIST.upScreen(btn);
							}
						})
				},
        initLabel: function() {
          $('.ib-msg-lable-box').each(function(i,o) {
             var _h = $(this).height();
             var _list = $(this).find('.ib-msg-lable');
             var _listH = $(_list).height();
             var _span = $(_list).find('span');
             var _w = $(_list).width();
             var _spanW = 0;
             var _newArry = [];
             if(_listH > _h) {
                $(_list).append('<span class="ib-lable-ellipsis">...</span>');
                var _addW = $('.ib-lable-ellipsis').width();
                $(_span).each(function(k,j){
                   _spanW += $(this).width() + _addW;
                   if(_spanW > _w) {
                      _newArry.push('<span class="ib-lable-ellipsis">...</span>');
                      $(this).parent().html(_newArry.join(''))
                      return false;
                   }else {
                     _newArry.push('<span>'+$(j).text()+'</span>')
                   }
                })
             };
          })
        },
				//上拉事件
				upScreen: function(obj) {
					$('.ib-select-box').removeClass('no');
					var index = $(obj).index();
					//判断选项是否都为默认选项
					var $platAll =$('.ib-plat-list span').eq(0),
							$areaAll = $('.ib-area-list span').eq(0);
					var platSelect = $(obj).attr('data-select');
					if($platAll.hasClass('active') && $areaAll.hasClass('active') && !platSelect) {
						$(obj).removeClass('active');
						$('.ib-condition-box .ib-condition-block').eq(0).addClass('active');
						$('.back-cover').css('opacity','0').css('z-index','-1')
						$('.ib-select-box').css('height',0);
					}else {
						//判断是否下拉状态
						var selectBox = $('.ib-select-box').eq(index-1);
						var selectBoxHeight = selectBox.find('.ib-list-main').height();
						//隐藏显示
						if(selectBox.css('height') == '0px') {
							selectBox.css('height',selectBoxHeight);
							$('.back-cover').css('opacity','1').css('z-index','9');
						}else {
							selectBox.css('height',0);
							$('.back-cover').css('opacity','0').css('z-index','-1')
						};
						//平台筛选
						if(index == 2) {
							//判断是否有选择过条件
							if(platSelect && platSelect!='0') {
								 var dataIndex = $(obj).attr('data-index');
								 dataIndex = dataIndex.split(',');
								 $(dataIndex).each(function(i,o) {
									 $('.ib-plat-list span').eq(o).addClass('active');
								 });
								 $('.ib-plat-list span').eq(0).removeClass('active');
							}else {
								 $('.ib-plat-list span').removeClass('active').eq(0).addClass('active');
							}
						};
						LIST.resetHeigh();
					}
				},
				//条件筛选
				IbScreen: function() {
					var index = $(this).index();
					var plat = $('.ib-plat-list').height();
					var area = $('.ib-area-list').height();
					var platBlock = $('.ib-condition-box .ib-condition-block').eq(1);
					var areaBlock = $('.ib-condition-box .ib-condition-block').eq(2);
					if($(this).hasClass('active')) {
            LIST.upScreen($(this));
						return false;
					};
					if(!plat&&!area) {
             $('.ib-select-box').css('height',0);
					}else {
						$('.ib-select-box').addClass('no').css('height',0);
					}
					$('.ib-condition-box .ib-condition-block').removeClass('active').removeClass('height');
					$(this).addClass('active');
					//默认排序
					if(index == 0) {
						  $('.ib-select-box').removeClass('no');
							$('.ib-condition-block').eq(1).removeAttr('data-city');
						  $('.ib-condition-block').eq(2).removeAttr('data-select');
						  $('.ib-select-box .ib-list-box span').removeClass('active');
							$('.ib-plat-list .ib-list-box span').eq(0).addClass('active');
							$('.ib-area-list .ib-list-box span').eq(0).addClass('active');
							$('.back-cover').css('opacity','0').css('z-index','-1');
							LIST.getIbList();
					}else {
						//已选择模块高亮
            if(platBlock.attr('data-city')&&platBlock.attr('data-city')!=0) {
               platBlock.addClass('height');
						};
						if(areaBlock.attr('data-select')&&areaBlock.attr('data-select')!=0) {
               areaBlock.addClass('height');
						};
						if(index == 1) {
							var areaHight = $('.ib-area-list .ib-list-main').height();
							$('.ib-area-list').css('height',areaHight);
						}else {//平台
							var platHight = $('.ib-plat-list .ib-list-main').height();
							$('.ib-plat-list').css('height',platHight);
						}
						$('.back-cover').css('opacity','1').css('z-index','9');
            //清空没确认的平台选项
						var dataIndex =areaBlock.attr('data-index');
						if(!dataIndex) {
							$('.ib-plat-list span').removeClass('active').eq(0).addClass('active');
						}
					}
				},
				//重置条件高亮
				resetHeigh: function() {
					var $platAll =$('.ib-plat-list span').eq(0),
							$areaAll = $('.ib-area-list span').eq(0);
					if($platAll.hasClass('active') && $areaAll.hasClass('active')) {
						$('.ib-condition-box .ib-condition-block').removeClass('active').removeClass('height').eq(0).addClass('active');
					}else if(!$areaAll.hasClass('active')&&$platAll.hasClass('active')) {
						$('.ib-condition-box .ib-condition-block').removeClass('active').removeClass('height').eq(1).addClass('active');
					}else if(!$platAll.hasClass('active')&&$areaAll.hasClass('active')){
						$('.ib-condition-box .ib-condition-block').removeClass('active').removeClass('height').eq(2).addClass('active');
					}
				},
				//筛选高亮
				screenHeigh: function() {
					var all = $(this).siblings().eq(0);
					var activeSpan = $(this).siblings('.active');
					var isArea = $(this).parents('.ib-select-box').hasClass('ib-area-list');
					if($(this).hasClass('active')) {
						 if($(this).index() != 0) {
							 $(this).removeClass('active');
							 if(activeSpan.length == 0) {
								 all.addClass('active');
							 }
						 }
					}else {
						if($(this).index() != 0) {
							//单选
							if(isArea) {
								 $(this).siblings().removeClass('active');
								 //触发地区筛选后事件
							}else {//复选
								all.removeClass('active');
							}
						}else {
							$(this).siblings().removeClass('active');
						}
						$(this).addClass('active');
					};
					//单选地区触发
					if(isArea) {
						$('.ib-condition-block').eq(1).attr('data-city',$(this).attr('data-id'));
						LIST.getIbList();
					}
				},
				//ib列表获取
				getIbList: function() {
					 var provinceId = $('.ib-condition-block').eq(1).attr('data-city');
					 var brokerId = $('.ib-condition-block').eq(2).attr('data-select');
					 brokerId = brokerId?brokerId:0;
					 provinceId = provinceId?provinceId:0;
           $.ajax({
						 type: 'get',
						 url: forex+'/front/find-introducing_broker-list.do?format=json&jsoncallback=?',
						 dataType: 'jsonp',
						 data: {
							 provinceId: provinceId,
							 brokerId: brokerId
						 },
						 success: function(data){
							 var brokerList = {list:data.result.obj};
               var html = $.tppl(document.getElementById('ibListTml').innerHTML, brokerList);
               $('.ib-list-tab').html(html);
						 }
					 })
				}
			}
	module.exports=LIST.init();
})
