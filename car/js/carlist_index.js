// 刷新车辆列表
function reload(){
	vm.getCarList();
}
/**
 * @description: 订单详情
 * @type {webview}
 */
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
	methods:{
		addCar:function(){
			var login = request.to_login();
			if (!login) {
				return false;
			}
			clicked('car_add_index.html');
		}
	}
});

$(document).on('click','.add_car',function(){
	vmHeader.addCar();
});
// 实例化
var vm = new Vue({
	el: '#template',
	data: {
		carList:[],
		cars_mess:null,
		mescroll:null,
		page:0,
		type:'up',
	},
	mounted: function(){
		var self = this;
		mui.init();
		mui.plusReady(function(){
			// self.getCarList();
			
			self.mescroll = new MeScroll("mescroll", {
				up: {
					callback: self.upCallback, //上拉回调
					page: {
						size: 10
					}, //可配置每页8条数据,默认10
					noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: { //配置列表无任何数据的提示
						warpId: "template",
						icon: "../../images/empty/car.png",
						tip: '<p style="font-size: 16px;color: #8590a6;">暂无车辆信息<p>',
					}
				}
			});
			// self.mescroll.resetUpScroll();
			// 预加载详情页面
			setTimeout(function() {
				preloadOrderDetail();
			}, 200);
			
		});
	},
	methods:{
		pullupRefresh:function(){
			var self = this;
			self.type = 'up';
			self.page = self.page + 1;
			self.getCarList();
		},
		pulldownRefresh:function(){
			var self = this;
			self.type = 'down';
			self.page = 1;
			self.getCarList();

		},
		upCallback: function(page) { //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
			//联网加载数据
			var self = this;
			self.getCarList(page.num);
		},
		getCarList: function(pageNum){ // 获取车辆列表数据
			var self = this;
			var data = {
					token: user.getState('token'),
					page:pageNum,
					limit:15
				};
				if (pageNum == 1) {
					self.carList = [];
				}
			if (data.token) {
				request.PostInfo(request.car_index,data,function(response){

					if (response.data.length > 0) {
						document.getElementById("png").style.display="none";
					}else {
						if (pageNum == 1) {
							document.getElementById("png").style.display="none";
						}
					}

					setTimeout(function() {
						self.carList = self.carList.concat(response.data);
						self.mescroll.endSuccess(response.data.length);
					},500);

				},function(response){});
			} else {
				self.carList = [];
				self.mescroll.endSuccess(0);
			}
		},

		delCar: function(index){ // 删除车辆
			var self = this;

			var data = {
				token: user.getState('token'),
				id: self.carList[index].id
			};
			
			mui.confirm('车辆删除后将无法恢复', '确认删除?', ['我再想想','确认删除'], function(e) {
				if (e.index == 1) {
					request.PostInfo(request.car_del,data,function(res){
						self.carList.splice(index,1);
						mui.toast(res.msg);
						document.getElementById("png").style.display="none";
					},function(res){});

				} else {

				}
			},'div');

		},
		back: function(index){ // 用于派单返回数据
			var self = this;
			var wo = plus.webview.getWebviewById('dis_order.html');
			if(plus.webview.currentWebview().opener()==wo){
				var carnumber = self.carList[index].carnumber;
				plus.webview.currentWebview().opener().evalJS("getCarInfo('"+carnumber+"')");
				mui.back();
			}else{
				return false
			}
			
		},
		editCar:function(index){
			var self = this;
			var cid = self.carList[index].id;
			mui.openWindow({
			    url:"car_add_index.html",
			    id:"./car/car_add_index.html",
			    extras:{
			        cid : cid,
	
			    },
			    createNew:true,
			    waiting:{
			      autoShow:true,//自动显示等待框，默认为true
			      title:'正在加载...',//等待对话框上显示的提示内容
			      options:{}
			    }
			});
		}
	},
	filters: {
		filterStart: function(val){ // 筛选 车辆状态（1未审核2审核通过3审核不通过）
			var startImg = parseInt(val); 
			switch (startImg){
				case 1:
					startImg = "认证中";
					break;
				case 2:
					startImg = "已认证"
					break;
				case 3:
					startImg = "认证失败"
					break;
				default:
					break;
			}
			return startImg;
		},
	}
})


