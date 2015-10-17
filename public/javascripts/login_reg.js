

//登录注册两个函数，向服务器提交数据，等待服务器答复

function login(){
	var username = $("#doc-vld-name-2").val();
	var password = $("#doc-vld-password-1").val();
	var data = {
		username: username,
		password: password
	};
	console.log(data);
	var url = $('form').attr('action');
	jQuery.ajax({
		url: url,
		type: "post",
		data: data,
		async: false,
		success: function(data){
			//服务器返回登录信息
			//var loginSuccess = parseInt(data);
			var loginSuccess = data;
			//data=1，登录成功
			console.log(data);
			if(loginSuccess == '1'){
				//弹出登陆成功
				$("#login-id").after('<button type="button" class="am-btn am-btn-success am-btn-block">登录成功</button>');
				//跳转到登录主页
				var href = window.location.origin + '/admin';
			    window.location.assign(href);
			}else if(loginSuccess == '0'){
				//弹出登录失败
				$("#login-id").after('<button type="button" class="am-btn am-btn-danger am-btn-block">用户名或密码错误</button>');
				var href = window.location.origin + '/admin/login';
			    window.location.assign(href);
			}else{
				var href = loginSuccess;
				alert(href);
			    window.location.assign(href);
			}
		}
	});
}

function reg(){
	var username = $("#doc-vld-name-1").val();
	var email = $("#doc-vld-email-2").val();
	var connect = $("#doc-vld-telephone-2").val();
	var password1 = $("#doc-vld-password-1").val();
	var password2 = $("#doc-vld-password-2").val();
	var sex = $("#sex input:checked").val();
	var data = {
		username: username,
		email: email,
		connect: connect,
		password: password1
	};
	jQuery.ajax({
		url: "/admin/reg",
		type: "post",
		data: data,
		async: false,
		success: function(data){
			var regSuccess = parseInt(data);
			//返回数据为1
			if(regSuccess == 1){
				$("#reg-id").after('<button type="button" class="am-btn am-btn-success am-btn-block">注册成功</button>');

				var href = window.location.origin + '/admin';
				window.location.assign(href);
			}else if(regSuccess ==0){
				$("#reg-id").after('<button type="button" class="am-btn am-btn-danger am-btn-block">用户名已存在</button>');
				
				/*var href = window.location.origin + '/admin-reg';
				window.location.assign(href);*/
			}else{
				alert('系统错误！');
			}
		}
	});
}