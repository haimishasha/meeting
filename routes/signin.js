/*************************************************************************************/
/*                                                                                   */
/*                                 签到功能的实现                                    */
/*                                                                                   */
/*************************************************************************************/

var IBeacon_signin_total    = require('../models/signin/iBeacon_signin_total.js');    //签到iBeacon总库
var Signer                  = require('../models/signin/signer.js');  //签到者信息
var Signin                  = require('../models/signin/signin.js');  //会议的签到信息
var wechat                  = require("./wechat");
var Meeting                 = require('../models/meeting.js');
var Config                  = require('./config');
var url                     = Config.url

//摇一摇或者扫一扫签到的固定网址
exports.shakesignin = function (req, res) {
  var iBeaconId        = req.params.iBeaconId;
  var url_meeting      = "";
  var url_loginmanager = "";
  var url_bindmanager  = "";
  var url_bindmeeting  = "";
  var url_shakesignin  = "";
  var url_signup       = "";
  var query = {id: iBeaconId};
  IBeacon_signin_total.get(query,function (err, iBeacon_signin_total){
    if(err){
      console.log(err);
    } 
    if(iBeacon_signin_total){     //判断总库中是否有此ibeacon

      if(iBeacon_signin_total.adminUser){     //判断ibeacon是否与管理员id绑定 

        if(iBeacon_signin_total.meetingid){  //会议已经与iBeacon绑定
          
          url_signup = '/signup/'+ iBeacon_signin_total.meetingid;  //跳转到报名页面

          return res.redirect(url_signup);
        }else{
          console.log("该设备没有绑定会议信息");
          res.end("该设备没有绑定会议");
        }
      }else{
        console.log("该设备没有与管理员绑定");
        url_bindmanager = "/signin_bind_admin/" + iBeaconId;
        url_loginmanager = "/admin/login?url="+url_bindmanager;
        return res.redirect(url_loginmanager);
      }
    }else{ 
    //没有总库，随便写一个便保存一个  日后改善     
      var newIBeacon_signin_total = new IBeacon_signin_total(iBeaconId); //总库中不存在，则保存如总库中

      newIBeacon_signin_total.save(function (err,result){
        if(err){
          console.log(err);
        }
        url_shakesignin = "/shakesignin/" + iBeaconId;
        res.redirect(url_shakesignin);
      });
    }
  });
}


//设备与管理员账号绑定界面
exports.bind_manager = function (req, res) {
  var iBeaconId = req.params.iBeaconId;
  var adminUser = req.session.user;
  res.render('signin_bind_admin',{
    iBeaconid:iBeaconId,
    adminUser:adminUser
  });
}

//设备与管理员账号绑定
exports.bind_managerp = function(req, res) {
  var iBeaconId = req.params.iBeaconId;
  var adminUser = req.session.user;
  var query = {id: iBeaconId};
  IBeacon_signin_total.get(query,function (err, iBeacon_signin_total){
    if(err){
      console.log(err);
    }
    if(iBeacon_signin_total){              //判断总库中是否有此ibeacon
      if(iBeacon_signin_total.adminUser){  //判断ibeacon是否与管理员id绑定
        console.log("该设备已经与管理员绑定");
      }else{
        IBeacon_signin_total.updateadminUser(adminUser, iBeaconId, function (err){
          if(err){
            console.log(err);
          }
          var url_shakesignin = "/shakesignin/" + iBeaconId;
          return res.redirect(url_shakesignin);
        });
      }
    }
  });
}


