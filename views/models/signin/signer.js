/*************************************************************************************/
/*                                                                                   */
/*               此部分代码是数据库对签到者所进行的一些相关的操作                  */
/*                                                                                   */
/*************************************************************************************/
var mongodb = require('../db');
function Signer(signer) {
    this.openid        = signer.openid;
    this.nickname      = signer.nickname;
    this.headimgurl    = signer.headimgurl;
    this.sex           = signer.sex;
    this.truename      = signer.truename;
    this.email         = signer.email;
    this.connect       = signer.connect;
    this.telephone     = signer.telephone;
    this.company       = signer.company;
    this.job           = signer.job;
    this.qq            = signer.qq;
};
module.exports = Signer;


//存储签到者信息到signins集合中
//Signer.save_signins =  function(meetingid,signer,callback) {
Signer.prototype.save = function(meetingid, callback) {
  var signer = {
      openid:      this.openid,
      nickname:    this.nickname,
      headimgurl:  this.headimgurl,
      sex:         this.sex,
      truename:    this.truename,
      email:       this.email,
      connect:     this.connect,
      telephone:   this.telephone,
      company:     this.company,
      job:         this.job,
      qq:          this.qq,
  };
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('signins', function (err, signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      } 
      signins.update({"meetingid": meetingid,}, {$push: { "signers": signer}} , function (err,user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      }); 
    });   
  });
};

//更新或者修改某个签到者的的信息到signins集合中
//Signer.update_signins =  function(meetingid,signer,callback) {
Signer.update =  function(meetingid,signer,callback) {
  mongodb.open(function (err,db){
    if(err){
      return callback(err);
    }
    db.collection('signins', function (err, signins) {
      if(err){
        mongodb.close();
        return callback(err);
      }
      signins.update({"meetingid": meetingid,"signers.openid": signer.openid}, {$set:{"signers.$": signer}}, function (err,result) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

//存储签到者信息到signers总集合中
Signer.prototype.saveintoSigners = function(callback) {
  var signer = {
      openid:      this.openid,
      nickname:    this.nickname,
      headimgurl:  this.headimgurl,
      sex:         this.sex,
      truename:    this.truename,
      email:       this.email,
      connect:     this.connect,
      telephone:   this.telephone,
      company:     this.company,
      job:         this.job,
      qq:          this.qq,
  };
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection("signers",function (err,signer1){
      if (err) {
        mongodb.close();
        return callback(err);
      } 
      signer1.insert(signer, function (err,user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      }); 
    });  
  });
};



//更新或者修改某个签到者的的信息到signers总集合中
Signer.update_signers =  function(signer,callback) {
  mongodb.open(function (err, db) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    db.collection("signers",function (err,signer1){
      if (err) {
        mongodb.close();
        return callback(err);
      } 
      signer1.update({"openid": signer.openid},{$set: signer},function(err){
        mongodb.close();
        if(err){
            return callback(err);
        }
        callback(null);
      });
    });
  });
}


//获某一个总库中的用户的信息
Signer.getSignerInSigners = function(query,callback) {
  mongodb.open(function (err, db) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    db.collection('signers', function (err, signer) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      signer.findOne(query, function (err, result) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        if(result){
          callback(null, result);
        }else{
          callback(null, null);
        }
      });
    });
  });
}

// //获某一个已经报名但是没有签到的或者是已经签到的人
// Signer.getSignerInSigners = function(query,callback) {
//   mongodb.open(function (err, db) {
//     if (err) {
//       mongodb.close();
//       return callback(err);
//     }
//     db.collection('signers', function (err, signer) {
//       if (err) {
//         mongodb.close();
//         return callback(err);
//       }
//       signer.findOne(query, function (err, result) {
//         mongodb.close();
//         if (err) {
//           return callback(err);
//         }
//         if(result){
//           callback(null, result);
//         }else{
//           callback(null, null);
//         }
//       });
//     });
//   });
// }