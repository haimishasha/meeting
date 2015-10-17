/**
 * ********************************************************************************
 * 
 * @param appid     认证ID
 * @param timestamp 时间戳
 * @param nonceStr	随机串
 * @param signature 认证签名
 * @param title		标题
 * @param desc		内容	
 * @param link		连接	
 * @param imgUrl	图标	
 * @param UrlPath   分享给朋友的地址。带OpenId
 * @author King
 * 
 * ********************************************************************************
 * 
 */
function _WXShare(appid,timestamp,nonceStr,signature,title,desc,link,imgUrl,UrlPath){
	//初始化参数
	appid=appid||'';
	timestamp=timestamp||0;
	nonceStr=nonceStr||'';
	signature=signature||'';
	title=title||document.title;
	desc=desc||document.title;
	link=link||document.location.href;
	imgUrl=imgUrl||'';
	UrlPath=UrlPath||'';
	wx.config({
	    debug: false, 						// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: appid, 						// 必填，公众号的唯一标识
	    timestamp: timestamp, 				// 必填，生成签名的时间戳
	    nonceStr: nonceStr, 				// 必填，生成签名的随机串
	    signature: signature,			// 必填，签名，见附录1
	    jsApiList: [
	        'onMenuShareTimeline',
	        'onMenuShareAppMessage',
	        'onMenuShareQQ'
	    ] 									// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
}	
wx.ready(function(){
	var shareData = {
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		UrlPath: UrlPath,
	};
	wx.onMenuShareAppMessage(shareData);
	wx.onMenuShareTimeline(shareData);
	wx.onMenuShareQQ(shareData);
	
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
	    wx.checkJsApi({
	      jsApiList: [
	        'onMenuShareAppMessage',
	        'onMenuShareTimeline',
	        'onMenuShareQQ'
	      ],
	      success: function (res) {
	       //alert(JSON.stringify(res));
	      }
	    });
	    // 2. 分享接口
	    // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
	    wx.onMenuShareAppMessage({
	      title: shareData.title,
	      desc: shareData.desc,
	      link: shareData.UrlPath,
	      imgUrl: shareData.imgUrl,
	      trigger: function (res) {
	        //alert('用户点击发送给朋友');
	      },
	      success: function (res) {
	        //alert('已分享');
	      },
	      cancel: function (res) {
	        //alert('已取消');
	      },
	      fail: function (res) {
	        //alert(JSON.stringify(res));
	    	  alert("分享失败！");
	      }
	    });
	    
	    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
	    wx.onMenuShareTimeline({
	        title: shareData.title,
	        link: shareData.UrlPath,
	        imgUrl: shareData.imgUrl,
	        trigger: function (res) {
	          //alert('用户点击分享到朋友圈');
	        },
	        success: function (res) {
	          //alert('已分享');
	        },
	        cancel: function (res) {
	          //alert('已取消');
	        },
	        fail: function (res) {
	          //alert(JSON.stringify(res));
	        	alert("分享失败！");
	        }
	    });
	    
	    wx.onMenuShareQQ({
	        title: shareData.title,
	        desc:  shareData.desc,
	        link: shareData.link,
	        imgUrl: shareData.imgUrl,
	        trigger: function (res) {
	          //alert('用户点击分享到QQ');
	        },
	        complete: function (res) {
	          //alert(JSON.stringify(res));
	        },
	        success: function (res) {
	          //alert('已分享');
	        },
	        cancel: function (res) {
	          //alert('已取消');
	        },
	        fail: function (res) {
	          //alert(JSON.stringify(res));
	        	alert("分享失败！");
	        }
	      });

});
wx.error(function(res){
	alert(res.errMsg);
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

});

