define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	require('tppl');
  require('zeptoAnimate');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	var LIST={
        commentId: PUBLIC.getQueryString('commentId'),//交易商或代理商ID
        commentStatus: PUBLIC.getQueryString('commentStatus'),//0:对交易商评论 1:对代理商评论
        loginStatus: 0,//是否登录
        createUser: '',//如果已经登录传用户ID，游客就传空
        commentator: '',//用户手机号或者游客IP
				page: 1,
				isScroll: true,
				scrollTop: '',
        init:function(){
          PUBLIC.checkLogin(function(res) {
            var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
                if(id && id != '-1') {
									LIST.createUser = id;
                  LIST.loginStatus = 1;
                  LIST.commentator = res.result ? res.result.phone : '';
								}else {
                  LIST.commentator = returnCitySN["cip"];
                }
             LIST.bind();
						 LIST.listScroll();
						 if(LIST.commentStatus == 1) {
							 LIST.checkComment();
						 }
						 LIST.checkScroll();
          });
        },
				bind: function() {
          $('body').on('click','.comment-reply .input.edit-comment',LIST.showEdit);
          $('body').on('click','.comment-reply-cover,.comment-reply-cancel',LIST.hideEdit);
          $('body').on('keyup','#reply-area',LIST.heighSend);
          $('body').on('click','.comment-reply-send.ok',LIST.checkSensitive);
				},
        showEdit: function() {
					LIST.scrollTop = $('body').scrollTop();
					var heihgt =  $(document).height();
          $('.comment-reply').addClass('focus');
					$('body').addClass('stop').css('top',-LIST.scrollTop);
          $('#reply-area').focus();
        },
        hideEdit: function() {
          $('.comment-reply').removeClass('focus');
					$('body').removeClass('stop');
					$('body').scrollTop(LIST.scrollTop);
        },
        heighSend: function() {
          var val = $(this).val().replace(/(^\s*)|(\s*$)/g, "");
          if(val) {
             $('.comment-reply-send').addClass('ok');
          }else {
             $('.comment-reply-send').removeClass('ok');
          }
        },
				//滚动条检测
				checkScroll: function() {
					//内容高度
					var heihgt =  $(document).height();
					//屏幕高度
					var screenHeight = $(window).height();
					if(heihgt<screenHeight) {
						LIST.page ++;
						LIST.showCommentList(LIST.page,true);
					}
				},
				//下拉加载列表
				listScroll: function() {
          window.onscroll = function() {
						if($('.comment-reply').hasClass('focus')) {
							return false;
						};
						//滚动条距离顶部距离
						var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
						//内容高度
						var heihgt =  $(document).height();
						//屏幕高度
						var screenHeight = $(this).height();
						if(scrollTop + screenHeight >= heihgt) {
							if(!$('.comment-loading').length) {
                $('.comment-list ul').append('<li class="comment-loading">正在加载，请稍后…</li>');
							};
							LIST.page ++;
			        LIST.showCommentList(LIST.page,false);
						}
					}
				},
        //显示评论列表
        showCommentList: function(page,status,mode) {
          $.ajax({
            type: 'get',
            url: forex + '/front/find-fx-comment-page.do?format=json&jsoncallback=?',
						dataType: 'jsonp',
            data: {
              comment_id: LIST.commentId,
              comment_status: LIST.commentStatus,
              pageNum: page,
              pageSize: 6
            },
            success: function(data) {
							if(data.result.obj && data.result.obj.fxComments.length > 0) {
								var res = data.result.obj.fxComments;
                                for(var i = 0; i < res.length ; i++){
                                    res[i].content = res[i].content.replace(/</g,'&lt;').replace(/>/g,'&gt;');
                                }
								var list = {list:res};
								var html = $.tppl(document.getElementById('ListTml').innerHTML, list);
								if(!mode) {
                 	$('.comment-list ul').append(html);
								}else {
									if($('.comment-list').length == 0) {
										$('body').append('<section class="comment-list"><ul></ul></section>');
										$('.no-comment').remove();
									};
									$('.comment-list ul').html(html);
									data.result.obj.total?$('.topbar span').text('评论('+data.result.obj.total+')'):'';
								};
								$('.comment-list ul li.opacity').animate({opacity: 1}).removeClass('opacity');
								//下拉加载的时候显示加载动画 发布和检测不添加
								if(status) {
									LIST.checkScroll();
								}else {
									$('.comment-loading').remove();
								}
							}else {
								if($('.no-more-comment').length > 0) {
                  $('.no-more-comment').remove();
									$('.comment-list ul').append('<li class="comment-loading no-more-comment">已经没有数据了</li>');
								}else {
									if($('.comment-loading').length > 0) {
										$('.comment-loading').text('已经没有数据了').addClass('no-more-comment');
									}
								}
							};
            }
          })
        },
				//评论资格检测
				checkComment: function() {
          $.ajax({
						type: 'get',
						url: forex + '/front/is-agented-cus-ib.do?format=json&jsoncallback=?',
						data: {
							ib_id: LIST.commentId
						},
						dataType: 'jsonp',
						success: function(data) {
              if(data.code == 0 && data.result.code == 10001) {
								//检测自己是自己的代理
								LIST.checkOneSelf();
							}else {
								 $('.comment-reply .input').text('只有该IB代理商历史代理会员才能评论');
								 $('.comment-reply').show();
							}
						}
					})
				},
				//检测自己是自己的代理
				checkOneSelf: function() {
					$.ajax({
						type: 'get',
						url: forex + '/personal/find-ib-base-info.do?format=json&jsoncallback=?',
						data: {
							customer_id: LIST.createUser
						},
						dataType: 'jsonp',
						success: function(data) {
							if(data.code == 0 && data.result.code == 10000) {
								var ibId = data.result.obj.ib_id;
								if(LIST.commentId == ibId) {
                  $('.comment-reply .input').text('对不起，您不能在自己主页评论！');
									$('.comment-reply').show();
									return false;
								}
							};
							$('.comment-reply .input').addClass('edit-comment');
							if($('.comment-list').length == 0){
								$(".comment-reply").addClass('focus');
							}
							$('.comment-reply').show();
						}
					})
				},
				//敏感词检测
				checkSensitive: function() {
					var content = $('#reply-area').val();
					content = content.replace(/\r\n/g,"　　").replace(/\n/g,"　　").replace(/(^\s*)|(\s*$)/g, "");
					if(content.length > 140) {
						$('body').mildHintLayer({type: 3,msg:'您的输入文字超过限定的140个汉字！'});
						return false;
					};
					$.ajax({
            type: 'get',
            url: forex + '/front/is-has-sensitiveword.do?format=json&jsoncallback=?',
						dataType: 'jsonp',
            data: {
               comment_id: LIST.commentId,
               comment_status: LIST.commentStatus,
               login_status: LIST.loginStatus,
               content: content
            },
						beforeSend: function() {
              $('.comment-reply-send').removeClass('ok');
						},
            success: function(data) {
               if(data.code == 0 && data.result.code == 10000) {
                 LIST.addComment(content);
               }else {
                 $('body').mildHintLayer({type:3,msg:'您的评论包含敏感词汇，已被屏蔽！'});
								 $('.comment-reply-send').addClass('ok');
               }
            }
          })
				},
				utf16toEntities: function(str) {
					var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
					return str.replace(patt, function(char){
						var H, L, code;
						if (char.length===2) {
							H = char.charCodeAt(0); // 取出高位
							L = char.charCodeAt(1); // 取出低位
							code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
							return "[表情]";
						} else {
							return "[表情]";
						}
					});
				},
        //发布评论
        addComment: function(content) {
					content = content.replace(/</g,'&lt;').replace(/>/g,'&gt;');
					content = LIST.utf16toEntities(content);
          $.ajax({
            type: 'get',
            url: forex + '/front/do-add-fx-comment.do?format=json&jsoncallback=?',
						dataType: 'jsonp',
            data: {
               comment_id: LIST.commentId,
               comment_status: LIST.commentStatus,
               login_status: LIST.loginStatus,
               commentator: LIST.commentator,
               create_user: LIST.createUser,
               content: content
            },
            success: function(data) {
               if(data.code == 0 && data.result.code == 10000) {
								 LIST.page = 1;
								 LIST.showCommentList(1,true,1);
                 $('body').mildHintLayer({type:1,msg:'发布成功'});
								 $('.comment-reply').removeClass('focus');
								 $('body').removeClass('stop');
								 $('#reply-area').val('');
								 $('.comment-reply-send').removeClass('ok');
								 $('.comment-loading').remove();
								 $('body').scrollTop(0);
               }else {
                 $('body').mildHintLayer({type:2,msg:'发布失败'});
								 $('.comment-reply-send').addClass('ok');
               }
            }
          })
        }
			}
	module.exports=LIST.init();
})