//用户报名页面
exports.signup = function (req, res) {
  //============ps此处应该有一个判断会议是否已经过期？？？有没有必要?/
  var meetingid = req.params.meetingid;
  //此处应该判断一下会议是否需要报名再进行更合适？？此处按照需要报名
  sign_wxsigner(req,res,function (wxsigner,stateOfSigner){
    var openid = wxsigner.openid;  
    if(stateOfSigner == 'old'){
      console.log('您已经报名成功');
      url_meeting = '/sign/'+ meetingid;
      res.redirect(url_meeting);
      //res.end('您已经报名成功');
      //=========报名成功，应该跳转到一个会议简介的页面
    }else{   
      var query = {meetingId:meetingid};
      console.log(meetingid);
      getMaxNum(query,function (result){
        console.log(result);
        if(result == "noMeeting"){
          console.log("noMeeting，网址不存在");
          res.end("网址不存在或者会议还没有正式开始");
        }else{
          //=================没有人数限制的会议,默认人数为10000
          var maxNum = parseInt(result);
          Signin.getSigners(meetingid,function (err,signers){
            if(err){
              console.log(err);
            }
            if(result == ''|| signers == null || signers.length < maxNum ){
              var query = {openid:openid};
              Signer.getSignerInSigners(query,function (err,signerInSigners){
                if(err){
                  console.log(err);
                }
                if(signerInSigners){
                  req.session.signer = signerInSigners;
                  res.redirect("/signup_past/"+ meetingid);
                  //res.end("您以前已经报过名");
                }else{
                  res.render("sign_up");
                }
              });
            }else{
              console.log('不好意思，报名人数已经达到上限');
              res.end('不好意思，报名人数已经达到上限');
            }
          });
        }
      });
    }
  });
}

//参会人员报名，相当于实名绑定
exports.signupp = function (req, res) {
  var meetingid    = req.params.meetingid;
  var truename     = req.body.truename;
  var email        = req.body.email;
  var connect      = req.body.connect;
  var telephone    = req.body.telephone;
  var company      = req.body.company;
  var job          = req.body.job;
  var qq           = req.body.qq;
  var openid       = req.session.openid;
  var url_meeting  = "";
  var query = { meetingid:meetingid, openid:openid};
  sign_wxsigner(req,res,function (wxsigner,stateOfSigner){
    var signer      = wxsigner;
    signer.truename = truename;
    signer.email    = email;
    signer.connect  = connect;
    signer.telephone = telephone;
    signer.company   = company;
    signer.job       = job;
    signer.qq        = qq;
    var newsigner = new Signer(signer);
    newsigner.saveintoSigners(function (err){   //更新总库中的信息
      if(err){
        console.log(err);
      }
      newsigner.save(meetingid, function(err){  //保存到会议的signers数组中
        if(err){
          console.log(err);
        }
        newsigner.arrived  = "no";
        Signer.update(meetingid,newsigner,function (err){ //更新用户已报名的状态
          if(err){
            console.log(err);
          }
          console.log("报名成功");
          //res.end("报名成功");
          //报名成功后应该跳转到一个会议简介页面???
          url_meeting = '/sign/'+ meetingid;       //跳转到签到界面
          res.redirect(url_meeting);
        });
      });
   });
  });
}

// //====此段代码需要优化 
// //参会人员报名界面，用户曾经已经绑定过实名信息
// exports.signup_past = function (req, res) {
//   var signer =  req.session.signer;
//   console.log(signer);
//   if(signer){
//     res.render("sign_up_past",{
//       truename:    signer.truename,
//       email:       signer.email,
//       connect:     signer.connect,
//       telephone:   signer.telephone,
//       company:     signer.company,
//       job:         signer.job,
//       qq:          signer.qq,
//     });
//   }
// }

