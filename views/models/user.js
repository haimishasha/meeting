/**
 * Created by Administrator on 2015/8/19.
 */
var mongodb = require('./db');
var Admin = function(admin){
    this.name= admin.name;
    this.birthday = admin.birthday;
    this.datesEmployed = admin.datesEmployed;
    this.email = admin.email;
    this.contact = admin.contact;
};

module.exports = Admin;

Admin.prototype.save = function(callback){

    var admin = {
        name: this.name,
        birthday: this.birthday,
        datesEmployed: this.datesEmployed,
        email: this.email,
        contact: this.contact
    };

    mongodb.open(function(err,db){

        if(err){
            return callback(err);
        }
        db.collection('admins',function(err,admins){
            if(err){
                mongodb.close();
                return callback(err);
            }
            admins.insert(admin,
                {safe:true},
            function(err,admin){
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                callback(null,admin.ops[0]);
            });
        });
    });
};