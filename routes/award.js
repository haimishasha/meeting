//加载抽奖模块数据库
var Award = require('../models/award');
//加载签到数据库
var Signin = require('../models/signin/signin');
module.exports = function(app){

/*********************************文件下载***************************/ 
app.get('/download', function (req, res) {
        var options = {
            root: __dirname + '/',
           dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        var fileName = '/目录.docx';
        res.sendFile(fileName, options, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
            else {
                console.log('Sent:', fileName);
            }
        });
    });
   /***********************************用户抽奖开始*******************************/
   app.get('/user/award',function(req,res){
    res.render('award');
   });
   app.get('/user/message',function(req,res){
    res.render('message');
   });
   //管理员设置抽奖
   app.get('/admin/awardSet',function (req,res){

        var result = '';

        res.render('admin-awardSet',{
          title: '新建抽奖',
          meetingId: req.query.meetingId
        });
   });

   //用户抽奖
   app.post('/1',function (req,res){

      var random = '',
          result = '';
       var query = '';

       Award.get(query,function(err,award_set){
        //一等奖
        var i = 0;
        while(i < 3){
          if(award_set){

           var probability = award_set.prizeArray[i].probability;               //中奖概率

           var award_num = award_set.prizeArray[i].award_num;                   //奖品数量

           random = Math.floor(Math.random() * 100);              //随机产生100中的整数

           if(random < probability * 100){                        //产生的随机数与概率数相比较，是否中奖

               result = i + 1;                                    //result为1/2/3分别对应一二三等奖

               break;

           }else{

               result = 0;                                         //否则没有中奖

           }
         }

         i++;       
       }
           res.render('test',{result:result});                    //返回抽奖结果
       });
   });

   //用户抽奖管理员设置
   app.post('/admin/awardSetU',function (req,res){

    var firstPrize = {
      probability: req.body.probability_1,
      award_num: req.body.award_num_1,
      prize:req.body.prize_1
    };

    var secondPrize = {
      probability: req.body.probability_2,
      award_num: req.body.award_num_2,
      prize:req.body.prize_2
    };

    var thirdPrize = {
      probability: req.body.probability_3,
      award_num: req.body.award_num_3,
      prize:req.body.prize_3
    };

    var prizeArray = new Array(3);

    prizeArray[0] = firstPrize;
    prizeArray[1] = secondPrize;
    prizeArray[2] = thirdPrize;

    var adminUser = req.session.user;

    var bodyAward = {
      adminUser: adminUser,
      meetingId: req.query.meetingId,
      prizeArray: prizeArray,
      mode: req.body.mode
    };

    var award = new Award(bodyAward);

       award.save(function(err,award){
           if(err){
               console.log(err);
           }
           console.log(award);
       });
       res.redirect('/admin/myAward');
   });

   /*用户抽奖结束*/

   /*管理员抽奖开始*/
  // 管理员抽奖设置,数据提交
   app.post('/admin/awardSetL',function (req,res){
    //按人数抽奖的数据，抽奖数量和奖品
    var numPrize = {
      liveAwardNum: req.body.liveAwardNum_0,
      livePrize:req.body.livePrize_0
    };
    //一等奖的数据，抽奖数量和奖品
    var firstPrize = {
      liveAwardNum: req.body.liveAwardNum_1,
      livePrize:req.body.livePrize_1
    };
    //二等奖的数据，抽奖数量和奖品
    var secondPrize = {
      liveAwardNum: req.body.liveAwardNum_2,
      livePrize:req.body.livePrize_2
    };
    //二等奖的数据，抽奖数量和奖品
    var thirdPrize = {
      liveAwardNum: req.body.liveAwardNum_3,
      livePrize:req.body.livePrize_3
    };
    //抽奖数据放入一个数组prizeArry中
    var prizeArray = new Array(4);
    prizeArray[0] = numPrize;
    prizeArray[1] = firstPrize;
    prizeArray[2] = secondPrize;
    prizeArray[3] = thirdPrize;

    //管理员id
    var adminUser = req.session.user;
    
    //构建一个对象，管理员唯一标示id、奖项信息和抽奖模式
    var bodyAward = {
      adminUser: adminUser,
      meetingId: req.query.meetingId,
      livePrizeArray: prizeArray,
      mode: req.body.mode
    };
    //构造函数实例化
    var award = new Award(bodyAward);
    //调用构造函数的方法，save来存储提交上来的数据
       award.save(function(err,award){
           if(err){
               console.log(err);
           }
       });

     res.redirect('/admin/myAward');
    /*var headcount = 100,
        award_num = 4;
    var awardArray = new Array();
    var i = award_num;

    while(i > 0){

    random = Math.floor(Math.random() * headcount);              //随机产生100中的整数

    console.log(random);
    awardArray[0] = random;

    i--;

    }*/
   });
   /******************************管理员抽奖结束*****************/


/****************************抽奖开始******************************/

//进入抽奖页面
app.get('/admin/award/:meetingId',function(req,res){
  //调用签到模块获取的用户信息，发送到抽奖界面
  var meetingid =  req.params.meetingId;
  Signin.getSigners(meetingid,function(err,signers){
    if(err){
      console.log(err);
      //跳转错误页面
      //res.redirect('/');
    }
          console.log(signers);
    if(signers){
      var length = signers.length;
      console.log(length);
      res.render('lottery',{
        signers: signers,
        signers_length: length,
        meetingId: meetingid
      });
    }else{
      console.log(0);
      res.render('lottery',{
        signers: [],
        signers_length: 0,
        meetingId: req.query.meetingId});
    }
  });
});
//抽奖方式的选择，根据不同抽奖方式，发送不同的抽奖信息
app.post('/admin/award',function(req,res){
  //抽奖类型
  var i = req.body.luckTag_id;
  //管理员身份
  var query = {
    meetingId:req.query.meetingId,
    adminUser: req.session.user
  };
  //读取抽奖信息
  Award.get(query,function(err,doc){
    if(err){
      return console.log(err);
    }
    //判断是否该管理员是否存在抽奖设置信息，存在则发送，不存在则发送空
    var data = {};
    if(doc){
      //读取中奖用户数量
      var num = doc.luckeruser?doc.luckeruser.length:0;
      //发送客户端信息构建
      data = {
        "map": {
          //奖品名称
          "luck_name": doc.livePrizeArray[i].livePrize,
          //已中奖人数
          "num": num,
          //抽取几人
          "tagNum": doc.livePrizeArray[i].liveAwardNum
        }
      };
    }else{
       data = {
        "map": {
          //奖品名称
          "luck_name": '0',
          //已中奖人数
          "num": '0',
          //抽取几人
          "tagNum": '0'
          }
      };
    }
    res.send(data);
  });
});
//提交用户中奖信息
app.post('/admin/luckUser',function(req,res){
  //搜索中奖信息
  var query = {
    meetingId: req.query.meetingId,
    adminUser: req.session.user
  };
  //用户信息提交包括昵称、openid、头像、中奖信息
  var data = {
    luckeruser: req.body
  };
  console.log(data);
  //调用update方法更新数据库信息
  Award.updatePush(query,data,function(err,result){
    if(err){
      return console.log(err);
    }
    console.log(result);
    res.send('1');
  });
});
//用户重新抽奖
app.post('/admin/awardReset',function(req,res){
  //搜索条件
  var query = {
    meetingId: req.query.meetingId,
    adminUser: req.session.user
  };
  //用户提交删除用户信息openid
  var data = {
    luckeruser: req.body
  };
  //发送客户端信息
  var json = {
    "list": ['0']
  };
  //根据用户提供信息删除数据库数据
  Award.updatePull(query,data,function(err,result){
    if(err){
      return console.log(err);
    }
    res.send(json);
  });
});

//读取已中奖用户信息
app.post('/admin/awardGetuser',function(req,res){
  //搜索条件
  var query = {
    meetingId:req.query.meetingId,
    adminUser: req.session.user
  };
  Award.get(query,function(err,doc){
    if(err){
      console.log(err);
    }
    //判断是否存在这样的文档
    var data = {};
    //存放幸运用户数组
    var list = new Array();
    if(doc){
      //判断是否有中奖用户
      if(doc.luckeruser){
        //中奖用户数组累计
        var i = 0;
        doc.luckeruser.forEach(function(e){
        //判断是否有相同奖项的中奖用户，然后遍历数组把对应的奖项的用户放入数组list中
          if(e.luckTagId == req.body.luckTagId){
            list[i] = {
              openid: e.openid,
              luckName: doc.livePrizeArray[req.body.luckTagId].livePrize,
              imgurl: e.imgUrl,
              name: e.nickName
            };
            //存放用户信息数组自加
            i++;
          }
        });
        //把获取信息数组放到发给客户端的data中
        data = {
          luckList: list
        };
      }else{
        //如果没有中奖用户则发送空
        data = {
          luckList: []
        };
      }
    }else{
      data = {
          luckList: []
      };
    }
  //发送中奖用户信息
  res.send(data);
  });
});
//管理员我的抽奖
app.get('/admin/myAward',function(req,res){
  //根据用户管理员账号读取管理员的会议信息
  var query = {
    meetingId:req.query.meetingId,
    adminUser: req.session.user
  };
  Award.getOne(query,function(err,doc){
    if(err){
      console.log(err);
    }
    console.log(doc);
    if(doc){
      res.render('admin-myAward',{
        award: doc,
        meetingId: req.query.meetingId
      });
    }else{
      res.render('admin-myAward',{
        award: '',
        meetingId: req.query.meetingId
      });
    }
  });
});
//管理员抽奖删除
app.get('/admin/awardRemove',function(req,res){
  //根据抽奖的id
  //var query = {id: req.query};

 var query = {
    meetingId:req.query.meetingId,
    adminUser: req.session.user
  };
  Award.remove(query,function(err,result){
    if(err){
      console.log(err);
      //返回报错页面res.redirect('/admin/myAward');
    }else{
       console.log(result);
       res.redirect('/admin/myAward');
    }
  });
});
//管理员抽奖修改
app.get('/admin/awardUpdate',function(req,res){
  //根据抽奖的id
  //var query = {id: req.query}; 

 var query = {
    meetingId:req.query.meetingId,
    adminUser: req.session.user
  };
  var data = req.body;
  Award.getOne(query,function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log(result);
      res.render('admin-awardUpdate',{award: result,title: '抽奖修改'});
    }
  });
});
//管理员抽奖
app.post('/admin/awardUpdate',function(req,res){
  //按人数抽奖的数据，抽奖数量和奖品
    var numPrize = {
      liveAwardNum: req.body.liveAwardNum_0,
      livePrize:req.body.livePrize_0
    };
    //一等奖的数据，抽奖数量和奖品
    var firstPrize = {
      liveAwardNum: req.body.liveAwardNum_1,
      livePrize:req.body.livePrize_1
    };
    //二等奖的数据，抽奖数量和奖品
    var secondPrize = {
      liveAwardNum: req.body.liveAwardNum_2,
      livePrize:req.body.livePrize_2
    };
    //二等奖的数据，抽奖数量和奖品
    var thirdPrize = {
      liveAwardNum: req.body.liveAwardNum_3,
      livePrize:req.body.livePrize_3
    };
    //抽奖数据放入一个数组prizeArry中
    var prizeArray = new Array(4);
    prizeArray[0] = numPrize;
    prizeArray[1] = firstPrize;
    prizeArray[2] = secondPrize;
    prizeArray[3] = thirdPrize;

    //管理员id
   var query = {
    meetingId:req.query.meetingId,
    adminUser: req.session.user
  };
    
    //构建一个对象，管理员唯一标示id、奖项信息和抽奖模式
    var bodyAward = {
      livePrizeArray: prizeArray,
    };
  Award.update(query,bodyAward,function(err,result){
    if(err){
      console.log(err);
    }
    console.log(result);
    res.redirect('/admin/myAward');
  });
});
   
};
