var resultShow = {
	init:function(){
        this.eventBind();
        this.isLogin();
	},
	//活动的时候
    isLogin:function(){
		wapApi.$ajax(wapApi.getLoginStatus,function(data){
            var brokerId = commonMethod.getUrlParameter("brokerId");
			window.datakey = data;
			customStateId = window.datakey.result.id;
            if(customStateId > 0 ) { //说明已经登录
				if(brokerId==1){
	            	// resultShow.getHtml(customStateId);
                }
	        }else{ //未登录
	            $("body").confirmLayer({"type":3,"msg":"您没有登录，快去登录页面先登录吧！"});
	        } 
		})
    },
    getHtml:function(id){
    	wapApi.getDuiBa.data.uid = id;
        wapApi.$ajax(wapApi.getDuiBa,function(data){
			if(data.result.code==10000){
				window.location.href=data.result.obj;
			}
		})
    },
	eventBind:function(){
		var that = this;
		$(".back-step").click(function(){
			that.jumpUrl();
		})
		$('body').off('click',"#backHistoryPage");
		$("#backHistoryPage").click(function(){
			that.jumpUrl();
		})
		$("#duiba").css("height",$(window).height()-$(".topbar").height()-15);
		$("#duiba").css("width",$(window).width()-5);
	},
	jumpUrl:function(){
		var reftype = commonMethod.getUrlParameter("type");
        var brokerId = commonMethod.getUrlParameter("brokerId");
        var shareId = commonMethod.getUrlParameter("shareId");
        var href = "";
        if(reftype == "customer"){
        	if(shareId){
        		href = "/traders/shop.html?brokerId="+brokerId+"&shareId="+shareId;
        	}else{
        		href = "/traders/shop.html?brokerId="+brokerId;
        	}
		}else if(reftype == "IB"){
			var agId = commonMethod.getUrlParameter("agId");
			var ibId = commonMethod.getUrlParameter("ibId");
			if(shareId){
        		href = "/traders/shop.html?brokerId="+brokerId+"&agId="+agId+"&ibId="+ibId+"&shareId="+shareId;
        	}else{
        		href = "/ib/detail.html?brokerId="+brokerId+"&agId="+agId+"&ibId="+ibId;
        	}
		}else{
		   href = "/";
		}
		window.location.href = href;
	}
}
resultShow.init();