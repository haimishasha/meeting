/*************************************************************************************/
/*                                                                                   */
/*                                 微信的功能                                        */
/*                                                                                   */
/*************************************************************************************/

var wechat     = require('wechat');
var WechatAPI  = require('wechat-api');
var OAuth      = require('wechat-oauth');
var config     = require('./config.js');
//var Bind_user  = require('../models/shakecard/bind_user.js');         //关注微信号的用户
//var User       = require('../models/shakecard/users.js');         //关注微信号的用户
var Signer     = require('../models/signin/signer.js');  //用户持有的iBeacon
var Signin     = require('../models/signin/signin.js');  //用户持有的iBeacon
// 创建wechat api
var api    = new WechatAPI(config.weixinConfig.appid, config.weixinConfig.appsecret);
// 创建wechat oauth client
var client = new OAuth(config.weixinConfig.appid, config.weixinConfig.appsecret);
// 微信验证
exports.wechat = wechat(config.weixinConfig, function (req, res, next) {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    var msgType = req.weixin.MsgType;
    var fromUserName = req.weixin.FromUserName;
    switch (msgType){
        case "event":{
              // 用户关注成功，保存用户信息
            if (req.weixin.Event == 'subscribe') {
                api.getUser(fromUserName, function (err, data, res) {
                    var openid     = data.openid;
                    var nickname   = data.nickname;
                    var headimgurl = data.headimgurl;
                    var remark     = data.remark;
                    // var sex        = data.sex;
                    // var language   = data.language;
                    // var city       = data.city;
                    // var province   = data.province;
                    // var country    = data.country;
                    
                    // 保存关注用户到微信用户实例中
                    var user = {
                    openid: openid,
                    nickname: nickname,
                    headimgurl: headimgurl,
                    remark: remark,
                    // sex: sex,
                    // city: city,
                    // province: province,
                    // country: country,
                    //language: language,
                    
                    }
                    var newUser = new User(user);
                    User.get(user.openid,function (err, user){
                        if(err){
                            console.log("error " + err);
                        }
                        if(!user){
                            newUser.save(function (err,user1){
                                if(err){
                                    console.log('微信关注用户信息保存失败,失败描述: ' + error.description);
                                }
                                if(user1){
                                    console.log("微信关注用户信息保存成功，openid：" + openid);
                                }
                            });
                        }
                    });
                });
                res.reply([
                    {
                        title: '感谢您关注Shake官方微信',
                        description: '您可以访问我们的微网站获取更多的信息。',
                        picurl: 'http://shake.wisewechat.com/img/module8.jpg',
                        url: 'http://shake.wisewechat.com/home'
                    }
                ]);
                break;
            }
            // 用户取消关注，删除用户信息
            if (req.weixin.Event == 'unsubscribe') {
                res.reply();
                User.get(fromUserName,function (err,user){
                    if(err){
                        console.log('微信取消关注用户信息保存失败,失败描述: ' + err.description);  
                    }
                    if(user){ 
                        // User.delete(fromUserName,function (err){
                        //     if(err){
                        //         console.log('微信取消关注用户信息保存失败,失败描述: ' + err.description);
                        //     }
                        //     console.log("微信取消关注用户信息删除成功，openid：" + fromUserName);
                        // });
                        console.log('用户取消关注，删除用户信息');

                    }
                });
                break;
            }
            res.reply();
            break;
        }
        case "text":{
            var Content = message.Content;
            switch(Content){
                case '注册':
                case 'zhuce':
                    res.reply([{
                        title:'点击进入注册页面',
                        description:'开始你的名片的第一步',
                        picurl:'http://shake.wisewechat.com/img/module8.jpg',
                        url:'http://shake.wisewechat.com/home'
                    }]);
                    break;
                case  '设计':
                case 'sheji':
                    res.reply([{
                        title:'设计页面体验版',
                        description:'设计独具个性的名片',
                        picurl:'http://shake.wisewechat.com/img/module8.jpg',
                        url:'http://shake.wisewechat.com/makeCard/1/1'
                    }]);
                    break;
                case  '注销':
                case 'zhuxiao':
                    res.reply([{
                        title:'注销页面',
                        description:'你可以删除你的所有信息',
                        picurl:'http://210.31.104.114/img/module8.jpg',
                        url:'http://shake.wisewechat.com/home'
                    }]);
                    break;
                case 'auth':
                    res.reply('https://210.31.104.114/oauth');
                    break;
              
                case'logout':
                    res.reply([{
                            title: '感谢您关注艾比肯官方微信',
                            description: '您可以访问我们的微网站获取更多的信息。',
                            picurl: 'http://aibiken-wifi.avosapps.com/img/module8.jpg',
                            url: 'http://aibiken-wifi.avosapps.com/wap/logout'
                        }
                    ]);
                    break;
                case'bind':
                    res.reply([{
                            title: '账号绑定',
                            description: '点击进行账号绑定操作。',
                            picurl: 'http://210.31.104.114/img/module8.jpg',
                            url: 'http://210.31.104.114/bind'
                        }
                    ]);
                    break;

              // case'sethome':
              // case'摇一摇':
              //     console.log(message);
              //     Weixin_user.get(fromUserName,function (err,weixin_user){
              //       if(err){
              //         console.log('wechat ibeacons set err:' + err);
              //         res.reply('出错啦，请稍后重试。');  
              //       }
              //       if(weixin_user){ 
              //         if (weixin_user.iBeacons.length == 0) {
              //             res.reply('您没有订购摇一摇产品，请访问商城购买后重试。');
              //         } else {
              //             res.reply([
              //                 {
              //                     title: '摇一摇页面设定',
              //                     description: '点击进行摇一摇页面设定操作。',
              //                     picurl: 'http://210.31.104.114/img/module8.jpg',
              //                     url: 'http://aibiken-wifi.avosapps.com/wap/sethome/' + shakeHand.id
              //                 }
              //             ]);
              //         }
              //       };
              //     });
              //   break;
                //res.reply('您的问题已收到，稍后我们会答复您！');
                
            }
            break;
        }
        case "image":
        //break;
        case "voice":
        //break;
        case "video":
        //break;
        case "location":
        //break;
        case "link":
        //break;
        default:{
            res.reply([
                {
                    title: '感谢您关注艾比肯官方微信',
                    description: '您可以访问我们的微网站获取更多的信息。',
                    picurl: 'http://aibiken-wifi.avosapps.com/i/wechat-qr.jpg',
                    url: 'http://aibiken-wifi.avosapps.com/wap'
                }
            ]);
            break;
        }
    }
    next;
});


