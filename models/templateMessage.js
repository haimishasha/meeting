/**
 * Created by Administrator on 2015/8/23.
 */
var weChatConfig = require('../settings');
var API = require('wechat-api');

module.exports = function(url,openid,data,callback){
    var api = new API(weChatConfig.appid, weChatConfig.secret);
    var templateId =  'JinyRskvHebSTU-hJtFmKmkeKQusP0k2CwpAMv0HQ6A';
// URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
    var topColor = '#FF0000'; // 顶部颜色

    api.sendTemplate(openid, templateId, url, topColor, data, function(err,result){
        if(err){
            console.log(err);
            return callback(err)
        }
        console.log(result);
        callback(null,result);
    });

//OPENTM205738126//模板消息ip
    /*
     {{first.DATA}}
     发布单位：{{keyword1.DATA}}
     发布时间：{{keyword2.DATA}}
     {{remark.DATA}}*/

/*    {{first.DATA}}
    留言人：{{keyword1.DATA}}
    留言时间：{{keyword2.DATA}}
    {{remark.DATA}}*/
};


