var list = {
	init:function(){
       this.eventBind();
	},
	eventBind:function(){
		$(".list").on("click",".item",function(){
			// $(".list .item.on").removeClass("on");
			// $(this).addClass("on");
			var id = $(this).attr("data-id");
			var pageref = commonMethod.getUrlParameter("pageref");
			if(pageref==2){
				window.location.href="/openAccount/index.html?brokerId="+id;
			}else{
				window.location.href="/openAccount/check.html?brokerId="+id;
			}
		})
	}
}
list.init();