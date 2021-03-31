var vm = new Vue({
	el: '#role_add_vue',
	data(){
		return{
			roleType:[
			],
			type_role:'',
			title: '',
			type_val:'',
			name:'',
			company_name:'',
			password:'',
			group_name:'',
			driver_name:'',
			driver_tel:''
		}
	},
	created: function(){
		var self = this;
		mui.plusReady(function(){
			var ws = plus.webview.currentWebview();
			var type = ws.type;//获得参数
			self.type_role=type;
			if(self.type_role == 'TMS3PL'){
				$('.mui-title').text('企业绑定');
			}else if(self.type_role == 'carriers'){
				$('.mui-title').text('企业承运商绑定');
			}
			else if(self.type_role == 'customer'){
				$('.mui-title').text('企业客户绑定');
			}
			else if(self.type_role == 'driver'){
				$('.mui-title').text('企业司机绑定');
			}
			console.log(type)
		});	
	},
	mounted: function() {
		var self = this;
		mui.init();
		// mui.plusReady(function(){
		// 	var self = plus.webview.currentWebview();
		// 	var type = self.type;//获得参数
		// 	console.log(type)
		// });
		self.get_roleType();
	},
	methods:{
		get_roleType: function(){
			var self = this;
			var data = {};
			request.PostInfo_new(request.get_identity,data,function(res){
					// var data = res.data;
				setTimeout(function() {
					var userType = []
					for (var key in res.data.tms_user_type) {
						userType.push(res.data.tms_user_type[key])
					}
					self.roleType = userType;
					console.log(JSON.stringify(self.roleType));
				}, 500);
			},function(res){});
		},
		
		addRole: function(index){
			console.log(index);
			var self  = this;
			var addType = index;
			// self.type_role = addType
			console.log(addType);
			self.type_role = addType;
			if(self.type_role=='carriage'){
				var btnArray = ['确认', '取消'];
				mui.confirm('确认绑定司机吗？', '绑定司机', btnArray, function(e) {
					if (e.index == 1) {
						// console.log("成功");
					} else {
						var data = {// 令牌
							company_name: self.company_name,
							driver_name: self.driver_name,
							driver_tel: self.driver_tel,
							group_name: self.group_name,
							login: self.name,
							pwd: self.password,
							type: self.type_role
						}
						request.PostInfo_new(request.user_add_binding,data,function(res){
							console.log(JSON.stringify(res));
							if(res.code==200){
								mui.toast('绑定成功！');
							}
							// mui.openWindow({
							// 	url:"index.html",
							// 	id:"role/index.html",
							// });
							plusCommon.popToTarget('../role/index.html',true);
							// mui.back();
						},function(res){
						
						});		
					}
				},"div");
			}
			else{
				mui.openWindow({
					url:"bind.html",
					id:"role/bind.html",
					extras:{
						type: addType,
					},
					waiting:{
					  autoShow:true,//自动显示等待框，默认为true
					  title:'正在加载...',//等待对话框上显示的提示内容
					  options:{}
					},
				});
			}
			
		},
		//绑定
		addRoleType: function(){
			var self = this;
			// var account = request.clear_str_null($('#account').val());
			// var pwd = request.clear_str_null($('#passWrod').val());
			// var gName = request.clear_str_null($('#groupName').val());
			// var cName = request.clear_str_null($('#companyName').val());
			// var cipher = request.clear_str_null($('#cipher').val());
			// var driverTel = request.clear_str_null($('#driverTel').val());
			// var driverName = request.clear_str_null($('#driverName').val());
			// var groupName_T = request.clear_str_null($('#groupName_T').val());
			// if (!account) {
			// 	mui.toast('账号不能为空!');
			// 	return false;
			// }
			// if (!pwd) {
			// 	mui.toast('密码不能为空!');
			// 	return false;
			// }
			// if (!gName) {
			// 	mui.toast('企业名称不能为空!');
			// 	return false;
			// }
			// if (!cName) {
			// 	mui.toast('企业名称不能为空!');
			// 	return false;
			// }
			// if (!groupName_T) {
			// 	mui.toast('企业名称不能为空!');
			// 	return false;
			// }
			// if (!cipher) {
			// 	mui.toast('密钥不能为空!');
			// 	return false;
			// }
			// if (!driverTel) {
			// 	mui.toast('姓名不能为空!');
			// 	return false;
			// }
			// if (!driverName) {
			// 	mui.toast('联系电话不能为空!');
			// 	return false;
			// }
			var data = {
				company_name: self.company_name,
				driver_name: self.driver_name,
				driver_tel: self.driver_tel,
				group_name: self.group_name,
				login: self.name,
				pwd: self.password,
				type: self.type_role
			}; 
			request.PostInfo_new(request.user_add_binding,data,function(res){
				console.log(JSON.stringify(res));
				if(res.code==200){
					mui.toast('绑定成功！');
				}
				// mui.openWindow({
				// 	url:"index.html",
				// 	id:"role/index.html",
				// });
				plusCommon.popToTarget('../role/index.html',true);
				// mui.back();
			},function(res){
			
			});		
		},
	},
});

$(document).on('click','#addRoleType',function(){
	vm.addRoleType();
});

