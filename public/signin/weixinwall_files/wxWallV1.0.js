/**********************
 * 微信墙前端js
 * mark
 **********************/
//基础配置
var ws_config = {
	updateTime     : 0,
	autoCheckTime  : 5000,     //毫秒
	sayTaskTime    : 4000
}
  	
//消息列表
var ws_say={
	index:0, //下一次将跳转的下标
	indexMax:0, //判断下标最大，如果出现新数据，会直接从此下标开始轮播
	indexDetail:0, //大图展示的下标
	page:3,
	runkey:1, //1运行0停止  
	news:"",
	list:""
}

//取得统计个数据：1,签到;2,留言墙
function getCount(){
		return $("#signlist").children('li.user-had').length;
}  		    
var task = null; //检查最新任务

var isCheck = 1; //1检查，0不检查
  	
function setUpdateTime(t){
	$("#checkTime").val(t);
}

//取得参数
function getConfig(key){
	if(key=='sayTaskTime'){
		return ws_config.sayTaskTime;
	}else if(key=='autoCheckTime'){
		return ws_config.autoCheckTime;
	}
}
  	
/**
 * 初始化方法
 */
function init(){
	//initWallConfig();//初使化配置信息,log与qr
  	//initSay();//初始化留言墙数据
  	initSignin();//初始化签到空白补全
  	startTask(); //开始执行更新程序
  	changeWall(1);//运行签到墙
  	updateHeardData(); //更新头部显示数
}

// //初始化页面配置
// function initWallConfig(){
// 	 $.getJSON("/pc/head_homeConfig.do?jsoncallback="+new Date().getTime(), function(msg){
// 		var logurl = msg.logurl;
// 		if(logurl.length>0){
// 			$("#logurl").attr("src",logurl);
// 		}else{
// 			$("#logurl").attr("src",'/weixinwall_files/logoV1.0.png');
// 			$("#logurl").css("background-size","100% 100%");
// 		}
// 		var qrurl = msg.qrurl;
// 		if(qrurl.length>0){
// 			$("#wscode").attr("src",qrurl);
// 			$("#bigQrurl").attr("src",qrurl);
// 		}
// 	});
// }

//初始签到
function initSignin(){
	var signCount = getSignSum();
	var s00 = 28-signCount%28;
	for(i=0; i<s00; i++){
		$("#signlist").append('<li class="user-no"><div class="play"></div></li>');
	}
}
  	 	
//启动任务
function startTask(){
  	task = setInterval("checkData()",getConfig('autoCheckTime'));
}

/**
 * 判断是否有最新签到和发言
 */
function checkData(){
  	if(isCheck==1){
   		$.getJSON("/signin?utime="+$("#checkTime").val()+"&jsoncallback="+new Date().getTime(), function(msg){
			setUpdateTime(msg.time);
			if(msg.hadsign==1){
				isCheck=0 //停止轮循
				updateData(msg.hadsign);
			}
		});
  	}
}

 //更新数据-并更新当前墙上面的显示数
function updateData(hadsign){
  	updateSignList();
  	updateHeardData(); //更新头部显示数
  	isCheck=1;
}	
/**
 * 获取最新签到
 */
function updateSignList(){
	var updateTime = $("#signUpdateTime").val();
  	var checkTime = $("#checkTime").val();
  	$.getJSON("/sign?utime="+updateTime+"&endtime="+checkTime+"&jsoncallback="+new Date().getTime(), function(msg){
		$("#signUpdateTime").val(checkTime);
		showSignList(msg.list);
	});
}
  	
//更新签到
function showSignList(d){
  	if(d!=null && d.length>0){
  		stopSignTask();
  		var obj = "";
  		var list = d;
  		stopSignTask2();
		//最新签到
		var content="";
		for (i = 0; i < list.length; i++) {
			$("[id='"+list[i].openid+"']").remove();
			//如果是拉黑或删除
			if(list[i].status==0 || list[i].type==2){
				break;
			}
			if(list[i].content.length>8){
				content = '<p style="font-size:35px;">'+list[i].content+'</p>';
			}else{
				content = '<p>'+list[i].content+'</p>';
			}
			obj = '<li id="'+list[i].openid+'" class="user-had">'+
						'<div class="play">'+
		    				'<input type="hidden" name="p'+list[i].sex+'" value="'+list[i].name+'|'+list[i].sex+'|'+list[i].imgurl+'|'+list[i].openid+'">'+
							'<div class="avatar" ><img src="'+list[i].imgurl+'" /><p>'+list[i].name+'</p></div>'+
							'<div class="siginWords"><i class="leftside"></i>'+content+'</div>'+					
						'</div>'+
					'</li>';
			$("#signlist").prepend(obj);
		}
		checkUserHead();
		runSign();//重新轮播
  	}
}

