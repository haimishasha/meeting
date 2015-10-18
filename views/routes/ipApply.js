
 
var Admin = require('../models/user.js');
var IpApply = require('../models/ipApply.js');
var getOpenId = require('../models/getopenid.js');
var templateMessage = require('../models/templateMessage');
var API = require('wechat-api');
var wechat = require('wechat');
var weChatConfig = require('../settings');
var https = require('https');
module.exports = function(app){
    app.get('/ipApplyindex', function(req, res) {
        console.log('user:');
        console.log(req.session);
        res.render('ipApplyindex',{title:"Ê×Ò³"});
    });
    app.get('/internet-connection',function(req, res){
        res.render('internet-connection',{title:"ÍøÂç¿ªÍ¨"})
    });

    app.get('/internet-connection-ip-next',checkLogin);
    app.get('/internet-connection-ip-next',function(req, res){
        var openid = req.session.openid;
    
        IpApply.getOne(openid,function(err,ipApplys){
            var i = 0,j = 0;
            var ipApplyF = new Array();    
            var ipApplyW = new Array();  
            if(err){
                ipApplyF = [];
                ipApplyW = [];

            }else{
                ipApplys.forEach(function(ipApply){
                    if(ipApply.adminIP){
                        ipApplyF[i] = ipApply;
                        i++;
                    }else{
                        ipApplyW[j] = ipApply;
                        j++;
                    }
                });
            }
            res.render('internet-connection-ip-next',
                {
                    title: "ÎÒµÄIP",
                    ipApplyF:ipApplyF,
                    ipApplyW:ipApplyW
                });
        });
    });

//ÎÒµÄIPÉêÇë
    app.get('/internet-connection-ip-apply',checkLogin);
    app.get('/internet-connection-ip-apply',function(req, res){
        res.render('internet-connection-ip-apply',{title:"ÉêÇëIP"})
    });
    app.get('/internet-connection-ip-apply',checkLogin);
    app.post('/internet-connection-ip-apply',function(req, res){
        var ipApply = new IpApply(req.body);
        var noncestr = Math.random().toString(36).substr(2,16);
        ipApply.OpenId = req.session.openid;
        ipApply.imgP = '/images/' + req.files.img.name;
        ipApply.ID = req.session.openid + noncestr
        //ipApply.OpenId = '123';
        /*  console.log(ipApply.OpenId);
         console.log(req.files.img.name);*/

        ipApply.save(function(err,admin){
            if(err){
                console.log(err);
            }else{
                var openid = req.session.openid;
                var date = new Date();
                var time = date.getFullYear() + "Äê" + (date.getMonth() + 1) + "ÔÂ" + date.getDate() + 'ÈÕ';
                var data1 = {
                    first: {
                        "value":"Ìá½»ÉêÇë³É¹¦£¡",
                        "color":"#173177"
                    },
                    keyword1: {
                        "value":"Ì«Ô­¿Æ¼¼´óÑ§",
                        "color":"#173177"
                    },
                    keyword2: {
                        "value":"ÍøÂç¹ÜÀíÔ±£º·ëöÎ",
                        "color":"#173177"
                    },
                    keyword3: {
                        "value":time,
                        "color":"#173177"
                    },
                    keyword4: {
                        "value":"ÄãµÄipµØÖ·ÉêÇëÒÑÌá½»,ÎÒÃÇÔÚÅ¬Á¦ÎªÄú´¦Àí¡£ÇëÄÍÐÄµÈ´ý»Ø¸´£¡",
                        "color":"#173177"
                    },
                    remark: {
                        "value":"µã»÷²é¿´ÏêÇé£¡£¡",
                        "color":"#173177"
                    }
                };
                var data2 = {
                    first: {
                        "value":"ÓÃ»§IPÉêÇë",
                        "color":"#173177"
                    },
                    keyword1: {
                        "value":"Ì«Ô­¿Æ¼¼´óÑ§",
                        "color":"#173177"
                    },
                    keyword2: {
                        "value":"ÍøÂç¹ÜÀíÔ±£º·ëöÎ",
                        "color":"#173177"
                    },
                    keyword3: {
                        "value":time,
                        "color":"#173177"
                    },
                    keyword4: {
                        "value":"MAC:" + req.body.MAC + "ÐÕÃû£º" + req.body.Name,
                        "color":"#173177"
                    },
                    remark: {
                        "value":"µã»÷²é¿´ÏêÇé£¡£¡",
                        "color":"#173177"
                    }
                };
                console.log(openid);
                var userUrl = 'http://' + weChatConfig.domain + '/internet-connection-details2/' + ipApply.ID ;
                var adminUrl = 'http://' + weChatConfig.domain + '/admin-ipApply';
                templateMessage(userUrl,openid,data1,function(err,result){     //¸øÓÃ»§·¢ËÍÐÅÏ¢
                    if(err){
                        console.log(err);
                    }
                    console.log(result);
                });
                templateMessage(adminUrl,'ozLEZxI_tB9xOARMemwz4wUx-9UU',data2,function(err,result){     //¸ø¹ÜÀíÔ±·¢ËÍÐÅÏ¢
                    if(err){
                        console.log(err);
                    }
                    console.log(result);
                });
                res.redirect('/internet-connection-ip-next');
            }
        });
        //res.redirect('/internet-connection-ip-apply');
        //res.redirect('/internet-connection-ip-next');
    });

//ÎÒµÄIPÏêÇé
    app.get('/internet-connection-details/:ID',checkLogin);
    app.get('/internet-connection-details/:ID',function(req, res){
        console.log(req.params.ID);
        IpApply.getIpDetail(req.params.ID,function(err,ipApply){
            var detailsIpConnect = ipApply;
            res.render('internet-connection-details',
                {title:"IPÏêÇé",
                    detailsIpConnect:detailsIpConnect
                });
        });
    });
    //´ýÉêÇëIPÏêÇé
    app.get('/internet-connection-details2/:ID',checkLogin);
    app.get('/internet-connection-details2/:ID',function(req, res, next){
        IpApply.getIpDetail(req.params.ID,function(err,ipApply){
            var unapprovedDataSet = ipApply;
            res.render('internet-connection-details2',
                {
                    title:"´ýÉêÇëIPÏêÇé",
                    unapprovedDataSet:unapprovedDataSet
                });
        });
    });

//¹ÊÕÏ±¨ÐÞ
//app.get('/trouble-repair',checkLogin);
    app.get('/trouble-repair',function(req, res){
        res.render('trouble-repair',{title:"¹ÊÕÏ±¨ÐÞ"})
    });

//¹ÊÕÏ±¨ÐÞ×ÔÖúÏµÍ³
    app.get('/trouble-repair-system',checkLogin);
    app.get('/trouble-repair-system',function(req, res){
        res.render('trouble-repair-system',{title:"×ÔÖúÏµÍ³"})
    });
//¹ÊÕÏ±¨ÐÞ×ÔÖúÏµÍ³½â¾ö·½°¸
    app.get('/trouble-repair-system-solve',checkLogin);
    app.get('/trouble-repair-system-solve',function(req, res){
        res.render('trouble-repair-system-solve',{title:"×ÔÖúÏµÍ³"})
    });
//¹ÊÕÏ±¨ÐÞÈË¹¤·þÎñ
    app.get('/trouble-repair-people',checkLogin);
    app.get('/trouble-repair-people',function(req, res){
        res.render('trouble-repair-people',{title:"ÈË¹¤·þÎñ"})
    });
//¹ÊÕÏ±¨ÐÞÈË¹¤·þÎñÉêÇë
    app.get('/trouble-repair-people-apply',checkLogin);
    app.get('/trouble-repair-people-apply',function(req, res){
        res.render('trouble-repair-people-apply',{title:"ÈË¹¤·þÎñ"})
    });
//¹ÊÕÏ±¨ÐÞ´ý½â¾ö¹ÊÕÏÏêÇé
    app.get('/trouble-people-details',checkLogin);
    app.get('/trouble-people-details',function(req, res){
        res.render('trouble-people-details',{title:"ÈË¹¤·þÎñ"})
    });
//¹ÊÕÏ±¨ÐÞÒÑ½â¾ö¹ÊÕÏÏêÇé
    app.get('/trouble-people-details2',checkLogin);
    app.get('/trouble-people-details2',function(req, res){
        res.render('trouble-people-details2',{title:"ÈË¹¤·þÎñ"})
    });

    app.get('/admin-ipApply', function(req, res) {
        var fpage = req.query.page;
        var page = 0;
        console.log('page:' + fpage);
        var query = {};
        /* var ipconnect =[{
         Name: "ÁõÈðç÷",
         Contact:18335102651,
         Department:"¼ÆËã»ú¿ÆÑ§Óë¼¼ÊõÑ§Ôº",
         Time:"2015/8/19",
         OfficeAddress:"BÂ¥",
         MAC:"12-12-12-12-12-12"
         },{
         Name: "ãÆÓïÍ¤",
         Contact:18335102651,
         Department:"¼ÆËã»ú¿ÆÑ§Óë¼¼ÊõÑ§Ôº",
         Time:"2015/8/19",
         OfficeAddress:"BÂ¥",
         MAC:"12-12-12-12-12-12"
         },{
         Name: "ÇØÏþ½Ü",
         Contact:18335102651,
         Department:"¼ÆËã»ú¿ÆÑ§Óë¼¼ÊõÑ§Ôº",
         Time:"2015/8/19",
         OfficeAddress:"BÂ¥",
         MAC:"12-12-12-12-12-12"
         },{
         Name: "¹¢èë",
         Contact:18335102651,
         Department:"¼ÆËã»ú¿ÆÑ§Óë¼¼ÊõÑ§Ôº",
         Time:"2015/8/19",
         OfficeAddress:"BÂ¥",
         MAC:"12-12-12-12-12-12"
         }];*/
        IpApply.getAll(query,function(err,ipApplys){
            var ipApplyF = new Array(),ipApplyW = new Array(),i = 0,j = 0;
            ipApplys.forEach(function(ipApply){
                if(ipApply.adminIP != "" | ipApply.reason != ""){
                    console.log(ipApply.adminIP);
                    console.log(ipApply.adminIP != "");
                    console.log(ipApply.reason);
                    console.log(ipApply.reason != "");
                    ipApplyF[i] = ipApply;
                    i++;
                }else{
                    ipApplyW[j] = ipApply;
                    j++;
                }
            });
            res.render('admin-ipApply', {
                    ipApplyF: ipApplyF,
                    ipApplyW: ipApplyW,
                    page: page
                }
            );
        });
    });

    app.post('/admin-ipApply/:ID/:OpenId',function(req,res){
        var ipApply = {
            adminIP: req.body.adminIP,
            adminMAC: req.body.adminMAC,
            adminSubnetMask: req.body.adminSubnetMask,
            adminDNS: req.body.adminDNS,
            adminSpareDNS: req.body.adminSpareDNS,
            reason: req.body.reason
        };
        IpApply.update(req.params.ID,ipApply,function(err,result){
            var openid = req.params.OpenId;
            var date = new Date();
            var time = date.getFullYear() + "Äê" + (date.getMonth() + 1) + "ÔÂ" + date.getDate() + 'ÈÕ';
            var data = {};
            if(!ipApply.reason){
                data = {
                    first: {
                        "value":"ÄúµÄIPµØÖ·ÉêÇë³É¹¦£¡",
                        "color":"#173177"
                    },
                    keyword1: {
                        "value":"Ì«Ô­¿Æ¼¼´óÑ§",
                        "color":"#173177"
                    },
                    keyword2: {
                        "value":"ÍøÂç¹ÜÀíÔ±£º·ëöÎ",
                        "color":"#173177"
                    },
                    keyword3: {
                        "value":time,
                        "color":"#173177"
                    },
                    keyword4: {
                        "value":"ÄúµÄIPµØÖ·£º" + req.body.adminIP,
                        "color":"#173177"
                    },
                    remark: {
                        "value":"µã»÷²é¿´ÏêÇé£¡£¡",
                        "color":"#173177"
                    }
                };
            }else{
                data = {
                    first: {
                        "value":"ÄúµÄIPµØÖ·ÉêÇëÊ§°Ü£¡",
                        "color":"#FF0033"
                    },
                    keyword1: {
                        "value":"Ì«Ô­¿Æ¼¼´óÑ§",
                        "color":"#173177"
                    },
                    keyword2: {
                        "value":"ÍøÂç¹ÜÀíÔ±£º·ëöÎ",
                        "color":"#173177"
                    },
                    keyword3: {
                        "value":time,
                        "color":"#173177"
                    },
                    keyword4: {
                        "value":"Ê§°ÜÔ­Òò£º" + req.body.reason,
                        "color":"#173177"
                    },
                    remark: {
                        "value":"µã»÷²é¿´ÏêÇé£¡£¡",
                        "color":"#173177"
                    }
                };
            }

            var userUrl = 'http://' + weChatConfig.domain + '/internet-connection-details/' + ipApply.ID ;
            templateMessage(userUrl,openid,data,function(err,result){
                if(err){
                    console.log(err);
                }
                console.log(result);
            });
            res.redirect('/admin-ipApply');
        });
        //res.redirect('/admin-ipApply');
    });

    app.get('/admin_handle_service', function(req, res) {
        res.render('admin-handle-service');
    });
    app.get('/admin_self_help', function(req, res) {
        res.render('admin-self-help');
    });
    app.get('/test',function(req,res){
        res.render('test');
    });

    app.post('/test',function(req,res){
        var admin = new Admin(req.body);
        //console.log('admin1:'+ admin);
        admin.save(function(err,admin){
            if(err){
                console.log(err);
            }
            console.log(admin);
        });
    });


    /*var l = encodeURIComponent('http://cardwechat.tyust.edu.cn/liuruiqi');
     var str = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx17594e92c12d9afd&redirect_uri=' + l +'&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect';
     console.log(str);*/

    app.get('/liuruiqi',function(req,res){
        getOpenId(req.url,function(userInformation){
            console.log(userInformation);
            console.log('weixin:');
            req.session.openid = userInformation.openid;
            console.log(req.session);
            res.redirect('/');
        });
    });

    var config = {
        token: weChatConfig.token,
        appid: weChatConfig.appid
    };
    app.post('/wechat',wechat(config,function(req,res){
        console.log(req.weixin);
        message = req.weixin;
        if(message.MsgType == 'text'){          //ÓÃ»§·¢ËÍÏûÏ¢

            console.log(message.Content);

        }else if(message.MsgType == 'event'){   //ÓÃ»§´¥·¢ÊÂ¼þ

            /*switch(message.Event){
             case 'subscribe':
             }*/
            if(message.Event == 'subscribe'){   //ÓÃ»§´¥·¢¹Ø×¢¹«ÖÚºÅÊÂ¼þ

                console.log(message.Event);
            }else if(message.Event == 'unsubscribe'){//ÓÃ»§´¥·¢È¡Ïû¹Ø×¢¹«ÖÚºÅÊÂ¼þ

                console.log(message.Event);
            }else if(message.Event == 'VIEW'){              //ÓÃ»§´¥·¢²Ëµ¥À¸µã»÷viewÊÂ¼þ

                var str1 = 'http://' + weChatConfig.domain + '/internet-connection-ip-next/';
                var str2 = 'http://' + weChatConfig.domain + '/';
                if(message.EventKey == str1){
                    req.session.openid = message.FromUserName;
                    //res.redirect('/internet-connection-ip-next');
                }else if(message.EventKey == str2){
                    //req.session.openid = message.FromUserName;
                    req.weixin.EventKey = 'http://' + weChatConfig.domain + '/internet-connection-ip-next/'
                }
            }
        }
        res.send(req.query.nonce);
    }));


    function checkLogin(req, res, next){
        var openid = req.session.openid;
        console.log(req.seesion);
        if(!openid){
            var l = encodeURIComponent('http://' + weChatConfig.domain + '/liuruiqi');
            var str = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ weChatConfig.appid + '&redirect_uri=' + l +'&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect';
            console.log(str);
            res.redirect(str);
        }else{
            next();
        }
    }
    /* var openid = req.session.openid;
     console.log(openid);
     if(openid == 'undefined'){
     console.log('¼ì²âÓÃ»§openidÎª¿Õ£¡');
     res.render('wechatA');
     }else{
     next();
     }
     }
     */
};
