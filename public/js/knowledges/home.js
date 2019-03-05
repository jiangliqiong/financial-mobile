define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	var HOME={
        init:function(){
          HOME.swiper()
        },
				bind: function() {

				},
        swiper:function(){
            function slideTab(a) {
                for (var b = bullets.length; b--;) bullets[b].className = bullets[b].className.replace("on", " ");
                var c=Math.floor(a/bullets.length);
                if(a>=bullets.length){
                    a=a-bullets.length*c;
                }
                bullets[a].className = "on"
            }
            for(var mySwipe = Swipe(document.getElementById("mySwipe"), {
                auto: 3e3,
                callback: function (a) {
                    slideTab(a);
                }
            }),bullets = document.getElementById("pager").getElementsByTagName("em"), i = 0; i < bullets.length; i++) {
                var elem = bullets[i];
                elem.setAttribute("data-tab", i)
            }
        }
			}
	module.exports=HOME.init();
})
