var map = {
	init:function(){
        this.eventBind();
	},
	getSearch:function(val){		
	    var api  = "https://restapi.amap.com/v3/assistant/inputtips?keywords="+val+"&key=72bfa3ee235677b7a7ef35cf0a91e72b";
		$.ajax({
			url:api,
			method:'get',
			function(data){
		      console.log(data);
			},
			error:function(){

			}
	    })  
	},
	eventBind:function(){
		var that = this;
        $(".input_search input").keyup(function(e){
        	if(e.keyCode==13){ 
               that.getSearch($(this).val());
            }
        })
	}
}
map.init();