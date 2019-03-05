/**
 * Created by Administrator on 2017/8/17.
 */
;(function ($) {
    /**
     * 头部逻辑处理
     */
   var header = {
       init: function () {
           header.bindEvent();
       },
       bindEvent:function () {
           //返回
           $('body').on('click','#backHistoryPage',header.backHistoryPage);
           //显示头部导航
           $('body').on('click','#openNavigation,.headerNavMask',header.openNavigation);

           //交易账户
           $('body').on('click','#headerJumpTradingAccount',header.headerJumpTradingAccount);
           //个人中心
           $('body').on('click','#headerJumpPersonal',header.headerJumpPersonal);
       },
       backHistoryPage:function () {
           window.history.back(-1);
       },
       openNavigation:function () {
           if($('.headerNav').css("display") == "block"){
               $('.headerNavMask').css('display','none');
               $('.headerNav').css('display','none');
               $('body').height('height','auto');
           }else{
               $('.headerNavMask').css('display','block');
               $('.headerNav').css('display','block');
               var height = Number(window.screen.height)/100;
               $('body').css('height',height + 'rem');
           }
       },
        headerJumpTradingAccount:function () {
            var referer = '../personal/tradingAccount.html';
            header.getLoginStatus(referer);
        },
        headerJumpPersonal:function () {
            var referer = '../personal/index.html';
            header.getLoginStatus(referer);
        },
        getLoginStatus:function (referer) {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 ){
                    window.location.href = referer;
                }else{
                    window.location.href = '/login.html?ref=' + Base64.encode(referer);
                }
            },function () {
                window.location.href = '/login.html?ref=' + Base64.encode(referer);
            })
        }
   }
    header.init();

    var footer = {
        init: function () {
            footer.bindEvent();
        },
        bindEvent:function () {
            //首页
            $('body').on('click','#footerJumpHome',footer.footerJumpHome);
            //财经日历
            $('body').on('click','#footerJumpCalendar',footer.footerJumpCalendar);
            //交易账户
            $('body').on('click','#footerJumpTradingAccount',footer.footerJumpTradingAccount);
            //个人中心
            $('body').on('click','#footerJumpPersonal',footer.footerJumpPersonal);
        },
        footerJumpHome:function (event) {
            if($(this).parent('li').hasClass('on')) event.preventDefault();
        },
        footerJumpCalendar:function (event) {
            if($(this).parent('li').hasClass('on')) event.preventDefault();
        },
        footerJumpTradingAccount:function () {
            if($(this).parent('li').hasClass('on')) return false;
            var referer = '../personal/tradingAccount.html';
            footer.getLoginStatus(referer);
        },
        footerJumpPersonal:function () {
            if($(this).parent('li').hasClass('on')) return false;
            var referer = '../personal/index.html';
            footer.getLoginStatus(referer);
        },
        getLoginStatus:function (referer) {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 ){
                    window.location.href = referer;
                }else{
                    window.location.href = '/login.html?ref=' + Base64.encode(referer);
                }
            },function () {
                window.location.href = '/login.html?ref=' + Base64.encode(referer);
            })
        }
    }
    footer.init();

    /**
     * 加载失败后重新加载
     */
    var loadfail = {
        bindEvent:function () {
            //重新加载
            $('body').on('click','#reload',loadfail.reload);
        },
        reload:function () {
            history.go(0);
        }
    }
    loadfail.bindEvent();
})(Zepto);
/**
 * 共同方法
 */
