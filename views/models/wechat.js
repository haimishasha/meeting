/**
 * Created by Administrator on 2015/8/23.
 */
var weChatConfig = require('./setting');
var API = require('wechat-api');
var api = new API('weChatConfig.appid', 'weChatConfig.secret');
var templateId =  'OPENTM205738126';
// URL�ÿգ����ڷ��ͺ�,���ģ����Ϣ�����һ���հ�ҳ�棨ios��, ���޷������android��
var url = '';
var topColor = '#FF0000'; // ������ɫ

var data = {
        first: {
            "value":"��ϲ�㹺��ɹ���",
            "color":"#173177"
        },
        keynote1: {
            "value":"�ɿ���",
            "color":"#173177"
        },
        keynote2: {
            value:"2014��9��16��",
            color:"#173177"
        },
        remark: {
            value:"��ӭ�ٴι���",
            color:"#173177"
        }
};
api.sendTemplate('openid', templateId, url, topColor, data, callback);

//OPENTM205738126//ģ����Ϣip
/*
{{first.DATA}}
������λ��{{keyword1.DATA}}
����ʱ�䣺{{keyword2.DATA}}
{{remark.DATA}}*/