//====此段代码需要优化 
//参会人员报名界面，用户曾经已经绑定过实名信息
exports.signup_past = function (req, res) {
  var signer =  req.session.signer;
  var meetingid = req.params.meetingid;
  if(signer){
    Signin.getSigner(meetingid,signer.openid,function (err,signer1){
      if(err){
          console.log('getsignerinfo1: ' + err.description);  
      }
      if(signer1){
        url_meeting = '/sign/'+ meetingid;       //跳转到签到界面
        res.redirect(url_meeting);
      }else{
        res.render("sign_up_past",{
          truename:    signer.truename,
          email:       signer.email,
          connect:     signer.connect,
          telephone:   signer.telephone,
          company:     signer.company,
          job:         signer.job,
          qq:          signer.qq,
        }); 
      }
    });
  }
}
//参会人员报名，用户曾经已经绑定过实名信息
exports.signup_pastp = function (req, res) {
  var signer =  req.session.signer;
  var meetingid = req.params.meetingid;
  var url_meeting  = "";
  var truename     = req.body.truename;
  var email        = req.body.email;
  var connect      = req.body.connect;
  var telephone    = req.body.telephone;
  var company      = req.body.company;
  var job          = req.body.job;
  var qq           = req.body.qq;
  var openid       = signer.openid;
  var nickname     = signer.nickname;
  var headimgurl   = signer.headimgurl;
  var resigner     ={};
  resigner.openid  = openid;
  resigner.nickname    = nickname;
  resigner.headimgurl  = headimgurl;
  resigner.truename = truename;
  resigner.email    = email;
  resigner.connect  = connect;
  resigner.telephone = telephone;
  resigner.company = company;
  resigner.job= job;
  resigner.qq = qq;
  resigner1 = resigner;
  resigner1.arrived  = "no";

  Signer.update_signers(resigner,function (err){
    if(err){
      console.log(err);
    }
    var signerArrived = new Signer(resigner);
    Signin.getSigner(meetingid,openid, function (err,signer){
      if(err){
        console.log(err);
      }
      if(signer){
        Signer.update(meetingid,resigner1,function (err){
          if(err){
            console.log(err);
          }
          console.log("报名成功");
          //res.end("报名成功");
          //报名成功后应该跳转到一个会议简介页面???
          url_meeting = '/sign/'+ meetingid;
          console.log(url_meeting);
          res.redirect(url_meeting);
        });
      }else{
        signerArrived.save(meetingid,function (err){
          if(err){
            console.log(err);
          }
          Signer.update(meetingid,resigner1,function (err){
            if(err){
              console.log(err);
            }
            console.log("报名成功");
            //res.end("报名成功");
            //报名成功后应该跳转到一个会议简介页面???
            url_meeting = '/sign/'+ meetingid;
            res.redirect(url_meeting);
          });
        });
      }
    });  
  });
}

// //参会人员签到
// exports.sign = function (req, res) {
//   var meetingid = req.params.meetingid;
//   var query={meetingId:meetingid};
//   console.log("im here");
//   Meeting.getOne(query,function (err,meeting){
//     if(err){
//       console.log(err);
//     }
//     //console.log(meeting);
//     if(meeting){
//       meeting.sign_withSignUp = "yes";//假设此处是必须要报名后才能签到
//       if(meeting.sign_withSignUp == "yes"){
//        console.log("开始喽");
//         sign_withSignUp(req,res);
//       }
//       else{
//        sign_withoutSignUp(req,res);
//       }
//     }
//   });
// }
exports.sign = function (req,res){
  var meetingid = req.params.meetingid;
  var query={meetingId:meetingid};
  console.log("im here");
  Meeting.getOne(query,function (err,meeting){
    if(err){
      console.log(err);
    }
    if(meeting){
      meeting.sign_withSignUp = "yes";//假设此处是必须要报名后才能签到
      if(meeting.sign_withSignUp == "yes"){
        sign_wxsigner(req,res,function (wxsigner,stateOfSigner){
          var openid = wxsigner.openid;
          Signin.getSigner(meetingid,openid, function (err,signer){
            if(err){
              console.log(err);
            }
            if(signer){
              if(signer.arrived){
                if(signer.arrived == "no"){
                  req.session.signer = signer;
                  res.render("signin_signer",{
                    truename:signer.truename,
                    telephone:signer.telephone
                  });
                }else if(signer.arrived == "yes"){
                  console.log("您已经签到成功");
                  //req.session.openid = openid;
                  res.redirect('/user/meeting/'+ meetingid);
                }
              }else{
                console.log("签到前请先报名哦！");
                res.redirect('/signup/'+ meetingid);
              }
            }else{
              console.log("签到前请先报名哦！");
              res.redirect('/signup/'+ meetingid);
            }
          });
        });
      }else{
       sign_withoutSignUp(req,res);
      }
    }else{
       res.render('error', {
        message: "会议不存在或者网页出错",
        error: "会议不存在或者网页出错"
      });
    }
  });   
}
//参会人员签到
exports.signp = function (req, res) {
  var meetingid = req.params.meetingid;
  signer = req.session.signer;
  signer.arrived = "yes";
  var date = new Date(),
  time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
         date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  signer.time = time;
  //此处数据库待改进
  Signer.update(meetingid,signer,function(err){
    if(err){
      console.log(err);
    }
    console.log("签到成功");
    res.redirect('/sign_success/'+ meetingid);
  });
}

//签到成功界面
exports.sign_success = function (req,res){
  var meetingid = req.params.meetingid;
  res.render("signin_signsuccess",{
    meetingid:meetingid
  });
}

