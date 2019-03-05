/**
 * Created by Administrator on 2017/8/31.
 */
;$(function () {
    var supervisionList = {
        currentIndex : 0, //最后一条数据的index
        pageSize: 10, //每页条数
        dataList : null,
        loading:false, //是否正在加载
        init: function () {
            supervisionList.getRegulatorList();
            supervisionList.scrollTo();
        },
        getRegulatorList:function () {
            $('.loading').show();
            $('#supervisionListBox').empty();
            wapApi.$ajax(wapApi.getRegulatorList,function (res) {
                $('.loading').hide();
                $('.loadfail').addClass('fxHidden').removeClass('fxVisible');
                if( res.result && res.result.code == 0 && res.result.obj.length > 0){
                    $('.loadingMore').css('display','block');
                    supervisionList.dataList = res.result.obj;
                    supervisionList.splitScreenRender();
                    $('.nodata').addClass('fxHidden').removeClass('fxVisible');
                }else{
                    $('.nodata').addClass('fxVisible').removeClass('fxHidden');
                }
            },function () {
                $('.loadfail').addClass('fxVisible').removeClass('fxHidden');
                $('.loading').hide();
            })
        },
        splitScreenRender:function () {
            var startIndex = supervisionList.currentIndex,
                endIndex = supervisionList.currentIndex + supervisionList.pageSize,
                data = supervisionList.dataList;
            var len = data.length;
            if(startIndex >= len){
                $('.loadingMore').html('已经没有数据了');
                return false;
            }
            var list = data.slice(startIndex,endIndex);
            for(var i = 0; i < list.length; i++){
                var introduce = list[i].regulator_introduce;
                if(introduce) list[i].regulator_introduce = commonMethod.trim(introduce);
            }
            var html = $.tppl(document.getElementById('supervisionListTml').innerHTML, {list: list});
            $('#supervisionListBox').append($(html));
            supervisionList.currentIndex = endIndex;
        },
        scrollTo:function () {
            window.onscroll = function(){
                //滚动条距离顶部距离
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                //内容高度
                var heihgt =  $(document).height();
                //屏幕高度
                var screenHeight = $(this).height();

                if(heihgt > 3200 && scrollTop > 100){
                    scrollToTopIcon.addScrollBtn();
                }else{
                    scrollToTopIcon.removeScrollBtn();
                }

                if(scrollTop + screenHeight + 100 >= heihgt){
                    if(!supervisionList.loading){
                        supervisionList.loading = true;
                        setTimeout(function () {
                            supervisionList.splitScreenRender();
                            supervisionList.loading = false;
                        },1000)
                    }
                }
            }
        },
    }
    supervisionList.init();
})
