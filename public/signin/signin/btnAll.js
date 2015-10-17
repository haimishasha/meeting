//1:浏览量，2：一键呼叫，3：一件分享，4外链地址，5：视频地址 6：地图  7.独立用户 8.预约表单 9.有奖转发
/**
 *  一键呼叫
 */
function telBtn(phone){
	console.log("一键呼叫 :"+phone);
	var ua = window.navigator.userAgent.toLowerCase(); 
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		_istat(0,2,phone);
	}
	window.location.href="tel:"+phone;
}

/**
 * 分享
 */
function shareBtn(type,desc){
	var msg;
	if(type == 1){
		msg = "微信分享";
	}else if(type == 2){
		msg = "新浪微博分享";
	}else if(type == 3){
		msg = "短信分享";
	}
	console.log("分享");	
	var ua = window.navigator.userAgent.toLowerCase(); 
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		_istat(0,3,msg);
	}
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i)=="micromessenger") {
	    $(".shareIframe").show();
	} else {
		alert("请使用微信访问！");
	  return;
	}
	return;
}

/**
 * 外链
 */
function urlBtn(url){
	console.log("外链 :"+url);
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		_istat(0,4,url);
	}
	//appendIframe(url,0);
	window.location.href = url;
}

/**
 * 视频
 */
var myVideo = document.getElementById("audio1");  //获取音乐DOM
function videoBtn(videoid){
	console.log("视频 :"+videoid);
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		_istat(0,5,videoid);
	}
	appendIframe("http://player.youku.com/embed/"+videoid,5);
	pauseVid();
}

function playVid(){ //播放 
  myVideo.play();
}
function pauseVid(){//暂停
  myVideo.pause();
}


/**
 * 地图
 */
function mapBtn(longitude,latitude,addressinfo,addressinfo){
	console.log("地图 :"+longitude+"="+latitude+"="+addressinfo+"="+addressinfo);
	var a = longitude+"="+latitude+"="+addressinfo+"="+addressinfo;
//	var webUrl = $("#webUrl").val();
	var ua = window.navigator.userAgent.toLowerCase(); 
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		_istat(0,6,a);
	}
	var url = "/web/map.do?lng="+longitude+"&lat="+latitude+"&name="+addressinfo+"&addr="+addressinfo;
	console.log("地图URL :"+url);
	appendIframe(url,0);
}

/**
 * 表单
 */
function formBtn(formid){
	var tenantid = document.getElementById("tenantid").value;// 商户ID
	var posterid = document.getElementById("posterid").value;// 应用ID
	console.log("表单:"+formid);
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		_istat(0,8,formid);
	}
	window.location.href = "/web/formApp.do?tenantid="+tenantid+"&posterid="+posterid+"&pageId="+formid;
}

/**
 * 有奖转发
 */
function avtBtn(avtid){
	var tenantid = document.getElementById("tenantid").value;// 商户ID
	var posterid = document.getElementById("posterid").value;// 应用ID
	////
	var openid = document.getElementById("openid").value;// 微信ID
	var share = document.getElementById("share").value;// 分享者
	var parent = document.getElementById("parent").value;// 二级分享者
	var type = document.getElementById("type").value;// 分享类型
	var friendid = document.getElementById("friendid").value;// 分享类型
	
	console.log("有奖转发:"+avtid);
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		_istat(0,9,avtid);
	}
	window.location.href = "/web/activityApp.do?tenantid="+tenantid+"&posterid="+posterid+"&activity="+avtid+
						"&openid="+openid+"&share="+share+"&parent="+parent+"&type="+type+"&friendid="+friendid;
}

/**
 * 关闭分享图层
 */
function closeShare(){
	$(".shareIframe").hide();
}

/**
 * * 追加并显示iframe
 * @param properties 
 * @param type 0:无， 1:浏览量，2：一键呼叫，3：一件分享，4：外链地址，5：视频地址 6：地图  7：独立用户 8：预约表单 9：有奖转发
 */
function appendIframe(properties,type){
	var dom = $(".ifromMain");
	var src = properties;
	var onload = null;
	var obj = document.getElementById("iFrames");
	//alert(obj);
	
	if(null != obj){destroyIframe(obj);}
	dom.append("<img src='/statics/template1/img/Close-Icon.png' style='position: fixed; right:0;top:0' onclick='removeIframe("+type+")' />")
	createIframe(dom,src,onload);
	
	dom.attr('style','background-color:#fff')
	dom.show();
}

/**
 * 移除Iframe
 */
function removeIframe(type){
	var obj = document.getElementById("iFrames");
	destroyIframe(obj);
	$(".ifromMain").hide();
	$(".ifromMain").empty();
	if(type == 5){
		playVid();
	}
}

/**
 * 动态创建iframe
 * 
 * @param dom 创建iframe的容器，即在dom中创建iframe。dom可以是div、span或者其他标签。
 * @param src iframe中打开的网页路径
 * @param onload iframe加载完后触发该事件，可以为空
 * @return 返回创建的iframe对象
 */
function createIframe(dom, src, onload) {
	// 在document中创建iframe
	var iframe = document.createElement("iframe");

	// 设置iframe的样式
	iframe.style.width = '100%';
	iframe.style.height = '100%';
	iframe.style.margin = '0';
	iframe.style.padding = '0';
	iframe.style.overflow = 'hidden';
	iframe.style.border = 'none';
	iframe.style.color = '#fff';
	iframe.id='iFrames';

	// 绑定iframe的onload事件
	if (onload
			&& Object.prototype.toString.call(onload) === '[object Function]') {
		if (iframe.attachEvent) {
			iframe.attachEvent('onload', onload);
		} else if (iframe.addEventListener) {
			iframe.addEventListener('load', onload);
		} else {
			iframe.onload = onload;
		}
	}

	iframe.src = src;
	// 把iframe加载到dom下面
	dom.append(iframe);
	return iframe;
}

/**
 * 销毁iframe，释放iframe所占用的内存。
 * @param iframe 需要销毁的iframe对象
 */
function destroyIframe(iframe) {
	// 把iframe指向空白页面，这样可以释放大部分内存。
	iframe.src = 'about:blank';
	try {
		iframe.contentWindow.document.write('');
		iframe.contentWindow.document.clear();
	} catch (e) {
	}
	// 把iframe从页面移除
	iframe.parentNode.removeChild(iframe);
}


