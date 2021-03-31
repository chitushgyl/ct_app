/**
 * @description：预加载订单详情页面
 */
var orderDetail = null;

function preloadOrderDetail() {
	orderDetail = mui.preload({
		url: "detail.html",
		id: "detail.html", //默认使用当前页面的url作为id
		styles: {}, //窗口参数
		extras: {
			idd: ""
		} //自定义扩展参数
	});
}

var vm_header = new Vue({
	el: '#header',
	data: {
	},
	methods:{
		addForm: function() { 
			var self  = this;
			mui.openWindow({
			    url:"role_add.html",
			    id:"role/role_add.html",
				// url:"form.html",
				// id:"role/form.html",
			    extras:{  
			      	get_id: '',
			      	from:'add',
			      	name:''
			    },
			    waiting:{
			      autoShow:true,//自动显示等待框，默认为true
			      title:'正在加载...',//等待对话框上显示的提示内容
			      options:{}
			    }
			});
		},	
	}
});

$(document).on('click','#addForm',function(){
	vm_header.addForm();
});

// 实例化
var vm = new Vue({
	el: '#template',
	data: {
		sliderNum: 0, // 类型; 进行中1; 已完成2; 已取消3
		mescroll: null,
		list: [],//历史数据
		cancel:[],//取消订单的数据
		type: 3, //产品支付类型 1 零担 2 室内配送 3 整车
		time: Date.parse(new Date()), //当前时间
		uoid: '', //订单id
		picktime: '', //装车时间
		// b_color:['#0088F4','#FFB433','#02A3A5','#0088F4','#FFB433','#02A3A5','#0088F4','#FFB433','#02A3A5']
	},
	mounted: function() {
		var self = this;
		// 初始化页面
		mui.init();
		mui.plusReady(function(){
			plus.nativeUI.closeWaiting();//关闭等待页
		})
		var data = {};
		request.PostInfo_new(request.user_binding_page,data,function(res){
					var data = res.data;
				setTimeout(function() {
					self.list = data;
					console.log(JSON.stringify(self.list));
				}, 500);
			},function(res){});
			
	},
	methods: {
		editorContact: function(index) { // 编辑常用联系人
			var self  = this;
			var conid = self.list[index].role_id;
			var name = self.list[index].name;
			mui.openWindow({
			    url:"form.html",
			    id:"role/form.html",
			    extras:{
			      	get_id: conid,
			      	name : name
			    },
			    waiting:{
			      autoShow:true,//自动显示等待框，默认为true
			      title:'正在加载...',//等待对话框上显示的提示内容
			      options:{}
			    }
			});
		},	

		change_role:function(index){
			var self = this;
			var data = {
				self_id: self.list[index].self_id
			};
			console.log(data);
			var btnArray = ['确认', '取消'];
			mui.confirm('切换角色', '确认切换角色？', btnArray, function(e) {
				console.log('index:'+e.index);
				if (e.index == 1) {
					// console.log("成功");
				} else {
					request.PostInfo_new(request.user_switchover,data,function(res){
						var msg = res.msg;
						mui.toast(msg);
						localStorage.dtoken = res.user_token;
						localStorage.project_type = self.list[index].type;
						if (self.list[index].system_admin) {
							localStorage.group_code = self.list[index].system_admin.group_code

						}
						// console.log(plus.runtime.appid);
						localStorage.change_role_flag = 1;
						
						mui.plusReady(function() {
							plus.webview.getWebviewById(plus.runtime.appid).evalJS('refreshData()');//底部菜单刷新
							console.log(plus.webview.getWebviewById('user/user.html'));
							plus.webview.getWebviewById('user/user.html').evalJS('refreshData_index_menu()');//个人中心菜单刷新
							//console.log("666666");
							mui.back();
							// plusCommon.popToTarget('../user/user.html',true);
						})
						
					},function(res){});
				}
			},"div");
		},
		del_role:function(index){
			var self = this;
			var data = {
				self_id: self.list[index].self_id
			};
			console.log(data);
			var btnArray = ['确认', '取消'];
			mui.confirm('删除角色', '确认删除角色？', btnArray, function(e) {
				console.log('index:'+e.index);
				if (e.index == 1) {
					// console.log("成功");
				} else {
					request.PostInfo_new(request.user_delete,data,function(res){
						var msg = res.msg;
						mui.toast(msg);
			// 			localStorage.dtoken = res.user_token;
			// 			localStorage.project_type = self.list[index].type;
			// 			if (self.list[index].system_admin) {
			// 				localStorage.group_code = self.list[index].system_admin.group_code
			
			// 			}
						// console.log(plus.runtime.appid);
						// localStorage.change_role_flag = 1;
						
						mui.plusReady(function() {
							plus.webview.getWebviewById(plus.runtime.appid).evalJS('refreshData()');//底部菜单刷新
							console.log(plus.webview.getWebviewById('user/user.html'));
							plus.webview.getWebviewById('user/user.html').evalJS('refreshData_index_menu()');//个人中心菜单刷新
							//console.log("666666");
							mui.back();
							// plusCommon.popToTarget('../user/user.html',true);
						})
						
					},function(res){});
				}
			},"div");
		},
		to_auth: function(index) {
			var self  = this;
			var conid = self.list[index].role_id;
			var name = self.list[index].name;
			mui.openWindow({
			    url:"auth.html",
			    id:"role/auth.html",
			    extras:{
			      	get_id: conid,
			      	name : name
			    },
			    createNew:true,
			    waiting:{
			      autoShow:true,//自动显示等待框，默认为true
			      title:'正在加载...',//等待对话框上显示的提示内容
			      options:{}
			    }
			});
		},
		
		reload:function(){
			var self = this;
			self.mescroll.resetUpScroll();
		},
		
		delete_role:function(item){
			console.log(JSON.stringify(item));
			var self = this;
			var data={
				self_id: item.self_id,
			};
			console.log(item.self_id);
			var btnArray = ['确认','取消'];
			mui.confirm('确认删除该角色吗？', '删除角色', btnArray, function(e) {
				request.PostInfo_new(request.user_delete,data,function(res){
					console.log(JSON.stringify(res));
					mui.toast(res.msg);
					location.reload();
				},function(res){
				});
			},"div");
		},
	},
			
	filters: {
		filterPrice: function(value) {
			if (!value) {
				value = 0;
			}
			return value;
		},
		addstrcut: function(value) {
			if (!value) {
				value = 0;
			}else if(value.length>5){
				// return value.length;
				return value.substr(0,4)+"...";
			}else{
				return value;
			}
		},
	}
});

