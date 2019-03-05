var html = "";
var reftype = commonMethod.getUrlParameter("type");
var brokerId = commonMethod.getUrlParameter("brokerId");
var agId = commonMethod.getUrlParameter("agId");
var ibId = commonMethod.getUrlParameter("ibId");
var shareId = commonMethod.getUrlParameter("shareId");
var accountOpen = {
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
            brokerId = brokerId;
            if(customStateId > 0 ) { //说明已经登录
	            accountOpen.isOpenAccount();
	        }else{ //未登录
	            $(".customershow").show();
	            $("body").confirmLayer({"type":3,"msg":"您没有登录，快去登录页面先登录吧！"});
	            $(".confirmBtn").addClass("login_confirmbtn");
	            accountOpen.sexChecked(0);
	            $("#showCountry").html("中国");
	        } 
		})
    },
    isOpenAccount:function(){
        wapApi.hasAccount.data["customerId"] = window.datakey.result.id ;
        wapApi.hasAccount.data["broker_id"] = brokerId;
        wapApi.$ajax(wapApi.hasAccount,function(data){
            if(data.code===0){
                if(data.result.code==10000){
                	if(!reftype){
                        $(".customershow").show();
                	}
                	accountOpen.isReview(brokerId);
                }else{
                	if(brokerId=="1"&&!reftype){
                        $(".customershow").show();
                	}
                    accountOpen.callBackData(data,window.datakey.result.type);
                }
            }
        },function(data){
            $("body").confirmLayer({"type":3,"msg":data.msg});
        })
    },
    isReview:function(brokerId){//是否审核
        wapApi.isReview.data["customer_id"]  = window.datakey.result.id ;
        wapApi.$ajax(wapApi.isReview,function(data){
           if(data.code==0){
               if(data.result.code==10000){
                    var flag=0;
                }else if(data.result.code==10001){
                    var flag=1;
                }
                accountOpen.agentCheck(brokerId,flag);
           }else{
               console.log(data.result.detail);
           }
        })
    },
    agentCheck:function(brokerId,flag){
        wapApi.agentCheck.data.customer_id= window.datakey.result.id;
        wapApi.agentCheck.data.broker_id = brokerId;
        wapApi.$ajax(wapApi.agentCheck,function(data){
           if(data.code==0){
            	if(data.result.code==10000){
		            $(".customershow").show();
		            if(window.datakey.result.type=="2"){
                        $(".agenttip").show(); 
		            }
		            if(reftype=="IB"){
                       $("input[name='ibId']").val(ibId);
		            }else if(reftype && shareId){
                       $("input[name='open_introducer']").val(shareId); 
		            }else{
		           	   $(".open_introducer").show();
		            }
		           
	            }else if(data.result.code==10001){
                    if(reftype=="IB"){
                       $("input[name='ibId']").val(ibId);
                       $(".ibshow").show();
                       $(".customershow").hide();
		            }else if(reftype && shareId){
                       $("input[name='open_introducer']").val(shareId);
                       $(".ibshow").show();
                       $(".customershow").hide();
		            }else if(reftype=="customer"){
		               $("input[name='ibId']").val(data.result.obj.ib_id);
                       $(".ibshow").show();
                       $(".customershow").hide();
		            }else{
		           	   $("input[name='ibId']").val(data.result.obj.ib_id);
		           	   $(".customershow").show();
		            }
	            }else{
                    $(".customershow").show();
	            }   	
                wapApi.getBackData.data["customer_id"]  = window.datakey.result.id ;
                accountOpen.getUserData(flag); 
           }else{
               console.log(data.result.detail);
           }
        })
    },
    getUserData: function(flag){ //获取回显数据
        var that = this;
        wapApi.$ajax(wapApi.getBackData,function(data){
            var byear,bmonth,bday;
            if(data.code == 0 && data.result && data.result.code == 0){ //有回显数据的时候
                dataall = data.result.obj;
                dealvariety = dataall.dealvariety;
                var birth = dataall.birthday.split("-");
                var birthkey = {"y":birth[0],"m":birth[1],"d":birth[2]};
                isOpenFlag =  dataall.is_checked;
                if(isOpenFlag==0&&flag==0){//未实名已开户未审核
                    isOpenFlag=0;
                }
                if(isOpenFlag==0&&flag==1 || isOpenFlag==1&&flag==1){//未实名已开户已审核,//已实名已开户已审核
                    isOpenFlag=1;
                }
                if(isOpenFlag==1&&flag==0){//已实名已开户未审核
                    isOpenFlag=2;
                }
                that.dealUserData(isOpenFlag,dataall);
            }else{
            	$(".open_header").show();
                $(".open_form").show();
	            that.sexChecked(0);
	            $("#showCountry").html("中国");
            }
        })
    },
    sexChecked:function(index){
    	$(".sex .radio").eq(index).addClass("checked");
    	$(".sex .radio").eq(index).html("&#xe70d;");
    	$("input[name='sex']").eq(index).attr("checked","checked");
    },
    dealUserData:function(isOpenFlag,dataall){
        var arr = ['firstName','lastName','email','regiondesc','post_code','idnumber','birthday','country_id','province_id','cityid'];
        var arr1 = ['name','sex','birthday','email','countryName','location','regiondesc','post_code','telphone','idnumber','is_checked'];
        $("#showArea").attr("data-province",dataall.province_id).attr("data-city",dataall.cityid);
        for(var i=0;i<arr.length;i++){
        		$("input[name='"+arr[i]+"']").val(dataall[arr[i]]);
        }
        for(var i=0;i<arr1.length;i++){
        	if(arr1[i]=="name"){
        		$("dd[datashow='name']").text(dataall.firstName+dataall.lastName);
        	}else if(arr1[i]=="is_checked"){
                if(dataall["is_checked"]=="1"){
                    $("dd[datashow='"+arr1[i]+"']").text("已认证");
                }
        	}else if(arr1[i]=="location"){
                 $("dd[datashow='location']").text(dataall.provinceNmae+dataall.cityName);
        	}else{
                $("dd[datashow='"+arr1[i]+"']").text(dataall[arr1[i]]);
        	}
        }

        if(dataall.image_url1){
        	accountOpen.ImgSet(dataall.image_url1,"1");
        }
        if(dataall.image_url2){
        	accountOpen.ImgSet(dataall.image_url2,"2");
        }
         if(dataall.bank_url){
        	accountOpen.ImgSet(dataall.bank_url,"3");
        }
        $(".open_header").show();
        if(isOpenFlag==1||isOpenFlag==2){//已经实名
        	$("input[name='idnumber']").attr("disabled","disabled");
        	$("input[name='firstName']").attr("disabled","disabled");
        	$("input[name='lastName']").attr("disabled","disabled");
        	if(isOpenFlag==1){//已经审核
        	    $(".opencont").eq(1).hide();
        	    $(".openInfo").show();
        	    $(".smallbtn").eq(0).hide();
        	    $(".smallbtn").css({"width":"100%","float":"none"});
            }else{//未审核
                $(".open_form").show();
                $(".photoshow").hide();
            }
        }else{//未实名
            $(".open_form").show();
            $(".photoshow").hide();
        }
        
        var date = dataall.birthday.split("-");
        $("#showDate").html(dataall.birthday).attr("data-year",date[0]).attr("data-month",parseFloat(date[1])).attr("data-date",parseFloat(date[2]));
        $("#showCountry").html(dataall.countryName)
        $("#showArea").html(dataall.provinceNmae+" "+dataall.cityName);
        if(dataall.sex=="女士"){
        	accountOpen.sexChecked(1);
        }else{
            accountOpen.sexChecked(0);
        }
        var keyflag = true;
        for(var i=0;i<$(".open_form input").length;i++){
        	if($(".open_form input").eq(i).val()==""){
    			if(i!=0&&i!=1&&i!=2&&i!=15&&i!=17&&i!=19){
                    keyflag = false;
    		    }
        	}
        }
		if(keyflag==true){
			$(".smallbtn").eq(1).attr("class","smallbtn able submitData");
		}else{
			$(".smallbtn").eq(1).attr("class","smallbtn disable");
		}
    },
    jumpUrlBefore:function(){
        var href="";
        if(reftype=="IB"){
        	if(shareId){
        	    href = "/openAccount/check.html?brokerId="+brokerId+"&agId="+agId+"&ibId="+ibId+"&type="+reftype+"&shareId="+shareId;
        	}else{
        	    href = "/openAccount/check.html?brokerId="+brokerId+"&agId="+agId+"&ibId="+ibId+"&type="+reftype;
        	}
        }else if(reftype=="customer"){
           if(shareId){
    		    href =  "/openAccount/check.html?brokerId="+brokerId+"&type="+reftype+"&shareId="+shareId;
	    	}else{
	    		href =  "/openAccount/check.html?brokerId="+brokerId+"&type="+reftype;
	    	}
        }else{
            href = "/openAccount/check.html?brokerId="+brokerId
        }
    	
        window.location.href = href;   
    },
    jumpUrlNext:function(flag){
        var href = "";
        if(reftype == "IB"){
        	if(shareId){
        	    href = "/openAccount/result.html?brokerId="+brokerId+"&agId="+agId+"&ibId="+ibId+"&type="+reftype+"&flag="+flag+"&shareId="+shareId;
        	}else{
        	    href = "/openAccount/result.html?brokerId="+brokerId+"&agId="+agId+"&ibId="+ibId+"&type="+reftype+"&flag="+flag;
        	}
        }else if(reftype == "customer"){
        	if(shareId){
	            href =  "/openAccount/result.html?brokerId="+brokerId+"&type="+reftype+"&flag="+flag+"&shareId="+shareId;
	        }else{
	        	href =  "/openAccount/result.html?brokerId="+brokerId+"&type="+reftype+"&flag="+flag;
	        }
        }else{
        	href = "/openAccount/result.html?brokerId="+brokerId+"&flag="+flag; 
        }
        window.location.href=href;
    },
	eventBind:function(){

		$(".editInfo").click(function(){
             $(".open_form").show();
             $(".openInfo").hide();
		})

		$('body').on('touchstart', function(event) {
            $(".open_form input").blur();
        })
	    var showCountryDom = document.querySelector('#showCountry');
		var countryIdDom = document.querySelector('#countryId');
		showCountryDom.addEventListener('click', function () {
		    var countryId = showCountryDom.dataset['id'];
		    var coutryName = showCountryDom.dataset['value'];
		    wapApi.getCountry.data.cityflag="1";
		    wapApi.$ajax(wapApi.getCountry,function(data){
		    	    var arr = [];
		            for(var i=0;i<data.result.length;i++){
		            	arr[i] = {"id":"","value":""};
		                arr[i].id = data.result[i].cityid;
		                arr[i].value = data.result[i].name;
		            }
		            var bankSelect = new IosSelect(1, 
		            [arr],
		            {
		                container: '.container',
		                title: '国家选择',
		                itemHeight: 50,
		                itemShowCount: 3,
		                oneLevelId: countryId,
		                callback: function (selectOneObj) {
		                    countryIdDom.value = selectOneObj.id;
		                    showCountryDom.innerHTML = selectOneObj.value;
		                    showCountryDom.dataset['id'] = selectOneObj.id;
		                    showCountryDom.dataset['value'] = selectOneObj.value;
		                    $("#showArea").html("").attr("data-province","").attr("data-city","");
		                    $("input[name='province_id']").val("");
		                    $("input[name='cityid']").val("");
		                    accountOpen.setNextBtn();  
		                }
		        });
		    })    
		});
        
       $(".open_header").on("click",'.showTab',function(){
       	    window.location.href = reftype ? "/openAccount/list.html?brokerId="+brokerId+"&type="+reftype+"&pageref=2" : "/openAccount/list.html?brokerId="+brokerId+"&pageref=2";
        })

        $(".smallbtn").eq(0).click(function(){
        	accountOpen.jumpUrlBefore();
        })

		var selectAreaDom = $('#selectArea');
		var showAreaDom = $('#showArea');
		showAreaDom.attr('data-province', areaData1);
		showAreaDom.attr('data-city', areaData2);
		var areaData1 = function(callback) {
		    wapApi.getProvince.data.cityid=$("#countryId").val();
		    wapApi.$ajax(wapApi.getProvince,function(data){
		    	callback(formData(data));
		    })
		}
		function formData(data){
			    var arr = [];
			     for(var i=0;i<data.result.length;i++){
		        	arr[i] = {"id":"","value":""};
		            arr[i].id = data.result[i].cityid;
		            arr[i].value = data.result[i].name;
		        }
		     return arr;
		}
		var areaData2 = function (areaData1,callback) {
			wapApi.getProvince.data.cityid = areaData1;
		    wapApi.$ajax(wapApi.getProvince,function(data){
		    	callback(formData(data));
		    })
		};
		selectAreaDom.bind('click', function () {
			if($("#countryId").val()==""){
				$("body").mildHintLayer({"type":3,"msg":"请先选择国家"});
				return;
			}
		    var oneLevelId = showAreaDom.attr('data-province');
		    var twoLevelId = showAreaDom.attr('data-city');
		    var iosSelect = new IosSelect(2, 
		        [areaData1 , areaData2],
		        {
		            title: '地区选择',
		            itemHeight: 35,
		            relation: [1, 1],
		            oneLevelId: oneLevelId,
		            twoLevelId: twoLevelId,
		            callback: function (selectOneObj, selectTwoObj) {
		                showAreaDom.attr('data-province', selectOneObj.id);
		                showAreaDom.attr('data-city', selectTwoObj.id);
		                showAreaDom.html(selectOneObj.value + ' ' + selectTwoObj.value);
		                $("input[name='province_id']").val(selectOneObj.id);
		                $("input[name='cityid']").val(selectTwoObj.id);
		                 accountOpen.setNextBtn();
		            }
		    });
		});

		var selectDateDom = $('#selectDate');
		var showDateDom = $('#showDate');
		// 初始化时间
		var now = new Date();
		var nowYear = now.getFullYear();
		var nowMonth = now.getMonth() + 1;
		var nowDate = now.getDate();
		    // 数据初始化
		function formatYear (nowYear) {
		    var arr = [];
		    for (var i = nowYear - 100; i <= nowYear; i++) {
		        arr.push({
		            id: i + '',
		            value: i + '年'
		        });
		    }
		    return arr;
		}
		function formatMonth () {
		    var arr = [];
		    for (var i = 1; i <= 12; i++) {
		        arr.push({
		            id: i + '',
		            value: i + '月'
		        });
		    }
		    return arr;
		}
		function formatDate (count) {
		    var arr = [];
		    for (var i = 1; i <= count; i++) {
		        arr.push({
		            id: i + '',
		            value: i + '日'
		        });
		    }
		    return arr;
		}
		var yearData = function(callback) {
		    callback(formatYear(nowYear))
		}
		var monthData = function (year, callback) {
		    callback(formatMonth());
		};
		var dateData = function (year, month, callback) {
		        if (/^1|3|5|7|8|10|12$/.test(month)) {
		            callback(formatDate(31));
		        }else if (/^4|6|9|11$/.test(month)) {
		            callback(formatDate(30));
		        }else if (/^2$/.test(month)) {
		            if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
		                callback(formatDate(29));
		            }
		            else {
		                callback(formatDate(28));
		            }
		        }else {
		            throw new Error('month is illegal');
		        }
		};
		selectDateDom.bind('click', function () {
		    var oneLevelId = showDateDom.attr('data-year');
		    var twoLevelId = showDateDom.attr('data-month');
		    var threeLevelId = showDateDom.attr('data-date');
		    var iosSelect = new IosSelect(3, 
		        [yearData, monthData, dateData],
		        {
		            title: '出生日期选择',
		            itemHeight: 35,
		            relation: [1, 1],
		            oneLevelId: oneLevelId,
		            twoLevelId: twoLevelId,
		            threeLevelId: threeLevelId,
		            callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
		                showDateDom.attr('data-year', selectOneObj.id);
		                showDateDom.attr('data-month', selectTwoObj.id);
		                showDateDom.attr('data-date', selectThreeObj.id);
		                if(selectTwoObj.id.length==1){
		            		selectTwoObj.id = "0"+selectTwoObj.id;
		            	}
		            	if(selectThreeObj.id.length==1){
		            		selectThreeObj.id = "0"+selectThreeObj.id;
		            	}
		                showDateDom.html(selectOneObj.id + '-' + selectTwoObj.id + '-' + selectThreeObj.id);
		                $("input[name='birthday']").val(selectOneObj.id + '-' + selectTwoObj.id + '-' + selectThreeObj.id);
		                 accountOpen.setNextBtn();
		            }
		    });
		});


		$(".sex").click(function(){
			if(!$(this).find(".radio").hasClass("checked")){
				$(".sex").find(".radio").html("&#xe724;")
				$(".sex").find(".radio.checked").removeClass("checked");
				$(this).find(".radio").addClass("checked");
				$(this).find(".radio").html("&#xe70d;");
			}
		})

		$("body").on("click",".login_confirmbtn",function(){
			window.location.href="/login.html?ref="+Base64.encode(window.location.href);
		})

		$(".agenttip .close").click(function(){
			$(".agenttip").hide();
		})

		$(".upload").on("change",".fileImage",function(){
			var that = $(this);
			var i = that.attr("i");
			var simpleFile = that[0].files[0];
		    if(!/image\/\w+/.test(simpleFile.type)) {
		    	$("body").mildHintLayer({"type":2,"msg":'请选择图片文件'});
		        return false;
		    }
		    var reader = new FileReader();
		    // 将文件以二进制文件读入页面中
		    if(that.next("div").find("img").length){
		    	that.next("div").find("img").attr("src","/images/common/small-loading.gif").attr("width","").attr("style","margin-top:0.7rem;");		    
		    }else{
		    	that.next("div").html('<img src="/images/common/small-loading.gif" style="margin-top:0.7rem;">');	    
		    }		    
		    reader.onload = function(f){
		        var src = f.target.result;
		        var formData = new FormData();
		        formData.append("file",simpleFile);
			    $.ajax({
			    	url:'/api/upload',
			    	type:'post',
			    	data:formData,
			    	dataType: "json",
			    	cache: false,//上传文件无需缓存
	                processData: false,//用于对data参数进行序列化处理 这里必须false
	                contentType: false, //必须
			    	success:function(data){
			    		if(data.res==false){
                            $("body").mildHintLayer({"type":2,"msg":'文件大小超出限制'});
			    		}else{
			    			if(i==3){
			    				that.siblings("div").html('<img src ="'+data.url+'" width="100%" i="'+i+'"/><input type="hidden" name="bank_url" class="bank_url" value="'+data.url+'"/>');
				    		}else{
				    			that.siblings("div").html('<img src ="'+data.url+'" width="100%" i="'+i+'"/><input type="hidden" name="fileImg'+i+'"  class="fileImage'+i+'" value="'+data.url+'"/>');
				    		}
				            sessionStorage.setItem("img"+i,data.url);
				            accountOpen.setNextBtn();
			    		}
			    	},
			    	error:function(data){
			    		$("body").mildHintLayer({"type":2,"msg":'服务开小差了'});
			    		accountOpen.setNextBtn();
			    	}
			    })
		    }
		    reader.readAsDataURL(simpleFile);
		})

		$(".open_form input[type='text'],.open_form input[type='tel'],.open_form input[type='number']").keyup(function(){
			if($(this).val()){
               $(this).parent("h4").find(".deleteicon").css("opacity","1");
		    }else{
		   	   $(this).parent("h4").find(".deleteicon").css("opacity","0");
		    }
		    accountOpen.setNextBtn();
		})

		$(".open_form input[type='text'],.open_form input[type='tel'],.open_form input[type='number']").focus(function(){
		   if($(this).val()){
               $(this).parent("h4").find(".deleteicon").css("opacity","1");
		   }
		})

		$(".open_form input[type='text'],.open_form input[type='tel'],.open_form input[type='number']").blur(function(){
			$(this).parent("h4").find(".deleteicon").css("opacity","0");
		})

		$(".deleteicon").click(function(){
        	$(this).parent().find("input").val("");
        	$(this).css("opacity","0");
        	 accountOpen.setNextBtn();
        })

        $("body").on("click",".changePage",function(){
        	window.location.href = "/personal/tradingAccount.html";
        })

        $(".submit").click(function(){
        	var _arr = $(".open_form").serializeArray();
            var data = {};
            $.each(_arr,function(index,value){
                var key = value.name,val = value.value;
                data[key] = val ;
            });
            var birth = data.birthday.split("-");
            data.name =  $.trim($('input[name="firstName"]').val())+" "+$.trim($('input[name="lastName"]').val());
            data.customerId = window.datakey.result.id;
            data.broker_id = brokerId;
            data.birthday_n = birth[0];
            data.birthday_y = birth[1];
            data.birthday_d = birth[2];
            data.type_id = "idcard";
            data.telphone = window.datakey.result.phone;
            delete data.birthday;
            accountOpen.submitData(data);
        })

        $(".submitData").click(function(){
        	if($(this).hasClass("able")){
	        	var _arr = $(".open_form").serializeArray();
	            var data = {};
                $.each(_arr,function(index,value){
                    var key = value.name,val = value.value;
                    data[key] = val ;
                });
                var birth = data.birthday.split("-");
                data.name =  $.trim($('input[name="firstName"]').val())+" "+$.trim($('input[name="lastName"]').val());
                data.customerId = window.datakey.result.id;
                data.broker_id = brokerId;
                data.birthday_n = birth[0];
                data.birthday_y = birth[1];
                data.birthday_d = birth[2];
                data.type_id = "idcard";
                data.telphone = window.datakey.result.phone;
                delete data.birthday;
	            var openmobile  = $("input[name='open_introducer_mobile']");
                if(openmobile.val()){
	                    var reg = /^\d{11}$/;
	                    if(reg.test(openmobile.val())){
                            if(openmobile.val() == window.datakey.result.phone){
                            	$("body").mildHintLayer({"type":2,"msg":$("input[name='open_introducer_mobile']").attr("title")+'不能为开户人'})
                                return false;
                            }else{
                            	accountOpen.phoneNumCheck(openmobile.val(),openmobile,data);
                            }
	                    }else{
	                    	$("body").mildHintLayer({"type":2,"msg":'请输入正确的介绍人手机号'});
	                    	return false;
	                    }
	            }else{
	            	if(accountOpen.checkVaidate()){
                        accountOpen.submitData(data);
	            	}
	            }
	        }
        }) 
	},


	submitData:function(data){
		var obj = $('.submitData');
		if(obj.hasClass('noclick')) return false;
		obj.addClass('noclick');
		wapApi.submitData.data = data;
        wapApi.$ajax(wapApi.submitData,function(data){
            obj.removeClass('noclick');
            var flag=1;
            accountOpen.jumpUrlNext(1);
        },function(data){
            obj.removeClass('noclick');
           $("body").confirmLayer({"type":3,"msg":"提交失败啦！"+data.result});
        });
	},
	validateInput:function(obj,name,val,title){
        // 正则表达式
        var flag = "";
        var regExp = {
            firstName : /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/,   //姓名验证规则
            lastName : /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/,   //姓名验证规则
            email : /^[\w\.\-]+@\w*[\.\w*]/,  //邮箱的验证规则
            post_code : /^[1-9,][0-9]{5}$/  //邮政编码的验证规则
        };
        if(regExp[name].test(val)){
        	flag = true;
        }else{
	        flag = false;
	    }
	    return flag;
	},
	checkVaidate:function(){
		var check = true;
        var inputArr = ["firstName","lastName","birthday","email","post_code","idnumber"];
        for(var i = 0; i < inputArr.length; i++){
        	if(inputArr[i]=="birthday"){
                if(!accountOpen.birthDayCheck($("input[name='"+inputArr[i]+"']"),$("input[name='"+inputArr[i]+"']").val())){
                   check = false;
                   return false;
                }
            }else if(inputArr[i]=="idnumber"){
            	if($("input[name='idnumber']").attr("disabled")!="disabled"){
            		if(!accountOpen.checkIdCardNo($("input[name='"+inputArr[i]+"']"),$("input[name='"+inputArr[i]+"']").val())){
	                   $("body").mildHintLayer({"type":2,"msg":"身份证号码填写错误"});
	                   check = false;
	                   return false;
                   }
            	}else{
                   check = true;
                   return true;
            	}
            }else if(!accountOpen.validateInput($("input[name='"+inputArr[i]+"']"),inputArr[i],$.trim($("input[name='"+inputArr[i]+"']").val()),$("input[name='"+inputArr[i]+"']").attr("title"))){
            	$("body").mildHintLayer({"type":2,"msg":$("input[name='"+inputArr[i]+"']").attr("title")+"填写错误"});
            	check = false;
            	return false;
            }
        }
        return check;
	},
	phoneNumCheck:function(num,obj,data1){
        wapApi.phoneNumCheck.data.mobile = num;
        wapApi.$ajax(wapApi.phoneNumCheck,function(data){
           if(data.result.code==40001){
              	$("body").mildHintLayer({"type":2,"msg":"介绍人手机号码不是本平台注册会员"});
                return false;
           }else if(data.result.code==10000){
                $("input[name='open_introducer']").val(data.result.obj.open_introducer);
                if(accountOpen.checkVaidate()){
                	data1.open_introducer = data.result.obj.open_introducer;
                	accountOpen.submitData(data1);
                }
           }
        },function(){
        	$("body").mildHintLayer({"type":2,"msg":data.result.detail});
           	return false;
        })
    },
    getAge: function(birthDay){ 
        var returnAge, birthdayArr = birthDay.split("-");
        var birthYear = birthdayArr[0], birthMonth = birthdayArr[1], birthDay = birthdayArr[2];
        var date = new Date();
        var nowYear = date.getFullYear();
        var nowMonth = date.getMonth() + 1;
        var nowDay = date.getDate();
        if(nowYear == birthYear){
            returnAge = 0;//同年 则为0岁
        }else{
            var ageDiff = nowYear - birthYear ; //年之差
            if(ageDiff > 0){
            	if(ageDiff>18 && ageDiff<65){
            		returnAge = ageDiff ;
            	}else if(ageDiff < 18){
            		returnAge = ageDiff ;
            	}else{
            		if(nowMonth == birthMonth){
                        var dayDiff = nowDay - birthDay;//日之差
                        if(dayDiff < 0){
                            returnAge = ageDiff - 1;
                        }else{
                            returnAge = ageDiff + 1;
                        }
                    }else{
                        var monthDiff = nowMonth - birthMonth;//之差
                        if(monthDiff < 0){
                           returnAge = ageDiff -1;
                        }else if(monthDiff>0){
                           returnAge = ageDiff+1 ;
                        }
                    }
            	}
            }else{
                returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
            }
        }
        return returnAge;//返回周岁年
    },
    birthDayCheck: function(obj, birthDay){
    	var flag = true;
        if(accountOpen.getAge(birthDay) > 65){
        	$("body").mildHintLayer({"type":2,"msg":"您已经超过65周岁，无法提交开户"});
            flag = false;
        }else if(accountOpen.getAge(birthDay) < 18){
        	$("body").mildHintLayer({"type":2,"msg":"您还不满18周岁，无法提交开户！"});
            flag = false;
        }
        return flag;
    },
    parityBit: ["1","0","X","9","8","7","6","5","4","3","2"],
    checkIdCardNo: function(obj,idCardNo,title){
            var that = this;
            //15位和18位身份证号码的基本校验
            var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
            if(!check){
               
               return false;
            }else{
            	if(idCardNo.length==15){//判断长度为15位或18位
                    return check15IdCardNo(obj, idCardNo, title);
	            }else if(idCardNo.length==18){
	                return check18IdCardNo(obj, idCardNo, title);
	            }else{
	                return false;
	            }
            }
           
            //进行身份证验证或者护照验证的方法
            function checkAddressCode(addressCode){
                var provinceAndCitys = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
                31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",
                45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
                65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}; 
                var check = /^[1-9]\d{5}$/.test(addressCode);
                if(!check) return false;
                if(provinceAndCitys[parseInt(addressCode.substring(0,2))]){
                    return true;
                }else{
                    return false;
                }
            }
            function checkBirthDayCode(obj, birDayCode,title){
                var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
                if(!check){
                  return false;
                }else{
	                var yyyy = parseInt(birDayCode.substring(0,4),10);
	                var mm = parseInt(birDayCode.substring(4,6),10);
	                var dd = parseInt(birDayCode.substring(6),10);
	                var xdata = new Date(yyyy,mm-1,dd);
	                if(xdata > new Date()){
	                    return false;//生日不能大于当前日期*/
	                }else if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) ){
	                   return true;
	                }else{
	                  return false;
	                }
	            }
            }
            function getParityBit(idCardNo){
                var id17 = idCardNo.substring(0,17);
                var powers = ["7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"];
                var power = 0;
                for(var i=0;i<17;i++){
                    power += parseInt(id17.charAt(i),10) * parseInt(powers[i]);
                }
                var mod = power % 11;
                return that.parityBit[mod];
            }
            function checkParityBit(obj,idCardNo,title){
                var parityBit = idCardNo.charAt(17).toUpperCase();
                if(getParityBit(idCardNo) == parityBit){
                   return true;
                }else{
                   return false;
                }
            }
            function check15IdCardNo(obj,idCardNo,title){ //校验15位的身份证号码
                //15位身份证号码的基本校验
                var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
                if(!check){
                  
                  return false;
                }else{
                	//校验地址码
	                var addressCode = idCardNo.substring(0,6);
	                check = checkAddressCode(addressCode);
	                if(!check){
	                  
	                  return false;
	                }else{
	                	 var birDayCode = '19' + idCardNo.substring(6,12);
		                //校验日期码
		                return checkBirthDayCode(obj, birDayCode,title);
	                }
                }
                
               
            }
            //校验18位的身份证号码
            function check18IdCardNo(obj,idCardNo,title){
               //18位身份证号码的基本格式校验
                var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
                if(!check){
                  
                  return false;
                }else{
                	 //校验地址码
	                var addressCode = idCardNo.substring(0,6);

	                //校验生日码;
	                var birDayCode = idCardNo.substring(6,14);


	                if(checkAddressCode(addressCode)){
                       if(checkBirthDayCode(obj, birDayCode,title)){
                           if(checkParityBit(obj, idCardNo,title)){
                              return true;
                           }else{
                           	  return false;
                           }
                       }else{
							return false;
                       }
	                }else{
	                	return false;
	                }
                }
            }
            function formateDateCN(day){
                var yyyy =day.substring(0,4);
                var mm = day.substring(4,6);
                var dd = day.substring(6);
                return yyyy + '-' + mm +'-' + dd;
            }
            //获取信息
            function getIdCardInfo(idCardNo){
                var genders = {male:"男",female:"女"};
                var idCardInfo = {
                    gender:"", //性别
                    birthday:"" // 出生日期(yyyy-mm-dd)
                };
                if(idCardNo.length == 15){
                    var aday = '19' + idCardNo.substring(6,12);
                    idCardInfo.birthday = formateDateCN(aday);
                    if(parseInt(idCardNo.charAt(14))%2 == 0){
                        idCardInfo.gender = genders.female;
                    }else{
                        idCardInfo.gender = genders.male;
                    }
                }else if(idCardNo.length == 18){
                    var aday = idCardNo.substring(6,14);
                    idCardInfo.birthday = formateDateCN(aday);
                    if(parseInt(idCardNo.charAt(16))%2 == 0){
                        idCardInfo.gender = genders.female;
                    }else{
                        idCardInfo.gender = genders.male;
                    }
                }
                return idCardInfo;
            }
            function getId15(idCardNo){
                if(idCardNo.length==15){
                    return idCardNo;
                }else if(idCardNo.length==18){
                    return idCardNo.substring(0,6) + idCardNo.substring(8,17);
                }else{
                    return null;
                }
            }
            function  getId18(idCardNo){
                if(idCardNo.length==15){
                    var id17 = idCardNo.substring(0,6) + '19' + idCardNo.substring(6);
                    var parityBit = getParityBit(id17);
                    return id17 + parityBit;
                }else if(idCardNo.length==18){
                    return idCardNo;
                }else{
                    return null;
                }
            }
        },
	setNextBtn:function(){
        var flag = "1";
        var _arr = $(".open_form").serializeArray();
        if(brokerId!=1&&_arr.length==14){
        	flag = "2";
        }else{
        	flag = accountOpen.valueEmptyCheck(_arr,flag);
        }
        if(flag=="1"){
        	$(".smallbtn").eq(1).attr("class","smallbtn able submitData");
        }else{
        	$(".smallbtn").eq(1).attr("class","smallbtn disable");
        }
	},
    valueEmptyCheck:function(_arr,flag){
        $.each(_arr,function(index,value){
            var key = value.name,val = value.value;
            var keyarr = 'open_introducer open_introducer_mobile ibId';
            if(keyarr.indexOf(key)<=-1){
	            if(val==""){
	               flag="2";
	            }
            }else{
            	if(brokerId==1){
            		if($(".fileImage1").val()&&$(".fileImage2").val()){
	            		flag="1";
	            	}else{
	            		flag="2";
	            	}
            	}else{
            		if($(".fileImage1").val()&&$(".fileImage2").val()){
	            		flag="1";
	            	}else{
	            		flag="2";
	            	}
            	}
            }
        });
        return flag;
    },
	callBackData:function(data,type){
	    $(".open_form").hide();
	    $(".btnshow").hide();
	    $("body").confirmLayer({"type":3,"msg":data.result.detail,"btntxt":"查看开户信息"});
	    $(".confirmBtn3").addClass("changePage");
	    accountOpen.isReview(brokerId);
	},
	ImgSet:function(data,i){
		if(i==3){
		    $(".uploaddiv").eq(i-1).html('<input type="file" name="bank_url" i="'+i+'" class="fileImage"/><div><img src="'+data+'" width="100%" i="'+i+'"><input type="hidden" name="bank_url" value="'+data+'" class="bank_url"/></div>');
		}else{
			$(".uploaddiv").eq(i-1).html('<input type="file" name="fileImg'+i+'" i="'+i+'" class="fileImage"/><div><img src="'+data+'" width="100%" i="'+i+'"><input type="hidden" name="fileImg'+i+'" value="'+data+'" class="fileImage'+i+'"/></div>');
		}

	}
}
accountOpen.init();