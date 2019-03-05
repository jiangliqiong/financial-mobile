define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	require('tppl');
	require('zeptoAnimate');
	var customerId;
	var STRATEGY={
        init:function(){
					PUBLIC.checkLogin(function(res){
						var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
								customerId= id;
                if(id && id != '-1') {
									STRATEGY.bind();
                  STRATEGY.getIbId();
								}else {
									location.href='/';
									return false;
								}
					})
        },
				bind: function() {
					$('body').on('click','.strategy-del', STRATEGY.strategyDel)
				},
				strategyDel: function() {
					var _this = $(this);
					var _parent = $(this).parents('li');
					$('body').confirmLayer({
								type: 2,
								title: '提示',
								msg: '您确定要删除该策略吗？',
								yes:function () {
                   STRATEGY.strategyDelFn(_this.attr('data-id'),_parent);
								}
						})
				},
				//获取IBId
				getIbId: function() {
					$.ajax({
						type: 'get',
						url: forex + '/personal/find-ib-base-info.do?format=json&jsoncallback=?',
						data: {
							customer_id: customerId
						},
						dataType: 'jsonp',
						success: function(data) {
							if(data.code == 0 && data.result.code == 10000) {
								var ibId = data.result.obj.ib_id;
								STRATEGY.getStrategyList(ibId);
							};
						}
					})
				},
				//获取喊单列表
				getStrategyList: function(ibId) {
          $.ajax({
						type: 'get',
						url: forex+'/front/find-fx-tactics-ib.do?format=json&jsoncallback=?',
						data: {
              ib_id: ibId
						},
						success: function(data) {
							var obj = data.result.obj;
							if(obj && obj.length > 0) {
								var list = {list:obj};
								var html = $.tppl(document.getElementById('strategyTml').innerHTML, list);
								$('.strategy-list ul').html(html);
							}else {
								$('.no-strategy').show();
								$('.strategy-list').hide();
							}
						}
					})
				},
				//删除喊单
				strategyDelFn: function(id,obj) {
					$.ajax({
						type: 'get',
						url: forex+'/front/delete-fx-tactic-id.do?format=json&jsoncallback=?',
						data: {
              id: id
						},
						success: function(data) {
              if(data.code == 0 && data.result.code == 10000) {
								$('body').mildHintLayer({type:1, msg:'删除成功！'});
								$(obj).remove();
								var list = $('.strategy-list ul li').length;
								if(!list) {
									$('.no-strategy').show();
									$('.strategy-list').hide();
								}
							}else {
								$('body').mildHintLayer({type:2, msg:'删除失败！'});
							}
						}
					})
				}
			}
	module.exports=STRATEGY.init();
})
