/**
 * Created by Administrator on 2015/8/20.
 */
var mongodb = require('./db');
var IpApply = function(ip){
    this.ID = '';
    this.Time = '';
    this.OpenId = ip.OpenId;
    this.Name = ip.Name;
    this.Contact = ip.Contact;
    this.OfficeAddress = ip.OfficeAddress;
    this.MAC = ip.MAC;
    this.Department = ip.Department;
    this.imgP = ip.imgP;
    this.adminIP = '';
    this.adminSubnetMask = '';
    this.adminDNS = '';
    this.adminSpareDNS = '';
    this.reason = '';
    this.result = 0;
};

module.exports = IpApply;
//ÓÃ»§ÉêÇë±£´æ
IpApply.prototype.save = function(callback){
    var date = new Date();
    var time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(); /*+ ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();*/
    var ipApply = {
        ID : this.ID,
        Time:time,
        OpenId : this.OpenId,
        Name : this.Name,
        Contact : this.Contact,
        OfficeAddress : this.OfficeAddress,
        MAC : this.MAC,
        Department : this.Department,
        imgP: this.imgP,
        adminIP: '',
        adminSubnetMask: '',
        adminDNS: '',
        adminSpareDNS: '',
        reason: '',
        result: 0
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('ipApplys',function(err,ipApplys){
            if(err){
                mongodb.close();
                return callback(err);
            }
            ipApplys.insert(ipApply,
                {
                    safe:true
                },function(err,admin){
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    callback(null,admin.ops[0]);
                });
        });
    });
};
//ÓÃ»§»ñÈ¡×Ô¼ºµÄipµØÖ·
IpApply.getOne = function(openid,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('ipApplys',function(err,ipApplys){
            if(err){
                mongodb.close();
                return callback(err);
            }
            ipApplys.find({OpenId:openid}).toArray(function(err,docs){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                callback(null,docs);
            });
        });
    });
};
//¹ÜÀíÔ±»ñÈ¡ËùÓÐÓÃ»§IPµØÖ·Îª¿ÕµÄÉêÇë
IpApply.getAll = function(query,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('ipApplys',function(err,ipApplys){
            if(err){
                mongodb.close();
                return callback(err);
            }
            ipApplys.count(query,function(err,total){

            });
            ipApplys.find(query).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            });
        });
    });
};
//°Ñ¹ÜÀíÔ±·ÖÅäµÄIPµØÖ··ÖÅä¸øÓÃ
IpApply.update = function(ID,ipApply,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('ipApplys',function(err,ipApplys){
            if(err){
                mongodb.close();
                return callback(err);
            }
            ipApplys.update({ID:ID},{$set: ipApply},{multi:true},function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,result);
            });
        });
    });
};


//¶ÁÈ¡ÓÃ»§µÄipµØÖ·ÏêÇé
IpApply.getIpDetail = function(ID,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('ipApplys',function(err,ipApplys){
            if(err){
                mongodb.close();
                return callback(err);
            }
            ipApplys.findOne({ID:ID},function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,doc);
            });
        });
    });
};











