var ipApply = require('./ipApply'),
    award = require('./award'),
    login_reg = require('./login_reg'),
    signIn = require('./sign'),
    message = require('./message'),
    meeting = require('./meeting');
var wechat = require('wechat');
var weChatConfig = require('../settings');

var config = {
        token: weChatConfig.token,
        appid: weChatConfig.appid,
        encodingAESKey: weChatConfig.encodingAESKey
};
module.exports = function(app){
    /***********************************************/
    app.get('/',function(req,res){
        res.render('index');
    });
    app.get('/adminaward',function(req,res){
        res.redirect('/admin/award/2fo66bn3neuhm2t9');
    });
    app.get('/adminsignin',function(req,res){
        res.redirect('/admin/singnin/2fo66bn3neuhm2t9');
    });
    app.get('/adminmessage',function(req,res){
        res.redirect('/admin');
    });
    /*************************************************/
    //ipApply(app);
    login_reg(app);
/*   存在问题:
1、一旦页面加载某个文件失败，就会执行使得页面直接跳转到登录界面;
2、某些不需要登录的界面也必须做检查
*/	
    app.use(checkLogin);
    signIn(app);
    message(app);
    meeting(app);
    award(app);

    function checkLogin(req, res, next){
        var url = req.url;
        var urlA = new Array();
        urlA = url.split('/');
        //console.log(urlA);
        //管理员界面需要验证是否登录
        if(urlA[1] == 'admin'){
            var username = req.session.user;
            //console.log(req.session);
            if(!username){
                res.redirect('/admin/login');
            }else{
                next();
            }
        //用户手机需要验证openid认证
        }else if(urlA[1] == 'user'){
            var openid = req.session.openid;
            if(!openid){
                //跳转认证界面
                //res.redirect('/admin/login');
                next();
            }else{
                next();
            }
        }else if(urlA[1] =='adminaward' || urlA[1] =='adminmessage' || urlA[1] =='adminsign'){
            next();
        }else{
            next();
        }
    }
};

