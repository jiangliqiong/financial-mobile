define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	var userType;
	var forex = PUBLIC.getUrlHeader()['forex'];
	var SUCCESS={
        init:function(){
					PUBLIC.checkLogin(function(res){
								userType = res.result ? res.result.type : '';
								SUCCESS.showBack();
								SUCCESS.refresh();
					})
        },
				showBack: function() {
           var list = $('.hot-retail-list .back-val');
					 $(list).each(function(i,o){
						 var ibBack = $(o).attr('data-ib');
						 var customerBack = $(o).attr('data-customer');
						 if(userType == '2') {
							 if(ibBack) {
								 $(o).html('<span>代理返佣：</span>'+'$'+ibBack+'/每手');
							 }else {
								 $(o).html('<span>代理返佣：</span>'+'0');
							 }
						 }else {
							 if(customerBack) {
								 $(o).html('<span>代理返佣：</span>'+'$'+customerBack+'/每手');
							 }else {
								 $(o).html('<span>代理返佣：</span>'+'0');
							 }
						 }
						 $(o).removeAttr('data-ib,data-customer');
					 })
				},
				refresh: function() {
					var url = forex+'/customer/refresh.do?format=json&jsoncallback=?';
        	$.getJSON(url,function(res){})
				}
			}
	module.exports=SUCCESS.init();
})
