define(function(require, exports, module) {
	var PUBLIC={
        init:function(){
          PUBLIC.fastClick();
        },
				//接口前缀域名
				getUrlHeader: function() {
					var baseUrl = {
						'forex': 'https://shop.fmtxt.com'
					};
					return baseUrl;
				},
				//获取url参数
				getQueryString:function(name)
				{
				 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				 var r = window.location.search.substr(1).match(reg);
				 if(r!=null)return  decodeURI(r[2]); return null;
			  },
				//检测是否登陆
				checkLogin: function(callBack, error) {
			    var url = PUBLIC.getUrlHeader()['forex']+"/wap/customer/login-data.do?format=json&jsoncallback=?";
					$.getJSON(url, function(res) {
						if (res && res.code == 10000) {
							callBack && callBack(res);
						} else {
							error && error(data);
						}
					});
				}
	};
	module.exports=PUBLIC;
})