//签到墙
exports.signin = function (req, res) {
  //此处也应该判断一下，是否需要报名再签到
  var meetingid = req.params.meetingid;
  var query = {meetingId:meetingid}
  Meeting.getOne(query,function (err,meeting){
    if(err){
      console.log(err);
    }
    if(meeting){
      meeting.sign_withSignUp = "yes"//==================此处赋值是为了假设会议必须签到
      if(meeting.sign_withSignUp == "yes"){
        signin_withSignUp(req,res);
      }
      else{
       signin_withoutSignUp(req,res);
      }
    }
  });
}


//查看参会人员名单
exports.signincard = function (req,res){
  var meetingid = req.params.meetingid;
  var signerArrived = [];
  var meeting = '';
  var title = "参会人员名单";
  var query = {
        meetingId: meetingid,
        meetingStatus: 1
      };
  Meeting.getOne(query,function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      meeting = result;
      Signin.getSignersArrived(meetingid,"yes","signin_card",function (err, signerArriveds){
        if(err){
          console.log(err);
        }
        if(signerArriveds){
          signerArrived = signerArriveds;
        }
        res.render('signin_card',{
          title: '参会人员名单',
          meeting: meeting,
          signerArrived:signerArrived,
          meetingid:meetingid
        });
      });
    }else{
      res.render('signin_card',{
        title: '参会人员名单',
        meeting: meeting,
        signerArrived:signerArrived,
        meetingid:meetingid
      });
    }
  });
}

//查看参会人员名单
exports.showcard = function (req,res){
  var meetingid = req.params.meetingid;
  var openid    = req.params.openid;
  Signin.getSigner(meetingid,openid, function (err,signer){
    if(err){
      console.log(err);
    }
    if(signer){
       res.render('sign_personInfo', {
        signer:signer,
        meetingid:meetingid,
        openid:openid
      });
    }else{
      res.render('error', {
        message: "404错误",
        error: "404错误"
      });
    }
  });
}

//查看参会人员名单
exports.signinstate = function (req,res){
  var meetingid = req.params.meetingid;
  var signerArrived = [];
  var signerNotArrived = [];
  var meeting = '';
  var title = "参会人员名单";
  var query = {
        meetingId: meetingid,
        meetingStatus: 1
      };
  Meeting.getOne(query,function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      meeting = result;
      Signin.getSignersArrived(meetingid,"yes","signin_state",function (err, signerArriveds){
        if(err){
          console.log(err);
        }
        if(signerArriveds){
          signerArrived = signerArriveds;
        }
        Signin.getSignersArrived(meetingid,"no","signin_state",function (err, signerNotArriveds){
          if(err){
            console.log(err);
          }
          if(signerNotArriveds){
            signerNotArrived = signerNotArriveds;
          }
          res.render('signin_details',{
            title: '参会人员名单',
            meeting: meeting,
            signerArrived:signerArrived,
            signerNotArrived:signerNotArrived,
            meetingid:meetingid
          });
        });
      });
    }else{
      res.render('signin_details',{
        title: '参会人员名单',
        meeting: meeting,
        signerArrived:signerArrived,
        signerNotArrived:signerNotArrived,
        meetingid:meetingid
      });
    }
  });
}


//下载名片
exports.getsignincard = function (req,res){
  var meetingid = req.params.meetingid;
  var openid     = req.params.openid;
   Signin.getSigner(meetingid,openid, function (err,signer){
    if(err){
      console.log(err);
    }
    if(signer){  
      var truename     = signer.truename,
          telephone    = signer.telephone,
          connect      = signer.connect,
          email        = signer.email;
          company      = signer.company,
          job          = signer.job,
          qq           = signer.qq;
      var cardString   = "BEGIN:VCARD" + '\n' +
                          "VERSION:3.0" + '\n' +
                          "N:" + truename + '\n' +
                          "FN:" + truename + '\n' +
                          "TEL;CELL;VOICE:" + telephone + '\n' +
                          "TEL;WORK;VOICE:" + connect + '\n' +
                          "TEL;WORK;FAX:" + connect + '\n' +
                          "EMAIL;PREF;INTERNET:" + email + '\n' +
                          "ADR;WORK;POSTAL:" + company + '\n' +
                          "ORG:" + company + '\n' +
                          "ROLE:" + job + '\n' +
                          "note:" + 'Shake 名片' + '\n' +
                          "END:VCARD";
      var userAgent = (req.headers['user-agent']||'').toLowerCase();
      if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
          res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(truename) + '.vcf');
      } else if(userAgent.indexOf('firefox') >= 0) {
          res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(truename)+'"' + '.vcf');
      } else {
          /* safari等其他非主流浏览器只能自求多福了 */
          res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(truename).toString('binary') + '.vcf');
      }
      res.setHeader('content-type', 'text/x-vCard');
      res.send(cardString); 
    }else{
      console.log("网址错误");
      res.render('error', {
        message: "404错误",
        error: "404错误"
      });
    } 
  });
}

