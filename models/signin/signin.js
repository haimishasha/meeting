/*************************************************************************************/
/*                                                                                   */
/*               此部分代码是数据库对会议签到所进行的一些相关的操作                  */
/*                                                                                   */
/*************************************************************************************/
var mongodb   = require('../db.js');
var Signin = function(signin) {
  this.meetingid = signin.meetingid;
  this.adminUser = signin.adminUser;
};

module.exports = Signin;

//存储会议签到信息
Signin.prototype.save = function(callback) {
  var signin = {
    meetingid: this.meetingid,
    adminUser: this.adminUser
  };
  console.log('signin:');
  console.log(signin);
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('signins',function (err, signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      signins.insert(signin, {safe: true}, function (err, result) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, result);
      });
    });
  });
}

//删除或者注销某个会议签到
Signin.remove = function(meetingid,callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('signins', function (err, signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      signins.remove({meetingid: meetingid}, {w: 1}, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
}

//获得某场会议的签到信息
Signin.get = function(meetingid, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    db.collection('signins', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.findOne({meetingid: meetingid}, function (err, signin) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, signin);
      });
    });
  });
}

//获得某场会议的签到者的信息或者是已报名用户的信息
Signin.getSigners = function(meetingid, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    db.collection('signins', function (err, signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
     signins.findOne({meetingid: meetingid,}, function (err, signin) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        if(signin){
          var signers = signin.signers;
          if(signers){
            callback(null, signers);
          }else{
            callback(null,null);
          }
        }else{
          callback(null,null);
        }
      });
    });
  });
}


//获得某场会议的签到者的信息（前提是需要报名）
Signin.getSignersArrived = function(meetingid,arrived,callback) {
  var i = 0;
  var signerArrived = [];
  mongodb.open(function (err, db) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    db.collection('signins', function (err, signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
     signins.findOne({meetingid: meetingid,}, function (err, signin) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        if(signin){
          var signers = signin.signers;
          if(signers){
            signers.forEach(function (signer,index){
              if(signer.arrived == arrived){
                signerArrived[i] = signer;
                i++;
              }
            });
            signerArrived.sort({company:1,truename:1});
            callback(null, signerArrived);
          }else{
            callback(null,null);
          }
        }else{
          callback(null,null);
        }
      });
    });
  });
}




//获得某场会议的某一个已经报名的人
Signin.getSigner = function(meetingid,openid, callback) {
  var signer1 = null;
  mongodb.open(function (err, db) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    db.collection('signins', function (err, signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      signins.findOne({meetingid: meetingid,}, function (err, signin) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        if(signin){
          if(signin.signers){
            signin.signers.forEach(function (signer,index){
              if(signer.openid === openid){
                signer1 = signer;
              }
            });
            callback(null,signer1);
          }else{
            callback(null,null);
          }
        }else{
          callback(null,null);
        }
      });
    });
  });
};