
var Meeting = require('../models/meeting.js');
var iBeacon_signin_total = require('../models/signin/iBeacon_signin_total.js');
var SignUpUser = require('../models/meetingSignUp.js');
var wechat_oauth = require('wechat-oauth');

var weChatConfig = require('../settings');
var API = require('wechat-api');
var http = require("http");
var fs = require("fs");
var api = new API(weChatConfig.appid, weChatConfig.secret);

var Signin = require('../models/signin/signin.js');
module.exports = function(app){


	/*********************用户路由开始*********************/
	//会议主页
	app.get('/1',function(req,res){
		res.render('1');
	});
	app.get('/user/meeting/:meetingId',function(req,res){
		var query = {
			meetingId: req.params.meetingId,
			meetingStatus: 1
		};
		Meeting.getOne(query,function(err,result){
			if(err){
				console.log(err);
			}
			console.log(result)
			if(result){
				res.render('indexMeeting',{
				title: '会议主页',
				meeting: result
			});
			}else{
				//如果没有会议就返回一个无会议画面
				res.render('indexMeeting',{title: 'null',meeting:''});
			}
		});
	});
	//会议留言
	app.get('/user/message',function(req,res){
		var query = {
			meetingId: req.params.meetingId,
			meetingStatus: '1'
		};
		res.render('message',{title: '会议留言'});
	});
	//会议抽奖
	app.get('/user/award',function(req,res){
		var query = {
			meetingId: req.params.meetingId,
			meetingStatus: '1'
		};
		res.render('award',{title: '会议抽奖'});
	});
	//会议报名
	app.get('/user/meetingSignUp',function(req,res){
		res.render('signup');
	});
	app.post('/user/meetingSignUp',function(req,res){
		var query = {
			meetingId: req.query.meetingId
		};
		var data = {user: req.body};
		meetingSignUp.update(query,data,function(err,result){
			if(err){
				console.log(err);
			}
			res.redirect('/user/signunSuccess');
		});
	});
	/*********************用户路由结束*********************/

	

	/*********************管理员路由开始*******************/
	//会议主页
	app.get('/admin',function(req,res){
		var query = {
			adminUser: req.session.user
		};
		var url = 'http://'+ weChatConfig.domain +'/shakesignin/';
		//读取会议信息
		Meeting.getAll(query,function(err,docs){
			if(err){
				console.log(err);
			}
			console.log(docs);
			//会议存在返回数据
			if(docs){
				res.render('admin-myMeeting',{meetings:docs,url: url});
			//会议不存在，返回空
			}else{
				res.render('admin-myMeeting',{meetings:[],url: ''});
			}
		});
	})
/*	app.get('/test',function(req,res){
		res.render('test1');
	});*/
    //会议申请
	app.get('/admin/meetingApply',function(req,res){
		var query = {
			adminUser: req.session.user
		};
		//读取ibeacon数据库中管理员的所有ibeacon
		iBeacon_signin_total.getAll(query,function(err,docs){
			if(err){
				console.log(err);
			}
			console.log(docs);
			//进入会议申请页面发送ibeacon设备数组
			if(docs){
				res.render('admin-apply',{ibeacons: docs});
			}else{
				res.render('admin-apply',{ibeacons: []});
			}
		});
	});
	//会议申请post
	app.post('/admin/meetingApply',function(req,res){
		console.log(req.body);
		console.log(req.files);
		console.log(req.files.material);
		//判断是否上传文件
		var material = new Array();
		if(req.files.material == undefined){
		  material = [];
		}else{
			//判断上传是否为多文件
			if(req.files.material.length){
				//遍历上传文件保存到数组中
				var i = 0;
				req.files.material.forEach(function(m){
					material[i] = "uploadFiles/" + m.name;
					i++;
				});
			}else{
				material[0] = "uploadFiles/" + req.files.material.name;
			}
		}
		var adminUser = req.session.user;
		var id = Math.random().toString(36).substr(2,16);
		var m = {
		adminUser: adminUser,
		meetingId: id,
		Title: req.body.Title,
		address: req.body.address,
		organizer: req.body.organizer,
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		ibeacon: req.body.ibeacon,
		intro: req.body.intro,
		material: material,
		signUp: req.body.signUp,
		maxNum: req.body.maxNum
	    };
		var meeting = new Meeting(m);
		meeting.save(function (err,result){
			if(err){
				console.log(err);
			}else{
				var url = '/admin/signinCreate?meetingid=' + id + '&ibeacon=' + req.body.ibeacon;
				res.redirect(url);
			}
		});
	});
app.get('/admin/signinCreate',function(req,res){
	var adminUser = req.session.user;
	var ibeacon = req.query.ibeacon;
	var meetingid = req.query.meetingid;
	//创建签到
    var signins = {
		meetingid: meetingid,
		adminUser: adminUser
		};
		var signin = new Signin(signins);
		signin.save(function (err,result){
			if(err){
				console.log(err);
			}
			console.log(result);
			res.redirect('/admin');
			console.log('ibeacon2:');
	    });
});

	//会议修改
	app.get('/admin/meetingUpdate',function(req,res){
		//查询条件
		var query = {
			adminUser: req.session.user,
			meetingId: req.query.meetingId
		};

		Meeting.getOne(query,function(err,doc){
			if(err){
				console.log(err);
			}
			if(doc){
				var meeting = doc;
				iBeacon_signin_total.getAll(query,function(err,docs){
				if(err){
					console.log(err);
				}
				console.log(docs);
				//进入会议申请页面发送ibeacon设备数组
				if(docs){
					res.render('admin-meetingUpdate',{meeting:meeting,ibeacons: docs});
				}else{
					res.render('admin-meetingUpdate',{meeting:meeting,ibeacons: []});
				}
		        });
			}else{
				res.redirect('/admin');
			}
		});
	});
	//会议修改post
	app.post('/admin/meetingUpdate',function(req,res){
		//查询条件
		var query = {
			adminUser: req.session.user,
			meetingId: req.query.meetingId
		};
		var data = req.body;
		console.log(data);
		//判断是否有文件上传
		if(req.files.material){
			data.material = req.files.material.path;
		}
		//更新数据
		Meeting.update(query,data,function(err,result){
			if(err){
				console.log(err);
			}
			console.log(result);
			res.redirect('/admin');
		});
	});
	//会议删除
	app.get('/admin/meetingRemove',function(req,res){
		//查询条件
		var query = {
			adminUser: req.session.user,
			meetingId: req.query.meetingId
		};
		//删除符合条件的文档
		Meeting.remove(query,function(err,result){
			if(err){
				console.log(err);
			}
			res.redirect('/admin');
			Signin.remove(req.query.meetingId,function(err,result){
				if(err){
					console.log(err);
				}
				console.log(result);
			});

		});
	});
	//会议开始
	app.get('/admin/meetingStart',function(req,res){
		console.log("query:");
		
		//会议暂时绑定一个ibeacon

		/*console.log(req.query);
		var ibeacons = req.query.ibeacon.split(',');
		console.log('ibeasons:');
		console.log(ibeacons);*/
		if(req.query.meetingStatus){
		var status = parseInt(req.query.meetingStatus);
		}else{
		var status = 0;	
		}
		//查询条件
		var query1 = {
			adminUser: req.session.user,
			meetingId: req.query.meetingId
		};
		var data1 = {};
		if(status){
			data1 = {
			meetingStatus: 0
		    };
		}else{
			data1 = {
			meetingStatus: 1
		    };
		}
		//更新集合meeting中的start字段
		Meeting.update(query1,data1,function(err,result){
			if(err){
			console.log(err);	
			}
			if(result){
				res.redirect('/admin');
			}else{
				res.redirect('/admin')
			}

			if(!status){
			
				//var adminUser = req.session.user,
				var id = req.query.ibeacon
				var meetingid = req.query.meetingId
			
				//更新ibeacon集合中meetingid和ibeacon的对应关系
				iBeacon_signin_total.updatemeetingid(meetingid,id,function(err){
					if(err){
						console.log(err);
					}
				});	
			}

		});
		
	});

app.post('/admin/meetingTemplate',function(req,res){
	var meetingId = req.query.meetingId;
	var templateId =  '7Dp-3Gis9UimFJm7wenkCx69_hVDKFVN2XRt5dA2ijU';
	// URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
	var url =  'http://' + weChatConfig.domain + '/user/meeting' + meetingId;
	var topColor = '#FF0000'; // 顶部颜色
	Signin.getSigners(meetingId,function(err,signers){
		var data = {
                    first: {
                        "value":req.body.first,
                        "color":"#173177"
                    },
                    keyword1: {
                        "value":req.body.keyword1,
                        "color":"#173177"
                    },
                    keyword2: {
                        "value":req.body.keyword2,
                        "color":"#173177"
                    },
                    remark: {
                        "value":req.body.remark,
                        "color":"#173177"
                    }
                };
                console.log(data);
                if(signers){
                	signers.forEach(function(signer){
			        	console.log(signer);
			         api.sendTemplate(signer.openid, templateId, url, topColor, data,function(err,result){
			         	if(err){
			         		console.log(err);
			         	}
			         });	
			        });
                }
                res.redirect('/admin');
	});
});

//管理员添加会议日程
app.get('/admin/schedule',function(req,res){
	/*var startTime = req.query.startTime;
	var endTime = req.query.endTime;
	var meetingId = req.query.meetingId;

	var start = startTime.substr(0,10);
	var end = endTime.substr(0,10);
	var s = start.split('/');
	var e = end.split('/');
	var num = (e[1] - s[1])*/
	res.render('admin-schedule');
});

app.post('/admin/Schedule',function(req,res){
	if(req.body){
		var query = {
		meetingId: req.query.meetingId,
		adminUser: req.session.user
	};
	console.log(req.body);
	var data = {
		meetingSchedule: req.body
	};

/*function Create(data){
	this.
}
    if(typeof(req.body.meetingDay) == 'object'){

    }else{
    	var data = {
    		meetingSchedule:{
    			req.body.meetingDay: req.body.m
    		}
    	};
    }*/
	Meeting.update(query,data,function(err,result){
		if(err){
			console.log(err);
		}
		//console.log(result);
		res.redirect('/admin');
	});
	}
});
app.get('/user/schedule',function(req,res){
	var query = {
			adminUser: req.session.user,
			meetingId: req.query.meetingId
	};
	Meeting.getOne(query,function(err,doc){
		if(err){
			console.log(err);
		}
        var day = new Array();
        if(doc.meetingSchedule){
        	if(typeof(doc.meetingSchedule.meetingDay) == "object"){
	        	day = doc.meetingSchedule.meetingDay;
	        }else{
	        	day[0] = doc.meetingSchedule.meetingDay;
	        }
	        console.log(doc.meetingSchedule);
	        console.log(day);
	        res.render('user-date',{
	        	meetingschedule: doc.meetingSchedule,
	        	days: day,
	        	title:'会议日程',
	        	meeting: doc
	        });
        }else{
        	res.render('user-date',{
	        	meetingschedule: '',
	        	days: [],
	        	title:'会议日程',
	        	meeting: ''
	        });
	    }
		/*var demo = {name:"m"};*/

		/*var n = 0;
		var m = new Array();
        for (var i in doc.meetingSchedule) (function(){

        	if(i=='meetingDay'){
        		if(typeof(doc.meetingSchedule[i]) == 'object'){
        			doc.meetingSchedule[i].forEach(function(day){
        				console.log(day);
        			})
        		}else{
        			console.log(doc.meetingSchedule[i]);
        		}
        	}else{
        		var j = 0;
        		var q = 0;
        		while(doc.meetingSchedule[i].length > j){
        		 m[n] = doc.meetingSchedule[i][j] + doc.meetingSchedule[i][j+1] + doc.meetingSchedule[i][j+2]
        			j = j +3;
        			n++;
        		}
        	}

        })();*/
		/*var i = 0;
		var j = m;
		var meetingschedule = new Array();
		function F(fuck){
			meetingcchedule[i] = {doc.fuck[i],doc.fuck[i+1],doc.fuck[i+2]}
			i = i +3;
		}
		doc.meetingSchedule.meetingDay.forEach(function(meetingday){
		});*/
		/*res.render('userschedule',{meetingschedule: doc.meetingSchedule});*/
	});
});
//管理员发送邮件
/*app.get('/admin/email',function(req,res){
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
 
// 开启一个 SMTP 连接池
var transport = nodemailer.createTransport(smtpTransport({
  host: "smtp.qq.com", // 主机
  secure: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: "1113264599@qq.com", // 账号
    pass: "wofeng19921219" // 密码
  }
}));
 
// 设置邮件内容
var mailOptions = {
  from: "Fred Foo <1113264599@qq.com>", // 发件地址
  to: "172071528@qq.com", // 收件列表
  subject: "Hello world", // 标题
  html: "<b>thanks a for visiting!</b> 世界，你好！" // html 内容
}
 
// 发送邮件
transport.sendMail(mailOptions, function(error, response) {
  if (error) {
    console.error(error);
  } else {
    console.log(response);
  }
  transport.close(); // 如果没用，关闭连接池
});
});
*/
	/*app.get('/admin/meetingStop',function(req,res){
		//查询条件
		var query1 = {
			adminUser: req.session.user,
			meetingId: req.query.meetingId
		};
		var data1 = {
			meetingStatus: '0'
		};
		//更新集合meeting中的start字段
		Meeting.update(query1,data1,function(err,result){
			if(err){
			console.log(err);	
			}
			console.log(result);
			if(result){
				//res.redirect('/admin');
			}else{
				//res.redirect('/admin')
			}
		});
	});*/
	/*app.get('/admin/downloadQRcode',function(req,res){
		api.createTmpQRCode(100, 1800, function(err,result){
			if(err){
				console.log(err);
			}
			console.log(result);
			if(result){
				res.redirect(api.showQRCodeURL(result.ticket));
			}
		});
	});*/
	//会议留言
	app.get('/admin/message',function(req,res){
		res.render('admin-message');
	});

	//下载资料
	app.get('/getMaterials/:meetingId',function(req,res){
		var query = {
			meetingId : req.params.meetingId
		};
		Meeting.getOne(query,function(err,result){
			if(err){
				console.log(err);
			}
			console.log(result)
			if(result){
				var materials = result.material;
				materials.forEach(function (material,index){
					var filename = material.substring(material.lastIndexOf('/') + 1),
					    writestream = fs.createWriteStream(material);
					 
					http.get(material, function (res) {
						res.pipe(writestream);
						});
				});
			}else{
				res.render('error', {
			      message: "NOT FIND",
			      error: "NOT FIND"
			    });
			}
		});
	});
	/*********************管理员路由结束*******************/
}