var select_title = 1;
function outSelectCity(name, id, pro_id) {
	indexData.$data.cityid = id; //城市的id
	// document.getElementById('selectcity').innerText = name;
	indexData.$data.inCityName = name;
}

var headerData = new Vue({
	el:"#carheader",
	data:{
		lid:'',
		title:'添加订单',
	}
});

var indexData = new Vue({
	el: "#carcont",
	data: {
	  send_arr:[{
		send_info:'添加发车地址',
		send_info_tel:'装车联系人'
	  }],
	  gather_arr:[{
		gather_info:'添加目的地址',
		gather_info_tel:'目的地联系人'
	  }],
	  
	checkedPick: false,
	checkedSend: false,
	warmPicker: false,  
	currentTime: '12:00',
    self_id:'',
	carId: 2, // 默认的车型id
	pick_type:'',
	pick_flag:'1',
	pick_price:'',
	send_type:'',
	send_price:'',
	send_flag:'1',
	line_price:'',
	address_list:[{
		send_info:'添加装车地址',
		send_info_tel:'装车地址联系人',
		send_address_id:'',
		gather_info:'添加目的地址',
		gather_info_tel:'目的地址联系人',
		gather_address_id:'',
		good_name:'',
		good_number:1,
		good_weight:1,
		good_volume:1,
		control_type:[],//温度信息
		clod:"freeze",
		clod_name:'冷冻',
	}],
	temp_control_type:[],//用来承接温度信息的过渡数组
	  yugu:'',
	  start_time:'',
	  end_time:'',
	  remark:'',
	  // line_price:'',
	  carData:[],
	  fristcontent: '', // 滚动条1
	  twocontent: '', // 滚动条2
	  threecontent: '', // 滚动条3
	  contentlist: {}, // 滚动所有内容
	  carId:'',//选择的车型
	  // carName:'',
      customer:'',
	  company_name:'',
      customer_id:'',
	  total_money:'',
	  //新增的用来提交预期运费的对象
	  anticipatedfreight:{
		  car_type:'',
		  pick_flag:'1',//是否装货
		  send_flag:'1',//是否卸货
		  gather_address:[
			  {area:"",city:"",info:"",pro:""},
		  ],//收货地址数组
		  send_address:[
			  {area:"",city:"",info:"",pro:""},
		  ],//发货地址数组
		  gatherCanUse:false, //判断是否可用
		  sendCanUse:false,//判断是否可用
	  },
	},
	mounted: function() {
		var self = this;
		
		this.get_control();
		mui.init({})
		mui.plusReady(function() {
			var selfPage = plus.webview.currentWebview();
			var order_id = selfPage.order_id;
			self.order_id = order_id;

			if (order_id) {
				headerData.title = '编辑订单';
				self.btn_title = '编辑订单';
			}
			headerData.order_id = order_id;
			//self.get_view();
		})
		
	},
	methods: {
		//商品名称字数限制
		checkLength:function(index){
			var self=this;
		    var l = 0;
		    for(var i=0; i<self.address_list[index].good_name.length; i++) {
		        if (/[\u4e00-\u9fa5]/.test(self.address_list[index].good_name[i])) {
		            l+=2;
		        } else {
		            l++;
		        }
		        if (l > 10) {
		            self.address_list[index].good_name = self.address_list[index].good_name.substr(0,i);
		            break;
		        }
		    }
		},
		//备注字数限制
		checkLength2:function(index){
			var self=this;
		    var l = 0;
		    for(var i=0; i<self.remark.length; i++) {
		        if (/[\u4e00-\u9fa5]/.test(self.remark[i])) {
		            l+=2;
		        } else {
		            l++;
		        }
		        if (l > 10) {
		            self.remark = self.remark.substr(0,i);
		            break;
		        }
		    }
		},
		//获取车辆信息
		get_car:function(){
			var data={};
			var self = this;
			request.PostInfo_new(request.getType,data,function(res){
				var list = res.data.info;
				var newList=list.map((item,index,arr)=>{
					let json={};
					json.value=item.self_id;
					json.text=item.parame_name;
					return json;
				});
				var getCar = new mui.PopPicker();
				 getCar.setData(newList);
				 getCar.show(function(selectItems){
					 self.carId=selectItems[0].value;
					 self.carName=selectItems[0].text;
					 self.anticipatedfreight.car_type=self.carId;
					 if(self.anticipatedfreight.sendCanUse && self.anticipatedfreight.gatherCanUse){
						 self.count_price();
					 }else{
						 // console.log('还没有选择地址');
					 }
				 })
				
			},function(res){
			
			});	
		},
		set_total_money:function(){
			var self = this;
			var pick_type = self.pick_type;
			var send_type = self.send_type;
			var pick_money = self.pick_price - 0;
			var send_money = self.send_price - 0;
			var line_price = self.line_price - 0;
			if (self.pick_type=='oneself') {
			  pick_money = 0
			}
			
			if (self.send_type=='oneself') {
			  send_money = 0
			}
	
			self.total_money =   line_price + pick_money + send_money
	
		},
	
		get_control:function(){
			var data={
				self_id:''
			};
			var self = this;
			request.PostInfo_new(request.createOrder,data,function(res){
				// console.log(JSON.stringify(res));
				self.temp_control_type = res.data.tms_control_type;
				if(self.temp_control_type && self.temp_control_type.length>0){
					self.address_list[0].control_type=self.temp_control_type;
					self.address_list[0].clod = self.temp_control_type[0].key
					self.address_list[0].clod_name =self.temp_control_type[0].name
				}
			},function(res){
			
			});	
		},
		
		// 前往收货地址
		send_info: function(index) { 
		    var flag = false;
			if (localStorage.ftoken == null) {
				mui.toast('请先登录');
				openLogin();
				flag = true;
			}
			if (flag) {
				return false;
			}
			$('.addcom').find('input').blur();
			var self = this;
			// 记录点击的类型 1 发货 2 收货
			self.tapCityType = 1;
			// 记录点击的地址索引
			self.activeIndex = index;
			var address = self.send_arr[index];
			clicked("../address/list.html",{selecttype:1,address:address});
		},
		
		
		// 前往客户
		customer_info: function(index) { 
			var flag = false;
			if (localStorage.ftoken == null) {
				mui.toast('请先登录');
				openLogin();
				flag = true;
			}
			if (flag) {
				return false;
			}
			$('.addcom').find('input').blur();
			var self = this;
			// 记录点击的类型 1 发货 2 收货
			self.tapCityType = 1;
			// 记录点击的地址索引
			self.activeIndex = index;
			var customer = '';
			clicked("../customer/list.html",{selecttype:3,customer:customer});
		},	
		
		// 前往收货地址
		gather_info: function(index) { 
			var flag = false;
			if (localStorage.ftoken == null) {
				mui.toast('请先登录');
				openLogin();
				flag = true;
			}
			if (flag) {
				return false;
			}
			$('.addcom').find('input').blur();
			var self = this;
			// 记录点击的类型 1 发货 2 收货
			self.tapCityType = 2;
			// 记录点击的地址索引
			self.activeIndex = index;
			var address = self.gather_arr[index];
			clicked("../address/list.html",{selecttype:2,address:address});
		},	
	
		//获取收发货人的地址和基本信息
		shiQu: function(shiqu) {
			var self = this;
			// 获取点击时候的地址索引
			var index = self.activeIndex;
			// console.log(JSON.stringify(shiqu));
			// 判断点击的时候点击的是发货还是收货
			if (self.tapCityType == 1) { // 发货地址
				self.address_list[index].send_info = shiqu.sheng_name+shiqu.shi_name+shiqu.qu_name+shiqu.address; // 详细地址
				self.address_list[index].send_info_tel = shiqu.contacts+shiqu.tel; // 详细地址
				self.address_list[index].send_address_id=shiqu.self_id;
				self.address_list[index].send_name=shiqu.contacts;
				self.address_list[index].send_tel=shiqu.tel;
				self.address_list[index].send_qu=shiqu.qu;
				self.address_list[index].send_sheng_name=shiqu.sheng_name;
				self.address_list[index].send_shi_name=shiqu.shi_name;
				self.address_list[index].send_qu_name=shiqu.qu_name;
				self.address_list[index].send_address=shiqu.address;
				self.anticipatedfreight.send_address.forEach((item,indexs)=>{
					if(index == indexs){
						item.area=shiqu.qu_name;
						item.city=shiqu.shi_name;
						item.info=shiqu.address;
						item.pro=shiqu.sheng_name;
					}
					self.anticipatedfreight.sendCanUse=true;
				})
			} else {

				self.address_list[index].gather_info = shiqu.sheng_name+shiqu.shi_name+shiqu.qu_name+shiqu.address; // 详细地址
				self.address_list[index].gather_info_tel = shiqu.contacts+shiqu.tel; // 详细地址
				self.address_list[index].gather_address_id=shiqu.self_id;
				self.address_list[index].gather_name=shiqu.contacts;
				self.address_list[index].gather_tel=shiqu.tel;
				self.address_list[index].gather_qu=shiqu.qu;
				self.address_list[index].gather_sheng_name=shiqu.sheng_name;
				self.address_list[index].gather_shi_name=shiqu.shi_name;
				self.address_list[index].gather_qu_name=shiqu.qu_name;
				self.address_list[index].gather_address=shiqu.address;
				self.anticipatedfreight.gather_address.forEach((item,indexs)=>{
					if(index == indexs){
						item.area=shiqu.qu_name;
						item.city=shiqu.shi_name;
						item.info=shiqu.address;
						item.pro=shiqu.sheng_name;
					}
					self.anticipatedfreight.gatherCanUse=true;
				})
			};

		},
		set_send_price:function(){
			var self=this;
			keyBoard.openKeyBoard('请输入配送费:(元)', self.send_price, keyBoard.keyModels.PLUS, function(number){
			    self.send_price = number;
				self.set_total_money();
			});
			
		},
		set_pick_price:function(){
			var self=this;
			keyBoard.openKeyBoard('请输入提货费:(元)', self.pick_price, keyBoard.keyModels.PLUS, function(number){
			    self.pick_price = number;
				self.set_total_money();
			});
			
		},
		
		//输入运费
		set_line_price:function(){
			var self=this;
			keyBoard.openKeyBoard('请输入运输费:(元)', self.line_price, keyBoard.keyModels.PLUS, function(number){
			    self.line_price = number;
				self.set_total_money();
			});
			
		},	
		
		
		//新增下单信息
		add_address_list(){
				console.log(JSON.stringify(this.address_list));
				let cando=false;
				this.address_list.forEach((item,index)=>{
					if(item.send_address_id && item.gather_address_id && item.good_name!=''){
						cando=true;
					}else{
						cando=false;
					}
				})
				if(cando){
			
					this.address_list.push({
					  send_info:'添加装车地址',
					  send_info_tel:'装车地址联系人',
					  gather_info:'添加目的地址',
					  gather_info_tel:'目的地址联系人',
					  good_name:'',
					  good_number:1,
					  good_weight:1,
					  good_volume:1,
					  control_type:this.temp_control_type,
					  clod:this.temp_control_type[0].key,
					  clod_name:this.temp_control_type[0].name		
					});
					this.anticipatedfreight.gather_address.push({area:"",city:"",info:"",pro:""});
					this.anticipatedfreight.send_address.push({area:"",city:"",info:"",pro:""});
					//在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候
					this.$nextTick(() => {
					  mui('.mui-numbox').numbox();
					})
				}else{
					console.log('没有新增，因为上一个还没填完！')
					mui.toast('请先填写完信息再添加！');
				}	
		},
		
		//获取数字输入框的值
		getNumbox(purpose,type,index,num){
			if(type == 'add'){
				num++;
			}else{
				num--;
			}
			this.$set(this.address_list[index],purpose,num);
		},
		
		//点击温度按钮
		click_control(val,index,name){
		      var list = this.address_list[index];
			  this.$set(this.address_list[index],'clod',val);
			  this.$set(this.address_list[index],'clod_name',name);
		    },
		
		//删除新增的下单信息
		del_address_list(index){
		  var list = this.address_list
			list.splice(index,1);
			this.anticipatedfreight.gather_address.splice(index,1);
			this.anticipatedfreight.send_address.splice(index,1);
			this.address_list = list;
			// mui('.mui-numbox').numbox();
		},
		
		//调用接口计算预估运费
		count_price:function(){
			var self = this;
			var data=self.anticipatedfreight;
			// console.log('data的值是：'+JSON.stringify(data))
			if(self.anticipatedfreight.car_type){
				request.PostInfo_new(request.count_price,data,function(res){
					self.yugu=res.info.singleprice+'~'+res.info.maxprice;
					console.log(JSON.stringify(self.yugu));
				},function(res){
					// console.log('332的是：'+JSON.stringify(res));
				})
			}
			
		},
		
		
		// 时间选择，选择装货时间
		timeSelt: function() { 
			var self = this;
			var year = new Date().getFullYear();
			var month = new Date().getMonth();
			var day = new Date().getDate();
			var hour = new Date().getHours();
			var end = day + 3;
			var minute = new Date().getMinutes();
			var start = new Date(year, month, day, hour, minute, 0).getTime(); // 当前时间的节点
			var starttime = start + 4 * 60 * 60 * 1000; // 只能选择4小时以后的时间
			var endtime = new Date(year, month, end, 23, 59, 0).getTime(); // 结束时间。3天后
			var dtpicker = new mui.DtPicker({
				type: "datetime",
				customData: {
					i: [ //时间/日期别名
						{
							value: '00',
							text: '00分'
						},
						{
							value: '15',
							text: '15分'
						},
						{
							value: '30',
							text: '30分'
						},
						{
							value: '45',
							text: '45分'
						}
					],
				}
			});
			dtpicker.show(function(selectItems) {
				var d = new Date(selectItems.y.value, selectItems.m.value - 1, selectItems.d.value, selectItems.h.value,
				selectItems.i.value);
				var time = selectItems.y.value + '-' + selectItems.m.value + '-' + selectItems.d.value + ' ' +  selectItems.h.value + ':'+selectItems.i.value;
				self.start_time = time;
			});
		},		
		
		// 时间选择，选择收货时间
		timeSelt_send: function() { 
			var self = this;
			var year = new Date().getFullYear();
			var month = new Date().getMonth();
			var day = new Date().getDate();
			var hour = new Date().getHours();
			var end = day + 3;
			var minute = new Date().getMinutes();
			var start = new Date(year, month, day, hour, minute, 0).getTime(); // 当前时间的节点
			var starttime = start + 4 * 60 * 60 * 1000; // 只能选择4小时以后的时间
			var endtime = new Date(year, month, end, 23, 59, 0).getTime(); // 结束时间。3天后
			var dtpicker = new mui.DtPicker({
				type: "datetime",
				customData: {
					i: [ //时间/日期别名
						{
							value: '00',
							text: '00分'
						},
						{
							value: '15',
							text: '15分'
						},
						{
							value: '30',
							text: '30分'
						},
						{
							value: '45',
							text: '45分'
						}
					],
				}
			});
			dtpicker.show(function(selectItems) {
				// console.log(JSON.stringify(selectItems));
				var d = new Date(selectItems.y.value, selectItems.m.value - 1, selectItems.d.value, selectItems.h.value,
					selectItems.i.value);
					var time = selectItems.y.value + '-'+  selectItems.m.value + '-' + selectItems.d.value + ' ' +  selectItems.h.value + ':'+selectItems.i.value;
				    self.end_time = time;
			});
		},

		
//输入数量
		set_good_number:function(index){
			var self=this;
			document.activeElement.blur();
			keyBoard.openKeyBoard('请输入数量:(件)', self.address_list[index].good_number, keyBoard.keyModels.PLUS, function(number){
			    self.address_list[index].good_number = number;
			});
		},	
		
		//输入重量
		set_good_weight:function(index){
			var self=this;
			document.activeElement.blur();
			keyBoard.openKeyBoard('请输入重量:(吨)', self.address_list[index].good_weight, keyBoard.keyModels.PLUS, function(number){
			    self.address_list[index].good_weight = number;
			});
		},	
		
		//输入立方
		set_good_volume:function(index){
			var self=this;
			document.activeElement.blur();
			keyBoard.openKeyBoard('请输入体积:(立方)', self.address_list[index].good_volume, keyBoard.keyModels.PLUS, function(number){
			    self.address_list[index].good_volume = number;
			});
		},	
	//输入运费
		set_line_price:function(){
			var self=this;
			document.activeElement.blur();
			keyBoard.openKeyBoard('请输入运输费:(元)', self.line_price, keyBoard.keyModels.PLUS, function(number){
			    self.line_price = number;
			});
		},			


		//输入装货费
		set_pick_price:function(){
			var self=this;
			document.activeElement.blur();
			keyBoard.openKeyBoard('请输入装货费:(元)', self.pick_price, keyBoard.keyModels.PLUS, function(number){
			    self.pick_price = number;
			});
		},	
		//输入卸货费
		set_send_price:function(){
			var self=this;
			document.activeElement.blur();
			keyBoard.openKeyBoard('请输入卸货费:(元)', self.send_price, keyBoard.keyModels.PLUS, function(number){
			    self.send_price = number;
			});
		},	


		get_week:function(){
			var arr = [];
			$('.set_checkbox .set_check_active').each(function(){
				var c = $(this).attr('data');
				arr.push(c);
			});
			return arr;
		},
		
		//下单提交，准备进入支付页面
		orderUse: function() {
			var self = this;
			var list = self.address_list;
			
			
			// list.forEach((item)=>{
			// 		item.good_weight=item.good_weight*1000;
			// })
			
			self.address_list.forEach((item,index)=>{				
				 if(item.send_address_id && item.gather_address_id && item.good_name!=''){
					cando=true;
				 }else{
					cando=false;
				 }
			})
			if(cando){
				self.count_price();
			}else{
				mui.toast('请完整填写信息！');
			}
		      for (var i in list) {
		          if (!list[i].send_address_id) {
		              mui.toast('请选择装车地址！');
		              return false;
		          }
		
		          if (!list[i].gather_address_id) {
		              mui.toast('请选择目的地址！');
		              return false;
		          }
		
		          if (!list[i].good_name) {
		              mui.toast('请输入货物名称！');
		              return false;
		          }          
		
		          if (!list[i].good_number) {
		              flag = true;
		              mui.toast('请输入货物件数！');
		              return false;
		          }         
		
		           if (!list[i].good_volume) {
		              mui.toast('请输入货物总体积！');
		              return false;
		          }          
		
		          if (!list[i].good_weight) {
		              mui.toast('请输入货物总重量！');
		              return false;
		          }
				  if (!list[i].clod) {
				      mui.toast('请选择温度！');
				      return false;
				  }
		      }
			   		
			  if (!self.start_time ) {
			  	mui.toast('请选择装车时间');
			  	return false;
			  }				
			  
			  if (!self.end_time) {
			  	mui.toast('请选择收货时间');
			  	return false;
			  }
			  	
			  if (!self.line_price) {
			  	mui.toast('请填写运输费');
			  	return false;
			  }	
			  if (self.line_price <200) {
				mui.toast('运费太低了');
				return false;
			  }	
			  
			if (!self.customer_id) {
				mui.toast('请选择客户');
				return false;
			}	
	
			  
			let data = {};
			  data.car_type= self.carId;
			  data.order_type ='vehicle';
			  // data.total_money=self.total_money;
			  data.total_money=self.line_price+self.send_price+self.pick_price;
			  data.dispatcher=list;
			  // data.dispatcher=JSON.stringify(list);
			  data.send_time=self.start_time;
			  data.gather_time=self.end_time;
			 //  //装货
			 //  if(self.anticipatedfreight.pick_flag =='1'){
				// data.pick_flag='N';
			 //  }else{
				// data.pick_flag='Y'; 			
			 //  }
			 //  //卸货
			 //  if(self.anticipatedfreight.send_flag =='1'){
			 //  	data.send_flag='N';	
			 //  }else{
				// data.send_flag='Y';  			
			 //  }
			  
			//装货
			if(self.pick_flag =='1'){
				data.pick_flag='N';
			}else{
				data.pick_flag='Y'; 			
			}
			//卸货
			if(self.send_flag =='1'){
				data.send_flag='N';	
			}else{
				data.send_flag='Y';  			
			}  
			  
			  data.pick_money=self.pick_price;
			  data.send_money=self.send_price;
			  data.pay_type = 'offline';
			  data.group_code = localStorage.group_code;
			  data.company_id = self.customer_id;
			  data.remark=self.remark;
			  // console.log("data:"+JSON.stringify(data));return;
				data.dispatcher.forEach((item,index)=>{
					item.good_weight=item.good_weight*1000;
				})
			  
			  request.PostInfo_new(request.tms_order_addOrder,data,function(res){
				// console.log('接口返回值是：'+JSON.stringify(res));
				if(res.code==200){		
					mui.toast(res.msg);
					mui.back();
				}else{
					mui.toast(res.msg);
				}
			},function(res){
				mui.toast(res.msg);
			});
			
		},

		outAdd: function(data) {
			var self = this;
			// 获取点击时候的地址索引
			var index = self.activeIndex;
			// 判断点击的时候点击的是发货还是收货
			if (self.tapCityType == 1) { // 发车地址
				self.startcity_str[index].city = data.address.city_name+ data.address.area_name; //发车地址 市
			} else {
				self.endcity_str[index].city = data.city_name+data.area_name; //目的地址 市
			};
			//判断发货地与收货地是否相同：如果相同则不调用接口
			function getArrEqual(arr1, arr2) {
				var newArr = [];
				for (var i = 0; i < arr2.length; i++) {
					for (var j = 0; j < arr1.length; j++) {
						if (arr1[j].city === arr2[i].city) {
							newArr.push(arr1[j].city);
						}
					}
				}
				return newArr;
			}
			// console.log(getArrEqual(self.startcity_str, self.endcity_str));
			var gotlenth = getArrEqual(self.startcity_str, self.endcity_str).length;
			if (gotlenth == 0) {
				// console.log("jifei");
				// self.evaluation();
			} else {
				mui.toast("收货城市不可和发货城市相同");
				self.eskilo = '';
				self.esprice = '';
			}
		},

		// 控制页面上移到可视区域,避免软键盘遮挡
		pagescroll:function(){    
			// console.log("页面上移函数");
			mui(".mui-content").scroll().scrollTo(0,-220);
			
		},
		
		set_price_json:function(){
			var self = this;
			clicked("price_json.html",{price_json:self.price_json});
		},

	},
	
	//计算属性
	computed:{
		returnMoney(){
			this.set_total_money();
			return this.total_money;
		}
			
	},
	
	//监控数据变化
	watch: {
		anticipatedfreight:{
			handler(){
				console.log('wacth打印的值：'+JSON.stringify(this.address_list));
				let cando=false;
				this.address_list.forEach((item,index)=>{
					if(item.send_address_id && item.gather_address_id && item.good_name!=''){
						cando=true;
					}else{
						cando=false;
					}
				})
				if(cando){
					this.count_price();
				}else{
					console.log('没有计算预估运费，因为上一个还没填完！')
				}
			},
			deep:true,
			immediate:false,
		}
	},
})



