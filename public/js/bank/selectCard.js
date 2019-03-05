/**
 * Created by Administrator on 2017/9/30.
 */
var selectCard = ( function (mod){
    var user = null;
    var getLoginStatus = function () {
        wapApi.$ajax(wapApi.getLoginStatus,function (res) {
            if( res.result && res.result.id && res.result.id != -1 ){
                user = res.result;
                cardListInit();
            }else{
                window.location.href = '/index.html';
            }
        },function () {
            window.location.href = '/index.html';
        })
    }
    var bankCard = {
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
    }
    var cardListInit = function () {
        wapApi.getBankCardList.data = {customer_id: user.id};
        wapApi.$ajax(wapApi.getBankCardList,function (res) {
            if(res.result && res.result.code == 0 && res.result.obj && res.result.obj.length > 0){
                var bankCards = res.result.obj;
                var paramId = commonMethod.getUrlParameter('id');
                for(var i = 0; i < bankCards.length; i++){
                    var accountId = bankCards[i].account_id;
                    var bankno = bankCards[i].bank_no;
                    for(var key in bankCard){
                        if(bankno.indexOf(key) != -1){
                            var value = bankCard[key];
                            bankCards[i].bankLogo = '/images/bank/'+value;
                        }
                    }
                    var len = bankCards[i].bank_account.length;
                    bankCards[i].bankAccount = bankCards[i].bank_account.slice( len - 4, len );
                    if(accountId == paramId){
                        bankCards[i].selected = true;
                    }
                }
                var html = $.tppl(document.getElementById('bankCardListTml').innerHTML, {list:bankCards});
                $('#bankCardListBox').html(html);
            }
        })
    }
    return {
        init: getLoginStatus
    };
})(window.selectCard || {});
selectCard.init();