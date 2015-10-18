/**
 * Created by Administrator on 2015/8/12.
 */
var createTicket = require('./createTicket.js');
var crypto = require('crypto');
//var mongodb = require('../db');
module.exports = function(url,callback){
    var config = {
        appId: 'wx6569c93469ff6026', // ±ØÌî£¬¹«ÖÚºÅµÄÎ¨Ò»±êÊ¶
        timestamp: '', // ±ØÌî£¬Éú³ÉÇ©ÃûµÄÊ±¼ä´Á
        nonceStr: '', // ±ØÌî£¬Éú³ÉÇ©ÃûµÄËæ»ú´®
        signature: ''// ±ØÌî£¬Ç©Ãû£¬¼û¸½Â¼1
    };

    /*var getTicket = function(callback){
        mongodb.open(function(err,db){
            if(err){
                return callback(err);
            }
            db.collection('ticket',function(err,collection){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                collection.find('ticket',function(err,ticket){
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    callback(ticket);
                });
            });
        });
    };*/

    var getNoncestr = function(){
        var noncestr = Math.random().toString(36).substr(2,16);
        //Math.random()²úÉú0-1Ö®¼äµÄËæ»ú¼ÆÊý
        //toString(n)²úÉú2-36Ö®¼äµÄn½øÖÆÊý£¬substr(2,15)½ØÈ¡×Ö·û´®µÚ¶þ¸ö¿ªÊ¼£¬Ò»¹²15Î»
        console.log('noncestr:' + noncestr);
        config.nonceStr = noncestr;
        return noncestr;

    };

    var getTimestamp = function() {
        var timestamp = parseInt(new Date().getTime() / 1000);
        //½«ÏÖÔÚÖ¸¶¨µÄÈÕÆÚºÍÊ±¼ä¾Ý 1970/1/1 ÎçÒ¹£¨GMT Ê±¼ä£©Ö®¼äµÄºÁÃëÊýÔÚÈ¥³ýÁ½Î»
        console.log('timestamp:' + timestamp);
        config.timestamp = timestamp;
        return timestamp;
    };

    var Sha1 = function(config,url) {
        var str = 'jsapi_ticket=' + config.jsapi_ticket + '&noncestr=' + config.nonceStr + '&timestamp=' + config.timestamp + '&url=' + url;
        var shaSum = crypto.createHash('sha1');
        shaSum.update(str);
        var shaResult = shaSum.digest('hex');
        //console.log('shaResult:' + shaResult);
        config.signature = shaResult;
        callback(config);
    };
    createTicket(function (js) {
        config.jsapi_ticket = js;
        getNoncestr();
        getTimestamp();
        Sha1(config,url);
    });


};