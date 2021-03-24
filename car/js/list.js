// 刷新车辆列表
function reload(){
	vm.getCarList();
}

var orderDetail = null;
/**
 * @description：预加载订单详情页面
 * @return webview Object
 */	
function preloadOrderDetail(){
	orderDetail = mui.preload({
        url: "car_update.html",
        id: "car_update.html", //默认使用当前页面的url作为id
        styles: {}, //窗口参数
        extras: {
            idd: ""
        } //自定义扩展参数
    });
}
// 头部
var vmHeader = new Vue({
	el: '#header',
	data:{
		shares:{},
		car_number : null,
		car_possess_show : null,
		car_type_name : null,
		contacts : null,
		tms_control_type_show : null,
		tel : null,
		board_time : null,
		car_brand : null,
		license : null,
		medallion : null,
		volam : null,
		weight : null,
		tms_car_possess_type:[],
	},
	methods:{
		addCar:function(){
			// var type = user.getState('type');
			var self = this;
			var project_type = localStorage.project_type;
			if(project_type=='user'){
				mui.openWindow({
				    url:"car_add.html",
				    id:"car_add",
				    extras:{
				      	board_time: self.board_time,
				      	car_number: self.car_number,
				      	car_possess: self.car_possess,
				      	car_type_id: self.car_type_id,
				      	contacts: self.contacts,
				      	control: self.control,
				      	license: self.license,
				      	medallion: self.medallion,
				      	tel: self.tel
				    },
				// var len = vm.$data.carList.length; 
				});
			}
			else{
				mui.openWindow({
				    url:"car_add3pl.html",
				    id:"car_add3pl",
				    extras:{
				      	board_time: self.board_time,
				      	car_number: self.car_number,
				      	car_possess: self.car_possess,
				      	car_type_id: self.car_type_id,
				      	contacts: self.contacts,
				      	control: self.control,
				      	// license: self.license,
				      	// medallion: self.medallion,
				      	tel: self.tel
				    },
				// var len = vm.$data.carList.length; 
				});
			}
			
		},	
	}
});

$(document).on('click','#addForm',function(){
	vmHeader.addCar();
});

