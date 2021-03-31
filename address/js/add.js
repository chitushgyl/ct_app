//地图实例
var map;
/**
 * @description:常用联系人页面回传参数
 * @param {Object} name
 * @param {Object} phone
 * @param {Object} id
 */
/**
 * 页面刷新
 */
function refreshData(){
	vm.getAdsList();		
}
function returan(name,phone,id){
	vm.$data.name = name;
	vm.$data.phone = phone;
}


/**
 * @description初始化地图
 */
function setuserlocal(){
	bmap.getUser_location(function(point){
		map.centerAndZoom(point,15);
		bmap.addMarker(map,'user',point);
		bmap.local_deviation(map,point,'template');
	});
}
// 地址选择器
//var cityPicker = null;
// 实例化vue
var vm = new Vue({
	el: '#template',
	data: {
		type: 1, // 操作类型 1 添加 2 编辑
		cityPicker: null,
		token: null,
		address_id: null,
		sheng: null,
		sheng_name: null,
		shi: null,
		shi_name: null,
		qu: null,
		qu_name: null,
		group_code:null,
		address: "",
		contacts: "",    //常用地址绑定的联系人
		tel: "",   //常用地址绑定的电话
		cityData3:[],
//		local:null,     //地图搜索
//		geocoder:null,    //地图地址解析
//		searchlist:[]     //检索的地址列表
 	},
	mounted: function(){
		var self = this;
		
		mui.init();
		
		mui.ready(function(){
			var cityPicker = new mui.PopPicker({
				layer:3
			});
			
			var showCityPicker = document.getElementById('cityPicker')
			showCityPicker.addEventListener('tap',function(event){
				showCityPicker.show(function(){})
			})
		})
		
		mui.plusReady(function() {		
			var ws = plus.webview.currentWebview();
			console.log(ws);
		  	self.type = ws.type ? ws.type : 1;
			//从城配编辑、修改页面进入将传值并初始化地址选择器		  	
		  	self.sheng = ws.sheng;   //省份id
		  	self.shi = ws.shi;    //城市id
		  	console.log(self.type);
		  	console.log(ws.sheng_name);
		  	console.log(ws.shi_name);
		  	console.log(ws.qu_name);
		  	console.log('city_id:'+ws.qu);
		  	//更换页面标题和按钮内容
		  	if(self.type == 2){   //编辑页面传值
		  		document.getElementById('title').innerHTML = "编辑地址";
		  		document.getElementById('subbtn').innerHTML = "确认修改";
				// 下面是编辑页面内容显示的消息。现在全部为空默认内容
		  		self.contacts = ws.contacts;       //姓名
		  		self.tel = ws.tel;     //电话
		  		self.sheng_name = ws.sheng_name;   //省份名
		  		self.shi_name = ws.shi_name;  //城市名 
		  		self.qu = ws.qu;    //地区/县id
		  		self.qu_name = ws.qu_name;    //地区/县名称
		  		self.address = ws.address;      //详细地址 
		  		self.address_id = ws.address_id;     //地址id
		  	}
		  	// 初始化选择器
		  	self.cityPicker = new mui.PopPicker({
		  		layer: 3,
		  	});
		  	self.cityPicker.setData(cityData3);
		  	
		  	if(self.type == 1){   //城配新建地址初始化选择器选项
		  		self.cityPicker.pickers[0].setSelectedValue(self.sheng);
				setTimeout(function(){
					self.cityPicker.pickers[1].setSelectedValue(self.shi);
				},100);
		  	}else{		  //编辑地址初始化选择器选项
		  		self.cityPicker.pickers[0].setSelectedValue(self.sheng);
				setTimeout(function(){
					self.cityPicker.pickers[1].setSelectedValue(self.shi);
				},100);
				setTimeout(function(){
					self.cityPicker.pickers[2].setSelectedValue(self.qu);
				},200);
		  	}
		});
		
	},

	methods: {
		click_one_second : function(){//设置缓存时间
		    var time = 30 * 60 * 1000;
		    var timestamp = new Date().getTime();
		    var time_out_time = localStorage.click_out_time_second ? localStorage.click_out_time_second : 0;
		    var get_time = timestamp - time_out_time;
		    if (get_time < time) {
		        return false;
		    } else {
		    	localStorage.click_out_time_second = timestamp
		        return true;
		    }
		},
		
		selectAddress: function(){ // 筛选地址
		    // alert('选择地址')
			var self = this;
			self.visibilityPicker();
			// 页面input失去焦点
			// document.getElementById("name").blur();
			// document.getElementById("phone").blur();
			// document.getElementById("address").blur();
			
			self.cityPicker.show(function(items) {
				self.sheng_name = (items[0] || {}).text;
				self.sheng = (items[0] || {}).value;
				self.shi_name = (items[1] || {}).text;
				self.shi = (items[1] || {}).value;
				self.qu_name = (items[2] || {}).text;
				self.qu = (items[2] || {}).value;
			});
		},
		visibilityPicker: function(type){ //隐藏地址选择框
			if(type==1){
				document.querySelector('.mui-poppicker').style.display = 'none';
				// vm.$data.name='';
			}else if(type==2){
				document.querySelector('.mui-poppicker').style.display = 'block';
				// vm.$data.phone='';
			}
		},
		submitFun: function(){ // 提交
			var self = this;
			var type = self.type;
			if(type == 1){ // 执行添加动作
			
			// var str = self.address;
			// var ze = /.+?(省|市|自治区|自治州|县|区)/g; // 省市区的正则
			// var str_ze = str.match(ze);
			// console.log(str_ze);
			// var arr = []
			// for (let i in str_ze) {
			//     let o = {};
			//     o["name"] = str_ze[i]; //即添加了key值也赋了value值 o[i] 相当于o.name 此时i为变量
			//     arr.push(o)
			// }
			// // console.log(JSON.stringify(arr));
			// if(arr[0].name!==self.sheng_name){
			// 	mui.toast("详细地址和所选省份或直辖市不匹配");
			// 	// self.address=" ";
			// 	return false;
			// }
			
			// if(arr[1].name!==self.shi_name){
			// 	mui.toast("详细地址和所选城市不匹配");
			// 	// self.address=" ";
			// 	return false;
			// }	
				
				
				
				var submitData = {
					token : user.getState('token'),
					self_id : self.address_id,
					pro : self.sheng_name,
					city : self.shi_name,
					area : self.qu_name,
					qu : self.qu,
					// group_code :user.getState('group_code'),
					group_code : localStorage.group_code,
					address : request.clear_str_null(self.address),
					contacts : self.contacts,
					tel : self.tel
				};
				
				console.log(JSON.stringify(localStorage.group_code));
				if(!self.sheng||!self.shi||!self.qu||!self.address||!self.contacts||!self.tel){
					mui.toast("请将地址信息填写完整！！");
					return false;
				}
				
				console.log(submitData);
				var project_type = localStorage.project_type;
				console.log(project_type);
				if (project_type == 'TMS3PL') {
					request.PostInfo_new(request.tms_address_addAddress,submitData,function(res){
						plus.webview.getWebviewById('../address/list.html').reload();
						mui.back();
					},function(res){});					
				}else{				
					request.PostInfo_new(request.api_address_addAddress,submitData,function(res){
						plus.webview.getWebviewById('../address/list.html').reload();
						mui.back();
					},function(res){});					
				}
				

			}else{ // 执行编辑动作
			
			
			// var str = self.address;
			// var ze = /.+?(省|市|北京市|天津市|上海市|重庆市|自治区|自治州|县|区)/g; // 省市区的正则
			// var str_ze = str.match(ze);
			// console.log(str_ze);
			// var arr = []
			// for (let i in str_ze) {
			//     let o = {};
			//     o["name"] = str_ze[i]; //即添加了key值也赋了value值 o[i] 相当于o.name 此时i为变量
			//     arr.push(o)
			// }
			// console.log(JSON.stringify(arr));
			// console.log(arr[0].name);
			// console.log(self.sheng_name);
			// if(arr[0].name!==self.sheng_name){
			// 	mui.toast("详细地址和所选省份或直辖市不匹配");
			// 	// self.address=" ";
			// 	return false;
			// }
			
			// if(arr[1].name!==self.shi_name){
			// 	mui.toast("详细地址和所选城市不匹配");
			// 	// self.address=" ";
			// 	return false;
			// }			
				var submitData = {
					self_id : self.address_id,
					qu: self.qu,
					group_code : localStorage.group_code,
					address : request.clear_str_null(self.address),
					contacts : self.contacts,
					tel : self.tel
				};
				
				console.log(JSON.stringify(submitData));
				console.log('pro:'+self.sheng_name);
				console.log('city:'+self.shi_name);
				console.log('area:'+self.qu_name);
				console.log('qu:'+self.qu);
				console.log('add:'+self.address);
				if(!self.sheng_name || !self.shi_name || !self.qu_name || !self.address){
					mui.toast("请将地址信息填写完整！");
					return false;
				}				
				if (project_type == 'TMS3PL') {
				request.PostInfo_new(request.tms_address_addAddress,submitData,function(res){
					plus.webview.getWebviewById('../address/list.html').reload();
					mui.back();
				},function(res){});
			}else{
				request.PostInfo_new(request.api_address_addAddress,submitData,function(res){
					plus.webview.getWebviewById('../address/list.html').reload();
					mui.back();
				},function(res){});
			}
			}
		},
		getContacts:function(){  //选择常用联系人
			clicked("contacts.html");
		},
		reload:function(){
			var self = this;
			self.mescroll.resetUpScroll();
		},
		addAdderss:function(){
			var self = this;
			request.PostInfo_new(request.get_city,{},function(res){
					console.log(JSON.stringify(res.data.info));
					var address_list=set_list_tree(res.data,0)
					// console.log(address_list);return;
					self.cityData3=address_list;
					console.log(self.cityData3);
					// plus.webview.currentWebview().opener().evalJS("refreshData()");
					// mui.back();
				},function(){})	
		}
		
	}
});

