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
	el: '#template_carriers',
	data: {
		shares:{}
	},
	mounted:function(){
		var self = this;
		mui.plusReady(function () {
		    self.shares = new share();
			self.shares.updateSerivces();
		})
	},
	methods:{
		addForm: function() { // 编辑常用联系人
			var self  = this;
			mui.openWindow({
			    url:"form.html",
			    id:"carriers/form.html",
			    extras:{
			      	get_id: '',
			      	from:''
			    },
			    waiting:{
			      autoShow:true,//自动显示等待框，默认为true
			      title:'正在加载...',//等待对话框上显示的提示内容
			      options:{}
			    }
			});
		},
				share_: function(){ // 打开分享
					var self = this;
					var href = request.url_share + '?a=carriage';
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
	}
});
$(document).on('click','#addForm',function(){
	vm_header.addForm();
});

// 实例化
var vm = new Vue({
	el: '#template_carr',
	data: {
		sliderNum: 0, // 类型; 进行中1; 已完成2; 已取消3
		mescroll: null,
		list: [],//历史数据
		cancel:[],//取消订单的数据
		type: 3, //产品支付类型 1 零担 2 室内配送 3 整车
		time: Date.parse(new Date()), //当前时间
		uoid: '', //订单id
		picktime: '', //提货时间
	},
	mounted: function() {
		var self = this;
		// 初始化页面
		mui.init();
		//创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
		//解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
		mui.plusReady(function() {
			self.mescroll = new MeScroll("mescroll", {
				up: {
					callback: self.upCallback, //上拉回调
					page: {
						size: 10
					}, //可配置每页8条数据,默认10
					noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: { //配置列表无任何数据的提示
						warpId: "dataList",
						icon: "../images/empty/contacts.png",
						tip: '<p style="font-size: 16px;color: #8590a6;">暂无承运商<p>',
					}
				}
			});
			// 预加载详情页面
			setTimeout(function() {
				// preloadOrderDetail();
			}, 200);
		})
	},
	methods: {
		delete_:function(index){
			var self  = this;
			var datelist = {
				self_id: self.list[index].self_id,
			}
		
			var btnArray = ['确认','取消'];
			mui.confirm('确认删除该承运商吗？', '删除承运商', btnArray, function(e) {
				if (e.index == 0) {
					request.PostInfo_new(request.tms_group_groupDelFlag,datelist,function(res){
						mui.toast(res.msg);
						location.reload();
					},function(res){
		
					});
				} else {
		
				}
			},"div");
		},
		returan: function(index) { // 返回数据
			var self  = this;
			// 本页面
			var wp = plus.webview.currentWebview().opener();
			// 如果是从个人中心跳转则不返回
			if(wp.id == "user/user.html") return false;
			var get_data = JSON.stringify({id:self.list[index].id,name:self.list[index].all_name});
			wp.evalJS('listenBack_customer('+get_data+')');
			mui.back();
		},
		upCallback: function(page) { //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
			//联网加载数据
			var self = this;
			self.getListDataFromNet(page.num,1); // 调用接口
		},

		getListDataFromNet: function(pageNum,type) { // 联网加载列表数据  进行中订单列表
			var self = this;
			if (pageNum == 1) self.list = [];
			
			var data = {
				page:pageNum,
				type:"carriers"
			}
			request.PostInfo_new(request.tms_group_groupPage,data,function(res){
				console.log(JSON.stringify(res.data.items));
					var data = res.data.items;
				setTimeout(function() {
					self.list = self.list.concat(data);
					console.log(JSON.stringify(self.list))
					self.mescroll.endSuccess(data.length);
				}, 500);
			},function(res){});
		},	
		editorContact: function(index) { 
			var self  = this;
			var conid = self.list[index].self_id;
			// var company_name= self.list[index].company_name;
			// var group_code= self.list[index].group_code;
			// var group_name= self.list[index].group_name;
			// // console.log(JSON.stringify(self.list[index].group_name) )
			// var create_user_name = self.list[index].create_user_name;
			// var cost_type_show = self.list[index].cost_type_show;
			// var cost_type = self.list[index].cost_type;
			// var type_show = self.list[index].type_show; 
			// var contacts = self.list[index].contacts;
			// var tel = self.list[index].tel;
			mui.openWindow({
			    url:"form.html",
			    id:"carriers/form.html",
			    extras:{
			      	get_id: conid,	
			    },
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
		}
		// addCarriers:function(){   //添加地址、传入城市ID，以便返回时刷新地址列表
		// 	var self = this;
		// 	mui.openWindow({
		// 	    url:"add_address.html",
		// 	    id:"add_address",
		// 	    extras:{
		// 	      	city_id:self.cityID,
		// 	        pro_id: self.proID,
		// 	    },
		// 	    waiting:{
		// 	      autoShow:true,//自动显示等待框，默认为true
		// 	      title:'正在加载...',//等待对话框上显示的提示内容
		// 	      options:{}
		// 	    }
		// 	});
		// },	

		// use_n:function(index){
		// 	var self  = this;
		// 	var datelist = {
		// 		token: user.getState('token'),
		// 		id: self.list[index].id,
		// 	}

		// 	if (user.getState('token') == null) {
		// 		mui.toast('请先登录！');
		// 		openLogin();
		// 		return false;
		// 	}

		// 	var btnArray = ['确认','取消'];
		// 	mui.confirm('确认禁用该客户吗？', '禁用客户', btnArray, function(e) {
		// 		if (e.index == 0) {
		// 			request.PostInfo(request.app_customer_use_n,datelist,function(res){
		// 				mui.toast(res.msg);
		// 				location.reload();
		// 			},function(res){

		// 			});
		// 		} else {

		// 		}
		// 	},"div");
		// },		

		// use_y:function(index){
		// 	var self  = this;
		// 	var datelist = {
		// 		token: user.getState('token'),
		// 		id: self.list[index].self_id,
		// 	}

		// 	if (user.getState('token') == null) {
		// 		mui.toast('请先登录！');
		// 		openLogin();
		// 		return false;
		// 	}

		// 	var btnArray = ['确认','取消'];
		// 	mui.confirm('确认启用该客户吗？', '启用客户', btnArray, function(e) {
		// 		if (e.index == 0) {
		// 			request.PostInfo(request.app_customer_use_y,datelist,function(res){
		// 				mui.toast(res.msg);
		// 				location.reload();
		// 			},function(res){

		// 			});
		// 		} else {

		// 		}
		// 	},"div");
		// },
		
		
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