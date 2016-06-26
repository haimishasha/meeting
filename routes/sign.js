/*************************************************************************************/
/*                                                                                   */
/*                                 功能的实现接口                                    */
/*                                                                                   */
/*************************************************************************************/

var wechat         = require("./wechat");
//var weixinserver   = require('./wexinserver');
//var card           = require("./card");
var signin         = require("./signin");
module.exports = function(app) {

  /********************************微信功能的实现********************************/

  //app.use(express.query());
  //app.get('/wechat', weixinserver.getService);
  app.use('/wechat', wechat.wechat);  
  //移除菜单
  app.get('/menu/delete',wechat.removeMenu);
  //创建菜单
  app.get('/menu/create',wechat.createMenu);
  //微信网页授权
  app.get('/oauth/:state?', wechat.oauth);
  //获取名片用户信息
  app.get('/user/cardinfo/:state?', wechat.getuserinfo_card);
  //获取签到用户信息
  app.get('/user/signerinfo/:state?', wechat.getuserinfo_signin);
  //绑定微信和系统账户
  app.get('/bind', wechat.bind);
  app.post('/bind', wechat.bindp);

  /*******************************名片功能的实现********************************/
  //摇一摇或者扫一扫名片的固定网址
  //app.get('/shakecard/:iBeaconId?', card.shakecard);
  //首页
  //app.get('/home/:iBeaconId?',      card.home);
  //首页,游客可以留言
  //app.post('/home/:iBeaconId?',     card.homep);
  //app.get('/makeCard/:iBeaconId',   card.makeCard);
	//制作名片
  //app.post('/makeCard/:iBeaconId',  card.makeCardp);
  //展示名片
  //app.get('/showCard/:iBeaconId',   card.showCard);
  //下载名片
  //app.get('/getCard/:iBeaconId',    card.getCard); 

  /********************************签到功能的实现********************************/
  //摇一摇或者扫一扫签到的固定网址
  app.get('/shakesignin/:iBeaconId', signin.shakesignin);
  //设备与管理员账号绑定界面
  app.get('/signin_bind_admin/:iBeaconId', signin.bind_manager);
  //设备与管理员账号绑定
  app.post('/signin_bind_admin/:iBeaconId', signin.bind_managerp);
  //参会人员报名界面
  app.get('/signup/:meetingid', signin.signup);
  //参会人员报名，相当于实名绑定
  app.post('/signup/:meetingid', signin.signupp);
  //参会人员报名界面，用户曾经已经绑定过实名信息
  app.get('/signup_past/:meetingid', signin.signup_past);
  //参会人员报名，用户曾经已经绑定过实名信息
  app.post('/signup_past/:meetingid', signin.signup_pastp);
  //参会人员签到
  app.get('/sign/:meetingid',signin.sign);
  //参会人员签到
  app.post('/sign/:meetingid',signin.signp);
  //签到成功页面
  app.get('/sign_success/:meetingid',signin.sign_success);
  //签到墙
  app.get('/signin/:meetingid', signin.signin);
  //后台查看参会人员名单（已签到+未签到）
  app.get('/signinstate/:meetingid', signin.signinstate);
  //查看参会人员名单
  app.get('/signincard/:meetingid', signin.signincard);
  app.get('/showcard/:meetingid/:openid',signin.showcard);
  //下载名片
  app.get('/signincard/:meetingid/:openid', signin.getsignincard);
}
 


