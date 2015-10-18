/*************************************************************************************/
/*                                                                                   */
/*         此部分代码是数据库对用于签到的单个iBeacon所进行的一些相关的操作           */
/*                                                                                   */
/*                          这部分代码目前貌似没有用                                 */
/*                                                                                   */
/*************************************************************************************/
var mongodb = require('../db');

function IBeacon_signin_manager(iBeacon_signin_manager) {
  this.iBeacon_signin_manager = iBeacon_signin_manager;
}
module.exports = IBeacon_signin_manager;

//为某个管理员增加一个iBeacon_signin_manager
IBeacon_signin_manager.prototype.save = function(managerid,callback) {
  var iBeacon_signin_manager = this.iBeacon_signin_manager;
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 managers 集合
    db.collection('managers', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      } 
      collection.update({
        "managerid": managerid,
      }, {
        $push: { 
          "iBeacons": iBeacon_signin_manager
        }
      } , function (err,user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        //console.log("iBeacon_signin_manager1_save");
        callback(null);
      }); 
    });
  });
};

//删除或者注销某个管理员的某一个iBeacon_signin_manager
IBeacon_signin_manager.remove = function(user,id,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 managers 集合
    db.collection('managers', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //查询要删除的iBeacon_signin_manager所对应的文档
      user.iBeacons.forEach(function (iBeacon_signin_manager,index){
        if(iBeacon_signin_manager.id === id){
          collection.update({
            "managerid":managerid
          }, {
                $pull: {
                  "iBeacons": {
                    "id": id,
                  }
                }
          }, function (err) {
            if (err) {
              mongodb.close();
              return callback(err);
            }
          });
        }
      });
    });
  });
}

// //更新或者修改某个管理员的某一个iBeacon_signin_manager的信息
// iBeacon_signin_manager.addcardno =  function(cardNo,managerid,id,callback) {
//   //打开数据库
//   mongodb.open(function (err,db){
//     if(err){
//       return callback(err);
//     }
//     //读取managers集合
//     db.collection('managers', function (err, collection) {
//       if(err){
//         mongodb.close();
//         return callback(err);
//       }
//       collection.update({
//         "managerid":        managerid,
//         "iBeacons.id":   id
//       }, {
//             $set: { 
//                 "cardNo": cardNo
//               }
//       }, function (err,result) {
//         //console.log("=======================");
//         mongodb.close();
//         if (err) {
//           return callback(err);
//         }
//         callback(null);
//       });
//     });
//   });
// };

//更新或者修改某个管理员的某一个iBeacon_signin_manager的信息   主要用于绑定信息
IBeacon_signin_manager.update =  function(managerid,iBeacon_signin_manager1,callback) {
  //打开数据库
  mongodb.open(function (err,db){
    if(err){
      return callback(err);
    }
    //读取managers集合
    db.collection('managers', function (err, collection) {
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.update({
        "managerid":       managerid,
        "iBeacons.id":  iBeacon_signin_manager1.id
      }, {
            $set: { 
                "iBeacons.$": iBeacon_signin_manager1
              }
      }, function (err,result) {
        //console.log("=======================");
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

//读取某个管理员的某一个iBeacon_signin_manager中的信息
IBeacon_signin_manager.get = function(user,id,callback) {
  var iBeacon_signin_manager1=null;
  if(user.iBeacons !== undefined ) {
    user.iBeacons.forEach(function (iBeacon_signin_manager,index){
      if(iBeacon_signin_manager.id === id){
        iBeacon_signin_manager1 = iBeacon_signin_manager;
      }
    });
  }
  callback(null, iBeacon_signin_manager1);//成功！返回查询的iBeacon_signin_manager信息
};

//读取某个管理员的某一个iBeacon_signin_manager中的信息
IBeacon_signin_manager.getAll = function(user,callback) {
  callback(null, user.iBeacons);//成功！返回查询的iBeacon_signin_manager信息
};