//检查用户墙布满情况，如果不满最后一墙，用空头像补充
function checkUserHead(){
	var signCount = getSignSum();
	var headNoSum = 28-signCount%28;
	var old_headNoSum = $("#signlist").children("li.user-no").length;
	if(headNoSum>old_headNoSum){
		for(var i=0; i<headNoSum-old_headNoSum; i++){
			$("#signlist").append('<li class="user-no"><div class="play"></div></li>');
		}
	}else if(old_headNoSum > headNoSum){
		var c00 = old_headNoSum-headNoSum;
		$("#signlist").children("li.user-no").slice(0,c00).remove();
	}
}
 	
//获取当前签到人数
function getSignSum(){
  	return $("#signlist").children("li.user-had").length;
}

//获取当前签到数据
function getSignData(){
	return $("#signlist").children("li.user-had");
}
  	
 //切换墙
function changeWall(){
  	
  		$("#siginWall").show();
  		$("body").append("<script src='/signin/weixinwall_files/signin.js'></script>");
		siginWallInit();
} 	

//检查签到墙是否已经不显示当前层
function checkSignHide(){
	return $('.siginWall').is(':hidden');
}

//公页间隔时间控制  	
var playButTimeKey = 0;
function setTimePlayButKey(){
	playButTimeKey=0;
}

//分页标签控制--判断
function wallPage(key){
	if(playButTimeKey!=0){
		return ;
	}
	playButTimeKey = 1;
	setTimeout("setTimePlayButKey()",1200);
	setSignPage(key);
}

//全屏
function fullScreen(element){
	if(element.requestFullscreen) {
	    element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
	    element.mozRequestFullScreen();
	} else if(element.webkitRequestFullscreen) {
	    element.webkitRequestFullscreen();
	} else if(element.msRequestFullscreen) {
	    element.msRequestFullscreen();
	}
}
//返回登录
function jumpLogin(){
	location.href = "/";
}

/**
 * 更新当前签到或发言数
 */
function updateHeardData(){
	
	var tag = screenArr[1];
	if(tag == '1' || tag== '2'){
		if (tag == 1) {
			$("#countP").html(getCount(2) + "条发言")
		} else if (tag == 2) {
			$("#countP").html(getCount(1) + "人签到")
		}
	}else{
		$("#countP").html(getCount(1) + "人签到");
	}
}

// /**
//  * 大屏幕打开显示二维码
//  * 如果签到墙（留言墙）正在运行，让其暂停
//  */
// function openQRcodeWall(){
// 	stopSignTask2();
//   	$("#but_play").removeClass("btnPause").addClass("btnPlay");
// 	$(".QRcodeBox").show();
// }

// /**
//  * 大屏幕关闭显示二维码
//  */
// function closeQrcodeWall(){
// 	$(".QRcodeBox").hide();
// 	startSignTask();
// }

/**
 *1签到墙2留言3抽奖4现场互动5对对碰6投票
//  */
// function getScreenIndex(){
// 	if(!$('#siginWall').is(':hidden')){ //签到墙
// 		return 1;
// 	}else if(!$('#msgWall').is(':hidden') || !$('#msgDetail').is(':hidden')){ //留言墙
// 		return 2;
// 	}else if(!$('#lotteryWall').is(':hidden')){
// 		return 3;
// 	}else if(!$('#onSiteWall').is(':hidden')){
// 		return 4;
// 	}else if(!$('#pairWall').is(':hidden')){
// 		return 5;
// 	}else if(!$('#voteWall').is(':hidden')){
// 		return 6;
// 	}
// }

/**
 * 大屏幕打开显示二维码
 * 如果签到墙（留言墙）正在运行，让其暂停
 */
function openQRcodeWall(){
	var walltype = 1;
	if(walltype==1){
		stopSignTask2();
  		$("#but_play").removeClass("btnPause").addClass("btnPlay");
	}else if(walltype==2){
		ws_say.runkey = 0;
  		runSay(0);
	}
	$(".QRcodeBox").show();
}

/**
 * 大屏幕关闭显示二维码
 */
function closeQrcodeWall(){
	$(".QRcodeBox").hide();
	var walltype = 1;
	if(walltype==1){
		startSignTask();
	}else if(walltype==2){
		ws_say.runkey = 1;
  		runSay(1);
	}
}