// 微信网页认证
exports.oauth = function(req, res){
    var state = req.params.state;
    var url = req.url;
    if (state) {
        appurl = url.slice(6);

    } else {
        appurl = "/";
    }
    // 授权通过后的回调地址
    state = appurl;

    if(req.session.wxuser) {
        res.redirect(appurl);
    } else {
        var url = client.getAuthorizeURL('http://cardwechat.tyust.edu.cn/user/cardinfo', state, 'snsapi_userinfo'); //无关注也可以授权，有明显授权页面
        res.end(url);
        res.redirect(url);
    }
};

// 获取名片微信用户的Openid及其他一些基本信息
exports.getuserinfo_card = function(req, res){
    //console.log("===========");
    var code = req.query.code;
    var state = req.query.state;
    var appurl = "/";
    if (state) {
        appurl = state;
    }
    //console.log(req.query);
   // console.log(state);
   // console.log("=====1111111111");
    client.getAccessToken(code, function (err, result) {
        var data = result.data;
        req.session.openid = data.openid;  
        var openid = result.data.openid;
        console.log(openid);
        User.get(openid,function (err,user){
            if(err){
                console.log('getuserinfo1: ' + err.description);  
            }
            if(!user){ 
                client.getUser(openid, function (err, result) {
                    if(err){
                      console.log('use weixin api get user: '+ err)  
                    }
                    var oauth_user = result;
                    var newUser = {
                        openid:      oauth_user.openid,
                        nickname:    oauth_user.nickname,
                        headimgurl:  oauth_user.headimgurl,
                        remark:      oauth_user.remark,
                    };
                    var newuser = new User(newUser);
                    newuser.save(function (err, newuser){
                       if(err){
                            console.log('getuserinfo2: ' + err.description);
                       }
                       req.session.wxuser = newuser;
                       return res.redirect(appurl);
                    });
                });
            }else{
                req.session.wxuser = user;
                return res.redirect(appurl);
            }
        });
    });
};




