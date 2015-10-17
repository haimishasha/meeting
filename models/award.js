/**
 * Created by Administrator on 2015/9/21.
 */
 var mongodb = require('./db');
 var Award = function(award_set){
    this.adminUser = award_set.adminUser;
    this.meetingId = award_set.meetingId;
    this.livePrizeArray = award_set.livePrizeArray;//一、二、三等奖的概率、奖品数量和奖品名字
    this.mode = award_set.mode;
};

module.exports = Award;

Award.prototype.save = function(callback){

    var Time = new Date();
    var time = Time.getFullYear() + '-' + Time.getMonth() + '-' + Time.getDate() + ' ' + Time.getHours() + ':' + Time.getMinutes() + ':' + Time.getSeconds();
    var noncestr = Math.random().toString(36).substr(2,16);
    var awards = {
        adminUser: this.adminUser,
        meetingId: this.meetingId, 
        id: noncestr,
        livePrizeArray: this.livePrizeArray,
        mode: this.mode,
        time: time
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('awards',function(err,award){
            if(err){
                mongodb.close();
                return callback(err);
            }
            award.insert(awards,
                {
                    safe: true
                },function(err,award){
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    callback(null,award);
                });
        });
    });
};


//
Award.get = function(query,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback();
        }
        db.collection('awards',function(err,award){
            if(err){
                mongodb.close();
                return callback(err);
            }
            award.find(query).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs[0]);
            });
        });
    });
};
Award.getAll = function(query,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback();
        }
        db.collection('awards',function(err,award){
            if(err){
                mongodb.close();
                return callback(err);
            }
            award.find(query).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            });
        });
    });
};
Award.getOne = function(query,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback();
        }
        db.collection('awards',function(err,award){
            if(err){
                mongodb.close();
                return callback(err);
            }
            award.findOne(query,function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,doc);
            });
        });
    });
};
//更新数据
Award.update = function(query,data,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('awards',function(err,award){
            if(err){
                mongodb.close();
                return callback(err);
            }
            award.update(query,{$set: data},{multi:true},function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,result);
            });
        });
    });
};




Award.updatePull = function(query,data,callback){
    mongodb.open(function(err,db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection('awards',function(err,award){
            if(err){
                mongodb.close();
                return callback(err);
            }
            award.update(query,{$pull: data},function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,result);
            });
        });
    });
};
Award.updatePush = function(query,data,callback){
    mongodb.open(function(err,db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection('awards',function(err,award){
            if(err){
                mongodb.close();
                return callback(err);
            }
            award.update(query,{$push: data},function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,result);
            });
        });
    });
};
Award.remove = function(query,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback();
        }
        db.collection('awards',function(err,award){
            if(err){
                mongodb.close();
                return callback(err);
            }
            award.remove(query,function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            });
        });
    });
}