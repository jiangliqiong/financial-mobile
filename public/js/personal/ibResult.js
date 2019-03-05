define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	var userType;
	var RESULT={
        init:function(){
					PUBLIC.checkLogin(function(res){
								userType = res.result ? res.result.type : '';
								RESULT.showBack()
					})
         RESULT.showBack();
        },
				showBack: function() {
           var list = $('.hot-retail-list .back-val');
					 $(list).each(function(i,o){
						 var ibBack = $(o).attr('data-ib');
						 var customerBack = $(o).attr('data-customer');
						 if(userType == '2') {
							 if(ibBack) {
								 $(o).text('$'+ibBack+'/每手');
							 }else {
								 $(o).html('&nbsp;');
							 }
						 }else {
							 if(customerBack) {
								 $(o).text('$'+customerBack+'/每手');
							 }else {
								 $(o).html('&nbsp;');
							 }
						 }
						 $(o).removeAttr('data-ib,data-customer');
					 })
				}
			}
	module.exports=RESULT.init();
})
