var mongodb = require('./db');
var cropty = require('crypto');

var AdminUser  = function(admin){
	this.username = admin.username;
	this.password = admin.password;
	this.email = admin.email;
	this.connect = admin.connect;
};
module.exports = AdminUser;


AdminUser.prototype.save = function(callback){

	//创建并返回一个哈希对象，一个使用所给算法的用于生成摘要的加密哈希。
	var md5 = cropty.createHash('md5');
	//通过提供的数据更新哈希对象，可以通过input_encoding指定编码为'utf8'、'ascii'或者 'binary'。如果没有指定编码，将作为二进制数据（buffer）处理。
	md5.update(this.password);
	//计算传入的所有数据的摘要值
	var d = md5.digest('hex');

	var date = new Date();
	var time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

	var adminUsers = {
		username: this.username,
		password: d,
		email: this.email,
		connect: this.connect,
		time: time
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('adminUsers',function(err,adminUser){
			if(err){
				mongodb.close();
				return callback(err);
			}
			adminUser.insert(adminUsers,{safe: true},function(err,adminUser){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,adminUser.ops[0]);
			});
		});
	});
}

AdminUser.getOne = function(query,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('adminUsers',function(err,adminUser){
			if(err){
				mongodb.close();
				return callback(err);
			}
			adminUser.findOne(query,function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			})
		});
	});
}