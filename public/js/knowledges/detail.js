define(function(require, exports, module) {
	var PUBLIC = require('publicFn');
	//接口前缀
	var forex = PUBLIC.getUrlHeader()['forex'];
	var DETAIL={
		    networkWIFI: '',
        init: function(){
					DETAIL.checkNetwork()
					DETAIL.videoFn();
        },
				bind: function() {

				},
				checkNetwork: function() {
					var wifi = true;
							var ua = window.navigator.userAgent;
							var con = window.navigator.connection;
							// 如果是微信
							if(/MicroMessenger/.test(ua)){
									// 如果是微信6.0以上版本，用UA来判断
									if(/NetType/.test(ua)){
										if(ua.match(/NetType\/(\S*)/)[1] != 'WIFI'){
												wifi = false;
										}
									// 如果是微信6.0以下版本，调用微信私有接口WeixinJSBridge
									}else{
											document.addEventListener("WeixinJSBridgeReady",function onBridgeReady(){
													WeixinJSBridge.invoke('getNetworkType',{},function(e){
															if(e.err_msg != "network_type:wifi"){
																	wifi = false;
															}
													});
											});
									}
							// 如果支持navigator.connection
							}else if(con){
									var network = con.type;
									if(network != "wifi" && network != "2" && network != "unknown"){  // unknown是为了兼容Chrome Canary
											wifi = false;
									}
							};
					   DETAIL.networkWIFI = wifi;
				},
				//视频播放组件
				videoFn: function() {
					var video = new tvp.VideoInfo();
					var videoId = $('#kg-video').attr('data-vid');
					var videoPic = $('#kg-video').attr('data-pic');
					video.setVid(videoId);//视频vid
					var player = new tvp.Player();//视频高宽
					player.setCurVideo(video);
					player.addParam("autoplay","0");//是否自动播放，1为自动播放，0为不自动播放
					player.addParam("showend",0);
					player.addParam("adplay",0);
					player.addParam("wmode","transparent");
					player.addParam("controls","0");
					player.addParam("preload","none");
					player.addParam("pic",videoPic);//默认图片地址
					//  player.addParam("flashskin", "");//是否调用精简皮肤，不使用则删掉此行代码
					player.write("videoCon");

					//是否wifi判断
					if(!DETAIL.networkWIFI) {
						$('.not-wifi').show();
						$('.kg-video-bg').hide();
					};
					var video = document.getElementById('tenvideo_video_player_0');
					video.onplay = function() {
						var checkPlay=setInterval(function(){
							if(video.currentTime>0) {
								$('.video-loading').remove();
								clearInterval(checkPlay);
							};
						},50)
					}
					//点击继续播放事件
					$('body').on('click','.vide-play-btn',function(){
					  $('.video-mask').remove();
						$('.video-loading').show();
					  video.play();
					})
				}
			}
	module.exports=DETAIL.init();
})
