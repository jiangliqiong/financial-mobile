/**
 * Created by Administrator on 2017/8/31.
 */
;$(function () {
    var supervisionDetail = {
        init:function () {
            supervisionDetail.detailInit();
        },
        detailInit:function () {
            $('.loading').show();
            var regulator_id = commonMethod.getUrlParameter('id');
            wapApi.getRegulatorDetails.data = {regulator_id:regulator_id};
            wapApi.$ajax(wapApi.getRegulatorDetails,function (res) {
                $('.loading').hide();
                $('.loadfail').addClass('fxHidden').removeClass('fxVisible');
                if( res.result && res.result.code == 0 && res.result.obj ){
                    //seo初始化
                    var regulator = res.result.obj;
                    document.title = regulator.regulator_name + '_外汇-选财外汇fmtxt.com';
                    $("meta[name='keywords']").attr("content",regulator.regulator_name);
                    $("meta[name='description']").attr("content",'选财外汇中的外汇交易由'+regulator.regulator_name+'共同监管内容及交易!');

                    var html = $.tppl(document.getElementById('detailTml').innerHTML, {list: res.result.obj});
                    $('#detailBox').append($(html));

                    $('.nodata').addClass('fxHidden').removeClass('fxVisible');
                    $('.contentBox').css('display','block');
                }else{
                    $('.nodata').addClass('fxVisible').removeClass('fxHidden');
                }
            },function () {
                $('.loadfail').addClass('fxVisible').removeClass('fxHidden');
                $('.loading').hide();
            })
        }
    }
    supervisionDetail.init();
})
