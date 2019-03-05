wapApi.submitData = {
    url: 'https://shop.fmtxt.com/email/send.do',
    data: {
        name:"",
        mobile:"",
        introducer:"",
        identity:""
    },
    type: '1'
}


function resize(){
  var e=(navigator.userAgent,+document.documentElement.clientWidth/750)*100;
  window.remFontSize=e=100>e?e:100,
  document.documentElement.style.fontSize=e+"px"
}
var b=null,ua=navigator.userAgent;window.addEventListener("resize",function(){clearTimeout(b),b=setTimeout(resize,50)},!1),resize()

$(".gotobottom").click(function(){
	var hei = $('body').height();
	$(window).scrollTop(hei);
})

var flag = 1;

var clickFlag = "1";
$(".submit").click(function(){
	var name = $("input[name='name']");
	var tel = $("input[name='mobile']");
	var name2 = $("input[name='introducer']");
    var regT = /^1\d{10}$/;

	if(name.val() && regT.test(tel.val())){
		showOk(name);
		showOk(tel);
		flag=1;
	}else if(name.val()){
        showOk(name);
		showError(tel);
		flag=2;
	}else if(regT.test(tel.val())){
		showOk(tel);
		showError(name);
		flag=2;
	}else{
		showError(name);
		showError(tel);
		flag=2;
	}

//	if(name2.val()&&name2.val()){
//      showOk(name2);
//      flag=1;
//	}else if(name2.val()&&!name2.val()){
//      showError(name2);
//      flag=2;
//	}
    if(flag==1&&clickFlag=="1"){
    	clickFlag = "2";
    	wapApi.submitData.data.name = $("input[name='name']").val();
    	wapApi.submitData.data.mobile = $("input[name='mobile']").val();
    	wapApi.submitData.data.introducer = $("input[name='introducer']").val();
    	wapApi.submitData.data.identity = $("input[name='identity']:checked").val();
	    wapApi.$ajax(wapApi.submitData,function(data){
            if(data.code==0){
                if(data.result.code==10000){
              	    showSuccess();
                }else{
                    showfail();
                }
                clickFlag = "1";
            }else{
            	showfail();
            	clickFlag = "1";
            }
	    })
    }
})




function showSuccess(){
	$("body").append('<div class="tip"><div class="ok"></div><p>提交成功</p></div>');
    setTimeout(function(){
        $(".tip").remove();
        emptyClass($("input[name='name']"));
	    emptyClass($("input[name='mobile']"));
	    emptyClass($("input[name='introducer']"));
    },3000);

}
function showfail(){
	$("body").append('<div class="tip"><div class="error"></div><p>提交失败</p></div>');
    setTimeout(function(){
        $(".tip").remove();
        emptyClass($("input[name='name']"));
	    emptyClass($("input[name='mobile']"));
	    emptyClass($("input[name='introducer']"));
    },3000);
}

function showError(dom){
    dom.attr("class","error");
	dom.next("span").attr("class","error");
}
function showOk(dom){
	dom.attr("class","ok");
    dom.next("span").attr("class","ok");
}
function emptyClass(dom){
    dom.attr("class","");
    dom.next("span").attr("class","");
    dom.val("");
}