var commonMethod = {
    //获取当前url中的参数
    getUrlParameter: function (key) {
        var para = location.search.match(new RegExp("[\?\&]" + key + "=([^\&]*)(\&?)", "i"));
        return para ? para[1] : para;
    },
    replaceParamVal:function(oldUrl, paramName, replaceWith) {
        var re = eval('/(' + paramName + '=)([^&]*)/gi');
        var newUrl = oldUrl.replace(re, paramName + '=' + replaceWith);
        return newUrl;
    },
    //获取json数组的长度
    getJsonLength: function(jsonArr){
        var jsonLength = 0;
        for(var item in jsonArr){
            jsonLength++;
        }
        return jsonLength;
    },
    //加密手机号
    encryptPhone: function(phone){
        var temp = "",phone = phone.toString();
        if( phone ){
            var bef = phone.slice(0,3);
            var aft = phone.slice(phone.length - 4,phone.length);
            temp = bef + "****" + aft;
        }
        return temp;
    },
    //格式化日期:例如yyyy-MM-dd （zero:true/false）
    formatDate: function(date,symbol,zero){
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        zero ? month < 10 ? month = "0" + month : month : month;
        day ? day < 10 ? day = "0" + day : day : day;

        return (year + symbol + month + symbol + day);
    },
    trim: function (str){ //删除左右两端的空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    ltrim: function (str){ //删除左边的空格
        return str.replace(/(^\s*)/g,"");
    },
    rtrim: function (str){ //删除右边的空格
        return str.replace(/(\s*$)/g,"");
    },
    //二次开户判断
    hasAccount:function (userId,brokerId,ibId,ref,brokerName) {
        wapApi.hasAccount.data = {"customerId":userId,"broker_id":brokerId,"ibId":ibId};
        wapApi.$ajax(wapApi.hasAccount,function (res) {
            if(res.result){
                if(res.result.code == 10000){
                    window.location.href = ref;
                }
                else{
                    var msg = '您已在【' + brokerName + '】开过户';
                    if( res.result.code == 40002 ) msg = '抱歉，您已在【' + brokerName + '】提交开户申请，请耐心等待结果！'
                    $('body').confirmLayer({
                        type: 4,
                        leftBtn: '开户信息',
                        rightBtn: '确定',
                        msg: msg,
                        yes:function () {},
                        check:function () {
                            window.location.href = '../personal/tradingAccount.html';
                        }
                    })
                }
            }
        })
    }
}


var scrollToTopIcon = {
    addScrollBtn:function () {
        scrollToTopIcon.bindEvent();
        if($('#scrollToTopBtn').length > 0){
            return false;
        }
       var html =   '<div class="toTopBox" id="scrollToTopBtn">' +
                        '<img src="/images/common/to-top.png" srcset="/images/common/to-top@2x.png 2x,/images/common/to-top@3x.png 3x" />' +
                    '</div>' ;
        $('body').append(html);
    },
    removeScrollBtn:function () {
        $('#scrollToTopBtn').remove();
    },
    bindEvent:function () {
        $('body').on('click','#scrollToTopBtn',scrollToTopIcon.scrollToTop);
    },
    scrollToTop:function () {
        var opts = {
            toT : 0,
            durTime : 500,
            delay : 30,
            callback:null
        };
       var  timer = null,
        _this = $('body'),
        curTop = _this.scrollTop(),
        subTop = opts.toT - curTop,
        index = 0,
        dur = Math.round(opts.durTime / opts.delay),
        smoothScroll = function(t){
            index++;
            var per = Math.round(subTop/dur);
            if(index >= dur){
                _this.scrollTop(t);
                window.clearInterval(timer);
                if(opts.callback && typeof opts.callback == 'function'){
                    opts.callback();
                }
                return;
            }else{
                _this.scrollTop(curTop + index*per);
            }
        };
        timer = window.setInterval(function(){
            smoothScroll(opts.toT);
        }, opts.delay);
    }
}

;$.fn.mildHintLayer = function (options) {
    if($('.mildHintBox').length > 0){
        return false;
    }
    var defaultOptions = {
        type: 1, //1成功提示;2失败提示;3警告提示
        mas:'',
        ref:''
    },
    iconCode = {
        1: '&#xe725;', //成功提示
        2: '&#xe71b;', //失败提示
        3: '&#xe722;'  //警告提示
    },
    opt = $.extend(defaultOptions,options),
    html =   '<div class="mildHintBox">' +
        '<span class="icon iconfont hintIcon">'+iconCode[opt.type]+'</span>' +
        '<p class="hintMessage">'+opt.msg+'</p>'+
        '</div>' ;
    $('body').append(html);
    setTimeout(function () {
        $('.mildHintBox').animate({opacity:1},200);
    },100)

    setTimeout(function () {
        $('.mildHintBox').animate({opacity:0},500,'',function () {
            $('.mildHintBox').remove();
            if(opt.ref) window.location.href = opt.ref;
        });
    },2500)
}

