/**
 * Created by Administrator on 2017/9/7.
 */
;$(function () {
    var bankWithdraw = {
        user: null,
        bankCard: {
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
        },
        getLoginStatus:function () {
            wapApi.$ajax(wapApi.getLoginStatus,function (res) {
                if( res.result && res.result.id && res.result.id != -1 ){
                    bankWithdraw.user = res.result;
                    bankWithdraw.init();
                }else{
                    window.location.href = '/index.html';
                }
            },function () {
                window.location.href = '/index.html';
            })
        },
        init:function () {
            // var addFlag = commonMethod.getUrlParameter('addFlag');
            // if(addFlag && addFlag == 1) bankWithdraw.bankCardListInit();

            bankWithdraw.inputValInit();
            //获取余额
            bankWithdraw.getBalance();
            //获取默认银行卡
            bankWithdraw.getBankCardList();
            bankWithdraw.bindEvent();
        },
        bindEvent:function () {
            $('body').on('blur','#inputMoney',bankWithdraw.limitDecimal);
            // $('body').on('click','.bankCard .item',bankWithdraw.selectBankCard);
            $('body').on('click','.allWithdrawBtn',bankWithdraw.allWithdrawHandle);
            //发起提现
            $('body').on('click','#withdrawBtn',bankWithdraw.withdrawMoneyHandle);
        },
        inputValInit:function () {
            $('#inputMoney').val('');
        },
        //获取余额
        getBalance:function () {
            wapApi.getBalance.data = {customer_id: bankWithdraw.user.id};
            wapApi.$ajax(wapApi.getBalance,function (res) {
                if(res.result && res.result.code == 0 && res.result.obj ){
                    var data = res.result.obj;
                    //账户余额
                    var balance = data.balance_money;
                    $('#balanceValue').html(balance ? balance  : 0);
                    $('.allWithdrawBtn').data('val',balance);
                }
            })
        },
        //获取绑定银行卡
        getBankCardList:function () {
            wapApi.getBankCardList.data = {customer_id: bankWithdraw.user.id};
            wapApi.$ajax(wapApi.getBankCardList,function (res) {
                if(res.result && res.result.code == 0 && res.result.obj && res.result.obj.length > 0){
                    var bankCards = res.result.obj;
                    for( var i = 0; i < bankCards.length; i++ ){
                        var paramId = commonMethod.getUrlParameter('id');
                        var accountId = bankCards[i].account_id;
                        var is_default = bankCards[i].is_default;
                        if( paramId ){
                            if(paramId == accountId) bankWithdraw.showCard(bankCards[i]);
                        }else{
                            if(is_default == 1) bankWithdraw.showCard(bankCards[i]);
                        }
                    }
                }
            })
        },
        showCard:function (card) {
            var bankno = card.bank_no;
            for(var key in bankWithdraw.bankCard){
                if(bankno.indexOf(key) != -1){
                    var value = bankWithdraw.bankCard[key];
                    $('.bankCard .bankLogo').attr('src','/images/bank/'+value);
                }
            }
            var bankAccount = card.bank_account, len = card.bank_account.length, account='';
            if(bankAccount) account = bankAccount.slice(len - 4, len);
            $('.bankCard .bankName').html(card.chinese_name).data('accounid',card.account_id).data('accountname',card.account_name).data('branchname',card.branch_name).data('reservedphone',card.reserved_phone);
            $('.bankCard .bankAccount').html('(' + account + ')');
            $('.bankCard .defaultText').html(card.is_default == 1 ?'默认' : '');
            $('.bankCard .item').attr('href','selectCard.html?id='+card.account_id);
        },
        limitDecimal:function (e) {
            var val = e.currentTarget.value;
            if(!val) {
                $('#withdrawBtn').removeClass('on');
                e.currentTarget.value = '';
                return;
            }
            var decimalValue = Number(parseFloat(val)).toFixed(2);
            e.currentTarget.value = decimalValue;

            if(val - 0 <= 0){
                $('#withdrawBtn').removeClass('on');
                return;
            }

            var balance = $('#balanceValue').text();
            if(decimalValue - balance > 0){
                $('.hintText').show();
                $('.balanceText').hide();
            }else{
                $('.hintText').hide();
                $('.balanceText').show();
            }
            $('#withdrawBtn').addClass('on');
        },
        // selectBankCard:function () {
        //     bankWithdraw.bankCardListInit();
        // },
        // bankCardListInit:function () {
        //     $(this).selectBankCardLayer({
        //         user: bankWithdraw.user,
        //         okHandle:function (res) {
        //             if(res && res.bank_no){
        //                 var bankno = res.bank_no;
        //                 for(var key in bankWithdraw.bankCard){
        //                     if(bankno.indexOf(key) != -1){
        //                         var value = bankWithdraw.bankCard[key];
        //                         $('.bankCard .bankLogo').attr('src','/images/bank/'+value);
        //                     }
        //                 }
        //                 var bankAccount = res.bank_account, len = res.bank_account.length, account='';
        //                 if(bankAccount) account = bankAccount.slice(len - 4, len);
        //                 $('.bankCard .bankName').html(res.chinese_name).data('accounid',res.account_id).data('accountname',res.account_name).data('branchname',res.branch_name).data('reservedphone',res.reserved_phone);
        //                 $('.bankCard .bankAccount').html('(' + account + ')');
        //                 $('.bankCard .defaultText').html(res.is_default == 1 ?'默认' : '');
        //             }
        //         }
        //     });
        // },
        allWithdrawHandle:function () {
            $('#inputMoney').val($(this).data('val')).trigger('focus');
        },
        withdrawMoneyHandle:function () {
            var _this = this;
            if(!$(_this).hasClass('on')) return false;
            var money =  $('#inputMoney').val();
            var total = $('#balanceValue').text();
            if(parseFloat(money) <= 0){
                $(_this).mildHintLayer({type:2,msg:'请输入有效金额'});
                return false;
            }
            if(parseFloat(money) - parseFloat(total) > 0){
                $(_this).mildHintLayer({type:2,msg:'您的可提现余额不足'});
                return false;
            }
            if($(_this).hasClass('noclick')) return false;
            $(_this).addClass('noclick');
            var param = {
                customer_id: bankWithdraw.user.id,
                account_id: $('.bankCard .bankName').data('accounid'),
                account_name: $('.bankCard .bankName').data('accountname'),
                apply_money: $('#inputMoney').val(),
                branch_name: $('.bankCard .bankName').data('branchname'),
                create_user: bankWithdraw.user.id,
                mobile: $('.bankCard .bankName').data('reservedphone')
            }

            wapApi.customerApplyMoney.data = param;
            wapApi.$ajax(wapApi.customerApplyMoney,function (res) {
                $(_this).removeClass('noclick');
                if(res.result && res.result.code == 10000 ){
                    window.location.href = 'success.html';
                }else{
                    window.location.href = 'failure.html';
                }
            },function () {
                $(_this).removeClass('noclick');
                window.location.href = 'failure.html';
            })
        }
    }
    bankWithdraw.getLoginStatus();
})