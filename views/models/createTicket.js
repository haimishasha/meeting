var https = require('https');
var crypto = require('crypto');
//var mongodb = require('./db');
 module.exports = function(callback){
	 var Ticket = {
		 ACCESS_TOKEN: '',
		 jsapi_ticket: ''
	 };
	 //获取Access_token函数
 	var getAccess_token = function(){
 		var appid = 'wx6569c93469ff6026';
 		var secret = '017965e2c63a2a3388a8ec8dd05bce50';
 		https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ appid +'&secret='+ secret +'', function(_res) {
               // 这个异步回调里可以获取access_token
               _res.on('data', function(d) {
                   process.stdout.write(d);//打印josn文件{"access_token":"ACCESS_TOKEN","expires_in":7200}
                   var json = JSON.parse(d);//将josn文件转化为对象
                   Ticket.ACCESS_TOKEN = json.access_token;
				   getTicket(Ticket.ACCESS_TOKEN);
                   console.log('ACCESS_TOKEN:' + Ticket.ACCESS_TOKEN);
               });

               }).on('error', function(e) {
                  console.error(e);
               })
 	};
	 //根据access_token获取ticket值
 	var getTicket = function(ACCESS_TOKEN){
 		https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ ACCESS_TOKEN +'&type=jsapi', function (_res){
			_res.on('data', function (d){
				process.stdout.write(d);
				var json = JSON.parse(d);//将josn文件转化为对象{}
				Ticket.jsapi_ticket = json.ticket;
				/*saveTicket(function(){
					if(err){
						console.log('saveTicket err!');
					}
				});*/
				callback(Ticket.jsapi_ticket);
				console.log('jsapi_ticket:' + Ticket.jsapi_ticket);

			});
		}).on('error', function (e) {
			console.log(e);
		})
 	};

	/*var saveTicket = function(err) {
		mongodb.open(function(err,db){
			if(err){
				return callback(err);
			}
			db.collection('ticket',function(err,collection){
				if(err){
					mongodb.close();
					return callback(err);
				}
				collection.update('ticket',function(err){
					mongodb.close();
					if(err){
						return callback(err);
					}
					callback(null);
				});
			});
		});
	};*/

	 getAccess_token();

 }