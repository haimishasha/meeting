var crypto = require('crypto');
var AdminUser = require('../models/login_reg.js');
module.exports = function(app){
	/*管理员登录*/
	app.get('/admin/login',function(req,res){
		if(req.query.url){
			res.render('admin-login',{url: req.query.url});
		}else{
			res.render('admin-login',{url: ''});
		}
	});
	app.post('/admin/login/:url?/:id?',function(req,res){
		
		var pass = req.body.password;
		var user = req.body.username;
		if(req.params.url && req.params.id){
			var url = '/' + req.params.url + '/' + req.params.id;
		}else{
			var url = '';
		}
		console.log(url);
		//密码加密
		var md5 = new crypto.createHash('md5');
		md5.update(pass);
		var d = md5.digest('hex');

		//查询条件用户名和密码
		var query = {
			username: user,
			password: d
		};
		//console.log(query);
		//判断用户名密码是否正确
		AdminUser.getOne(query,function(err,doc){
			if(err){
				console.log(err);
			}
			//密码正确返回1
			if(doc){
				//用户登录，seesion中放入用户名，用与判断用户是否已经登录
				req.session.user = req.body.username;
				
				if(url){
					res.send(url);
				}else{
					res.send('1');
				}
			//密码用户不对返回0
			}else{
				res.send('0');
			}
		});
	});
	/*管理员注册*/
	app.get('/admin/reg',function(req,res){
		res.render('admin-register');
	});
	app.post('/admin/reg',function(req,res){
		console.log(req.body);
		var user = req.body.username;
		//查询条件用户名和密码
		var query = {
			username: user
		};
		//判断注册用户是否已存在
		AdminUser.getOne(query,function(err,docs){
			if(err){
				console.log(err);
			}
			//如果不存在就注册
			if(!docs){
				var adminUser = new AdminUser(req.body);
				adminUser.save(function(err,doc){
					if(err){
						console.log(err);
					}
					console.log(doc);
					//如果注册成功，返回0，表示注册成功
					res.send('1');
				});
				console.log(req.body);
			//如果已存在就返回信息
			}else{
				//如果注册失败，返回1，表示用户已存在
				res.send('0');
			}
		});
	});
};