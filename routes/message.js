var Signin = require('../models/signin/signin');


module.exports = function(app){
    var meetingid;
	app.get('/message/:meetingId',function(req,res){

        meetingid = req.params.meetingId;
        var openid = req.session.openid;
        var username;
        var headimgurl;
        Signin.getSigner(meetingid,openid,function(err,doc){
            if(err){
                console.log(err);
            }
            else {
                if(doc){
                    username = doc.nickname;
                    headimgurl = doc.headimgurl;
                    res.render('message', {
                        username: username,
                        headimgurl: headimgurl
                    });
                }else{
                    username = '';
                    headimgurl ='';
                    res.render('message', {
                        username: username,
                        headimgurl: headimgurl
                    });
                }
                
            }
        });

});
    /*********************聊天功能******************/
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var history = new Array();
    io.on('connection', function(socket){
        socket.join('meetingid');
        for(var i=0;i<history.length;i++)
        {
            socket.emit('chat message', history[i]);          
        }
       // socket.emit('chat message', 'lyd__上面是最近的一些信息'); 
        socket.on('chat message', function(msg)
        {                   
            io.sockets.in('meetingid').emit('chat message',msg);
            addMsg(msg);
         });
    });

    http.listen(3000, function(){console.log('listening on *:3000');});

    function addMsg(msg){
        history.push(msg);
        if(history.length>100)
          histor.shifty.shift();
                  console.log('4');
    }

}
