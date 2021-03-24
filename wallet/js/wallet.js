var indexData=new Vue({
	el:"#moneyContent",
	data:{
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
		mui.plusReady(function(){
			
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
		
		//获取交易明细列表
		getList(){
			
			let self=this;
			let data={
				page:self.page
			}
			request.PostInfo_new(request.wallet_info,data,function(res){
				console.log('wallet_info的值是：'+JSON.stringify(res))
				let temp_data=res.data;
				if(temp_data &&　temp_data.length>0){
					self.list=temp_data;
					// self.list=self.list.concat(self.temp_list)
					self.$nextTick(()=>{
						mui.init({
							  pullRefresh: {
								container: "#pullrefresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
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
						if(temp_data &&　temp_data.length>0){
							 self.page++;
							 self.list=self.list.concat(temp_data);
							 mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						}else{
							 mui.toast('我是有底线的');
							 mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							 return;
						}
						
					},function(){
						
					});
				},
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
		}
	}
})



	

