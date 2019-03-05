/**
 * Created by Administrator on 2017/8/22.
 */
;$(function () {
    var personalBasicInfo = {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 ){
                    personalBasicInfo.user = res.result;
                    personalBasicInfo.init();
                    $('#telphone').text(res.result.phone ? commonMethod.encryptPhone(res.result.phone) : '');
                }else{
                    window.location.href = '/index.html';
                }
            },function () {
                window.location.href = '/index.html';
            })
        },
        init:function () {
            //来源判断
            personalBasicInfo.originJudge();
            //用户基本信息
            personalBasicInfo.getCustomerBasicInfo();
            personalBasicInfo.openedAccount();
            personalBasicInfo.birthdaySelect();
            personalBasicInfo.bindEvent();
        },
        bindEvent:function () {
            $('body').on('click','.appellationLi',personalBasicInfo.selectAppellation);
            $('body').on('click','.safeExitBtn',personalBasicInfo.safeExit);
        },
        originJudge:function () {
            var type = commonMethod.getUrlParameter('type');
            if(type && type == 1){
                $('#openNavigation').hide();
            }
        },
        //用户基本信息
        getCustomerBasicInfo:function () {
            wapApi.getBasicInfo.data = {customer_id: personalBasicInfo.user.id};
            wapApi.$ajax(wapApi.getBasicInfo,function (res) {
                if( res.result && res.result.code == 0 && commonMethod.getJsonLength(res.result.obj) > 0){
                    var basicInfo = res.result.obj;
                    // $('#telphone').text(basicInfo.telphone ? commonMethod.encryptPhone(basicInfo.telphone) : '');
                    $('#realName').text(basicInfo.is_checked == 1 ? '已认证' : '未认证');
                    $('#appellation').text(basicInfo.sex ? basicInfo.sex : '未填写');
                    var birthday = basicInfo.birthday,year,month,day;
                    if(birthday){
                        var arr = birthday.split('-');
                        year = arr[0]; month = arr[1]; day = arr[2];
                    }
                    $('#birthday').text(basicInfo.birthday ? basicInfo.birthday : '未填写').data('year',year ? year : 1981).data('month',month ? parseInt(month) : 1).data('date',day ? parseInt(day) : 1);
                    $('#email').text(basicInfo.email ? basicInfo.email : '未填写');
                    $('#address').text(basicInfo.regiondesc ? '已填写' : '未填写');
                }
            })
        },
        //照片是否认证
        openedAccount:function(){
            wapApi.openedAccount.data = {customer_id: personalBasicInfo.user.id};
            wapApi.$ajax(wapApi.openedAccount,function (res) {
                if( res && res.result ){
                    $('#certificate').text(res.result.code == 10001 ? '已认证' : '未认证');
                }
            })
        },
        //选择称谓
        selectAppellation:function () {
            if($('.mildHintBox').length > 0) return false;
            $(this).appellationLayer(function (obj) {
                personalBasicInfo.submitAppellation(obj);
            },function (obj) {
                personalBasicInfo.submitAppellation(obj);
            })
        },
        //提交基本信息称谓
        submitAppellation:function (obj) {
            var param = {
                customer_id: personalBasicInfo.user.id,
                modify_user: personalBasicInfo.user.id,
                sex: $(obj).data('sexid')
            }
            wapApi.updateBasicInfo.data = param;
            wapApi.$ajax(wapApi.updateBasicInfo,function (res) {
                if(res.result && res.result.code == 0) {
                    $('body').mildHintLayer({type:1,msg:'称谓保存成功'});
                    $('#appellation').html($(obj).text());
                }else{
                    $('body').mildHintLayer({type:2,msg:'称谓保存失败'});
                }
            },function (error) {
                $('body').mildHintLayer({type:2,msg:'称谓保存失败'});
            })
        },
        
        //生日选择
        birthdaySelect:function () {
            var selectDateDom = document.querySelector('.birthdayLi');
            var showDateDom = document.querySelector('#birthday');
            // 初始化时间
            var now = new Date();
            var nowYear = now.getFullYear();
            var nowMonth = now.getMonth() + 1;
            var nowDate = now.getDate();

            var yearData = function(callback) {
                callback(personalBasicInfo.formatYear(nowYear));
            }
            var monthData = function (year, callback) {
                callback(personalBasicInfo.formatMonth());
            }
            var dayData = function (year, month, callback) {
                if (/^1|3|5|7|8|10|12$/.test(month)) {
                    callback(personalBasicInfo.formatDay(31));
                }else if (/^4|6|9|11$/.test(month)) {
                    callback(personalBasicInfo.formatDay(30));
                }else if (/^2$/.test(month)) {
                    if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
                        callback(personalBasicInfo.formatDay(29));
                    }
                    else {
                        callback(personalBasicInfo.formatDay(28));
                    }
                }else {
                    throw new Error('month is illegal');
                }
            }

            selectDateDom.addEventListener('click', function(){
                if($('.mildHintBox').length > 0) return false;
                var oneLevelId = showDateDom.dataset['year'];
                var twoLevelId = showDateDom.dataset['month'];
                var threeLevelId = showDateDom.dataset['date'];
                var iosSelect = new IosSelect(3,
                    [yearData, monthData, dayData],
                    {
                        title: '出生日期选择',
                        itemHeight: 35,
                        relation: [1, 1],
                        oneLevelId: oneLevelId,
                        twoLevelId: twoLevelId,
                        threeLevelId: threeLevelId,
                        callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                            if(selectTwoObj.id.length==1){
                                selectTwoObj.id = "0"+selectTwoObj.id;
                            }
                            if(selectThreeObj.id.length==1){
                                selectThreeObj.id = "0"+selectThreeObj.id;
                            }
                            var param = {
                                customer_id: personalBasicInfo.user.id,
                                modify_user: personalBasicInfo.user.id,
                                birthday: selectOneObj.id + '-' + selectTwoObj.id + '-' + selectThreeObj.id
                            }
                            wapApi.updateBasicInfo.data = param;
                            wapApi.$ajax(wapApi.updateBasicInfo,function (res) {
                                if(res.result && res.result.code == 0) {
                                    showDateDom.dataset['year'] = selectOneObj.id;
                                    showDateDom.dataset['month'] = parseInt(selectTwoObj.id);
                                    showDateDom.dataset['date'] = parseInt(selectThreeObj.id);
                                    $(showDateDom).html(selectOneObj.id + '-' + selectTwoObj.id + '-' + selectThreeObj.id);
                                    $('body').mildHintLayer({type:1,msg:'出生日期保存成功'});
                                }else{
                                    $('body').mildHintLayer({type:2,msg:'出生日期保存失败'});
                                }
                            },function (error) {
                                $('body').mildHintLayer({type:2,msg:'出生日期保存失败'});
                            })
                        }
                    });
            });
        },

        formatYear: function(nowYear) {
            var arr = [];
            for (var i = nowYear ; i >= nowYear - 100 ; i--) {
                arr.push({
                    id: i + '',
                    value: i + '年'
                });
            }
            return arr;
        },
        formatMonth: function  () {
            var arr = [];
            for (var i = 1; i <= 12; i++) {
                arr.push({
                    id: i + '',
                    value: i + '月'
                });
            }
            return arr;
        },
        formatDay: function (count) {
            var arr = [];
            for (var i = 1; i <= count; i++) {
                arr.push({
                    id: i + '',
                    value: i + '日'
                });
            }
            return arr;
        },
        safeExit:function () {
            var type = commonMethod.getUrlParameter('type');
            wapApi.$ajax(wapApi.userLogOut,function (res) {
                personalBasicInfo.exitPage(type);
            },function () {
                personalBasicInfo.exitPage(type);
            })
        },
        exitPage:function (type) {
            if(type && type == 1){
                window.location.href = 'https://mbank.fmtxt.com';
            }else{
                window.location.href = '/index.html';
            }
        }
    }
    personalBasicInfo.getLoginStatus();
})
