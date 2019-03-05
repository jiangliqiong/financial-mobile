define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	require('tppl');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];

	var Activity={
		    userType: '',
        init:function(){
					PUBLIC.checkLogin(function(res) {
						Activity.userType = res.result.type;
						$.imgLazyLoad();
						Activity.getList();
					})
        },
				bind: function() {

				},
				getListScroll: function() {
					var _font = $('html').css('font-size').replace('px','');
					var _l = $('.list-ul li').length;
					var _w = 2.6*_font;
					$('.list-ul ul').css('width', _w*_l);
				},
				getList: function() {
					$.ajax({
						type: 'get',
						url: forex+'/front/find-parameter-broker-list.do?format=json&jsoncallback=?',
						data: {},
						dataType: 'jsonp',
						success: function(data) {
              if(data.code == 0 && data.result.obj) {
								var html = [];
								$(data.result.obj).each(function(i,o) {
									if(Activity.userType == 2) {
										var backVal = o.ib_back;
									}else {
										var backVal = o.customer_back;
									};
									var label = [];
									$(o.regulatorList).each(function(k,l) {
                    label.push(l.regulator_name);
									});
									var url = '/traders/shop.html?brokerId='+o.broker_id;
									html.push('<li>'
						       +'<div class="top">'
						       +'<img src="'+o.logo_url+'" alt="">'
						       +'</div>'
						       +'<p class="name">'+o.chinese_name+'</p>'
						       +'<p class="back"><b>$'+backVal+'</b>/每手</p>'
						       +'<p class="label">监管机构：'+label.join(' ')+'</p>'
						       +'<p class="line"></p>'
						       +'<p class="more-label">查看详情  &gt;</p>'
									 +'<a href="'+url+'"></a>'
						      +'</li>')
								})
                $('.list-ul ul').html(html.join(''));
								Activity.getListScroll();
							}
						}
					})
				}
			}
	module.exports=Activity.init();
})
