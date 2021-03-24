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
	el: "#dataList",
	data: {  
		self_id:'', 
		type:'',
		pick_type:'',
		pick_price:'',
		pick_flag:'1',
		send_type:'',
		send_price:'',
		send_flag:'1',
		trunking:1,
		lineList:{
		
		},  //零担线路数据
		send_arr:{
			send_sheng_name:'添加发货地址',
			send_shi_name:'',
			send_qu_name:'',
			send_address:'',
			tel:'',
			contacts:'装车联系人',
			send_qu:'',
			send_address_id:''
		},
		gather_arr:{
			gather_sheng_name:'添加目的地址',
			gather_shi_name:'',
			gather_qu_name:'',
			gather_address:'',
			tel:'',
			contacts:'目的地联系人',
			gather_qu:'',
			gather_address_id:''
		},
	    depart_time:'',
		  min_money:'',
		  price:'',
		  carData:[],
		  fristcontent: '', // 滚动条1
		  twocontent: '', // 滚动条2
		  threecontent: '', // 滚动条3
		  contentlist: {}, // 滚动所有内容
		cycle:[
		  {id: 1, value:'星期一', state: false},
		  {id: 2, value:'星期二', state: false}, 
		  {id: 3, value:'星期三', state: false},
		  {id: 4, value:'星期四', state: false},
		  {id: 5, value:'星期五', state: false},
		  {id: 6, value:'星期六', state: false},
		  {id: 0, value:'星期日', state: false},
		],
		time0:'',
		time1:'',
		time2:'',
		time3:'',
		time4:'',
		time5:'',
		time6:'',
		control_type:[],
		control:'',
		clod:'',
		clod_name:'',
		shift_number:''
	},
	mounted: function() {
		var self = this;
		this.get_control();
		mui.init()
		mui.plusReady(function() {
			var page = plus.webview.currentWebview();
			self.self_id = page.self_id;

			var data={
				self_id:self.self_id
			}
			request.PostInfo_new(request.tms_line_createLine,data,function(response){
				
				var data = response.data.info;
				console.log(JSON.stringify(data));
				self.lineList = data;
				self.shift_number=self.lineList.shift_number;
				self.type=self.lineList.type;
				self.price=self.lineList.price;
				self.group_code=self.lineList.group_code;
				self.min_money=self.lineList.min_money;
				
				// self.trunking=self.lineList.trunking;
				
				self.pick_price=self.lineList.pick_price;
				self.send_price=self.lineList.send_price;
				self.send_type=self.lineList.send_type;
				self.pick_type=self.lineList.pick_type;
				//装货
				if(self.pick_type =='pick'){
					self.pick_flag='2';
					console.log("开启提货服务");
					document.getElementById("picktype").classList.add('mui-active');
				}else{
					self.pick_flag='1'; 
					console.log("关闭提货服务");
					document.getElementById("picktype").classList.remove('mui-active');
				}
				//卸货
				if(self.send_type =='send'){
					self.send_flag='2';			
					  document.getElementById("sendtype").classList.add('mui-active');
				}else{
					self.send_flag='1';  
					document.getElementById("sendtype").classList.remove('mui-active');
				}

				self.control=self.lineList.control;
				self.clod=self.lineList.control;
				self.depart_time=self.lineList.depart_time;
				self.time0=self.lineList.time0;
				self.time1=self.lineList.time1;
				self.time2=self.lineList.time2;
				self.time3=self.lineList.time3;
				self.time4=self.lineList.time4;
				self.time5=self.lineList.time5;
				self.time6=self.lineList.time6;
				self.trunking=self.lineList.trunking;
				
				self.send_arr.send_sheng_name = self.lineList.send_sheng_name; // 详细地址
				self.send_arr.send_shi_name = self.lineList.send_shi_name; // 详细地址
				self.send_arr.send_qu_name = self.lineList.send_qu_name; // 详细地址
				self.send_arr.send_address = self.lineList.send_address; // 详细地址
				self.send_arr.contacts=self.lineList.send_name;
				self.send_arr.tel=self.lineList.send_tel
				self.send_arr.send_address_id=self.lineList.send_address_id;				
				self.send_arr.send_qu=self.lineList.send_qu;		
				
				self.gather_arr.gather_sheng_name = self.lineList.gather_sheng_name; // 详细地址
				self.gather_arr.gather_shi_name = self.lineList.gather_shi_name; // 详细地址
				self.gather_arr.gather_qu_name = self.lineList.gather_qu_name; // 详细地址
				self.gather_arr.gather_address = self.lineList.gather_address; // 详细地址
				self.gather_arr.contacts=self.lineList.gather_name;
				self.gather_arr.tel=self.lineList.gather_tel
				self.gather_arr.gather_address_id=self.lineList.gather_address_id;
				self.gather_arr.gather_qu=self.lineList.gather_qu;	
				
				
				var weeks_list = self.cycle;
				for (var i in weeks_list) {
				  if (weeks_list[i].id == 1) {
					if (self.lineList.time1 == 'Y') {
					  weeks_list[0].state = true;
					}
				  }
				  if (weeks_list[i].id == 2) {
					if (self.lineList.time2 == 'Y') {
					  weeks_list[1].state = true;
					}
				  }
				  if (weeks_list[i].id == 3) {
					if (self.lineList.time3 == 'Y') {
					  weeks_list[2].state = true;
					}
				  }
				  if (weeks_list[i].id == 4) {
					if (self.lineList.time4 == 'Y') {
					  weeks_list[3].state = true;
					}
				  }
				  if (weeks_list[i].id == 5) {
					if (self.lineList.time5 == 'Y') {
					  weeks_list[4].state = true;
					}
				  }
				  if (weeks_list[i].id == 6) {
					if (self.lineList.time6 == 'Y') {
					  weeks_list[5].state = true;
					}
				  }
				  if (weeks_list[i].id == 0) {
					if (self.lineList.time0 == 'Y') {
					  weeks_list[6].state = true;
					}
				  }
				}
				self.cycle = weeks_list;
				
				
			},function(response){
				
			})
	
			// if (self_id) {
			// 	headerData.title = '发布线路';
			// 	self.btn_title = '编辑线路';
			// }else{
			// 	headerData.title = '发布线路';
			// 	self.btn_title = '创建线路';				
			// }
			// headerData.order_id = order_id;

		})
		
	},
	methods: {
		get_control:function(){
			var data={
				self_id:''
			};
			var self = this;
			request.PostInfo_new(request.createOrder,data,function(res){
				console.log(JSON.stringify(res));
				var list = res.data.tms_control_type;

				for (var i in list) {
						var one = {
							key:list[i].key,
							name:list[i].name,
						};
						self.control_type.push(one);
						// self.control=self.control_type[0];
				}
			},function(res){
			
			});	
		},
		
		send_info: function(index) { // 前往收货地址
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
		
		gather_info: function(index) { // 前往收货地址
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
		shiQu: function(shiqu) {
			var self = this;
			// 获取点击时候的地址索引
			// 判断点击的时候点击的是发货还是收货
			if(self.tapCityType == 1){ // 发货地址
				console.log("发货地址");
				self.send_arr.send_sheng_name = shiqu.sheng_name; // 详细地址
				self.send_arr.send_shi_name = shiqu.shi_name; // 详细地址
				self.send_arr.send_qu_name = shiqu.qu_name; // 详细地址
				self.send_arr.send_address = shiqu.address; // 详细地址
				self.send_arr.contacts=shiqu.contacts;
				self.send_arr.tel=shiqu.tel
				self.send_arr.send_address_id=shiqu.self_id;
				self.send_arr.send_qu=shiqu.qu;
			}else{
				console.log("收货地址");
				self.gather_arr.gather_sheng_name = shiqu.sheng_name; // 详细地址
				self.gather_arr.gather_shi_name = shiqu.shi_name; // 详细地址
				self.gather_arr.gather_qu_name = shiqu.qu_name; // 详细地址
				self.gather_arr.gather_address = shiqu.address; // 详细地址
				self.gather_arr.contacts=shiqu.contacts;
				self.gather_arr.tel=shiqu.tel
				self.gather_arr.gather_address_id=shiqu.self_id;
				self.gather_arr.gather_qu=shiqu.qu;
			};
			// self.order_count_kilo();
		},	

		// 时间选择，选择装货时间
		timeSelt: function() { 
			var self = this;
			// var year = new Date().getFullYear();
			// var month = new Date().getMonth();
			// var day = new Date().getDate();
			var hour = new Date().getHours();
			// var end = day + 3;
			var minute = new Date().getMinutes();
			// var start = new Date(year, month, day, hour, minute, 0).getTime(); // 当前时间的节点
			var start = new Date(hour, minute, 0).getTime(); // 当前时间的节点
			var starttime = start + 4 * 60 * 60 * 1000; // 只能选择4小时以后的时间
			// var endtime = new Date(year, month, end, 23, 59, 0).getTime(); // 结束时间。3天后
			var dtpicker = new mui.DtPicker({
				// type: "datetime",
				type: "time",
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
				// var d = new Date(selectItems.y.value, selectItems.m.value - 1, selectItems.d.value, selectItems.h.value,selectItems.i.value);
				var d = new Date(selectItems.h.value,selectItems.i.value);
				// var time = selectItems.y.value + '-' + selectItems.m.value + '-' + selectItems.d.value + ' ' +  selectItems.h.value + ':'+selectItems.i.value;
				var time = selectItems.h.value + ':'+selectItems.i.value;
				self.depart_time = time;
			});
		},		
		click_control:function(key,index,name){
			var self=this;
			self.clod = key;
			self.clod_name = name;
		    self.control  		= key;
			// self.clod     		= self.control_type[index].key;
			// self.clod_name      = self.control_type[index].name;
			// console.log("index:"+index);
			// console.log("self.clod:"+self.clod);
			// console.log("self.clod_name:"+self.clod_name);
		},
		get_str:function(n){
		  var str = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	
			var res = "";
			 for(var i = 0; i < n ; i ++) {
			   var id = Math.ceil(Math.random()*35);
			   res += str[id];
			 }
			 var myDate = new Date();
			 var y = myDate.getFullYear();              
			 var m = myDate.getMonth()+1;              
			 var d = myDate.getDate();              
			 var h = myDate.getHours();                
			 return res + y + '' + m+ ''+d + '' + h;
		},
    //单独选中选框事件
		// checkOne:function(index,state) {
  //        // this.weeks[index].state = !state
  //        // console.log(this.weeks[index].state)
		// },
		
		checkOne:function(index,state) {
			this.cycle[index].state = !state
			console.log(this.cycle[index].state)
		},
		
		set_trunking:function(){
			var self=this;
			keyBoard.openKeyBoard('请输入时效:(天)', self.trunking, keyBoard.keyModels.PLUS, function(number){
			    self.trunking = number;
			});
		},
		
		set_send_price:function(){
			var self=this;
			keyBoard.openKeyBoard('请输入配送费:(元)', self.send_price, keyBoard.keyModels.PLUS, function(number){
			    self.send_price = number;
			});
		},
		set_pick_price:function(){
			var self=this;
			keyBoard.openKeyBoard('请输入提货费:(元)', self.pick_price, keyBoard.keyModels.PLUS, function(number){
			    self.pick_price = number;
			});
		},	
		//输入单公里价格运费
		set_price:function(){
			var self=this;
			keyBoard.openKeyBoard('请输入单公里运输费:(元)', self.price, keyBoard.keyModels.PLUS, function(number){
			    self.price = number;
			});
		},	
		//输入运费
		set_min_money:function(){
			var self=this;
			keyBoard.openKeyBoard('请输入运输费:(元)', self.min_money, keyBoard.keyModels.PLUS, function(number){
			    self.min_money = number;
			});
		},				
		//下单提交，准备进入支付页面
		outAdd: function() {
			var self = this;
// console.log("send_arr:"+JSON.stringify(self.send_arr));
// console.log("gather_arr:"+JSON.stringify(self.gather_arr));return;
		 if (!self.send_arr) {
			  mui.toast('请选择发车地址');
			  return false;
		  }      

		  if (!self.gather_arr) {
			  mui.toast('请选择目的地址！');
			  return false;
		  }

		  if (!self.depart_time) {
			  console.log(self.depart_time);
			  mui.toast('请选择发车时间！');
			  return false;
		  }      

		  if (!self.clod) {
			  mui.toast('请选择温控！');
			  return false;
		  }      

		  if (!self.trunking>0) {
			  mui.toast('时效不能为空！');
			  return false;
		  }    


		  if (!self.price) {
			  mui.toast('单公里价格不能为空！');
			  return false;
		  }
		  
		  if (!self.min_money) {
			  mui.toast('最低干线费不能为空！');
			  return false;
		  }

		  var data={
					type:'alone',
					price:self.price,//单价
					min_money:self.min_money,//最低干线费
					pick_type:self.pick_type,
					send_type:self.send_type,
					pick_price:self.pick_price,
					send_price:self.send_price,
					self_id:self.self_id,
					depart_time:self.depart_time,
					control:self.clod,
					group_code:self.company_select,
					gather_address_id      : self.gather_arr.gather_address_id,
					send_address_id        : self.send_arr.send_address_id,
					gather_qu              : self.gather_arr.gather_qu,
					// gather_address         : self.gather_arr.gather_sheng_name+self.gather_arr.gather_shi_name+self.gather_arr.gather_qu_name+self.gather_arr.gather_address,
					gather_address         : self.gather_arr.gather_address,
					gather_contacts_name   : self.gather_arr.contacts,
					gather_contacts_tel    : self.gather_arr.tel,
					send_qu                : self.send_arr.send_qu,
					// send_address           : self.send_arr.send_sheng_name+self.send_arr.send_shi_name+self.send_arr.send_qu_name+self.send_arr.send_address,
					send_address           : self.send_arr.send_address,
					send_contacts_name     : self.send_arr.contacts,
					send_contacts_tel      : self.send_arr.tel,
					shift_number:'',	
					trunking:self.trunking,
					group_code:localStorage.group_code,
		    }
			  if (self.self_id) {
			  data.shift_number = self.shift_number
			  }else{
			  data.shift_number = self.get_str(5)
			  }
			  //装货
			  if(self.pick_flag =='1'){
				data.pick_type='oneself';
			  }else{
				data.pick_type='pick'; 
			  }
			  //卸货
			  if(self.send_flag =='1'){
			  	data.send_type='oneself';			  
			  }else{
				data.send_type='send';  
			  }
			  
			var check_time = true;
			for (var i in self.cycle) {
			  if (self.cycle[i].id == 1) {
				  if (self.cycle[i].state) {
					data.time1 = 'Y'
					check_time = false;
				  } else {
					data.time1 = 'N'
				  }
			  } else if (self.cycle[i].id == 2) {
				  if (self.cycle[i].state) {
					data.time2 = 'Y'
					check_time = false;
				  } else {
					data.time2 = 'N'
				  }
			  } else if (self.cycle[i].id == 3) {
				  if (self.cycle[i].state) {
					data.time3 = 'Y'
					check_time = false;
				  } else {
					data.time3 = 'N'
				  }
			  } else if (self.cycle[i].id == 4) {
				  if (self.cycle[i].state) {
					data.time4 = 'Y'
					check_time = false;
				  } else {
					data.time4 = 'N'
				  }
			  } else if (self.cycle[i].id == 5) {
				  if (self.cycle[i].state) {
					data.time5 = 'Y'
					check_time = false;
				  } else {
					data.time5 = 'N'
				  }
			  } else if (self.cycle[i].id == 6) {
				  if (self.cycle[i].state) {
					data.time6 = 'Y'
					check_time = false;
				  } else {
					data.time6 = 'N'
				  }
			  } else if (self.cycle[i].id == 0) {
				  if (self.cycle[i].state) {
					data.time0 = 'Y'
					check_time = false;
				  } else {
					data.time0 = 'N'
				  }
			  }
			}
			  
			  
			  
			  console.log("线路提交数据:"+JSON.stringify(data));
			  
			  request.PostInfo_new(request.tms_line_addLine,data,function(res){
			  	console.log("添加线路："+JSON.stringify(res));

				if(res.code==200){
					mui.toast(res.msg);
					// plus.webview.getWebviewById('../line/line.html').reload();
					// mui.back();
					mui.back();
					 var list = plus.webview.currentWebview().opener();
					 //触发父页面的自定义事件(refresh),从而进行刷新
					  mui.fire(list, 'refresh');
					  //返回true,继续页面关闭逻辑
					return true;
				}else{
					mui.toast(res.msg);
				}
				

			  },function(res){
			  
			  });
			
			
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
	
	//监控数据变化
	watch: {
		anticipatedfreight:{
			handler(){
				this.count_price();
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
		console.log(selectItems[0].text);
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
		console.log(selectItems[0].text);
		indexData.carriage = selectItems[0].text;
		indexData.carriage_id = selectItems[0].value;
		picker.dispose();
	});	
}

//是否装货开关的判断
document.getElementById("picktype").addEventListener("toggle",function(event){
	console.log('event.detail.isActive:'+event.detail.isActive);
  if(event.detail.isActive){
    indexData.pick_type = 'pick';
	indexData.pick_flag='2'; //需要装货
	// alert("开启提货")
  }else{
    indexData.pick_type = 'oneself'; 
    indexData.pick_price = ''; 
	indexData.pick_flag='1';//不需要装货
	// alert("关闭提货")
  }
})

//是否卸货开关的判断
document.getElementById("sendtype").addEventListener("toggle",function(event){
  if(event.detail.isActive){
    indexData.send_type = 'send';
	indexData.send_flag='2'; //需要卸货
	// alert("开启配送")
  }else{
    indexData.send_type = 'oneself'; 
    indexData.send_price = ''; 
	indexData.send_flag='1'; //不需要卸货
	// alert("关闭配送")
  }
})


// $(document).on('click','.control_div button',function(e){
// 	$(this).addClass('active_clod').siblings().removeClass('active_clod');
// 	var self=this;
// 	self.clod=$(this).hasClass('active_clod').attr("data");
// 	console.log(self.clod);
// });


function backPaddress(data) { // 获得选中城市的返回值 展示效果
	indexData.shiQu(data);
}

function shi(shi) { // 获得选中城市的返回值 只有市 传给后台
	indexData.outAdd(shi);
}

function listenBack(data) { //常用地址获得选中的返回值
				console.log(JSON.stringify(data));
				indexData.shiQu(data);
};
