// 刷新车辆列表
function reload(){
	indexData.getList();
}
var indexData=new Vue({
	el:"#moneyContent",
	data:{
		mescroll:null,
		list:[],
		page:1,
		user_money:'',
		// temp_list:[
		// 	{"produce_type":"提现","money":"100.00","create_time":"2021-03-11 15:44:11"},
		// 	{"produce_type":"提现","money":"10.00","create_time":"2021-03-11 15:26:10"},
		// 	{"produce_type":"提现","money":"100.00","create_time":"2021-03-11 15:44:11"},
		// 	{"produce_type":"提现","money":"10.00","create_time":"2021-03-11 15:26:10"},
		// 	{"produce_type":"提现","money":"100.00","create_time":"2021-03-11 15:44:11"},
		// 	{"produce_type":"提现","money":"10.00","create_time":"2021-03-11 15:26:10"},
		// 	{"produce_type":"提现","money":"100.00","create_time":"2021-03-11 15:44:11"},
		// 	{"produce_type":"提现","money":"10.00","create_time":"2021-03-11 15:26:10"},
		// ],
		total:3,//列表总数
	},
	mounted(){
		var self=this;
		mui.plusReady(function(){
			// self.mescroll = new MeScroll("mescroll", {
			// 	dow: {
			// 		callback: self.upCallback, //上拉回调
			// 		page: {
			// 			size: 10
			// 		}, //可配置每页8条数据,默认10
			// 		noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
			// 		empty: { //配置列表无任何数据的提示
			// 			warpId: "dataList",
			// 			icon: "../images/empty/car.png",
			// 			tip: '<p style="font-size: 16px;color: #8590a6;">暂无车辆信息<p>',
			// 		}
			// 	}
			// });
			// // 预加载详情页面
			// setTimeout(function() {
			// 	// preloadOrderDetail();
			// }, 200);
		});
		this.getData();
	},
	methods:{
		
		//加载页面信息
		getData(){
			let self=this;
			//获取用户余额
			request.PostInfo_new(request.user_owm,{},function(res){
				console.log('刷新了')
				self.user_money=res.data.user_capital.money;
			},function(res){
				
			});
			self.getList();
			
		},
		// upCallback: function(page) { //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
		// 	//联网加载数据
		// 	var self = this;
		// 	console.log(page)
		// 	self.getList(page.num,1);
		// },
		//获取交易明细列表
		getList:function(){
			// console.log(pageNum)
			let self=this;
			// if(pageNum == 1) self.list = [];
			let data={
				page:self.page
				// page: pageNum,
			}
			request.PostInfo_new(request.wallet_info,data,function(res){
				console.log('wallet_info的值是：'+JSON.stringify(res))
				var data=res.data;
				// setTimeout(function() {
				// 	self.list = self.list.concat(data);
				// 	console.log(JSON.stringify(self.list));
				// 	self.mescroll.endSuccess(data.length);
				// },500);
				if(data &&　data.length>0){
					self.list=data;
					// self.list=self.list.concat(self.temp_list)
					self.$nextTick(()=>{
						mui.init({
							  pullRefresh: {
								container: "#mescroll", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
								// dow: {
								// 	height:100, //可选.默认50.触发上拉加载拖动距离
								// 	auto: false, //可选,默认false.自动上拉加载一次
								// 	contentrefresh: "正在加载", //可选，正在加载状态时，上拉加载控件上显示的标题内容
								// 	contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
								// 	callback:self.pulltofresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
								// },
								up: {
									height:100, //可选.默认50.触发上拉加载拖动距离
									auto: false, //可选,默认false.自动上拉加载一次
									contentrefresh: "正在加载", //可选，正在加载状态时，上拉加载控件上显示的标题内容
									contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
									callback:self.pullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
								}
							}
						});
					})
				}
			
			},function(res){
				
			})
		},
		
		//上拉加载
		pullupRefresh(){
					let self=this;
					// console.log('加载了');
					console.log('self.page是：'+self.page);
					let data={
						page:self.page
					}
					request.PostInfo_new(request.wallet_info,data,function(res){
						let temp_data=res.data;
						console.log('pullrefresh的值是：'+JSON.stringify(res))
						if(temp_data &&　data.length>0){
							 self.page++;
							 self.list=self.list.concat(temp_data);
							 mui('#mescroll').pullRefresh().endPullupToRefresh(true);
						}else{
							 mui.toast('我是有底线的');
							 mui('#mescroll').pullRefresh().endPullupToRefresh(false);
							 return;
						}
						
					},function(){
						
					});
				},
				 // pulltofresh() {
				 //           let self=this;
				 //           // console.log('加载了');
				 //           console.log('self.page是：'+self.page);
				 //           let data={
				 //           	page:self.page
				 //           }
					// 	   request.PostInfo_new(request.wallet_info,data,function(res){
					// 	   	let temp_data=res.data;
					// 	   	console.log('pullrefresh的值是：'+JSON.stringify(res))
					// 		self.list = self.list.concat(temp_data);
					// 	   },function(res){
						   	
					// 	   });
					// 	   mui('#mescroll').pullRefresh().endPulldownToRefresh();
				 //            // mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				 //        },
		// pullupRefresh(){
		// 	let self=this;

		// 	if(self.list.length<self.total){
		// 		self.page++;
		// 	}else{
		// 		mui.toast('我是有底线的');
		// 		// 这里结束添加数据
		// 		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		// 		return;
		// 	}
		// 	console.log('self.page是：'+self.page);
		// 	let data={
		// 		page:self.page
		// 	}
		// 	request.PostInfo_new(request.wallet_info,data,function(res){
		// 		let temp_data=res.data;
		// 		 if(temp_data &&　temp_data.length>0){
		// 			 self.list=self.list.concat(temp_data);
		// 		 }
		// 		 mui('#pullrefresh').pullRefresh().endPullupToRefresh(self.list.length >= self.total);
		// 	},function(){
				
		// 	});
		// 	// mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		// },
		
		//跳转提现页面
		jumpBank(){
			clicked('./extract.html');
		},
		reload:function(){
			var self = this;
			self.mescroll.resetUpScroll();
		},
	}
})



	

