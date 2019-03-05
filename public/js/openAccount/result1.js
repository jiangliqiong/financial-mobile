 var resultShow = {
	init:function(){
        this.eventBind();
        this.getHtml(1);
	},
	//活动的时候
    getHtml:function(id){
    	wapApi.getDuiBa.data.uid = id;
        wapApi.$ajax(wapApi.getDuiBa,function(data){
			if(data.result.code==10000){
				$("#duiba").attr("src",data.result.obj);
			}
		})
    },
	eventBind:function(){
		var that = this;
		$("#duiba").css("height",$(window).height()-$(".topbar").height()-15);
		$("#duiba").css("width",$(window).width()-5);
	},
}
resultShow.init();