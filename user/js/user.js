var indexDtat = new Vue({
	el:"#template",
	data:{
		isLogin:0,                                 // 是否登录  1 已登录  0 未登录
		userImg: '../images/user/personimg.png', // 用户图像
		// userName:"登录/注册",                        // 用户登录按钮
		userName:"",                        // 用户登录按钮
		type_name:'',
		tel:'',
		type:'',
		groupName:"切换账号",                        // 用户登录按钮
		token:'',
		login_name:'',//登陆账号
		company:'',//登陆公司
		role_name:'',//登陆 角色
		phone:user.getState('phone'),
		user_id:user.getState('id'),
		personData:null,
		company_number:1,
		company_list:[],
		admin_id:0,
		state_m:0,
		footer_list:[],
		owm_list : [],
		style_base:{
			border:'none',
			textAlign:'center'
		},
		style_height:{
			minHeight:'180px'
		},
		// type_name:'用户',
	},
	created:function(){
		
		mui.plusReady(function () {
			plus.nativeUI.showWaiting();
			console.log('ing');
		});
	},
	mounted:function(){
		var self = this;
		
		mui.plusReady(function () {
			
			// self.get_info();

		    self.shares = new share();
			self.shares.updateSerivces();
			// self.getpersoninfo();
			// self.logoInfo();
			// self.getCompanyNumber();
			plus.nativeUI.closeWaiting();
			$('.mui-content').show();
		})	
	},
	methods:{
		// get_info:function(){

		// },
		// logoInfo:function(){
		// 	var self = this;
		// 	var token = user.getState('token');
		// 	var data ={
				
		// 	};
		// 	account.getAllButton(data,function(response){
		// 		self.personData=response;
		// 	})
		// },
		// getCompanyNumber:function(){
		// 	// 切换账号
		// 	var self = this;
		// 	var token = user.getState('token');
		// 	var data ={
		// 		token:token
		// 	};
		// 	account.getCompanyNumber(data,function(response){
		// 		// console.log(JSON.stringify(response));
		// 		self.company_number=response;
		// 		console.log('公司数量：'+self.company_number);
		// 	})
		// },
		// getCompanyList:function(){
		// 	// 切换账号
		// 	var self = this;
		// 	var token = user.getState('token');
		// 	var data ={
		// 		token:token
		// 	};
		// 	account.getCompanyList(data,function(response){
		// 		// console.log(JSON.stringify(response));
		// 		self.company_list = response;
		// 	})
		// },		
		// switch_accountURL:function(id){
		// 	// 确认 切换账号
		// 	var self = this;
		// 	var token = user.getState('ftoken');
		// 	var data ={
		// 		token:token,
		// 		id:id
		// 	};
		// 	account.switch_accountURL(data,function(response){
		// 		// console.log(JSON.stringify(response));
		// 		console.log('切换成功');
		// 		localStorage.removeItem("userInfo");
		// 		user.setAllState(response, function() {
		// 			self.user_id = id;
		// 			var userName = response.name;
		// 			var userImg = response.userimage;
		// 			if (userName) {
		// 				self.userName = userName;
		// 			} else {
		// 				self.userName = 'chitu000';
		// 			}
		// 			if (userImg) {
		// 				self.userImg = request.ServerUrl+ userImg;
		// 			} else {
		// 				self.userImg = '../images/user/personimg.png';
		// 			}
		// 			// window.location.reload();
		// 		});

		// 	})
		// },
		getpersoninfo:function(){
			var self = this;
			console.log("个人中心重新设置数据");
			var token = user.getState('token');
			
			// 用户手机号
			var phone = user.getState('tel');
			// console.log(phone);
			// 用户名
			var username = user.getState('name');
			var login = user.getState('login');

			// 用户头像
			var user_img = user.getState('userimage');
			var ftoken = request.ftoken;
			var dtoken = request.dtoken;


			// new
			if (ftoken || dtoken) {
				self.isLogin= 1;
				self.userName = "chitu000";
				self.company = 'company'
			} else {
				self.isLogin= 0;
				self.admin_id= 0;
				console.log("未登录/登录错误");
				self.userName = "登录/注册";
				self.userImg = '../images/user/personimg.png';
			}

			// if (token && login) {
			// 	console.log("登录状态")
			// 	self.isLogin= 1;
				
			// 	if(!username){
			// 		self.userName = "chitu000";
			// 	}else{
			// 		self.userName = user.getState('name');
			// 	}
			// 	self.login_name = login;
			// 	self.company = user.getState('group_name');
			// 	self.admin_id = user.getState('admin_id');
			// 	if (self.admin_id == 1) {
			// 		self.role_name = '主账号';
			// 	} else {
			// 		var role = user.getState('role_name');
			// 		if (role) {
			// 			self.role_name = role;
			// 		} else {
			// 			self.role_name = '暂无角色'
			// 		}
			// 	}
			// 	var app_role = localStorage.getItem('app_role');
			// 	if (app_role == 1) {
			// 		var app_role_n = '(个人)';
			// 	} else if (app_role == 2) {
			// 		var app_role_n = '(企业)';
			// 	}
			// 	self.role_name = app_role_n + self.role_name;
				
			// 	if(!user_img){
			// 		 self.userImg = '../images/user/personimg.png';
			// 	}else{
			// 		self.userImg = request.ServerUrl+ user.getState('userimage');
			// 	}
			// } else { // 未登陆
			
			// 	self.isLogin= 0;
			// 	self.admin_id= 0;
			// 	console.log("未登录/登录错误");
			// 	self.userName = "登录/注册";
			// 	self.userImg = '../images/user/personimg.png';
			// }
			
			setTimeout(function(){
				// self.licenseTatus();
			},300);
		},
		licenseTatus:function(){
			
			console.log("执行驾驶证认证状态方法----------------------------------------------------");
			
			var ftoken = request.ftoken;
			var dtoken = request.dtoken;
			if(!ftoken && !dtoken){
				console.log("没有token,不会执行下面内容");
				return false;
			}
			
			var data = {
				token: user.getState('token'),
			};
			
			order.licenceState(data,function(response){
				console.log(JSON.stringify(response));
				// 将驾驶证图片设置到缓存;
				user.setState("drivingimage",response.license_img);
				user.setState("drivingLicenseStatus",response.license);
				var code = parseInt(response.license);
				switch (code){
					case 1: // 未认证
						// mui.toast('参数错误');
						// mui.toast("驾驶证未认证");
						document.getElementById('viewText').innerHTML = '点击认证';
						break;
					case 2: // 已认证
						// document.getElementById('png').style.display = 'block';
						document.getElementById('viewText').innerHTML = '已认证';
						document.getElementById('viewText').style.color = 'darkgreen';
						// mui.toast("驾驶证认证成功");
						break;
					case 3: // 认证失败
						// mui.toast("驾驶证认证失败");
						document.getElementById('viewText').innerHTML = '认证失败';
						document.getElementById('viewText').style.color = 'red';
						// mui.alert("驾驶证认证失败，请重新认证");
						break;
					case 4: // 认证中
						// mui.toast("驾驶证认证中");
						document.getElementById('viewText').innerHTML = '认证中...';
						// document.getElementById('viewText').style.color = 'red';
						break;
					default:
						break;
				}
			});
		},
		// selectImg:function(){
		// 	var token = user.getState('token');
		// 	// console.log(123);
		// 	var ftoken = request.ftoken;
		// 	var dtoken = request.dtoken;
		// 	if(!ftoken && !dtoken && !token){
		// 		openLogin();
		// 		return false;
				
		// 	}
		// 	// clicked('../user/safe.html');
		// },
		to_change_role_index:function(){
			var ftoken = localStorage.ftoken;
			var dtoken = localStorage.dtoken;
			if(!ftoken && !dtoken){
				openLogin();
				return false;
				
			}
			clicked('../role/index.html');
		},
		toSetting:function(){
			// alert(1111);
			var ftoken = localStorage.ftoken;
			var dtoken = localStorage.dtoken;
			if(!ftoken && !dtoken){
				openLogin();
				return false;
				
			}
			clicked('../setting/setting.html');
		},
		to_page(page){
			var ftoken = localStorage.ftoken;
			var dtoken = localStorage.dtoken;
			if(!ftoken && !dtoken){
				openLogin();
				return false;	
			}
			clicked(page);
		},
		uesr_path(item){
			var path=item.app_path;
			// var type=item.type;
			var data={
				type:item.type,
			};
			var ftoken = localStorage.ftoken;
			var dtoken = localStorage.dtoken;
			if(!ftoken && !dtoken){
				openLogin();
				return false;		
			}
			console.log(path);
			clicked(path,data);
		},
		
		login:function(){
			var self = this;
			if(self.isLogin ==0){
				clicked('../login/login.html');
			}
			if(self.isLogin ==1){
				clicked('../user/safe.html');
			}
			
		},												

		toWallet:function(item){    // 钱包
			var admin_id = user.getState('admin_id');
			if (item.type == 'money') {
				// mui.toast('主账号才能使用钱包功能!');
				// return false;
				clicked('../wallet/wallet.html');
			}	
		},

		// toSetting:function(){
		// 	clicked('../setting/setting.html');
		// },
		// toserver:function(){
		// 	clicked('../cusService/customerService.html');
		// },
		// toCooperation:function(){
		// 	clicked('../cusService/join.html');
		// },
		
		// 将传递的参数转换成可执行的函数(无法实现动态函数的定义)
		handelTap:function(a){
			console.log(a);
			this[a]();   // 转换成可执行函数
		},
		// 上面函数定义的参数,转换成可执行的函数
		share: function(){ // 打开分享
			var self = this;
			var phone = user.getState('phone');
			// var href = "https://56cold.com/share/share/usershare.html";
			var href = "http://www.56cold.com";
			if(phone){
				href += '?sharephone='+phone;
			}
			var msg={
				type:"web",
				title:"赤途冷链",
				content:"打造一流冷链运输平台", // 分享内容
				href:href, // 分享图片
				thumbs:["_www/images/logo.png"] // 缩略图
			};
			self.shares.openShare(msg);
		}		
		,share_driver: function(){ // 打开分享
			var self = this;
			var phone = user.getState('phone');
			// var href = "https://56cold.com/share/share/usershare.html";
			var href = "http://d.56cold.com";
			if(phone){
				href += '?sharephone='+phone;
			}
			var url_img = request.ServerUrl + '/image/logo.png';
			var msg={
				type:"web",
				title:"新订单",
				content:"来新订单了，注意查看！", // 分享内容
				href:href, // 分享图片
				thumbs:[url_img] // 缩略图
			};
			self.shares.openShare(msg);
		}		
		,share_carriage: function(){ // 打开分享
			var self = this;
			var phone = user.getState('phone');
			// var href = "https://56cold.com/share/share/usershare.html";
			var href = request.url_share + '/H5_carriage/index.html';
			if(phone){
				href += '?sharephone='+phone;
			}
			var url_img = request.ServerUrl + '/image/logo.png';
			var msg={
				type:"web",
				title:"新订单",
				content:"来新订单了，注意查看！", // 分享内容
				href:href, // 分享图片
				thumbs:[url_img] // 缩略图
			};
			self.shares.openShare(msg);
		}		

		,share_customer: function(){ // 打开分享
			var self = this;
			var phone = user.getState('phone');
			// var href = "https://56cold.com/share/share/usershare.html";
			var href = request.url_share + '/H5_customer/index.html';
			if(phone){
				href += '?sharephone='+phone;
			}
			var url_img = request.ServerUrl + '/image/logo.png';
			var msg={
				type:"web",
				title:"下单端口",
				content:"快来下单了，注意查看！", // 分享内容
				href:href, // 分享图片
				thumbs:[url_img] // 缩略图
			};
			self.shares.openShare(msg);
		}
	},		
	filters:{
		filter_height(e){
			console.log(e);
			return e;
		}
	},
	watch:{
		// 'token': function(newVal,old){
  //             // this.fullname = newVal + '-' + this.lastname
		// 	  console.log(newVal);
		// 	  console.log(old);
  //       },
        // 'lastname': function(newVal){
        //       this.fullname = this.firstname + '-' + newVal
        // }
	}
	
})

