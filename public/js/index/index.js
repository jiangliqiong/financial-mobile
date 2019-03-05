var swiperShow;
var indexShow = {
	init:function(){
        this.scrollTo();
        this.showContent();
        this.eventBind();
        this.resizeHeight();
	},
    //页面滚动，头部逐渐色变
    scrollTo:function () {
        window.onscroll = function(){
            var topHeight = document.documentElement.scrollTop || document.body.scrollTop;
            var xmHeight = $('#mySwipe').height();
            if(topHeight > xmHeight){
                $('.search').css("background",'-webkit-linear-gradient(304deg, #094494, #0a1f61)');
            }else{
                var opacity = (1/xmHeight)*topHeight;
                $('.search').css("background",'rgba(9,68,148,'+ opacity +')');
            }
        }
    },
		strategyTime: null,
		//策略滚动
		strategyTml: function() {
			var ul = $('.strategy-rt ul');
			var strategyHtml = ul.html();
			strategyHtml = strategyHtml + strategyHtml;
			ul.html(strategyHtml);
		},
		strategyScroll: function(status) {
			clearInterval(indexShow.strategyTime);
			var ul = $('.strategy-rt ul');
			var original = $('.strategy-rt ul li').length/2;
			var top = $('.strategy-rt ul').position().top;
			var height = $('.strategy-rt ul li').height();
			var end = original * height;
			indexShow.strategyTime = setInterval(function() {
				 top = top - height;
				 ul.animate({top: top},function() {
					 if(top == end) {
						 ul.css('top', 0);
						 top = 0;
					 }
				 })
			},3000)
		},
    showIbTips:function (id) {
        localStorage.setItem('ibTips', 'ibTips');
        wapApi.ibQualiValid.data = {customer_id:id};
        wapApi.$ajax(wapApi.ibQualiValid,function (res) {
            if( res.result && res.result.code == 10102 ){
                $('body').ibTipsLayer();
            }
        })
    },
    showContent:function(){
        var that = this;
        that.isLogin();
				that.strategyTml();
        if(window.location.href.indexOf("type=search")>-1){
            that.showSearchContent();
        }else{
            $(".searchdiv").hide();
            $(".indexdiv").show();
            $(".searchResult").hide();
            that.hotTraderShow();
            that.swiper();
					  that.strategyScroll();
        }
    },
    isLogin:function(){
        wapApi.$ajax(wapApi.getLoginStatus,function(data){
            window.datakey = data;
            customStateId = window.datakey.result.id;
            brokerId = commonMethod.getUrlParameter("id");
            if(customStateId > 0 ) { //说明已经登录
                $(".search span").html('<a href="/personal/index.html"><i class="icon iconfont login">&#xe71a;</i></a>');
                if(window.datakey.result.type==1){//交易商
                    $(".customerback").show();
                    var ibTips = localStorage.getItem('ibTips');
                    if(!ibTips){
                        indexShow.showIbTips(customStateId);
                    }
                }else{
                    $(".ibback").show();
                }

            }else{ //未登录
                var referer= Base64.encode(window.location.href);
               $(".search span").html('<a href="/login.html?ref='+referer+'">登录</a>');
               $(".customerback").show();
            }
        })
    },
    getSearchLink:function(val){
        var that = this;
        wapApi.$ajax(wapApi.searchLink,function(data){
            if(data.result.code==0 && data.result.obj){
                window.searchLinkData = data.result.obj;
                that.dealSearchLinkData(val);
            }
        })
    },
    getSearchResult:function(val){
        var that = this;
        wapApi.searchResult.data.keywords = val;
        wapApi.$ajax(wapApi.searchResult,function(data){
            if(data.result.code==0 && data.result.obj){
                that.dealSearchResultData(data.result.obj);
            }
        })
    },
    showResult:function(){
        var that = this;
        $(".searchResult").show();
        $(".hot").hide();
        $(".history").hide();
        $("#searchform input").blur();
        $(".searchnull").hide();
    },
    dealSearchResultData:function(data){
        var html1 = "",html2 = "";
        var that = this;
        if(data.brokerlist){
           for(var i = 0; i<data.brokerlist.length; i++){
               var list = data.brokerlist[i];
               var str = '';
               if(window.datakey.result.type&&window.datakey.result.type==2){
                   var ib_back = list.ib_back ? list.ib_back : "0";
                   str = '<p>代理返佣：<span>$'+ib_back+'/手</span></p>';
               }else{
                   var customer_back = list.customer_back ? list.customer_back : "0";
                   str = '<p>外汇返佣：<span>$'+customer_back+'/手</span></p>';
               }
               var min_price = list.min_price ? list.min_price : "$0";
               html1 += '<li><a href="/traders/shop.html?brokerId='+list.broker_id+'"><div><img src="'+list.logo_url+'"></div><h3>'+list.chinese_name+'</h3><p>平均点差：<span>'+list.min_point+'</span></p><p>最高杠杆：<span>'+list.max_leverage+'</span></p><p>最低入金：<span>'+min_price+'</span></p><p>平台类型：<span>'+list.managing_mode+'</span></p>'+str+'</a><a class="openbtn" href="/traders/shop.html?brokerId='+list.broker_id+'">马上开户</a></li>';
           }
        }
        if(data.iblist){
            for(var j = 0; j<data.iblist.length; j++){
                var list = data.iblist[j];
                var blist = '';
                var blistarr = list.brokerListName.split(",");
                for(var k = 0; k < blistarr.length; k++){
                    if(blistarr[k]){
                        blist+= '<span>'+blistarr[k]+'</span>';
                    }
                }
                html2 += '<li><a href="/ib/index.html?ibId='+list.ib_id+'"><div><img src="'+list.logo_url+'"></div><div><h3><span><i class="icon iconfont">&#xe727;</i>认证机构</span>'+list.ib_name+'</h3><h2 class="tradershow"><p>'+blist+'</p></h2><p class="region">地区：'+list.provinceName+'</p></div></a></li>';
            }
        }
        if(!html1&&!html2){
            $(".searchnull").show();
            $(".hot").show();
            $(".searchResult").hide();
            $("#searchform input").blur();
        }else if(!html1){
            $(".sResulthead li").removeClass("on");
            $(".sResulthead li").eq(1).addClass("on");
            $(".searchResult .traders").html('<div class="nodata abnormal"><img src="/images/common/nodata.png" srcset="/images/common/nodata@2x.png 2x, /images/common/nodata@3x.png 3x" /><span>暂无数据</span></div>').hide();
            $(".searchResult .ibs").html("<ul class='ibslist'>"+html2+"</ul>").show();
            that.showResult();
        }else if(!html2){
            $(".sResulthead li").removeClass("on");
            $(".sResulthead li").eq(0).addClass("on");
            $(".searchResult .traders").html("<ul class='trader'>"+html1+"</ul>").show();
            $(".searchResult .ibs").html('<div class="nodata abnormal"><img src="/images/common/nodata.png" srcset="/images/common/nodata@2x.png 2x, /images/common/nodata@3x.png 3x" /><span>暂无数据</span></div>').hide();
            that.showResult();
        }else{
            $(".searchResult .traders").html("<ul class='trader'>"+html1+"</ul>").show();
            $(".searchResult .ibs").html("<ul class='ibslist'>"+html2+"</ul>").hide();
            $(".sResulthead li").removeClass("on");
            $(".sResulthead li").eq(0).addClass("on");
            that.showResult();
        }
    },
    tagIntercept:function(){
        $('.tradershow').each(function(i,o) {
             var _h = $(this).height();
             var _list = $(this).find('p');
             var _listH = $(_list).height();
             var _span = $(_list).find('span');
             var _w = $(_list).width();
             var _spanW = 0;
             var _newArry = [];
             if(_listH > _h) {
                $(_list).append('<span class="lable-ellipsis">...</span>');
                var _addW = $('.lable-ellipsis').width();
                $(_span).each(function(k,j){
                   _spanW += $(this).width() + _addW;
                   if(_spanW > _w) {
                      _newArry.push('<span class="lable-ellipsis">...</span>');
                      $(this).parent().html(_newArry.join(''))
                      return false;
                   }else {
                     _newArry.push('<span>'+$(j).text()+'</span>')
                   }
                })
             };
          })
    },
    dealSearchLinkData:function(val){
        var data = window.searchLinkData;
        var html = "";
         var j = 0;
        for(var i = 0; i < data.length; i++ ){
            var patt1 = new RegExp(val,"gi");
            if(data[i].name && patt1.test(data[i].name)){
                j++;
                var type = "代理商";
                var href = "ib/index.html?ibId="+data[i].id;
                if(data[i].table_type==0){
                    type = "交易商";
                    href = "/traders/shop.html?brokerId="+data[i].id
                }
                if(j <= 12){
                    html+='<li><a href="'+href+'"><span>'+data[i].name+'</span>'+type+'</a></li>';
                }
            }
        }
        if(html){
            $(".searchlink ul").html(html);
            $(".searchlink").show();
            $(".history").hide();
            $(".hot").hide();
            $("body").css("background","#fff");
        }else{
            $(".searchlink").hide();
            if(localStorage.getItem("historyList")){
                $(".history").show();
            }else{
                $(".history").hide();
            }
            $(".hot").show();
            $("body").css("background","#efeff4");
        }

    },
    resizeHeight:function(){
        function resizeH(){
            $(".swiper-container").css("height",$(".list").height());
        }
        var a = null;
        window.addEventListener("resize",function(){
            clearTimeout(a),
            a=setTimeout(resizeH,50)
        },!1);
        resizeH();
    },
    hotTraderShow:function(){
        $(".hotlist .list li").each(function(){
            var index = $(this).index();
            if(index%3==0){
                $(this).css("border-left","0");
            }
        })
        $(".swiper-container").css("height",$(".list").height());
        swiperShow = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            direction: 'vertical',
            loop:true,
            autoplay: 2500,
            noSwiping : true,
            noSwipingClass : 'stop-swiping',
        });
    },
    swiper:function(){
        function slideTab(a) {
            for (var b = bullets.length; b--;) bullets[b].className = bullets[b].className.replace("on", " ");
            var c=Math.floor(a/bullets.length);
            if(a>=bullets.length){
                a=a-bullets.length*c;
            }
            bullets[a].className = "on";
        }

        for(var mySwipe = Swipe(document.getElementById("mySwipe"), {
            auto: 3e3,
            callback: function (a) {
                slideTab(a);
            }
        }),bullets = document.getElementById("pager").getElementsByTagName("em"), i = 0; i < bullets.length; i++) {
            if(bullets.length == 1){
                $("#pager").hide();
            }
            var elem = bullets[i];
            elem.setAttribute("data-tab", i)
        }
    },
    historyListSet:function(val){
        if(localStorage.getItem("historyList")){
            var list = localStorage.getItem("historyList").split("/");
            if(list.length==5){
                list.splice(0,1);
                list[list.length] = val;
                localStorage.setItem("historyList",list.join("/"));
            }else{
                localStorage.setItem("historyList",localStorage.getItem("historyList")+"/"+val);
            }
        }else{
            localStorage.setItem("historyList",val);
        }
    },
    showHistory:function(){
        if(localStorage.getItem("historyList")){
            $(".history").show();
            var list = localStorage.getItem("historyList").split("/");
            var html = '';
            for(var i = 0; i < list.length; i++){
                html+= '<a>'+list[i]+'</a>';
            }
            $(".historylist").html(html);
        }else{
            $(".history").hide();
        }

    },
    showSearchContent:function(){
        var that = this;
        $('.footerNav').hide();
        $(".indexdiv").hide();
        $(".searchdiv").show();
        $(".search_s input").focus().val("");
        $(".clearsearch").hide();
        $(".searchlink").hide();
        $(".hot").show();
        if(localStorage.getItem("historyList")){
            that.showHistory();
        }
    },
    isIbCheck:function(){
        wapApi.qualificationIb.data["customer_id"] = window.datakey.result.id;
        wapApi.$ajax(wapApi.qualificationIb,function(data){
            if(data.result.code===10101){
                window.location.href="/ibapply/fail.html";
            }else if(data.result.code==10102){
                window.location.href="/ibapply/qualified.html";
            }else if(data.result.code==10103){
                $("body").confirmLayer({"type":3,"msg":"您已是IB代理商，赶紧发展更多开户来赚钱啦！"})
            }else{
                $("body").confirmLayer({"type":3,"msg":data.result.detail})
            }
            indexShow.clickFlag2=true;
        },function(data){
            $("body").confirmLayer({"type":3,"msg":data.result.detail})
            indexShow.clickFlag2=true;
        })
    },
	eventBind:function(){
        var that = this;
        $('body').on('touchstart', function(event) {
            $("#searchform input").blur();
        })
        $(".search div").click(function(){
            var href = "";
            if (window.location.href.indexOf("index">-1)) {
                href="/index.html";
            }else{
                href="";
            }
            swiperShow.stopAutoplay();
            history.pushState("","",href+"?type=search");
       	    that.showSearchContent();
        })
        $(".search_s input").on("input",function(e){
            if(e.keyCode==13){
                that.getSearchResult($("input[name='search']").val());
                that.historyListSet($("input[name='search']").val());
                $(".searchlink").hide();
                return false;
            }else{
                if($(this).val()){
                    $(".clearsearch").show();
                    if(window.searchLinkData){
                        that.dealSearchLinkData($(this).val());
                    }else{
                        that.getSearchLink($(this).val());
                    }
                }else{
                    $(".searchlink").hide();
                    $(".clearsearch").hide();
                    $(".searchResult").hide();
                    $(".searchnull").hide();
                    $(".hot").show();
                    if(localStorage.getItem("historyList")){
                        that.showHistory();
                    }
                }
            }
        })

         $(".search_s input").on("focus",function(e){
            if($(this).val()){
                $(".clearsearch").show();
            }
         })

        $(".history .hottop i").click(function(){
            localStorage.removeItem("historyList");
            that.showHistory();
        })

        $(".clearsearch").click(function(){
            $(this).hide();
            $(".search_s input").val("");
            $(".searchlink").hide();
            $(".clearsearch").hide();
            $(".searchResult").hide();
            $(".searchnull").hide();
            $(".hot").show();
            if(localStorage.getItem("historyList")){
                that.showHistory();
            }
        })
        $(".searchlink ul").on("click","li",function(){
            $(".search_s input").val($(this).find("span").text());
            that.historyListSet($(this).find("span").text());
            that.showHistory();
        })
        $(".sResulthead li").click(function(){
            var index = $(this).index();
            $(".sResulthead li.on").removeClass("on");
            $(this).addClass("on");
            $(".sResultList").hide();
            $(".sResultList").eq(index).show();
            if(index==1){
                that.tagIntercept();
            }
        })
        $(".search_s ins").click(function(){
            $(".searchdiv").hide();
            $(".indexdiv").show();
            $('.footerNav').show();
            that.hotTraderShow();
            that.swiper();
						that.strategyScroll();
            $(".searchResult").hide();
            var href = "";
            if (window.location.href.indexOf("index">-1)) {
                href="index.html";
            }else{
                href="";
            }
            history.pushState("","",href);
        })
        $(".searchlink p").click(function(){
           $(".searchlink").hide();
           that.getSearchResult($("input[name='search']").val());
           that.historyListSet($("input[name='search']").val());

        })
        $("#searchform").submit(function(){
            that.getSearchResult($("input[name='search']").val());
            that.historyListSet($("input[name='search']").val());
            $(".searchlink").hide();
            return false;
        })

        $(".historylist").on("click","a",function(){
            that.getSearchResult($(this).text());
            $("input[name='search']").val($(this).text());
            $(".searchlink").hide();
        })

        indexShow.clickFlag2=true;
        // var referer = window.location.href;
        // $(".ibad").click(function(){
        //     var that = $(this);
        //     if(window.datakey.result.id === -1){
        //         var referer= Base64.encode(window.location.href);
        //         window.location.href = "/login.html?ref="+referer;
        //     }else{
        //         if(indexShow.clickFlag2){
        //             indexShow.clickFlag2 = false;
        //             indexShow.isIbCheck();
        //         }
        //     }
        // })
	},
}
indexShow.init();