// 实例化
var vm = new Vue({
	el: '#template_carList',
	data: {
		carList:[],
		mescroll: null,
		carCreList:[],
		cars_mess:null,
		self_id:null,
		page:0,
		type:'up',
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
						icon: "../images/empty/car.png",
						tip: '<p style="font-size: 16px;color: #8590a6;">暂无车辆信息<p>',
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
		returan: function(index) { // 返回数据
			var self  = this;
			// 本页面
			var wp = plus.webview.currentWebview().opener();
			// 如果是从个人中心跳转则不返回
			if(wp.id == "user/user.html") return false;
			var get_data = JSON.stringify({self_id:self.carList[index].self_id,carnumber:self.carList[index].car_number,contant:self.carList[index].contacts,tel:self.carList[index].tel});
			wp.evalJS('listenBack('+get_data+')');
			mui.back();
		},
		// pullupRefresh:function(){
		// 	var self = this;
		// 	self.type = 'up';
		// 	self.page = self.page + 1;
		// 	self.getCarList();
		// },
		// pulldownRefresh:function(){
		// 	var self = this;
		// 	self.type = 'down';
		// 	self.page = 1;
		// 	self.getCarList();

		// },
		upCallback: function(page) { //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
			//联网加载数据
			var self = this;
			self.getCarList(page.num,1);
		},
		getCarList: function(pageNum){ // 获取车辆列表数据
			var self = this;
			if(pageNum == 1) self.carList = [];
			var data = {
					page: pageNum,
				};
				console.log(JSON.stringify(data));
				var project_type = localStorage.project_type;
				if(project_type=='user'){
					request.PostInfo_new(request.api_car_carPage,data,function(res){
						console.log(JSON.stringify(res.data.info));
						var data = res.data.info;
						self.showlist = res.data.info;
						if (data.length == 0) {
							document.getElementById("png").style.display="none";
						}else {
							if (pageNum == 1) {
								document.getElementById("png").style.display="none";
							}
							
						}
						setTimeout(function() {
							self.carList = self.carList.concat(data);
							console.log(JSON.stringify(self.carList));
							self.mescroll.endSuccess(data.length);
						},500);
					},function(res){});
				}
				else{
					request.PostInfo_new(request.tms_car_carPage,data,function(res){
						console.log(JSON.stringify(res.data.items));
						if (res.data.items.length == 0) {
							document.getElementById("png").style.display="none";
						}else {
							if (pageNum == 1) {
								document.getElementById("png").style.display="none";
							}
						}
						// self.showlist = res.data.info;
						var data = res.data.items;
						setTimeout(function() {
							self.carList = self.carList.concat(data);
							self.mescroll.endSuccess(data.length);
						},500);
					
					},function(res){});
				}
		},
		delCar: function(index){ // 删除车辆
			var self = this;
			var data = {
				self_id: self.carList[index].self_id
			};
			var project_type = localStorage.project_type;
			console.log(self.carList[index].self_id);
			if(project_type=='user'){
			mui.confirm('车辆删除后将无法恢复', '确认删除?', ['确认','取消'], function(e) {
				console.log(JSON.stringify(e));
				if (e.index == 0) {
					request.PostInfo_new(request.api_car_carDelFlag,data,function(res){
						console.log(res);
						self.carList.splice(index,1);
						mui.toast(res.msg);
						location.reload();
						document.getElementById("png").style.display="none";
					},function(res){});
				} else {
				}
			},'div');	
			}
			else{
				mui.confirm('车辆删除后将无法恢复', '确认删除?', ['确认','取消'], function(e) {
					console.log(JSON.stringify(e));
					if (e.index == 0) {
						request.PostInfo_new(request.tms_car_carDelFlag,data,function(res){
							console.log(res);
							self.carList.splice(index,1);
							mui.toast(res.msg);
							location.reload();
							document.getElementById("png").style.display="none";
						},function(res){});
					} else {
					}
				},'div');
				
			}
			
		},
		editCar:function(index){
			var self = this;
			var self_id = self.carList[index].self_id;
			var car_number = self.carList[index].car_number;
			var car_possess_show = self.carList[index].car_possess_show;
			var car_type_name = self.carList[index].car_type_name;
			var contacts = self.carList[index].contacts;
			var tms_control_type_show = self.carList[index].tms_control_type_show;
			var tel = self.carList[index].tel;
			var board_time = self.carList[index].board_time;
			var car_brand = self.carList[index].car_brand;
			var license = self.carList[index].license;
			var medallion = self.carList[index].medallion;
			var volam = self.carList[index].volam;
			var weight = self.carList[index].weight;
			var project_type = localStorage.project_type;
			// console.log(board_time);
			if(project_type == 'user'){
				mui.openWindow({
				    url:"car_add.html",
				    id:"car/car_add.html",
				    extras:{
						type: 2,
						self_id : self_id,
						car_number : car_number,
						car_possess_show : car_possess_show,
						car_type_name : car_type_name,
						contacts : contacts,
						tms_control_type_show : tms_control_type_show,
						tel : tel,
						board_time : board_time,
						car_brand : car_brand,
						license : license,
						medallion : medallion,
						volam : volam,
						weight : weight,
				    },
				    // createNew:true,
				    waiting:{
				      autoShow:true,//自动显示等待框，默认为true
				      title:'正在加载...',//等待对话框上显示的提示内容
				      options:{}
				    }
				});
			}
			else{
				mui.openWindow({
				    url:"car_add3pl.html",
				    id:"car/car_add3pl.html",
				    extras:{
						type: 2,
						self_id : self_id,
						car_number : car_number,
						car_possess_show : car_possess_show,
						car_type_name : car_type_name,
						contacts : contacts,
						tms_control_type_show : tms_control_type_show,
						tel : tel,
						board_time : board_time,
						car_brand : car_brand,
						license : license,
						medallion : medallion,
						volam : volam,
						weight : weight,
				    },
				    // createNew:true,
				    waiting:{
				      autoShow:true,//自动显示等待框，默认为true
				      title:'正在加载...',//等待对话框上显示的提示内容
				      options:{}
				    }
				});
			}
			
		},
		reload:function(){
			var self = this;
			self.mescroll.resetUpScroll();
		}
	},
	filters: {
		// filterStart: function(val){ // 筛选 车辆状态（1未审核2审核通过3审核不通过）
		// 	var startImg = parseInt(val); 
		// 	switch (startImg){
		// 		case 1:
		// 			startImg = "认证中";
		// 			break;
		// 		case 2:
		// 			startImg = "已认证"
		// 			break;
		// 		case 3:
		// 			startImg = "认证失败"
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// 	return startImg;
		// },
	}
});
