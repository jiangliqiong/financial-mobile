define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	require('tppl');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	var customerId;
	var IbMsg={
        init:function(){
					PUBLIC.checkLogin(function(res){
						var id = res.result ? res.result.id : '',
								type = res.result ? res.result.type : '';
								customerId = id;
                if(id && id != '-1') {
									IbMsg.bind();
									IbMsg.getIbInfo();
								}else {
									location.href='/';
									return false;
								}
					})
        },
				bind: function() {
				},
				getIbInfo: function() {
					$.ajax({
						type: "get",
						url: forex+'/personal/find-ib-base-info.do?format=json&jsoncallback=?',
						async: true,
						dataType: 'jsonp',
						data: {
							customer_id: customerId
						},
						success: function(data) {
							if(data.result.code == 10000) {
                  var html = $.tppl(document.getElementById('ibMsgTml').innerHTML, data.result.obj);
                  $('#ib-msg').html(html);
							}
						}
					});
				}
			}
	module.exports=IbMsg.init();
})