/*
 * @description: 选择器
 * @param: data 选择器的数据
 * @param: col 选择器的列
 * @param: ele 选择器数据输出的位置
 * */
function picker(data,col,ele){
	// 如果没有说明选择器是几列，就默认1列
	if(!col){
		col = 1;
	}
	// 初始化选择器
	var picker = new mui.PopPicker({layer: col},{buttons:['取消','ok','确定']});
	// 设置选择器的数据
	picker.setData(data);
	// 显示选择器
	picker.show(function (selectItems) {
		// 输出选择器选中的值
		// console.log(selectItems[0].text);
		indexData.control = selectItems[0].text;
		// ele.html(selectItems[0].text);
		// 设置选中的value 
		// ele.setAttribute("data-value",selectItems[0].value);
		// 销毁选择器
		picker.dispose();
	});	
}
function picker_carriage(data,col,ele){
	// 如果没有说明选择器是几列，就默认1列
	if(!col){
		col = 1;
	}
	// 初始化选择器
	var picker = new mui.PopPicker({layer: col},{buttons:['取消','ok','确定']});
	// 设置选择器的数据
	picker.setData(data);
	// 显示选择器
	picker.show(function (selectItems) {
		// 输出选择器选中的值
		// console.log(selectItems[0].text);
		indexData.carriage = selectItems[0].text;
		indexData.carriage_id = selectItems[0].value;
		picker.dispose();
	});	
}

