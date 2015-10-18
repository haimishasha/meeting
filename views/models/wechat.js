/**
 * Created by Administrator on 2015/8/23.
 */
var weChatConfig = require('./setting');
var API = require('wechat-api');
var api = new API('weChatConfig.appid', 'weChatConfig.secret');
var templateId =  'OPENTM205738126';
// URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
var url = '';
var topColor = '#FF0000'; // 顶部颜色

var data = {
        first: {
            "value":"恭喜你购买成功！",
            "color":"#173177"
        },
        keynote1: {
            "value":"巧克力",
            "color":"#173177"
        },
        keynote2: {
            value:"2014年9月16日",
            color:"#173177"
        },
        remark: {
            value:"欢迎再次购买！",
            color:"#173177"
        }
};
api.sendTemplate('openid', templateId, url, topColor, data, callback);

//OPENTM205738126//模板消息ip
/*
{{first.DATA}}
发布单位：{{keyword1.DATA}}
发布时间：{{keyword2.DATA}}
{{remark.DATA}}*/
