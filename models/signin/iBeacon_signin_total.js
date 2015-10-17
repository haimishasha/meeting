/*************************************************************************************/
/*                                                                                   */
/*          此部分代码是数据库对用于签到的iBeacon总库所进行的一些相关的操            */
/*                                                                                   */
/*************************************************************************************/
var mongodb       = require('../db');
var config        = require('../../routes/config');
var url           = config.url.url;

function IBeacon_signin_total(id) {
  this.id      = id;
  this.url     = url + "shakesignin/"+id;
};

module.exports = IBeacon_signin_total;

//存储iBeacon信息
IBeacon_signin_total.prototype.save = function(callback) {
  var iBeacon_signin_total = {
	  id:     this.id,
    url:    this.url,
  };
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('iBeacon_signins', function (err, iBeacon_signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      iBeacon_signins.insert(iBeacon_signin_total, {safe: true}, function (err, result) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, result);
      });
    });
  });
};

//更新IBeacon_signin_total信息，此处专用于绑定管理员账号
IBeacon_signin_total.updateadminUser = function(adminUser, id, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('iBeacon_signins', function (err, iBeacon_signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      iBeacon_signins.update({"id": id}, {$set: {"adminUser": adminUser}}, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

//更新IBeacon_signin_total信息，此处专用于绑定会议编号
IBeacon_signin_total.updatemeetingid = function(meetingid,id, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('iBeacon_signins', function (err, iBeacon_signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      iBeacon_signins.update({"id": id}, {$set: {"meetingid": meetingid}}, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

//删除一个设备
IBeacon_signin_total.delete = function(id,callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('iBeacon_signins', function (err, iBeacon_signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      iBeacon_signins.remove({id: id}, {w: 1}, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

//读取某个iBeacon信息
IBeacon_signin_total.get = function(query,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('iBeacon_signins', function (err, iBeacon_signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      iBeacon_signins.findOne(query, function (err, result) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, result);
      });
    });
  });
};

//读取所有满足条件的iBeacon的信息
IBeacon_signin_total.getAll = function(query,callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('iBeacon_signins', function (err, iBeacon_signins) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      iBeacon_signins.find(query).toArray(function (err, results) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, results);
      });
    });
  });
};

