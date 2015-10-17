var arr = new Array();
$(function() {
	//initTileFn();
	if (arr[1] != undefined) {// tag1是发言
		var tag = arr[1].split("_")[2];
		var title1 = arr[1].split("_")[1];
		
		if (tag == 1) {
		$("#countP").html(getCount(2) + "条发言")
		
		} else if (tag == 2) {
		$("#countP").html(getCount(1) + "人签到")
		
		}
		if (tag == 3) {
		$("#countP").html("");
		}
	}
		//$("#title").html(title1);
		if($.trim(title1).length<1)
		{
		title1="关注微信号，发送含有“签到”两字的内容即可签到";
		}
		splits(title1);
	
	// 初始化气泡提示
	var toolTxt;
	$('.tooltip').mouseover(function() {
		var toolTxt = $(this).attr("title")
	}).tooltipster({
		content : toolTxt,
		theme : 'tooltipster-shadow',
		trigger : 'hover',
		delay : 0,
		speed : 200
	});
	$("div.btnMenu a")
			.click(
					function() {
						var boxClass = $(this).attr("data-class");
						switch (boxClass) {
							case "fullWall":{
								break;
							}
							default:
								break;
							}
					}
				);
	//快捷键
	document.onkeypress=function(event){
		var e = event || window.event;
		var keyCode = e.keyCode || e.which;		
        switch (keyCode) {
	   		case 80:
	       		//x
	       		 $(".onSiteWall").show().siblings().hide();
	       		 onSiteWllFn();
	       		break;
	        default:
	            break;
        }	
	}
	
	//签到
	function siginWallFn(){
		var title1="关注微信号，发送含有“签到”两字的内容即可签到";
		if (arr[1] != undefined) {// tag1是发言
		var tag = arr[1].split("_")[2];
		if($.trim(arr[1].split("_")[1]).length>=1)
		{
			var title1 = arr[1].split("_")[1];
		}
		if (tag == 1) {
		$("#countP").html(getCount(2) + "条发言")
		
		} else if (tag == 2) {
		$("#countP").html(getCount(1) + "人签到")
		}
		if (tag == 3) {
		$("#countP").html("");
		}
		}
		splits(title1);
		$("body").append(strStart +"signWallV1.0"+ strEnd);
		siginWallInit();
	}
	function splits(title){
		var msgs='';
		 $("#title").siblings().remove();
		 $("#title li").remove();
		for(var i=0; i<=title.length;)
			{
			var msgs1=title.substring(i,i+17);
			var msgs2=title.substring(i+17,i+34);
			  $("#title").append('<li>'+msgs1+'<br>'+msgs2+'</li>');
			  i+=34;
			}
	}
});
