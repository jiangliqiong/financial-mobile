define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	require('tppl');
	require('zeptoAnimate');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	var baseList = null;
	var IBLIST={
		    page: 1,
				isEnd: false,
        init:function(){
          IBLIST.bind();
          IBLIST.getList();
					IBLIST.listScroll();
        },
				bind: function() {
          //设为代理
					$('body').on('click','.ib-set-btn',IBLIST.setIb)
					//关键词搜索
					$('body').on('click','.ib-search-btn',function() {
						IBLIST.isEnd = false;
						IBLIST.page = 1;
						IBLIST.getList(1,false,'search');
					})
					//键盘事件
					$('body').on('keyup','.keyword',function(e) {
						if(e.keyCode == 13 || e.which == 13) {
							IBLIST.getList();
						}
					})
				},
				setIb: function() {
					var ibName = $('.ib-msg-name').text();
					var ibAccount = PUBLIC.getQueryString('ib_account');
					var ibId = $(this).attr('data-ib-id');
					var openId = PUBLIC.getQueryString('openId');
					var toIbName = $(this).attr('data-name');
					$('body').confirmLayer({
                type: 1,
                title: '提示',
                msg: '您确定要将'+ibName+'账户 '+ibAccount+' 的IB代理商变更为 【'+toIbName+'】吗？<p class="tip-important">注意：变更成功后将无法撤销！</p>',
                yes:function () {
                  location.href = '/personal/ibChangeRes.html?ibId='+ibId+'&openId='+openId;
                }
            })
				},
				//下拉加载列表
				listScroll: function() {
					window.onscroll = function() {
						//滚动条距离顶部距离
						var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
						//内容高度
						var heihgt =  $(document).height();
						//屏幕高度
						var screenHeight = $(this).height();
						if(scrollTop + screenHeight >= heihgt) {
							// if(!$('.comment-loading').length) {
							// 	$('.comment-list ul').append('<li class="comment-loading">正在加载，请稍后…</li>');
							// };
							IBLIST.page ++;
							IBLIST.getList(IBLIST.page,true);
						}
					}
				},
				//代理商列表
				getList: function(page,status,type) {
					if(IBLIST.isEnd) {
             return false;
					};
					var pageNum = page?page:IBLIST.page;
					var brokerId = PUBLIC.getQueryString('broker_id');
					var ibId = PUBLIC.getQueryString('ib_id');
					if(type && type == 'search') {
					var keyWords = $('.keyword').val();
					}else {
          var keyWords = '';
			   	};
					$.ajax({
						type: 'get',
						url: forex+'/personal/find-ib-info-brokey.do?format=json&jsoncallback=?',
						dataType: 'jsonp',
						data: {
              broker_id: brokerId,
							currentPage: pageNum,
              pageSize: 6,
							keyWords: keyWords
						},
						success: function(data) {
							 if(data.result.code == 10000) {
								 var obj = data.result.obj;
								 var list = obj.Ibs;
								 var page = data.result.page;
								 $('.ib-msg-name').text(obj.broker_name);
								 if(!status) {
									 	$('.ib-msg-count').text('共 '+page.totalCount+' 家代理商');
								 };
								 if(list&&list.length) {
									hasList = true;
								 	var score = [];
								 	var full,half,empty;
								 	$(list).each(function(i,o) {
								 			if(o.recommending_index) {
								 				full = o.recommending_index.split('.')[0];
								 				half = o.recommending_index.split('.')[1];
								 				empty = Math.floor(5-o.recommending_index);
								 			}else {
								 				full = 0;
								 				half = 0;
								 				empty = 5;
								 			};
								 			score.push({
								 				full: full,
								 				half: half,
								 				empty: empty
								 			})
								 	});
								 	var ibList = {list: list, score: score, id: ibId};
									if(!baseList) {
										baseList = ibList;
									};
								 	var html = $.tppl(document.getElementById('ibListTml').innerHTML, ibList);
									if(status) {
                    $('.ib-list').append(html);
									}else {
										$('.ib-list').html(html);
									}
									if(type && type == 'search') {
										$('.no-result').hide();
										$('.ib-list-top').hide();
									};
								 }else {
										 if(type && type == 'search') {
										 }else {
											 IBLIST.page = 1;
											 IBLIST.isEnd = true;
										 }
										 if(status) {
											 return false;
										 };
									   $('.no-result').show();
                     if(baseList) {
											 var html = $.tppl(document.getElementById('ibListTml').innerHTML, baseList);
											 $('.ib-list').html(html);
											 $('.ib-list-top').show();
										 }
								 }
							 }else {
								 IBLIST.page = 1;
								 if(status) {
									 return false;
								 };
                 $('.no-result').show();
							 }
						}
					})
				}
			}
	module.exports=IBLIST.init();
})
