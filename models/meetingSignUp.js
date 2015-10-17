var mongodb = require('./db');

var SignUpUsers  = function(user){
	this.meetingId = user.meetingId;
	this.adminUser = user.adminUser;
	this.users = [];
};
module.exports = SignUpUsers;

SignUpUsers.prototype.save = function(callback){
	var date = new Date();
	var time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	//var id = Math.random().toString(36).substr(2,16);
	var SignUpUsers = {
		meetingId: this.meetingId,
		adminUser: this.adminUser,
		user: this.users,
		time: time
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('signupusers',function(err,signupuser){
			if(err){
				mongodb.close();
			}
			signupuser.save(SignUpUsers,{safe: true},function(err,result){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,result);
			});
		});
	});
};
SignUpUsers.update = function(query,data,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('signupusers',function(err,signupuser){
			if(err){
				mongodb.close();
			}
			signupuser.update(query,{$push: data},function(err,result){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,result);
			});
		});
	});
}

SignUpUsers.getOne = function(query,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('signupusers',function(err,signupuser){
			if(err){
				mongodb.close();
			}
			signupuser.findOne(query,function(err,doc){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,doc);
			});
		});
	});
}

SignUpUsers.getCount = function(query,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('signupusers',function(err,signupuser){
			if(err){
				mongodb.close();
			}
			signupuser.count(query,function(err,total){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,total);
			});
		});
	});
}