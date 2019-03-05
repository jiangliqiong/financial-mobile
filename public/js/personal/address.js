/**
 * Created by Administrator on 2017/8/22.
 */
;$(function () {
    var personalAddress = {
        user : null,
        //获取登录状态
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 ){
                    personalAddress.user = res.result;
                    personalAddress.init();
                }else{
                    window.location.href = '/index.html';
                }
            },function () {
                window.location.href = '/index.html';
            })
        },
        init:function () {
            personalAddress.countrySelect();
            personalAddress.regionSelect();
            personalAddress.addressInfoInit();
            personalAddress.bindEvent();
        },
        bindEvent:function () {
            $('body').on('click','.submitAddressBtn',personalAddress.submitAddress);
            $('body').on('keyup','input[name="street"]',personalAddress.streetKeyup);
            $('body').on('input','#street',personalAddress.showClearBtn);
            $('body').on('focus','#street',personalAddress.showClearBtn);
            $('body').on('blur','#street',personalAddress.hideClearBtn);
            $('body').on('tap','.clearIcon',personalAddress.clearStreet);
        },
        showClearBtn:function () {
            if(this.value) $(this).siblings('.clearIcon').css('display','block');
        },
        hideClearBtn:function () {
            $(this).siblings('.clearIcon').css('display','none');
        },
        streetKeyup:function () {
            personalAddress.addressCheck();
        },
        clearStreet:function (e) {
            e.preventDefault();
            $(this).siblings('#street').val('').focus().trigger('input');
            personalAddress.addressCheck();
        },
        //国家下拉列表数据初始化
        countrySelect:function () {
            var countryDom = document.querySelector('#country');
            var countryValueDom = document.querySelector('#countryValue');
            countryDom.addEventListener('click', function () {
                var countryId = countryValueDom.dataset['id'];
                var coutryName = countryValueDom.dataset['value'];
                wapApi.getCountry.data = {cityflag: 1};
                wapApi.$ajax(wapApi.getCountry,function(res){
                    if(res.result && res.result.length > 0){
                        var data = [], items = res.result;
                        for(var i = 0; i < items.length; i++){
                            var item = items[i];
                            data[i] = {"id": item.cityid ? item.cityid : '',"value": item.name ? item.name : ''};
                        }
                        var countrySelect = new IosSelect(1,
                            [data],
                            {
                                container: '.container',
                                title: '国家选择',
                                itemHeight: 50,
                                itemShowCount: 3,
                                oneLevelId: countryId,
                                callback: function (selectOneObj) {
                                    countryValueDom.value = selectOneObj.value;
                                    countryValueDom.dataset['id'] = selectOneObj.id;
                                    countryValueDom.dataset['countryid'] = selectOneObj.id;
                                    countryValueDom.dataset['countryname'] = selectOneObj.value;
                                    $('#regionValue').val('');
                                    personalAddress.addressCheck();
                                }
                            });
                    }
                })
            });
        },
        //所在地区下拉列表初始化
        regionSelect:function () {
            var provinceData = [],cityData = [];
            var regionDom = document.querySelector('#region');
            var regionValueDom = document.querySelector('#regionValue');
            var provinceData = function(callback) {
                wapApi.getProvince.data = {cityid: $("#countryValue").data('countryid') ? $("#countryValue").data('countryid') : '01'};
                wapApi.$ajax(wapApi.getProvince,function(res){
                    if(res.result && res.result.length > 0){
                        var items = res.result;
                        callback(personalAddress.getRegionData(items));
                    }
                })
            }
            var cityData = function (provinceData,callback) {
                wapApi.getProvince.data = {cityid:provinceData};
                wapApi.$ajax(wapApi.getProvince,function(res){
                    if(res.result && res.result.length > 0){
                        var items = res.result;
                        callback(personalAddress.getRegionData(items));
                    }
                })
            };
            regionDom.addEventListener('click', function () {
                var oneLevelId = $(regionValueDom).data('provinceid');
                var twoLevelId = $(regionValueDom).data('cityid');
                var regionSelect = new IosSelect(2,
                    [ provinceData, cityData],
                    {
                        title: '地区选择',
                        itemHeight: 35,
                        relation: [1, 1],
                        oneLevelId: oneLevelId,
                        twoLevelId: twoLevelId,
                        callback: function (selectOneObj, selectTwoObj) {
                            regionValueDom.dataset['provinceid'] = selectOneObj.id;
                            regionValueDom.dataset['cityid'] = selectTwoObj.id;
                            regionValueDom.value = selectOneObj.value + ' ' + selectTwoObj.value;
                            regionValueDom.dataset['provincename'] = selectOneObj.value;
                            regionValueDom.dataset['cityname'] = selectTwoObj.value;
                            personalAddress.addressCheck();
                        }
                    });
            })

        },
        //地区数据处理
        getRegionData:function (items) {
            var data=[];
            for(var i = 0; i < items.length; i++){
                var item = items[i];
                data[i] = {"id": item.cityid ? item.cityid : '',"value": item.name ? item.name : ''};
            }
            return data;
        },
        //区分是基本信息地址还是代理商信息的所在地
        addressInfoInit:function () {
            var type = commonMethod.getUrlParameter('type');
            type == 'ib' ? personalAddress.ibInfoAddressInit() : personalAddress.basicInfoAddressInit();
        },
        //基本信息地址初始化
        basicInfoAddressInit:function () {
            wapApi.getBasicInfo.data = {customer_id:personalAddress.user.id};
            wapApi.$ajax(wapApi.getBasicInfo,function (res) {
                if(res.result && res.result.code == 0 && commonMethod.getJsonLength(res.result.obj) > 0) {
                    var info = res.result.obj;
                    $('input[name="country"]').val(info.countryName ? info.countryName : '中国').data('countryid',info.country_id ? info.country_id : '01').data('val',info.countryName).data('id',info.country_id ? info.country_id : '01');
                    $('input[name="region"]').val(info.provinceNmae  + " " + info.cityName ).data('provinceid',info.province_id).data('cityid',info.cityid).data('val',info.provinceNmae + " " + info.cityName);
                    $('input[name="street"]').val(info.regiondesc).data('val',info.regiondesc);
                    personalAddress.addressCheck();
                }
            })
        },
        //代理商信息的所在地初始化
        ibInfoAddressInit:function () {
            wapApi.getIbBasicInfo.data = {customer_id:personalAddress.user.id};
            wapApi.$ajax(wapApi.getIbBasicInfo,function (res) {
                if(res.result && res.result.code == 10000 && commonMethod.getJsonLength(res.result.obj) > 0) {
                    var info = res.result.obj;
                    $('input[name="country"]').val(info.country_name ? info.country_name : '中国').data('countryid',info.country_id ? info.country_id : '01').data('val',info.countryName).data('id',info.country_id ? info.country_id : '01');
                    $('input[name="region"]').val(info.province_name + " " + info.city_name ).data('provinceid',info.province_id).data('cityid',info.city_id).data('val',info.provinceNmae + " " + info.cityName);
                    $('input[name="street"]').val(info.ib_address).data('val',info.regiondesc);
                    personalAddress.addressCheck();
                }
            })
        },
        //地址提交区分
        submitAddress:function () {
            if(!$(this).hasClass('active')){
                return false;
            }
            var type = commonMethod.getUrlParameter('type');
            type == 'ib' ? personalAddress.submitIbInfoAddress() : personalAddress.submitBasicInfoAddress();
        },
        //提交基本信息地址
        submitBasicInfoAddress:function () {
            var country = $('input[name="country"]').val();
            var region = $('input[name="region"]').val();
            var street = $('input[name="street"]').val();
            if(personalAddress.addressValidate(country,region,street)){
                var _this = this;
                if($(_this).hasClass('noclick')){
                    return false;
                }
                $(_this).addClass('noclick');
                var param = {
                    customer_id: personalAddress.user.id,
                    modify_user: personalAddress.user.id,
                    country_id: $('input[name="country"]').data('countryid'),
                    province_id: $('input[name="region"]').data('provinceid'),
                    cityid: $('input[name="region"]').data('cityid'),
                    regiondesc: street
                }
                wapApi.updateBasicInfo.data = param;
                wapApi.$ajax(wapApi.updateBasicInfo,function (res) {
                    if(res.result && res.result.code == 0) {
                        window.location.href = 'basicInfo.html';
                    }else{
                        $(_this).mildHintLayer({type:2,msg:'提交失败'});
                    }
                },function (error) {
                    $(_this).mildHintLayer({type:2,msg:'提交失败'});
                })

            }
        },
        //提交IB代理信息地址
        submitIbInfoAddress:function () {
            var country = $('input[name="country"]').val();
            var region = $('input[name="region"]').val();
            var street = $('input[name="street"]').val();
            if(personalAddress.addressValidate(country,region,street)){
                var _this = this;
                if($(_this).hasClass('noclick')){
                    return false;
                }
                $(_this).addClass('noclick');
                var param = {
                    customer_id: personalAddress.user.id,
                    country_id: $('input[name="country"]').data('countryid'),
                    province_id: $('input[name="region"]').data('provinceid'),
                    city_id: $('input[name="region"]').data('cityid'),
                    ib_address: street,
                    update_type: 1
                }
                wapApi.updateIbBasicInfo.data = param;
                wapApi.$ajax(wapApi.updateIbBasicInfo,function (res) {
                    if(res.result && res.result.code == 10000) {
                        window.location.href = 'ibmsg.html';
                    }else{
                        $(_this).mildHintLayer({type:2,msg:'提交失败'});
                    }
                },function (error) {
                    $(_this).mildHintLayer({type:2,msg:'提交失败'});
                })

            }
        },
        addressValidate:function (country,region,street) {
            if( !country ){
                $('body').mildHintLayer({type:3,msg:'请选择国家'});
                return false;
            }

            if( !region ){
                $('body').mildHintLayer({type:3,msg:'请选择所在地区'});
                return false;
            }

            if( !street ){
                $('body').mildHintLayer({type:3,msg:'请填写街道地址'});
                return false;
            }
            return true;
        },
        //检验地址是否修改
        addressCheck:function () {
            //国家比较
            if(!$('input[name="country"]').val() || !$('input[name="region"]').val() || !$('input[name="street"]').val()){
                $('.submitAddressBtn').removeClass('active');
            }else {
                $('.submitAddressBtn').addClass('active');
            }
        }
    }
    personalAddress.getLoginStatus();
})
