
function refresh(){
	vm.$data.mescroll.resetUpScroll();
}
function refresh_show(){
	location.reload();
}

function listenBack_dis(data){
	$('#dataList').hide();
	vm.upCallback({num:1,size:10});
	if (data == 1) {
		vm.share_()
	}
}

/**
 * @description 此处采用vue.js 循环数据
 */
var vm = new Vue({
	el: '#carOrderList',
    data: {
    	sliderNum: 0, // 类型; 进行中1; 已完成2; 已取消3
    	isShow:true,
        mescroll: null,
		list: [],
		clods: [],
		thButtonInfo: [],
		clod: "",
		contacts:'',
		tel:'',
		total_price:'',
		type:'',
		car_number:'',
		getC_id:'',
		listwo:[{a:1,b:2,c:3,d:9}],
		get_id:'',
		car_info:'',
		status:null,
		radio_car:'',
		checkedIndex: -1,
		checkedIndex_c:-1,
    },
    mounted: function() {
    	var self = this;
    	// 初始化页面
    	mui.init();
    	//创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
		//解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
		mui.plusReady(function(){
				var ws = plus.webview.currentWebview();
			  	self.get_id = ws.self_id;
			  	self.from = ws.from ? ws.from : '';
			  	console.log(self.from);
			  	console.log(self.get_id);
			self.mescroll = new MeScroll("mescroll", {
				up: {
					callback: self.upCallback, //上拉回调
					page:{size:10}, //可配置每页8条数据,默认10
					noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						warpId:"dataList",
						icon: "../images/empty/order.png", //图标,默认null
						tip: '<p style="font-size: 16px;color: #999999;">暂无相关订单<p>', //提示
					}
				}
			});	
			var shares = new share();
			shares.updateSerivces();
			self.share_ = function(){
				var href = request.url_share + '?a=carriage';
				var url_img = request.ServerUrl + '/image/logo.png';
				var msg={
					type:"web",
					title:"新订单",
					content:"来新订单了，注意查看！", // 分享内容
					href:href, // 分享图片
					thumbs:[url_img] // 缩略图
				};
				shares.openShare(msg);
			}

			mui('.nav').on('tap', '.nav-list', function() {
				var i = this.getAttribute("i");
				if (self.sliderNum != i) {
					//更改列表条件
					self.sliderNum = i;
					var leng = mui(".nav .nav-list").length;
					for (var n = 0; n < leng; n++) {
						mui(".nav .nav-list")[n].classList.remove("active");
					}
					this.classList.add("active");
					//重置列表数据
					self.mescroll.resetUpScroll();
				}
			});
		})
		
    },
	methods:{
		//上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
		upCallback: function(page) {
			console.log("page.num=="+page.num+", page.size=="+page.size);
			//联网加载数据
			var self = this;
			if(self.sliderNum==0){
				self.getListDataFromNet(page.num,1); // 调用接口
			}
			if(self.sliderNum==1){
				self.getListDataFromNet(page.num,2);
			}

		},
		
		to_car:function(index){
			var self = this;
			self.getC_id=self.list[index].self_id;
			self.car_number=self.list[index].car_number;
			self.contacts=self.list[index].contacts;
			self.tel=self.list[index].tel;
			self.type=self.list[index].car_possess;
			self.checkedIndex = index;
			// self.checkedIndex_c=index;
		},
		to_car_c:function(index){
			var self = this;
			self.checkedIndex_c=index;
		},

		getListDataFromNet:function(pageNum,status){
			console.log(status);
			var self = this;
			self.status=status;
			
			if(pageNum == 1) self.list = [];
			 if(status == 1){
			var data = {
				page: pageNum,
				// group_code: localStorage.group_code,	
			}
			
			data.status = status;
			console.log(JSON.stringify(data))
			request.PostInfo_new(request.tms_car_carPage,data,function(res){
				console.log(JSON.stringify(res))
				var data = res.data.items;
				//更新列表数据
				self.list = self.list.concat(data);
				console.log(JSON.stringify(data))
				//传参:数据的总数; mescroll会自动判断列表是否有无下一页数据,如果数据不满一页则提示无更多数据;
				self.mescroll.endSuccess(data.length);
				$('#dataList').show();
			},function(res){
				//联网失败的回调,隐藏下拉刷新和上拉加载的状态;
				self.mescroll.endSuccess(0);
				$('#dataList').show();
				// self.mescroll.endErr();
				// mui.toast("连接服务器出错...");
			});
			}
			if(status == 2){
			var data = {
				page: pageNum,
				type:"carriers",
				// group_code: localStorage.group_code,	
			}
			data.status = status;
			console.log(JSON.stringify(data))
			request.PostInfo_new(request.tms_group_groupPage,data,function(res){
				console.log(JSON.stringify(res))
				var data = res.data.items;
				//更新列表数据
				self.list = self.list.concat(data);
				console.log(JSON.stringify(data))
				//传参:数据的总数; mescroll会自动判断列表是否有无下一页数据,如果数据不满一页则提示无更多数据;
				self.mescroll.endSuccess(data.length);
				$('#dataList').show();
			},function(res){
				//联网失败的回调,隐藏下拉刷新和上拉加载的状态;
				self.mescroll.endSuccess(0);
				$('#dataList').show();
				// self.mescroll.endErr();
				// mui.toast("连接服务器出错...");
			});
			}
		},
		submitFun: function(){ // 提交
			var self = this;
			// var token = user.getState('token');
			// var group_id = user.getState('group_id');
			// var name = request.clear_str_null($('#name').val());
			// var contact_name = request.clear_str_null($('#contact_name').val());
			// var contact_tel = request.clear_str_null($('#contact_tel').val());
			// if (!self.group_id) {
			// 	mui.toast('请选择公司!');
			// 	return false;
			// }			
		
			// if (!name) {
			// 	mui.toast('客户名称不能为空!');
			// 	return false;
			// }
		
			// if (!self.paystate_id) {
			// 	mui.toast('请选择结算方式!');
			// 	return false;
			// }
			// if (!contact_name) {
			// 	mui.toast('联系人不能为空!');
			// 	return false;
			// }
			// var c_m = request.checkMobile(contact_tel);
			// if (c_m) {
			// 	mui.toast('联系电话(手机号)格式错误！');
			// 	return false;
			// }
			self.car_info = [{
				car_id: self.getC_id,
				car_number:self.car_number,
				contacts:self.contacts,
				price: self.total_price,
				tel: self.tel,
				type: self.type
			}]
			console.log(JSON.stringify(self.car_info))
			if(self.status == 1){
				var data = {
					car_info:self.car_info,
					carriage_flag: "driver",
					dispatch_list:self.get_id ,
					group_code: localStorage.group_code,
					total_price: self.total_price,
				};
			}
			else{
				var data = {
					company_id:self.getC_id,
					carriage_flag: "carriers",
					dispatch_list:self.get_id ,
					group_code: localStorage.group_code,
					total_price: self.total_price,
				};
			}
			
			console.log(JSON.stringify(data))
			request.PostInfo_new(request.tms_dispatch_addDispatch,data,function(res){
				console.log(res);
				mui.toast(res.msg);
				// vm.mescroll.resetUpScroll();
				plus.webview.currentWebview().opener().evalJS("refresh_show()");
				// plus.webview.getWebviewById('../order_3pl/take_list.html').reload();
		  	},function(res){
		
		  	});
		},
		
		
		
	},
	filters:{
	order_weight:function(value,order_type){
		var self = this;
	         if (order_type == 'vehicle') {
				 var self = this;
	             return value/1000 + ' 吨  '
	         } else {
	             return value + ' kg  '
	         }
	     },
	},	
});

$(document).on('click','.create_order',function(){
	vm.submitFun();
});
// $(document).on('click','.radiobox',function(){
// 	vm.to_car().check=true;
// });
//监听专车取消订单传过来的refres
window.addEventListener('cancel', function(event) {
	refresh();
});