//是否装货开关的判断
document.getElementById("picktype").addEventListener("toggle",function(event){
	// console.log('event.detail.isActive:'+event.detail.isActive);
  if(event.detail.isActive){
    indexData.pick_type = 'pick';
	indexData.pick_flag='2'; //需要装货
	//indexData.set_total_money();
	// alert("开启提货")
  }else{
    indexData.pick_type = 'oneself'; 
    indexData.pick_price = ''; 
	indexData.pick_flag='1';//不需要装货
	//indexData.set_total_money();
	// alert("关闭提货")
  }
})

//是否卸货开关的判断
document.getElementById("sendtype").addEventListener("toggle",function(event){
  if(event.detail.isActive){
    indexData.send_type = 'send';
	indexData.send_flag='2'; //需要卸货
	//indexData.set_total_money();
	// alert("开启配送")
  }else{
    indexData.send_type = 'oneself'; 
    indexData.send_price = ''; 
	indexData.send_flag='1'; //不需要卸货
	//indexData.set_total_money();
	// alert("关闭配送")
  }
})


function backPaddress(data) { // 获得选中城市的返回值 展示效果
	indexData.shiQu(data);
}

function shi(shi) { // 获得选中城市的返回值 只有市 传给后台
	indexData.outAdd(shi);
}

function listenBack(data) { //常用地址获得选中的返回值
	// console.log(JSON.stringify(data));
	indexData.shiQu(data);
};

function listenBack_carriage(data) { //常用地址获得选中的返回值
	console.log("客户："+JSON.stringify(data));
	indexData.customer=data.company_name;
	indexData.customer_id=data.self_id;
	// indexData.shiQu(data);
};