// 用户绑定
exports.bind = function (req, res) {
    api.getFollowers(function(err, result) {
        if(err){
            console.log(err);
        }else{
            console.log(result);
        }
    });
    var wxuser = req.session.wxuser;
    // 倘若当前用户没有经过oauth授权，则没有openid，无法获取用户以保存的数据，所以，转向到静默授权页面（仅对关注用户有效）授权
    if(wxuser) 
    {
        res.render('bind', {
            openid: wxuser.openid
        });
    } else {
        res.redirect('/oauth/bind');
    }
};
//绑定post
exports.bindp = function (req, res) {
    var telephone = req.body.telephone;
    var name      = req.body.name;
    var openid    = req.body.openid;
    var bind_user = {
        telephone:  telephone,
        name:       name,
        openid:     openid
    }
    var newBind_user = new Bind_user(bind_user);
    newBind_user.get(telephone, name,function (err,bind_user){
        if(err){
            console.log("bindp error: " + err);
            //res.render('404', {message: error});
        }
        if(bind_user){
            console.log("您的这个邮箱已经与别的微信号绑定了！");
        }else{
            User.update(telephone, name, openid, function (err){
                if(err){
                    console.log("wechat err of bindp: err" + err);
                }else{
                    newBind_user.save(function (err,bind_user){
                        if(err){
                            console.log("bindp error: "+ err);
                        }
                        if(bind_user){
                            console.log('Bind Ok!');
                            return res.redirect('/');
                        }
                    });
                }
            });  
        }
    });
};


//创建菜单
exports.createMenu =  wechat(config.weixinConfig, function (req, res, next) {
    console.log('menu');
    var menu  = {
        "button": [
            {
                "type": "view", 
                "name": "关于我们", 
                "url": "http://shake.wisewechat.com/home"
            },
            {
                "type": "view", 
                "name": "签到", 
                "url": "http://shake.wisewechat.com/sign/0"
            }, 
            {
                "name": "名片", 
                "sub_button": [
                    {
                        "type": "view", 
                        "name": "注册", 
                        "url": "http://shake.wisewechat.com/home"
                    }, 
                    {
                        "type": "view", 
                        "name": "设计", 
                        "url": "http://shake.wisewechat.com/home"
                    }, 
                    {
                        "type": "view", 
                        "name": "注销", 
                        "url": "http://shake.wisewechat.com/home"
                    }
                ]
            }
        ]
    }
    api.createMenu(menu, function (err, menus){});
    console.log('================create menu========================');
    if (err) {
      console.log(err);
    }
    console.log(menus);
   res.end('Menu coming soon!')
});


//移除菜单
exports.removeMenu = function(req, res) {
    console.log('remove menu'); 
    api.removeMenu(function(err, menus){
        console.log('================remove menu========================');
        if (err) {
            console.log(err);
        }
        console.log(menus);
    });
    res.end('Menu coming gone!')
};

//获取菜单
exports.getMenu = wechat(config.weixinConfig,function(req, res, next) {
    console.log('get menu');
    api.getMenu(function(err, menus){
    console.log('================get menu========================');
        if (err) {
            console.log(err);
        }
        console.log(menus);
    });
    res.end('Menu coming gone!')
});

exports.client = client;




// 获取签到微信用户的信息
exports.getuserinfo_signin = function(req, res){
    getopenid(req,res,function (openid,state,appurl){
        var meetingid = state.slice(8);
        Signin.getSigner(meetingid,openid,function (err,signer){
            if(err){
                console.log('getsignerinfo1: ' + err.description);  
            }
            if(!signer){ 
                client.getUser(openid, function (err, result) {
                    if(err){
                      console.log('use weixin api get user: '+ err)  
                    }
                    var oauth_user = result;
                    var newSigner = {
                        openid:      oauth_user.openid,
                        nickname:    oauth_user.nickname,
                        headimgurl:  oauth_user.headimgurl,
                    };
                    var newsigner = new Signer(newSigner);
                    req.session.wxuser = newsigner;
                    req.session.stateOfSigner = "new";
                    return res.redirect(appurl); 
                });
            }else{  
                req.session.wxuser = signer;
                req.session.stateOfSigner = "old";
                return res.redirect(appurl); 
            }
        });
    });
};


// 获取签到微信用户的Openid
function getopenid(req,res,callback){
    var code = req.query.code;
    var state = req.query.state;
    var appurl = "/";
    if (state) {
        appurl = state;
    }
    client.getAccessToken(code, function (err, result) {
        var data = result.data;
        req.session.openid = data.openid;  
        var openid = result.data.openid;
        callback(openid,state,appurl);
    });
}
// 获取签到微信用户的详细信息
function getuserinfo(openid,callback){
    client.getUser(openid, function (err, result) {
        if(err){
          console.log('use weixin api get user: '+ err)  
        }
        callback(result);
    });
}