//确认框
;$.fn.confirmLayer = function ( options ) {
    if($('.confirmLayer').length > 0){
        return false;
    }
    var defaultOptions = {
        type: 1,
        title: '提示',
        msg:'',
        leftBtn:'取消',
        rightBtn: '确定',
        centerBtn: '确定',
        yes:function (obj) {},
        cancel:function () {},
        check:function () {}
    },opt;
    var init = function () {
        opt = $.extend(defaultOptions,options);
        var html1 = '<div class="confirmLayer">' +
            '<div class="confirmMask"></div>'+
            '<div class="confirmBox">' +
            '<p class="title">'+opt.title+'</p>' +
            '<div class="hintMessage1">'+opt.msg+'</div>'+
            '<div class="btnBox"><a class="btn cancelBtn">'+opt.leftBtn+'</a><a class="btn confirmBtn confirmBtn1">'+opt.rightBtn+'</a></div>'+
            '</div>' +
            '</div>' ,
        html2 = '<div class="confirmLayer">' +
            '<div class="confirmMask"></div>'+
            '<div class="confirmBox">' +
            '<div class="hintMessage2">'+opt.msg+'</div>'+
            '<div class="btnBox"><a class="btn cancelBtn">'+opt.leftBtn+'</a><a class="btn confirmBtn confirmBtn2">'+opt.rightBtn+'</a></div>'+
            '</div>' +
            '</div>' ,
        html3 = '<div class="confirmLayer">' +
            '<div class="confirmMask"></div>'+
            '<div class="confirmBox">' +
            '<div class="hintMessage2">'+opt.msg+'</div>'+
            '<div class="btnBox"><a class="confirmBtn confirmBtn3">'+opt.centerBtn+'</a></div>'+
            '</div>' +
            '</div>',
        html4 = '<div class="confirmLayer">' +
            '<div class="confirmMask"></div>'+
            '<div class="confirmBox">' +
            '<div class="hintMessage2">'+opt.msg+'</div>'+
            '<div class="btnBox"><a class="btn checkBtn">'+opt.leftBtn+'</a><a class="btn confirmBtn confirmBtn4">'+opt.rightBtn+'</a></div>'+
            '</div>' +
            '</div>' ;
        if(opt.type == 1){
            $('body').append(html1);
        }else if(opt.type == 2){
            $('body').append(html2);
        }else if(opt.type == 3){
            $('body').append(html3);
        }else if(opt.type == 4){
            $('body').append(html4);
        }
        var t = setTimeout(function () {
            $('.confirmBox').animate({opacity:1},150);
        },100)
    }
    init();

    var close = function () {
        $('.confirmBox').animate({opacity:0},150);
        $('.confirmLayer').remove();
    }

    $('.cancelBtn').on('click',function () {
        close();
        opt.cancel && opt.cancel();
    })
    $('.checkBtn').on('click',function () {
        close();
        opt.check && opt.check();
    })
    $('.confirmBtn').on('click',function () {
        close();
        opt.yes && opt.yes($('.confirmLayer'));
    })
}
;$.fn.appellationLayer = function ( selectManFun, selectWomanFun ) {
    if($('.appellationLayerBox').length > 0){
        return false;
    }
    var html = '<div class="appellationLayerBox"><div class="appellationMask"></div>'+
                    '<div class="appellationLayer">'+
                        '<a class="manBtn" data-sexid="0">先生</a>'+
                        '<a class="womanBtn" data-sexid="1">女士</a>'+
                        '<a class="cancelBtn">取消</a>'+
                    '</div>'+
                '</div>';
    $('body').append(html);
    setTimeout(function () {
        $('.appellationLayer').animate({bottom:0},150);
    },100)
    $('.manBtn').on('click',function () {
        selectManFun && selectManFun($('.appellationLayerBox .manBtn'));
        $('.appellationLayer').animate({bottom:'-3rem'},150,'',function () {
            $('.appellationLayerBox').remove();
        });
    })
    $('.womanBtn').on('click',function () {
        selectWomanFun && selectWomanFun($('.appellationLayerBox .womanBtn'));
        $('.appellationLayer').animate({bottom:'-3rem'},150,'',function () {
            $('.appellationLayerBox').remove();
        });
    })
    $('.cancelBtn,.appellationMask').on('click',function () {
        $('.appellationLayer').animate({bottom:'-3rem'},150,'',function () {
            $('.appellationLayerBox').remove();
        });
    })
}

