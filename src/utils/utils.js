"use strict";
/**
 * 时间戳转换成时间
 * @param {number} times 时间戳
 * @param {number} num 分割位数
 * num = 16 2020-02-24 01:00
 * num = 10 2020-02-24
 */
const timetrans = (times, num) => {
    let setNum = num || 16;
    let date = new Date(times + 8 * 3600 * 1000); // 增加8小时
    return date.toJSON().substr(0, setNum).replace('T', ' ');
}

/**
 * 校验手机号
 * @param {number | string} cellphone 手机号码
 */
const checkCellphone = (cellphone) => {
    const reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
    const flag = reg.test(cellphone);
    return flag;
}

/**
 * 检验身份证
 * @param {number | string} idCard 身份证号码
 */
const isIdCardNo = (idCard) => {
    //15位和18位身份证号码的正则表达式
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
        if (idCard.length == 18) {
            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); // 将前17位加权因子保存在数组里
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum = 0; // 用来保存前17位各自乖以加权因子后的总和
            for (var i = 0; i < 17; i++) {
                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
            }
            var idCardMod = idCardWiSum % 11; // 计算出校验码所在数组的位置
            var idCardLast = idCard.substring(17); // 得到最后一位身份证号码
            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod == 2) {
                if (idCardLast == "X" || idCardLast == "x") {
                    return true;
                } else {
                    return false;
                }
            } else {
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if (idCardLast == idCardY[idCardMod]) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    } else {
        return false;
    }
}

/**
 * 校验邮箱
 * @param {string} mail 邮箱
 */
const checkMail = (mail) => {
    const reg = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$/;
    const flag = reg.test(mail);
    return flag;
}

/**
 * 时间分割
 * yyyy年mm月dd日 - dd日
 * yyyy年mm月dd日 - mm月dd日
 * yyyy年mm月dd日 - yyyy年mm月dd日
 * @param {String} start_date 开始时间
 * @param {String} end_date 结束时间
 */
const transRangeDate = (start_date, end_date) => {
    const startArr = start_date.split("-");
    const endArr = end_date.split("-");
    const tempStart = new Date(start_date.replace(/\-/g, '/'));
    const tempEnd = new Date(end_date.replace(/\-/g, '/'));
    if (tempStart.getFullYear() < tempEnd.getFullYear()) {
        return `${startArr[0]}年${startArr[1]}月${startArr[2]}日 - ${endArr[0]}年${endArr[1]}月${endArr[2]}日`;
    }
    if (tempStart.getMonth() < tempEnd.getMonth()) {
        return `${startArr[0]}年${startArr[1]}月${startArr[2]}日 - ${endArr[1]}月${endArr[2]}日`;
    }
    return `${startArr[0]}年${startArr[1]}月${startArr[2]}日 - ${endArr[2]}日`;
}

/**
 * 金额分割，实现金额整数和小数点后的大小样式
 * @param {String | Number} money 金额
 */
const splitMoney = (money) => {
    const newMoney = ('' + money).split(".");
    if (newMoney.length < 2) {
        newMoney.push('');
    }
    return newMoney;
}

/**
 * 手机号隐藏中间4位
 * @param {String} phone 手机号
 */
const hidePhone = (phone) => {
    const reg = /^(\d{3})\d{4}(\d{4})$/; 
    const newPhone = phone.replace(reg, "$1 **** $2");
    return newPhone;
}

/**
 * 计算时间距现在多久
 * @param {String} oldDate 需要转换的时间
 */
const dateDiff = (oldDate) => {
    let result = null;// 最后的结果
    const now = new Date().getTime();// 当前时间
    const diffDate = new Date(oldDate.replace(/\-/g, '/')).getTime();// 传入的过去时间
    const minute = 1000 * 60;// 1分钟
    const hour = minute * 60;// 1小时
    const day = hour * 24;// 1天
    const calcStamp = now - diffDate;// 计算的相差时间戳
    const _minute = calcStamp / minute;
    const _hour = calcStamp / hour;
    const _day = calcStamp / day;
    if (_day >= 1) {
        result = oldDate;// 不需要转换
    } else if (_hour >= 1) {
        result = parseInt(_hour) +"小时前";
    } else if (_minute>=1) {
        result = parseInt(_minute) +"分钟前";
    } else {
        result = "刚刚";
    }
    return result;
}

/**
 * 为base64加密服务变量和方法
 */
const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const _utf16to8 = (str) => {
    let out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
/**
 * base64加密实现
 * @param {string} str 待加密字符串
 */
const base64encode = (str) => {
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;
    str = _utf16to8(str);
    while (i < str.length) {
        chr1 = str.charCodeAt(i++);
        chr2 = str.charCodeAt(i++);
        chr3 = str.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
}

/**
 * 格式化时间 - 倒计时需要
 * 1天1时1分1秒
 * 1时1分1秒
 * 1分1秒
 * 1秒
 * @param {String | Number} val 字符串数字或数字 
 */
const formatDate = (val) => {
    let tempVal = val;
    const _day = 1000 * 60 * 60 * 24;
    const _hour = 1000 * 60 * 60;
    const _minute = 1000 * 60;
    const _second = 1000;
    let _dd = '', _hh = '', _mm = '', _ss = '';
    if (tempVal > _day) {
        _dd = Math.floor(tempVal / _day);
        tempVal = tempVal - (_dd * _day);
        _dd = _dd + '天';
    }
    if (tempVal > _hour) {
        _hh = Math.floor(tempVal / _hour);
        tempVal = tempVal - (_hh * _hour);
        _hh = _hh + '时';
    }
    if (tempVal > _minute) {
        _mm = Math.floor(tempVal / _minute);
        tempVal = tempVal - (_mm * _minute);
        _mm = _mm + '分';
    }
    if (tempVal > 0) {
        _ss = Math.floor(tempVal / _second);
        _ss = _ss + '秒';
    }
    const newVal = _dd + _hh + _mm + _ss;
    return newVal;
}

/**
 * 聊天使用的时间格式
 * 2020年01月01日 01:01
 * 01月01日 01:01
 * @param {String} val 待转换的时间 2020-03-03 20:51:51
 */
const chatDate = (val, isYear) => {
	if(!val) return '';
    let timesArr = val.split("-");
    const todayYear = new Date().getFullYear();
    if (parseInt(timesArr[0]) <= todayYear) {
        if (!isYear) {
            // 加入isYear是为了适配直播的时间
            timesArr[0] = "";
        }
    }
    timesArr[2] = timesArr[2].substring(0, 8);
    const smallTimeArr = timesArr[2].split(" ");
    let result = null;
    if (timesArr[0] === "") {
        result = `${timesArr[1]}月${smallTimeArr[0]}日 ${smallTimeArr[1]}`;
    } else {
        result = `${timesArr[0]}年${timesArr[1]}月${smallTimeArr[0]}日 ${smallTimeArr[1]}`;
    }
    return result;
}

module.exports = {
    timetrans,
    checkCellphone,
    isIdCardNo,
    checkMail,
    transRangeDate,
    splitMoney,
    hidePhone,
    dateDiff,
    base64encode,
    formatDate,
    chatDate
}