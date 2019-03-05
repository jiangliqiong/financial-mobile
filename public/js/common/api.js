/**
 * Created by Administrator on 2017/8/17.
 */
var fx_path = "https://shop.fmtxt.com";
var spider_path = "https://spider.fmtxt.com";
var wapApi = {
    /**
     * 登录注册退出
     */
    /******************************************/
    //获取登录状态
    getLoginStatus:{
        url: fx_path + '/wap/customer/login-data.do',
        data: {},
        type: '1'
    },
    //用户登录(根据参数不同分为：1.验证码登录；2.密码登录)
    userLogin:{
        url: fx_path + '/wap/customer/login.do',
        data: {},
        type: '1'
    },
    doOpenAccount:{
        url: fx_path + '/front/is-opened-mobile.do',
        data: {
            mobile:"",
            broker_id:"",
            code:""
        },
        type: '1'
    },
    //获取验证码
    getCheckCode:{
        url: fx_path + '/wap/customer/create-phone-code.do',
        data: {
            mobile:"",
        },
        type: '1'
    },
    //退出登录状态
    userLogOut:{
        url: fx_path + '/wap/customer/logout.do',
        data: {},
        type: '1'
    },
    /******************************************/
    //优质交易商列表
    getBrokerList:{
        url: fx_path + '/front/find-parameter-broker-list.do',
        data: {},
        type: '1'
    },
    //获取交易商信息
    getBrokerInfo:{
        url: '',
        data: {},
        type: '1'
    },
    //获取二维码
    getQrCode:{
        url: fx_path + '/customer/getQrCode.do',
        data: {},
        type: '1'
    },
    //交易商优惠活动
    getBrokerActivityList:{
        url: fx_path + '/front/find-broker-activity-list.do',
        data: {},
        type: '1'
    },
    //代理交易商列表
    getAgentsBrokerList:{
        url: fx_path + '/front/agents-broker-list.do',
        data: {},
        type: '1'
    },
    //账户余额
    getAccountBalance:{
        url: fx_path + '/front/find-customer-balance-money.do',
        data: {},
        type: '1'
    },
    //基本信息
    getBasicInfo: {
        url: fx_path + '/personal/find-customer-all-byId.do',
        data: {},
        type: '1'
    },
    //代理基本信息
    getIbBasicInfo: {
        url: fx_path + '/personal/find-ib-base-info.do',
        data: {},
        type: '1'
    },
    //是否已经开过户
    openedAccount : {
        url: fx_path + '/front/is-opened-customer.do',
        data : {},
        type: '1'
    },
    //资金出入明细信息
    getFundOutInDetail:{
        url: fx_path + '/front/customer-page-change-details.do',
        data: {},
        type: '1'
    },
    //判断是否代理过此交易商
    agentBrokerValid:{
        url: fx_path + '/personal/customer-broker-valid.do',
        data: {},
        type: '1'
    },
    //根据用户信息判断用户是否具有IB资格
    ibQualiValid:{
        url: fx_path + '/personal/ib-qualification-valid.do',
        data: {},
        type: '1'
    },
    //暂停代理
    pauseAgent:{
        url: fx_path + '/front/cancel-agents.do',
        data: {},
        type: '1'
    },
    //恢复代理
    recoverAgent:{
        url: fx_path + '/front/recover-agents.do',
        data: {},
        type: '1'
    },
    //更新基本信息
    updateBasicInfo: {
        url: fx_path + '/personal/update-customer-byId.do',
        data: {},
        type: '1'
    },
    //更新Ib基本信息
    updateIbBasicInfo: {
        url: fx_path + '/personal/update-introducing-broker-info.do',
        data: {},
        type: '1'
    },
    //更新Ib基本信息
    updateIbBasicInfoSingle: {
        url: fx_path + '/personal/update-introducing-broker-info-single.do',
        data: {},
        type: '1'
    },
    //变更代理商
    changeAgent: {
        url: fx_path + '/personal/fx-ib-open-change.do',
        data: {},
        type: '1'
    },
    //当前用户账户信息列表
    getAccountInfoList:{
        url: fx_path + '/front/foreign-account-exchange-status-list.do',
        data: {},
        type: '1'
    },
    //获取介绍人下的开户信息
    getIntroducerInfo:{
        url: fx_path + '/personal/find-open-by-introducer.do',
        data: {},
        type: '1'
    },
    /**
     * 个人中心首页项目接口
     */
    /*******************************************/
    //代理交易商个数
    getAgentTraderCount: {
        url: fx_path + '/front/total-ibAgents-count.do',
        data: {},
        type: '1'
    },
    //开户数
    getOpenAccountCount: {
        url: fx_path + '/front/total-open-count.do',
        data: {},
        type: '1'
    },

    //基本信息是否完善
    basicInfoIsComplete: {
        url: fx_path + '/front/is-customer-completed.do',
        data: {},
        type: '1'
    },
    //代理信息是否完善
    agentInfoIsComplete: {
        url: fx_path + '/front/is-ib-completed.do',
        data: {},
        type: '1'
    },
    //绑定银行卡数
    getBankCardCount:{
        url: fx_path + '/front/total-card-count.do',
        data: {},
        type: '1'
    },
    //最近一次返佣金额
    getLastRebate:{
        url: fx_path + '/front/last-back-money.do',
        data: {},
        type: '1'
    },
    //获取银行卡信息
    getBankCardList:{
        url: fx_path +  '/front/find-bank-account-detail.do',
        data: {},
        type: '1'
    },
    //获取余额返佣
    getBalance:{
        url: fx_path + '/front/find-customer-balance-money.do',
        data: {},
        type: '1'
    },
    //一个客户下的多个银行卡设置默认银行卡
    setDefaultBankCard:{
        url: fx_path + '/front/modify-bank-account-default.do',
        data: {},
        type: '1'
    },

    //发起提现
    customerApplyMoney:{
        url: fx_path + '/front/customer-wap-check-apply.do',
        data: {},
        type: '1'
    },
    /*******************************************/
    /**
     * 监管机构
     */
    /*****************************************/
    //监管机构列表
    getRegulatorList:{
        url: fx_path + '/front/find-regulator-list.do',
        data: {},
        type: '1'
    },
    //监管机构详情
    getRegulatorDetails:{
        url: fx_path + '/front/find-regulator-details.do',
        data: {},
        type: '1'
    },
    /*****************************************/

    /**
     * 财经日历
     */
    /**************************************/
    getCalendarData:{
        url: spider_path + '/finance-spider/exchange/fx-calendar',
        data: {},
        type: '1'
    },
    /**************************************/
    //获得国家的信息
    getCountry : {
        url: fx_path + '/city/find-all-country.do',
        data: {},
        type: '1'
    },
    getProvince : {//默认获得城市的信息
        url:fx_path+'/city/find-bypid.do',
        data:{
            cityid:'01'
        },
        type:"1"
    },
    getBrokerInfo : {//默认获得交易商的信息
        url:fx_path+'/front/broker/.do',
        data:{
            id:'',
        },
        type:"1"
    },
    addAgent:{
        url:fx_path+'/front/add-agents.do',
        data:{
            broker_id:'',
            customer_id:'',
            default_back:'',
        },
        type:"1"
    },
    introducerList:{
        url:fx_path+'/personal/find-open-by-introducer.do',
        data:{
            open_introducer:'',
            broker_id:''
        },
        type:"1"
    },
    qualificationIb : {//验证申请IB资格
        url:fx_path+'/personal/ib-qualification-valid.do',
        data:{
            customer_id:''
        },
        type:"1"
    },
    hasAccount : {  //是否已经开过户
        url:fx_path + '/front/is-opened.do',
        data : {
            "customerId":'',
            "broker_id":''
        },
        type : "1"
    },
    isReview : {  //是否已经审核
        url:fx_path + '/front/is-opened-customer.do',
        data : {
            "customerId":''
        },
        type : "1"
    },
    agentCheck:{
        url:fx_path + '/personal/customer-broker-valid-status.do',
        data : {
            "customer_id":'',
            "broker_id":''
        },
        type : "1"
    },
    phoneNumCheck:{
        url:fx_path + '/personal/introducer-mobile-valid.do',
        data : {
            "mobile":'',
        },
        type : "1"
    },
    getBackData : {  //拿回显数据
        url:fx_path + '/personal/find-customer-all-byId.do',
        data:{
            "customer_id":"",
        },
        state :true,
    },
    submitData : {
        url : fx_path + '/front/do-add.do',
        data : {} ,
        type : "1"
    },
    insrt : {
        url:fx_path+'/front/add-fxsimulation.do',
        data:{
            "customer_id": '',
            "broker_id": '',
        },
        type:"1"
    },
    searchResult:{  //搜索关联
        url:fx_path+'/front/search.do',
        data:{
            "keywords": '',
        },
        type:"1"
    },
    searchLink:{  //搜索关联
        url:fx_path+'/front/search-details.do',
        data:{

        },
        type:"1"
    },
    getDuiBa:{
        url:fx_path+'/temporary/duiba-scratch-ticket.do',
        data:{
            "uid":"",
        },
        type:"1"
    },
    //喊单交易品种
    getVarieties : {
        url: fx_path + '/front/get-basedata.do',
        data: {},
        type: '1'
    },
    //喊单列表
    getVarietiesList : {
        url: fx_path + '/front/find-fx-tactics-ib.do',
        data: {},
        type: '1'
    },
    //判断是否在24小时之内变更过代理商
    isIbChanged : {
        url: fx_path + '/front/is-ib-changed.do',
        data: {},
        type: '1'
    },
    $ajax: function(opt,success,error){
        var param = "?", obj = opt.data, url;
        if (typeof obj == "object") {
            for (var items in obj) {
                param = param + items + '=' + obj[items] + '&';
            }
            url =  opt.url + param + 'format=json&jsoncallback=?';
        } else {
            url =  opt.url + obj + '?format=json&jsoncallback=?';
        }
        $.getJSON(encodeURI(url), function (data) {
            if(data && (data.code == 0 || data.code == 10000 )) {
                success && success(data);
            }else {
                error && error(data);
            }
        });
    }
}
