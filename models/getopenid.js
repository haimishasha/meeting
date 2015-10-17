
var https = require('https');
var url = require('url');
var weChatConfig = require('../settings');

module.exports = function(requrl,callback){

    var parse_url = url.parse(requrl,true,true);        //获取用户的从微信服务器返回信息转化为对象

    var code = parse_url.query.code;                    //读取对象中的code，用作下一步获取access_token和openid

    var getAccess_token = function(code){

        https.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + weChatConfig.appid + '&secret=' + weChatConfig.secret + '&code=' + code + '&grant_type=authorization_code',function(_res){
            _res.on('data',function(d){
                //process.stdout.write(d);                 //打印josn文件，d是接收微信服务器发送过来的数据
                var json = JSON.parse(d);                //将josn文件转化为对象
                var access_token = json.access_token;
                var openid = json.openid;                //获取用户的access_token和用户的openid
                //console.log('access:' + access_token); //打印access_token和openid用来测试
                //console.log('openid:' + openid);
                getUserInformation(openid,access_token); //调用getUserInformation()方法获取用户信息
            })
        }).on('error', function(e) {
            console.error(e);
        });
    };
//刷新access_token获取refresh_token
    var getRefresh_token = function(){
        https.get('https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=' + weChatConfig.appid + '&grant_type=refresh_token&refresh_token=REFRESH_TOKEN',function(_res){
            _res.on('data',function(d){                  //接收微信服务器发送的消息
                //process.stdout.write(d);                 //打印json文件
                var json = JSON.parse(d);                //将json转化为对象
                var refresh_token = json.refresh_token;  //获取refresh_token值
            }).on('error', function(e){
                console.log(e);
            });
        });
    };

//拉取用户信息
    var getUserInformation = function(openid,access_token){
        https.get('https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN',function(_res){
            _res.on('data',function(d){
                //process.stdout.write(d);
                var json = JSON.parse(d);                //获取用户信息
                var userInformation = json;
                callback(userInformation);
            }).on('error',function(e){
                console.log(e);
            });
        });
    };
    getAccess_token(code);
};