//滚动条置顶
window.onload=function() {
    setTimeout(function () {
        window.scrollTo(0,0);
    },100)
}

;$.fn.selectBankCardLayer = function (options) {
    if($('.selectBankCardLayerBox').length > 0){
        return false;
    }
    var bankCards = {
        '080102': 'gsyh.png', //工商银行
        '080103': 'nyyh.png', //农业银行
        '080104': 'zgyh.png', //中国银行
        '080105': 'jsyh.png', //建设银行
        '080100': 'yzyh.png', //邮政储蓄银行
        '080410': 'payh.png', //平安银行
        '080305': 'msyh.png', //民生银行
        '080303': 'gdyh.png', //光大银行
        '080306': 'gfyh.png', //广发银行
        '080302': 'zxyh.png', //中信银行
        '080309': 'xyyh.png', //兴业银行
        '080304': 'hxyh.png', //华夏银行
        '080308': 'zsyh.png', //招商银行
        '080310': 'pfyh.png', //浦发银行
        '080301': 'jtyh.png'  //交通银行
    };
    var defaultOptions = {
            data: null,
            user: null,
            okHandle:function () {},
            cancelHandle:function () {}
        },
        opt = $.extend(defaultOptions,options);

    var bankCardLi = function () {
        var html = '';
        wapApi.getBankCardList.data = {customer_id: opt.user.id};
        wapApi.$ajax(wapApi.getBankCardList,function (res) {
            if(res.result && res.result.code == 0 && res.result.obj && res.result.obj.length > 0){
                var data = res.result.obj;
                for(var i = 0; i < data.length; i++){
                    var info = JSON.stringify(data[i]);
                    var bankno = data[i].bank_no,src='';
                    for(var key in bankCards){
                        if(bankno.indexOf(key) != -1){
                            src = '/images/bank/' + bankCards[key];
                            break;
                        }
                    }
                    var is_default = data[i].is_default,selectIconCode,defaultIcon,selectClass;
                    selectIconCode = is_default == 1 ? '&#xe756;' : '&#xe758;';
                    defaultIcon = is_default == 1 ? '<span class="icon iconfont defaultIcon">&#xe725;</span>' : '<span class="setTo">设为</span>';
                    selectClass = is_default == 1 ? 'on' : '';
                    html += '<li class="'+selectClass+'" data-data='+info+'>' +
                                '<div class="liTap">' +
                                    '<span class="icon iconfont selectIcon">'+selectIconCode+'</span>' +
                                    '<div class="bankCardInfo">' +
                                        '<div class="img"><img src="'+src+'"/></div>' +
                                        '<div class="info">' +
                                            '<span class="name">'+data[i].chinese_name+'</span>' +
                                            '<span class="account">'+data[i].bank_account+'</span>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'+
                                '<div class="textMask"></div>' +
                                '<a class="default '+selectClass+'" data-accountid="'+data[i].account_id+'">' +
                                defaultIcon +
                                '<span class="text">默认</span>' +
                                '</a>' +
                        '</li>';
                }
                $('.selectBankCardLayerBox #bankCardList').empty().append($(html));
            }
        })
    }

    var html =  '<div class="selectBankCardLayerBox">' +
                    '<div class="bankCardMask"></div>' +
                    '<div class="bankCardBox">'+
                        '<p class="title">选择银行卡</p>' +
                        '<div class="cardBox">' +
                            '<ul id="bankCardList">' +
                            '</ul>' +
                            '<a class="addBankCardBtn" href="/personal/bank.html?type=2&status=1">' +
                                '<span class="icon iconfont addIcon">&#xe729;</span>' +
                                '<span class="addText">添加银行卡</span>' +
                            '</a>' +
                        '</div>' +
                        '<div class="btnBox">' +
                            '<a class="cancelBtn">取消</a>' +
                            '<a class="ensureBtn">确定</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' ;
    $('body').append(html);

    bankCardLi();
    $('.selectBankCardLayerBox .bankCardBox').on('touchstart',function (event) {
        document.body.style.position='fixed';
    })
    $('.selectBankCardLayerBox .bankCardBox').on('touchend',function (event) {
        document.body.style.position='auto';
    })
    setTimeout(function () {
        $('.bankCardBox').animate({opacity:1},200);
    },100)

    $('body').on('click','.cancelBtn',function () {
        $('.bankCardBox').animate({opacity:0},300,'',function () {
            $('.selectBankCardLayerBox').remove();
            opt.cancelHandle && opt.cancelHandle();
        });
    })

    $('body').on('click','.ensureBtn',function () {
        var res = $('.cardBox ul li.on').data('data');
        if(res){
            opt.okHandle && opt.okHandle(res);
            $('.bankCardBox').animate({opacity:0},300,'',function () {
                $('.selectBankCardLayerBox').remove();
            });
        }else{
            $('body').mildHintLayer({type:3,msg:'请选中银行卡'});
        }
    })

    $('body').on('click','.cardBox ul li .liTap',function (e) {
        e.stopPropagation();
        var $li = $(this).parent();
        if(!$li.hasClass('on')){
            $li.addClass('on').siblings().removeClass('on');
            $li.find('.selectIcon').empty().html('&#xe756;');
            $li.siblings().find('.selectIcon').empty().html('&#xe758;');
        }
    })
    $('body').on('click','.default',function (e) {
        e.stopPropagation();
        if(!$(this).hasClass('on')){
            var _this = this;
            wapApi.setDefaultBankCard.data = {customer_id: opt.user.id,account_id: $(_this).data('accountid')};
            wapApi.$ajax(wapApi.setDefaultBankCard,function (res) {
                if( res.result && res.result.code == 0 ){
                    $(_this).addClass('on').parents('li').siblings().find('.default').removeClass('on');
                    $(_this).empty().html('<span class="icon iconfont defaultIcon">&#xe725;</span><span class="text">默认</span>');
                    $(_this).parents('li').siblings().find('.default').empty().html('<span class="setTo">设为</span><span class="text">默认</span>');
                }
            })
        }
    })
}
/*
 * 查看大图
 */
