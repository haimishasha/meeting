var mongodb = require('./db');

var Meeting = function(meeting){
	this.adminUser = meeting.adminUser;
	this.meetingId = meeting.meetingId;
	this.Title = meeting.Title;
	this.address = meeting.address;
	this.organizer = meeting.organizer;
	this.startTime = meeting.startTime;
	this.endTime = meeting.endTime;
	this.ibeacon = meeting.ibeacon;
	this.intro = meeting.intro;
	this.material = meeting.material;
	this.maxNum = meeting.maxNum;
	this.signUp = meeting.signUp;
}

module.exports = Meeting;


Meeting.prototype.save = function(callback){
	var date = new Date();
	var time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	var meetings = {
		adminUser: this.adminUser,
		meetingId: this.meetingId,
		Title: this.Title,
		address: this.address,
		organizer: this.organizer,
		startTime: this.startTime,
		endTime: this.endTime,
		ibeacon: this.ibeacon,
		intro: this.intro,
		material: this.material,
		maxNum: this.maxNum,
		signUp: this.signUp,
		time: time,
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('meetings',function(err,meeting){
			if(err){
				mongodb.close();
				return callback(err);
			}
			meeting.insert(meetings,{safe: true},function(err,meeting){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,meeting);
			});
		});
	});
}


Meeting.getAll = function(query,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('meetings',function(err,meeting){
			if(err){
				mongodb.close();
				return callback(err);
			}
			meeting.find(query).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
}
Meeting.getOne = function(query,callback){
	mongodb.open(function(err,db){
		if(err){
			return callbakc(err);
		}
		db.collection('meetings',function(err,meeting){
			if(err){
				mongodb.close();
				return callback(err);
			}
			meeting.findOne(query,function(err,doc){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,doc);
			});
		});
	});
}

Meeting.update = function(query,data,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err)
		}
		db.collection('meetings',function(err,meeting){
			if(err){
				mongodb.close();
				return callback(err);
			}
			meeting.update(query,{$set:data},function(err,result){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,result);
			});
		});
	});
}

Meeting.remove = function(query,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('meetings',function(err,meeting){
			if(err){
				mongodb.close();
				return callback(err);
			}
			meeting.remove(query,function(err,result){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,result);
			});
		});
	});
}