//不需要报名的签到
function sign_withoutSignUp (req, res) {
  var meetingid = req.params.meetingid;
  sign_wxsigner(req,res,function (wxsigner,stateOfSigner){
    if(stateOfSigner == 'new'){
      wxsigner.saveInSignins(meetingid, function (err){
        if(err){
          console.log(err);
        }
        res.redirect('/user/meeting/'+ meetingid);
      });
    }else{
      res.redirect('/user/meeting/'+ meetingid);
    }
  });
}


// //需要报名的签到
// function sign_withSignUp (req, res) {
//   var meetingid = req.params.meetingid;
//   sign_wxsigner(req,res,function (wxsigner,stateOfSigner){
//     var openid = wxsigner.openid;
//     Signin.getSigner(meetingid,openid, function (err,signer){
//       if(err){
//         console.log(err);
//       }
//       if(signer){
//         if(signer.arrived){
//           if(signer.arrived == "no"){
//             signer.arrived = "yes";
//             //此处数据库待改进
//             Signer.update(meetingid,signer,function(err){
//               if(err){
//                 console.log(err);
//               }
//               console.log("签到成功");
//               res.redirect('/user/meeting/'+ meetingid);
//             });
//           }else{
//             console.log("您已经签到成功");
//             res.redirect('/user/meeting/'+ meetingid);
//           }
//         }
//       }else{
//         console.log("签到前请先报名哦！");
//        res.redirect('/signup/'+ meetingid);
//       }
//     });
//   });
// }

//签到墙——有报名的签到
function signin_withSignUp (req, res) {
  //此处也应该判断一下，是否需要报名再签到
  var meetingid = req.params.meetingid;
  Signin.getSignersArrived(meetingid,"yes","wall",function (err, signerArrived){
    if(err){
      console.log(err);
    }
    console.log("signerArrived");
    console.log(signerArrived);
    if(signerArrived){
      res.render('signin_signin',{
        signers:signerArrived
      });
    }else{
      res.render('signin_signin_null');
    } 
  });
}

//签到墙--无报名的签到
function signin_withoutSignUp (req, res) {
  //此处也应该判断一下，是否需要报名再签到
  var meetingid = req.params.meetingid;
  var query = {meetingid: meetingid};
  Signin.getSigners(query,function (err, signers){
    if(err){
      console.log(err);
    }
    if(signers){
      res.render('signin_signin',{
        signers:signers
      });
    }else{
        res.render('signin_signin_null');
    }
  });
}


//获得用户的微信信息（openid或者是更加详细的信息）
function sign_wxsigner(req,res,callback){
  var wxuser    = {};
  var openid    = "1";
  var state     = req.url;
  var stateOfSigner = req.session.stateOfSigner;
  if(req.session.wxuser) {
    wxuser       = req.session.wxuser;
    if(wxuser.ops){
      wxuser    = wxuser.ops[0];
    }
    openid       = wxuser.openid;
  } else {
      var client = wechat.client;
      //console.log(url);
      var url_weixin    = client.getAuthorizeURL(url.url+'user/signerinfo', state,"snsapi_userinfo"); //无关注也可以授权，有明显授权页面
      //console.log(url_weixin);
      return res.redirect(url_weixin);  
  }
  callback(wxuser,stateOfSigner);
}

//获取会议所允许的最大人数
function getMaxNum(query,callback){
  Meeting.getOne(query,function (err,meeting){
    if(err){
      console.log(err);
    }
    //console.log(meeting);
    if(meeting){
      if(meeting.maxNum){
        callback(meeting.maxNum);
      }
      else{
        console.log("noMaxNum");
        callback(10000);
      }
    }else{
      callback("noMeeting");
    }
  });
}