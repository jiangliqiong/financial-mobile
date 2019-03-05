var checkflag = 1;
var submitflag = 1;
var reftype = commonMethod.getUrlParameter("type");
var brokerId = commonMethod.getUrlParameter("brokerId");
var agId = commonMethod.getUrlParameter("agId");
var shareId = commonMethod.getUrlParameter("shareId");
var ibId = commonMethod.getUrlParameter("ibId");
var wait = 60;  
var checkOpen = {
	init: function(){
		this.showTabChange();
		this.eventBind();
        this.isLogin();
	},
	showTabChange:function(){
        if((reftype && reftype=="IB") || (reftype && reftype=="customer")){
        	$(".open_header dl").removeClass("showTab");
        }else{
        	$(".open_header dl").addClass("showTab");
        }
    },
	isLogin:function(){
	    wapApi.$ajax(wapApi.getLoginStatus,function(data){
            window.datakey = data;
            customStateId = window.datakey.result.id;
            if(customStateId > 0 ) { //说明已经登录
            	$(".tel").val(window.datakey.result.phone).attr("disabled","disabled");
            	$(".next-step").addClass("jumpbtn");
                if(!reftype){
                    $(".customershow").show();
                }else{
                    if(window.datakey.result.type==2){
                        checkOpen.agentCheck();
                    }else{
                        $(".customershow").show();
                    }
                }
                $('.getcheckcode').hide().next('.deleteicon').hide();$
            }else{ //未登录
                $(".opencont h4").eq(1).show();
                $(".customershow").show();
            } 
	    })
	},
    isOpenAccount:function(){
        wapApi.hasAccount.data["customerId"] = window.datakey.result.id ;
        wapApi.hasAccount.data["broker_id"] = brokerId;
        wapApi.$ajax(wapApi.hasAccount,function(data){
            if(data.code===0){
                if(data.result.code==10000){
                    checkOpen.jumpUrl();
                }else{
                    checkOpen.callBackData(data);
                }
            }
        },function(data){
            $("body").confirmLayer({"type":3,"msg":data.msg});
        })
    },
	agentCheck:function(){
        wapApi.agentCheck.data.customer_id= window.datakey.result.id;
        wapApi.agentCheck.data.broker_id = brokerId;
        wapApi.$ajax(wapApi.agentCheck,function(data){
            if(!reftype){
               
            }else{
                if(window.datakey.result.type==2){
                    if(data.result.code==10001){
                        $(".ibshow").show();
                    }else{
                        $(".customershow").show();
                        if($(".agenttip")){
                            $(".agenttip").show(); 
                        } 
                    }
                }else{
                    $(".customershow").show();
                }
            }
            wapApi.getBackData.data["customer_id"]  = window.datakey.result.id ;
        },function(){
            $("body").confirmLayer({"type":3,"msg":data.result.detail});
        })
    },
	jumpUrl:function(){
        if(reftype && shareId){
    		if(agId){
        		window.location.href="/openAccount/index.html?type="+reftype+"&agId="+agId+"&ibId="+ibId+"&brokerId="+brokerId+"&shareId="+shareId;
        	}else{
        		window.location.href="/openAccount/index.html?type="+reftype+"&brokerId="+brokerId+"&shareId="+shareId;
        	}
    	}else if(reftype){
    		if(agId){
        		window.location.href="/openAccount/index.html?type="+reftype+"&agId="+agId+"&ibId="+ibId+"&brokerId="+brokerId;
        	}else{
        		window.location.href="/openAccount/index.html?type="+reftype+"&brokerId="+brokerId;
        	}
    	}else{
    		window.location.href="../openAccount/index.html?brokerId="+brokerId;
    	}
	},
    doOpenAccount:function(mobile,brokerId,code){
    	submitflag = 2;
    	wapApi.doOpenAccount.data.mobile = mobile;
    	wapApi.doOpenAccount.data.broker_id = brokerId;
    	wapApi.doOpenAccount.data.code = code;
        wapApi.$ajax(wapApi.doOpenAccount,function(data){
        	var rescode = data.result.code;
            if(rescode === 10000){
            	var Days = 30;
				var exp = new Date();
				exp.setTime(exp.getTime() + Days*24*60*60*1000);
				document.cookie = 'isKeepAlive' + "="+ 1 + ";expires=" + exp.toGMTString()+ ";domain=" + "fmtxt.com" + ";path=" + "/" + "; ";
				checkOpen.jumpUrl();
            }else if(rescode === 10001){
            	var Days = 30;
				var exp = new Date();
				exp.setTime(exp.getTime() + Days*24*60*60*1000);
				document.cookie = 'isKeepAlive' + "="+ 1 + ";expires=" + exp.toGMTString()+ ";domain=" + "fmtxt.com" + ";path=" + "/" + "; ";
				checkOpen.jumpUrl();
            }else{
                $("body").confirmLayer({"type":3,"msg":data.result.detail});
            }
	        submitflag = 1;
	    },function(data){
	    	submitflag = 1;
	    	$("body").confirmLayer({"type":3,"msg":data.result.detail});
	    })
    },
    getCheckCode:function(mobile,obj){
    	checkflag=2;
        wapApi.getCheckCode.data.mobile = mobile;
        wapApi.$ajax(wapApi.getCheckCode,function(data){
            //$("body").confirmLayer({"type":3,"msg":"短信发送成功，请查收"});
            checkOpen.timeCount(obj);
            checkflag=1;
	    },function(data){
	        $("body").confirmLayer({"type":3,"msg":"短信发送太频繁了,请稍后再试"});
	    	checkflag=1;
	    })
    },
    timeCount:function(o){
        if (wait == 0) {
            if(/^1\d{10}$/.test($(".tel").val())){
                o.addClass("abled");
            }
            o.text("免费获取验证码");  
            wait = 60;  
        } else {  
            o.removeClass("abled");  
            o.text("重新发送(" + wait + ")");  
            wait--;  
            setTimeout(function() {  
                checkOpen.timeCount(o)  
            },1000)
        }
    },
	eventBind:function(){
		var that = this;
        $(".agenttip .close").click(function(){
            $(".agenttip").hide();
        })

		$(".tel").keyup(function(){
		    if($(".tel").val().length==11 && /^1\d{10}$/.test($(".tel").val())){
                $(".getcheckcode").addClass("abled");
			}else{
				 $(".getcheckcode").removeClass("abled");
			}
		})
      
		if($(".tel").val() && $(".tel").val().length==11  && /^1\d{10}$/.test($(".tel").val())){
			$(".getcheckcode").addClass("abled");
		}else{
			$(".getcheckcode").removeClass("abled");
		}

		if($(".tel").val().length==11 && $(".checkcode").val() && /^1\d{10}$/.test($(".tel").val())){
 			$(".next-step").attr("class","next-step able");
		}else{
			$(".next-step").attr("class","next-step");
		}
        
		$("input").keyup(function(){
            if($(this).val()){
                $(this).parent("h4").find(".deleteicon").css("opacity","1");
            }else{
                $(this).parent("h4").find(".deleteicon").css("opacity","0");
            }
			if( /^1\d{10}$/.test($(".tel").val()) && $(".tel").val().length==11 && $(".checkcode").val()){
                $(".next-step").attr("class","next-step able");
			}else{
				$(".next-step").attr("class","next-step");
			}
		})

        $("input").focus(function(){
            if($(this).val()){
                $(this).parent("h4").find(".deleteicon").css("opacity","1");
            }else{
                $(this).parent("h4").find(".deleteicon").css("opacity","0");
            }
        })
        
        $("input[type='tel']").blur(function(e){
            $(this).parent("h4").find(".deleteicon").css("opacity","0");
        })

	
        $(".deleteicon").click(function(e){
            $(this).parent('h4').find("input").val("");
            $(".getcheckcode").removeClass("abled");
            $(this).css("opacity","0");
        })
        

        $(".opencont h4").on("click",".abled",function(){//获取验证码倒计时
        	var mobile = $(".tel").val();
        	if(checkflag==1){
        		that.getCheckCode(mobile,$(this));
        	}
        }) 

        
        $("body").on("click",".able",function(){
        	var mobile = $(".tel").val();
        	var code = $(".checkcode").val();
        	if(submitflag==1){
        		that.doOpenAccount(mobile,brokerId,code);
        	}
        })

        $(".checkcode").on("input",function(){
            if($(".tel").val().length==11 && $(".checkcode").val()){
                $(".next-step").attr("class","next-step able");
            }else{
                $(".next-step").attr("class","next-step");
            }
        })
        
        $(".open_header").on("click",'.showTab',function(){
            window.location.href="/openAccount/list.html?brokerId="+brokerId+"&pageref=1";
        })
        
        $("body").on("click",".jumpbtn",function(){
            checkOpen.isOpenAccount();
        })
	},
    callBackData:function(data){
        $("body").confirmLayer({"type":3,"msg":data.result.detail,"btntxt":"查看开户信息"});
        $(".confirmBtn3").addClass("changePage");
    },
}
checkOpen.init();