/**
 * Created by Administrator on 2017/9/2.
 */
;$(function () {
    var calendarIndex = {
        selectedDate: new Date(),
        init:function () {
            calendarIndex.monthDay(new Date());
            calendarIndex.yearMonth(new Date());
            calendarIndex.weekCalendarInit(new Date());
            calendarIndex.calendarSelect();
            calendarIndex.bindEvent();
        },
        bindEvent:function () {
            //切换上一周
            $('body').on('click','.prevIcon',calendarIndex.switchPrevWeek);
            //切换下一周
            $('body').on('click','.nextIcon',calendarIndex.switchNextWeek);
            //选中日期
            $('body').on('click','#weekCalendarBox li div span',calendarIndex.selectDate);
        },
        yearMonth:function (date) {
            if(date){
                var year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate();
                $('.yearMonth').html(year + '年' + month + '月').data('year',year).data('month',month).data('date',day);
            }
        },
        monthDay:function (date) {
            var month = date.getMonth() + 1,
                day = date.getDate(),
                week = date.getDay(),
                weekArr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
                weekText = weekArr[week];
            if( month < 10 ) month = "0" + month;
            if( day < 10 ) day = "0" + day;
            $('.selectDate').empty().html(month + '-' + day + ' / ' + weekText);
        },
        selectDate:function () {
            var date = $(this).parent().data('date');
            calendarIndex.selectedDate = new Date(date);
            calendarIndex.yearMonth(new Date(date));
            calendarIndex.weekCalendarInit(new Date(date));
            //更新财经日历数据
            calendarIndex.getCalendarData(commonMethod.formatDate(calendarIndex.selectedDate,'',true));
            //更新选择日期（11-10 / 星期一）
            calendarIndex.monthDay(new Date(date));
        },

        //财经日历信息初始化
        getCalendarData: function (date) {
            $('.loading').show();
            $('#calendarInfoBox').empty();
            $('.content').css('display','none');
            wapApi.getCalendarData.data = {date: date}
            wapApi.$ajax(wapApi.getCalendarData, function (res) {
                $('.loading').hide();
                $('.loadfail').addClass('fxHidden').removeClass('fxVisible');
                if (res.data && res.data && res.data.financialArr.length > 0) {
                    $('.content').css('display','block');
                    var financialArr = res.data.financialArr,
                        calendarList = new Array();
                    for(var i = 0; i < financialArr.length; i++){
                        var sameTimeArr = financialArr[i].sameTimeArr;
                        for(var j = 0; j < sameTimeArr.length; j ++){
                            var obj = {};
                            obj.countryName = financialArr[i].countryName;
                            obj.financeflagClass = financialArr[i].financeflagClass;
                            obj.flagClass = financialArr[i].flagClass;
                            obj.time = financialArr[i].time;
                            obj.beforeVal = sameTimeArr[j].beforeVal;
                            obj.dynamicGraphUrl = sameTimeArr[j].dynamicGraphUrl;
                            obj.importanceImgUrl = sameTimeArr[j].importanceImgUrl;
                            obj.predictionVal = sameTimeArr[j].predictionVal;
                            obj.publishVal = sameTimeArr[j].publishVal;
                            obj.target = sameTimeArr[j].target;
                            obj.profitMore = sameTimeArr[j].profit[0] ? sameTimeArr[j].profit[0].profitMore : '';
                            calendarList.push(obj);
                        }
                    }
                    var calendarData = {list: calendarList};
                    var html = $.tppl(document.getElementById('calendarInfoTml').innerHTML, calendarData);
                    $('#calendarInfoBox').empty().append($(html));
                    $('.nodata').addClass('fxHidden').removeClass('fxVisible');
                    //滚动条置顶
                    setTimeout(function () {
                        window.scrollTo(0,0);
                    },10)
                } else {
                    $('.nodata').addClass('fxVisible').removeClass('fxHidden');
                }
            }, function (res) {
                $('.loadfail').addClass('fxVisible').removeClass('fxHidden');
                $('.loading').hide();
            })
        },
        /**************************一周日历呈现*******************************/
        switchPrevWeek:function () {
            $('#weekCalendarBox').animate({marginLeft:0},500,'',function () {
                $("#weekCalendarBox").prepend($("#weekCalendarBox li").last());
                var  width = window.screen.width;
                $('#weekCalendarBox').css('margin-left', -width);
                var date = $('#weekCalendarBox li').eq(1).find('div').eq(0).data('date');
                var prevDayArr = calendarIndex.getPrevWeekDays(date);
                var prevWeekData = calendarIndex.getWeekCalendarData(prevDayArr);
                calendarIndex.renderWeekCalendar(0,prevWeekData);
            });
        },
        switchNextWeek:function () {
            var  width = window.screen.width;
            var deviation = -(width * 2);
            $('#weekCalendarBox').animate({marginLeft: deviation},500,'',function () {
                $("#weekCalendarBox").append($("#weekCalendarBox li").first());
                $('#weekCalendarBox').css('margin-left', -width);
                var date = $('#weekCalendarBox li').eq(1).find('div').eq(6).data('date');
                var nextDayArr = calendarIndex.getNextWeekDays(date);
                var nextWeekData = calendarIndex.getWeekCalendarData(nextDayArr);
                calendarIndex.renderWeekCalendar(2,nextWeekData);
            });
        },
        weekCalendarInit:function (currDate) {
            var dayArr = calendarIndex.getWeekDays(currDate);
            var currWeekData = calendarIndex.getWeekCalendarData(dayArr);
            calendarIndex.renderWeekCalendar(1,currWeekData);

            var prevDayArr = calendarIndex.getPrevWeekDays(currWeekData[0].date);
            var prevWeekData = calendarIndex.getWeekCalendarData(prevDayArr);
            calendarIndex.renderWeekCalendar(0,prevWeekData);

            var nextDayArr = calendarIndex.getNextWeekDays(currWeekData[6].date);
            var nextWeekData = calendarIndex.getWeekCalendarData(nextDayArr);
            calendarIndex.renderWeekCalendar(2,nextWeekData);
        },
        getWeekCalendarData:function (dayArr) {
            var weekTextArr = new Array("周日","周一","周二","周三","周四","周五","周六"),
                data = new Array();
            for(var i = 0; i < dayArr.length; i++){
                //一周的某一天
                var oneday = dayArr[i];
                //所属的月份
                var month = oneday.getMonth() + 1;
                //具体是哪一天
                var day = oneday.getDate();

                if(month < 10) month = '0' + month;
                //周日~周六文字
                var weekText = weekTextArr[i];
                var obj = {
                    weekText: weekText,
                    date: oneday,
                    day: day
                }
                var onedayTime =  new Date(commonMethod.formatDate(oneday,'-',true)).getTime();
                var selectedDateTime = new Date(commonMethod.formatDate(calendarIndex.selectedDate,'-',true)).getTime();
                var nowDateTime = new Date(commonMethod.formatDate(new Date(),'-',true)).getTime();
                if(onedayTime < nowDateTime){
                    obj.style = 'past';
                } else if( onedayTime == nowDateTime){
                    obj.style = 'now';
                }else{
                    obj.style = 'future'
                }
                if( onedayTime == selectedDateTime ) obj.style = 'on';
                data.push(obj);
            }
            return data;
        },
        renderWeekCalendar:function (index,data) {
            var html = $.tppl(document.getElementById('weekCalendarTml').innerHTML, { weekdays: data });
            $('#weekCalendarBox li').eq(index).empty().append($(html));
        },
        //取得当前日期一周内的七天
        getWeekDays:function (currDate) {
            var days = new Array();
            for(var i = 0; i < 7; i++){
                days[i] = calendarIndex.getWeek(currDate,i);
            }
            return days;
        },
        getWeek:function (currDate,i) {
            var idx = currDate.getDay();
            var format = new Date(currDate);
            format.setDate(currDate.getDate() - idx + i);
            return format;
        },

        //取得上一周的日期数(共七天)
        getPrevWeekDays:function (nday) {
            var days = new Array();
            for(var i = -7;i <= -1; i++) {
                days[7+i] = calendarIndex.getPrevWeek( new Date( nday ), i );
            }
            return days;
        },

        //指定日期的上一周(前七天)
        getPrevWeek:function (dt,i) {
            var today = dt;
            today.setDate(today.getDate()+i);
            return today;
        },

        //取得下一周的日期数(共七天)
        getNextWeekDays: function (nday) {
            var days = new Array();
            for(var i = 1; i <= 7; i++) {
                days[i-1] = calendarIndex.getNextWeek( new Date( nday ), i );
            }
            return days;
        },

        //指定日期的下一周(后七天)
        getNextWeek: function (dt,i) {
            var today = dt;
            today.setDate(today.getDate() + i );
            return today;
        },
        /**************************一周日历呈现*******************************/

        /****************************右上角日历******************************/
        //生日选择
        calendarSelect:function () {
            var selectDateDom = document.querySelector('.dateicon');
            var showDateDom = document.querySelector('.yearMonth');
            // 初始化时间
            var now = new Date();
            var nowYear = now.getFullYear();
            var nowMonth = now.getMonth() + 1;
            var nowDate = now.getDate();

            var yearData = function(callback) {
                callback(calendarIndex.formatYear(nowYear));
            }
            var monthData = function (year, callback) {
                callback(calendarIndex.formatMonth());
            }
            var dayData = function (year, month, callback) {
                if (/^1|3|5|7|8|10|12$/.test(month)) {
                    callback(calendarIndex.formatDay(31));
                }else if (/^4|6|9|11$/.test(month)) {
                    callback(calendarIndex.formatDay(30));
                }else if (/^2$/.test(month)) {
                    if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
                        callback(calendarIndex.formatDay(29));
                    }
                    else {
                        callback(calendarIndex.formatDay(28));
                    }
                }else {
                    throw new Error('month is illegal');
                }
            }

            selectDateDom.addEventListener('click', function(){
                // $('.footerNav').css('display','none');
                var oneLevelId = showDateDom.dataset['year'];
                var twoLevelId = showDateDom.dataset['month'];
                var threeLevelId = showDateDom.dataset['date'];
                var iosSelect = new IosSelect(3,
                    [yearData, monthData, dayData],
                    {
                        title: '日期选择',
                        itemHeight: 35,
                        relation: [1, 1],
                        oneLevelId: oneLevelId,
                        twoLevelId: twoLevelId,
                        threeLevelId: threeLevelId,
                        callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                            // $('.footerNav').css('display','block');
                            if(selectTwoObj.id.length==1){
                                selectTwoObj.id = "0"+selectTwoObj.id;
                            }
                            if(selectThreeObj.id.length==1){
                                selectThreeObj.id = "0"+selectThreeObj.id;
                            }
                            showDateDom.dataset['year'] = selectOneObj.id;
                            showDateDom.dataset['month'] = parseInt(selectTwoObj.id);
                            showDateDom.dataset['date'] = parseInt(selectThreeObj.id);
                            $(showDateDom).html(selectOneObj.id + '年' + selectTwoObj.id + '月');
                            var selectedDate = new Date(selectOneObj.id + '-' + selectTwoObj.id + '-' + selectThreeObj.id);
                            calendarIndex.selectedDate = selectedDate;
                            calendarIndex.weekCalendarInit(selectedDate);
                            //更新财经日历数据
                            calendarIndex.getCalendarData(commonMethod.formatDate(calendarIndex.selectedDate,'',true));
                            //更新选择日期（11-10 / 星期一）
                            calendarIndex.monthDay(new Date(selectedDate));
                        }
                    });
            });
        },

        formatYear: function(nowYear) {
            var arr = [];
            for (var i = nowYear + 2; i >= nowYear - 100; i--) {
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
        /****************************右上角日历******************************/

    }
    calendarIndex.init();
})