;$.fn.showImgLayer = function (options) {
    if($('.imgLayerBox').length > 0){
        return false;
    }
    var defaultOptions = {
            type: 1,
            html:''
        },
        opt = $.extend(defaultOptions,options),
        html = '<div class="imgLayerBox">' +
                    '<div class="imgMask"></div>' +
                    '<div class="imgBox">'+opt.html+'</div>'+
                '</div>' ;
    $('body').append(html);
    setTimeout(function () {
        $('.imgBox').animate({opacity:1},200);
    },100)

    $('.imgMask,.imgBox').on('click',function () {
        $('.imgBox').animate({opacity:0},500,'',function () {
            $('.imgLayerBox').remove();
        });
    })
}

/*
 * 满足IB资格的提示
 */
;$.fn.ibTipsLayer = function (options) {
    if($('.ibTipsLayerBox').length > 0){
        return false;
    }
    var defaultOptions = {
            type: 1,
            yes: function () {},
            cancel:function () {}
        },
        opt = $.extend(defaultOptions,options),
        html = '<div class="ibTipsLayerBox">' +
                    '<div class="imgMask"></div>' +
                    '<div class="imgBox">' +
                        '<img src="/images/index/ibTips.png" srcset="/images/index/ibTips@2x.png 2x,/images/index/ibTips@3x.png 3x" />' +
                        '<div class="tipsBox">' +
                            '<p class="title">您已具备代理商申请资格</p>' +
                            '<span class="text">30余家全球顶级交易商一键代理</span><span class="text">超高返佣，轻松月入过万！</span>' +
                        '</div>'+
                        '<a class="cancelBtn"></a><a class="okBtn"></a>'+
                    '</div>'+
                '</div>' ;
    $('body').append(html);
    setTimeout(function () {
        $('.imgBox').animate({opacity:1},200);
    },100)

    $('.cancelBtn').on('click',function () {
        $('.imgBox').animate({opacity:0},500,'',function () {
            $('.ibTipsLayerBox').remove();
            opt.cancel && opt.cancel();
        });
    })
    $('.okBtn').on('click',function () {
        $('.imgBox').animate({opacity:0},300,'',function () {
            $('.ibTipsLayerBox').remove();
            window.location.href = '/ibApply/qualified.html?type=1';
        });
    })
}