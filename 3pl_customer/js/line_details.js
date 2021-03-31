//实例化vue
var indexData = new Vue({
	el: '#dataList',
	data : {
		mescroll : null,
		lineList:{},  //零担线路数据
		yugu:'',
		tms_pick_type:[
			{key: "pick", name: "上门提货"},
			{key: "oneself", name: "自送到点"}
		],//提货按钮数组
		tms_send_type:[
			{key: "send", name: "送货上门"},
			{key: "oneself", name: "到点自提"}
		],//送货按钮数组
		choosePickType:'oneself',//默认选中的提货方式
		chooseSendType:'oneself',//默认选中的送货方式
		pick_price:null,
		send_price:null,
		pick_price_show:0,
		send_price_show:0,
		more_Price:null,
		send_arr:[{
				send_info:'添加发车地址',
				send_info_tel:'装车联系人'
		}],
		gather_arr:[{
				gather_info:'添加目的地址',
				gather_info_tel:'目的地联系人'
		}],
		tms_control_type:[],//温度存储数组
		tms_orde_type:[],//不知道什么用处，先建了再说
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
			remark:''
		}],//下单地址和货物信息
		
		temp_control_type:[
			// {key: "freeze", name: "冷冻"},
			// {key: "refrigeration", name: "冷藏"},
			// {key: "normal", name: "常温"},
			// {key: "constant", name: "恒温"},
			// {key: "cold", name: "冷冻/冷藏"},
		],//用来承接温度信息的过渡数组
		anticipatedfreight:{
		  line_id:'',
		  pick_type:'N',//是否装货【oneself=>N】
		  send_type:'N',//是否卸货【oneself=>N】
		  gather_address:[
			  {area:"",city:"",info:"",pro:""},
		  ],//收货地址数组
		  send_address:[
			  {area:"",city:"",info:"",pro:""},
		  ],//发货地址数组
		  temp_weight:[1],
		  temp_volume:[1],
		  weight:'',//总和
		  volume:'',//总和
		},//预估运费提交数据
		isShow:false,//是否显示下单地址的添加按钮
		// 调用下单字段时使用的字段
		price:'',
		min_money:'',
		pick_price:'',
		send_price:'',
		start_time:null,
		end_time:null,
		send_time:null,
		remark:'',
	},
	mounted: function(){
		var self = this;
		// 初始化页面
		mui.init();
		self.getCreateOrde();
		mui.plusReady(function(){
			var page = plus.webview.currentWebview();
			console.log(JSON.stringify(page));	
			var data = {
				self_id : page.self_id,
			}
			;
			request.PostInfo_new(request.line_details,data,function(response){
				console.log(JSON.stringify(response))
				var data = response.data.info;
				self.lineList = data;
				//初始化下单数据
				
				self.anticipatedfreight.line_id=data.self_id;
				self.anticipatedfreight.gather_address[0].pro=self.lineList.gather_sheng_name;
				self.anticipatedfreight.gather_address[0].city=self.lineList.gather_shi_name;
				self.anticipatedfreight.gather_address[0].area=self.lineList.gather_qu_name;
				self.anticipatedfreight.gather_address[0].info=self.lineList.gather_address;
	
				
				self.anticipatedfreight.send_address[0].pro=self.lineList.send_sheng_name;
				self.anticipatedfreight.send_address[0].city=self.lineList.send_shi_name;
				self.anticipatedfreight.send_address[0].area=self.lineList.send_qu_name;
				self.anticipatedfreight.send_address[0].info=self.lineList.send_address;
				
				self.getOrigin(self.lineList);
				
				self.send_time=self.lineList.start_time;//发货时间
				self.gather_time=self.lineList.end_time;//收货时间
				self.pick_price=self.lineList.pick_price;
				self.send_price=self.lineList.send_price;
				
				//初始化address_list数据
				self.address_list[0].gather_info=self.lineList.gather_sheng_name+self.lineList.gather_shi_name+self.lineList.gather_qu_name+self.lineList.gather_address;
				self.address_list[0].gather_info_tel=self.lineList.gather_tel;
				self.address_list[0].gather_address_id=self.lineList.gather_address_id;
				
				self.address_list[0].send_info=self.lineList.send_sheng_name+self.lineList.send_shi_name+self.lineList.send_qu_name+self.lineList.send_address;
				self.address_list[0].send_info_tel=self.lineList.send_tel;
				self.address_list[0].send_address_id=self.lineList.send_address_id;
				
				self.address_list[0].send_name=self.lineList.send_name;
				self.address_list[0].send_tel=self.lineList.send_tel;
				self.address_list[0].send_qu=self.lineList.send_qu;
				self.address_list[0].send_sheng_name=self.lineList.send_sheng_name;
				self.address_list[0].send_shi_name=self.lineList.send_shi_name;
				self.address_list[0].send_qu_name=self.lineList.send_qu_name;
				self.address_list[0].send_address=self.lineList.send_address;
				
				
				self.address_list[0].gather_name=self.lineList.gather_name;
				self.address_list[0].gather_tel=self.lineList.gather_tel;
				self.address_list[0].gather_qu=self.lineList.gather_qu;
				self.address_list[0].gather_sheng_name=self.lineList.gather_sheng_name;
				self.address_list[0].gather_shi_name=self.lineList.gather_shi_name;
				self.address_list[0].gather_qu_name=self.lineList.gather_qu_name;
				self.address_list[0].gather_address=self.lineList.gather_address;
				
			},function(response){
				
			})
		});
	},
	methods:{
		//备注字数限制
		checkLength2:function(index){
			var self=this;
		    var l = 0;
		    for(var i=0; i<self.address_list[index].remark.length; i++) {
		        if (/[\u4e00-\u9fa5]/.test(self.address_list[index].remark[i])) {
		            l+=2;
		        } else {
		            l++;
		        }
		        if (l > 10) {
		            self.address_list[index].remark = self.address_list[index].remark.substr(0,i);
		            break;
		        }
		    }
		},
		//获取页面基本信息
		getCreateOrde:function(){
			var data={
				self_id:''
			};
			var self = this;
			request.PostInfo_new(request.createOrder,data,function(res){
				console.log(JSON.stringify(res));
				if(res.data.tms_pick_type && res.data.tms_pick_type.length>0){
					self.tms_pick_type=res.data.tms_pick_type;
				}
				if(res.data.tms_send_type && res.data.tms_send_type.length>0){
					self.tms_send_type=res.data.tms_send_type;
				}
				if(res.data.tms_control_type && res.data.tms_control_type.length>0){
					self.temp_control_type = res.data.tms_control_type;
					self.address_list[0].control_type=self.temp_control_type;
					self.address_list[0].clod = self.temp_control_type[0].key;
					self.address_list[0].clod_name =self.temp_control_type[0].name;
					
					
					
				}
			},function(res){
			
			});	
		},
		
		//点击提货方式按钮(发货地址)
		choosePick(item){
			let self=this;
			self.choosePickType=item.key;
			//当提货状态变成自送到点的时候，所有的发货地址都要变成线路地址
			if(self.choosePickType == 'oneself'){
				self.anticipatedfreight.pick_type='N';
				self.address_list.forEach((item,index)=>{
					 item.send_info=self.lineList.send_sheng_name+self.lineList.send_shi_name+self.lineList.send_qu_name+self.lineList.send_address;
					 item.send_info_tel='';
				})
				self.pick_price_show="0";
			}else{
				self.anticipatedfreight.pick_type='Y'
				self.address_list.forEach((item,index)=>{
					 item.send_info='添加装车地址';
					 item.send_info_tel='装车地址联系人';
				})
				self.pick_price_show=self.pick_price;
			}
			self.changeIsShow(self.chooseSendType,self.choosePickType);
		},
		
		//点击送货方式按钮(收货地址)
		chooseSend(item){
			let self=this;
			self.chooseSendType=item.key;
			//当提送状态变成自送到点的时候，所有的送货地址都要变成线路地址
			if(self.chooseSendType == 'oneself'){
				self.anticipatedfreight.send_type='N'
				self.address_list.forEach((item,index)=>{
					 item.gather_info=self.lineList.gather_sheng_name+self.lineList.gather_shi_name+self.lineList.gather_qu_name+self.lineList.gather_address;
					 item.gather_info_tel='';
				})
				self.send_price_show="0";
			}else{
				self.anticipatedfreight.send_type='Y'
				self.address_list.forEach((item,index)=>{
					 item.gather_info='添加目的地址';
					 item.gather_info_tel='目的地址联系人';
				})
				self.send_price_show=self.send_price;
			}
			self.changeIsShow(self.chooseSendType,self.choosePickType);
		},
		
		//用来赋值最初的线路和人的信息
		getOrigin(data){
			let self=this;
			
			self.address_list[0].gather_sheng_name=data.gather_sheng_name;
			self.address_list[0].gather_shi_name=data.gather_shi_name;
			self.address_list[0].gather_qu_name=data.gather_qu_name;
			self.address_list[0].gather_qu=data.gather_address;
			self.address_list[0].gather_name=data.gather_name;
			self.address_list[0].gather_tel=data.gather_tel;
			self.address_list[0].gather_address_id='';
			
			self.address_list[0].send_sheng_name=data.send_sheng_name;
			self.address_list[0].send_shi_name=data.send_shi_name;
			self.address_list[0].send_qu_name=data.send_qu_name;
			self.address_list[0].send_qu=data.send_address;
			self.address_list[0].send_name=data.send_name;
			self.address_list[0].send_tel=data.send_tel;
			self.address_list[0].send_address_id='';
		},
		
		//是否显示下单地址的添加按钮以及是否清空地址变成默认地址
		changeIsShow(send,pick){
			let self=this;
			if(pick=='oneself' && send =='oneself'){
				self.isShow=false;
				// console.log(self.temp_address_list);
				// alert(123);
				//这里将情况用户自己选择的地址（如果真的有的话）[重新初始化address_list]
				 self.address_list=[{
					send_info:self.lineList.send_sheng_name+self.lineList.send_shi_name+self.lineList.send_qu_name+self.lineList.send_address,
					send_info_tel:self.lineList.send_tel,
					send_address_id:self.lineList.send_address_id,
					gather_info:self.lineList.gather_sheng_name+self.lineList.gather_shi_name+self.lineList.gather_qu_name+self.lineList.gather_address,
					gather_info_tel:self.lineList.gather_tel,
					gather_address_id:self.lineList.gather_address_id,
					good_name:'',
					good_number:1,
					good_weight:1,
					good_volume:1,
					control_type:self.temp_control_type,
					clod:self.temp_control_type[0].key,
					clod_name:self.temp_control_type[0].name ,
					send_name:self.lineList.send_name,
					send_tel:self.lineList.send_tel,
					send_qu:self.lineList.send_qu,
					send_sheng_name:self.lineList.send_sheng_name,
					send_shi_name:self.lineList.send_shi_name,
					send_qu_name:self.lineList.send_qu_name,
					send_address:self.lineList.send_address,
					
					gather_name:self.lineList.gather_name,
					gather_tel:self.lineList.gather_tel,
					gather_qu:self.lineList.gather_qu,
					gather_sheng_name:self.lineList.gather_sheng_name,
					gather_shi_name:self.lineList.gather_shi_name,
					gather_qu_name:self.lineList.gather_qu_name,
					gather_address:self.lineList.gather_address,
				 }];
				 self.getOrigin(self.lineList);
				 self.anticipatedfreight.send_address=[];
				 self.anticipatedfreight.gather_address=[];
				 self.anticipatedfreight.temp_volume=[1];
				 self.anticipatedfreight.temp_weight=[1];
				 self.anticipatedfreight.send_address.push({
					 pro:self.lineList.send_sheng_name,
					 city:self.lineList.send_shi_name,
					 area:self.lineList.send_qu_name,
					 info:self.lineList.send_address,
				 })
				 self.anticipatedfreight.gather_address.push({
					 pro:self.lineList.gather_sheng_name,
					 city:self.lineList.gather_shi_name,
					 area:self.lineList.gather_qu_name,
					 info:self.lineList.gather_address,
				 })
			}else{
				self.isShow=true;
				if(pick=='oneself'){
					
					self.address_list.forEach((item,index)=>{
						item.send_sheng_name=self.lineList.send_sheng_name;
						item.send_shi_name=self.lineList.send_shi_name;
						item.send_qu_name=self.lineList.send_qu_name;
						item.send_qu=self.lineList.send_address;
						item.send_name=self.lineList.send_name;
						item.send_tel=self.lineList.send_tel;
						item.send_address_id='';
					})
				
					self.anticipatedfreight.send_address.forEach((item,index)=>{
						item.pro=self.lineList.send_sheng_name;
						item.city=self.lineList.send_shi_name;
						item.area=self.lineList.send_qu_name;
						item.info=self.lineList.send_address;
					})
				}else{
					self.anticipatedfreight.send_address.forEach((item,index)=>{
						item.pro=null;
						item.city=null;
						item.area=null;
						item.info=null;
					})
					
					self.address_list.forEach((item,index)=>{
						item.send_name=null;
						item.send_tel=null;
						item.send_qu=null;
						item.send_sheng_name=null;
						item.send_shi_name=null;
						item.send_qu_name=null;
						item.send_address=null;
						item.send_address_id=null;
					})					
				}
				
				
				
				if(send =='oneself'){
					
					self.address_list.forEach((item,index)=>{
						item.gather_sheng_name=self.lineList.gather_sheng_name;
						item.gather_shi_name=self.lineList.gather_shi_name;
						item.gather_qu_name=self.lineList.gather_qu_name;
						item.gather_qu=self.lineList.gather_address;
						item.gather_name=self.lineList.gather_name;
						item.gather_tel=self.lineList.gather_tel;
						item.gather_address_id='';
					})
					
					self.anticipatedfreight.gather_address.forEach((item,index)=>{
						item.pro=self.lineList.gather_sheng_name;
						item.city=self.lineList.gather_shi_name;
						item.area=self.lineList.gather_qu_name;
						item.info=self.lineList.gather_address;
					})
				}else{
					self.anticipatedfreight.gather_address.forEach((item,index)=>{
						item.pro=null;
						item.city=null;
						item.area=null;
						item.info=null;
					})

					self.address_list.forEach((item,index)=>{
						item.gather_name=null;
						item.gather_tel=null;
						item.gather_qu=null;
						item.gather_sheng_name=null;
						item.gather_shi_name=null;
						item.gather_qu_name=null;
						item.gather_address=null;
						item.gather_address_id=null;
					})					
				}
			}
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
			console.log(JSON.stringify(shiqu));
			console.log('index：'+index);
			// 判断点击的时候点击的是发货还是收货
			if (self.tapCityType == 1) { // 发货地址
			
				var c_ss=self.lineList.send_sheng_name+self.lineList.send_shi_name;
				var xz_ss=shiqu.sheng_name+shiqu.shi_name;
				
				
				if(xz_ss==c_ss){
					console.log("地址在可选范围内")
				}else{
					mui.toast('第'+(index+1)+"个装车地址必须在"+self.lineList.send_sheng_name+self.lineList.send_shi_name+"范围内");
					return false;					
				}
			
			
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
				var c_ss=self.lineList.gather_sheng_name+self.lineList.gather_shi_name;
				var xz_ss=shiqu.sheng_name+shiqu.shi_name;

				if(xz_ss==c_ss){
					console.log("地址在可选范围内")
				}else{
					mui.toast('第'+(index+1)+"个收货地址必须在"+self.lineList.gather_sheng_name+self.lineList.gather_shi_name+"范围内");
					return false;					
				}
				
				// if(shiqu.sheng_name!=self.lineList.gather_sheng_name && shiqu.shi_name!=self.lineList.gather_shi_name ){
				// 	mui.toast('第'+(index+1)+"个收货地址必须在"+self.lineList.gather_sheng_name+self.lineList.gather_shi_name+"范围内");
				// 	return false;
				// }
				
				
				var c_address=self.lineList.gather_sheng_name+self.lineList.gather_shi_name+self.lineList.gather_qu_name+self.lineList.gather_address;
				var xz_address=shiqu.sheng_name+shiqu.shi_name+shiqu.qu_name+shiqu.address;
				
				// console.log("c_address:"+JSON.stringify(c_address));
				// console.log("xz_address:"+JSON.stringify(xz_address));
				if(c_address==xz_address){
					mui.toast("配送地址不能和仓库地址一样");
					return false;
				}
		
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
		
		//新增下单信息
		add_address_list(){
			let self=this;
		        self.address_list.push({
		          send_info:'添加装车地址',
		          send_info_tel:'装车地址联系人',
		          gather_info:'添加目的地址',
		          gather_info_tel:'目的地址联系人',
		          good_name:'',
		          good_number:1,
		          good_weight:1,
		          good_volume:1,
				  control_type:self.temp_control_type,
		          clod:self.temp_control_type[0].key,
		          clod_name:self.temp_control_type[0].name,
				  remark:'',
		        });
				
				self.anticipatedfreight.temp_weight.push(1);
				self.anticipatedfreight.temp_volume.push(1);
				
				//如果新增的时候送货方式【收货地址】是到点自提，则给新增的地址上加上线路默认地址
				if(self.chooseSendType =='oneself'){
					
					self.address_list.forEach((item,index)=>{
						item.gather_sheng_name=self.lineList.gather_sheng_name;
						item.gather_shi_name=self.lineList.gather_shi_name;
						item.gather_qu_name=self.lineList.gather_qu_name;
						item.gather_qu=self.lineList.gather_address;
						item.gather_name=self.lineList.gather_name;
						item.gather_tel=self.lineList.gather_tel;
						item.gather_address_id='';
					})
					
					self.anticipatedfreight.gather_address.push({
						pro:self.lineList.gather_sheng_name,
						city:self.lineList.gather_shi_name,
						area:self.lineList.gather_qu_name,
						info:self.lineList.gather_address,
					});
				}else{
					self.anticipatedfreight.gather_address.push({area:"",city:"",info:"",pro:""});
				}
				//如果新增的时候提货方式【发货地址】是自送到点，则给新增的地址上加上线路默认地址
				if(self.choosePickType =='oneself'){
					
					self.address_list.forEach((item,index)=>{
						item.send_sheng_name=self.lineList.send_sheng_name;
						item.send_shi_name=self.lineList.send_shi_name;
						item.send_qu_name=self.lineList.send_qu_name;
						item.send_qu=self.lineList.send_address;
						item.send_name=self.lineList.send_name;
						item.send_tel=self.lineList.send_tel;
						item.send_address_id='';
					})
					
					
					self.anticipatedfreight.send_address.push({
						pro:self.lineList.send_sheng_name,
						city:self.lineList.send_shi_name,
						area:self.lineList.send_qu_name,
						info:self.lineList.send_address,
					})
				}else{
					self.anticipatedfreight.send_address.push({area:"",city:"",info:"",pro:""});
				}
				//在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候
				self.$nextTick(() => {
				  mui('.mui-numbox').numbox();
				})
				
		},
		
		//获取数字输入框的值
		getNumbox(purpose,type,index,num){
			let self=this;
			if(type == 'add'){
				num++;
			}else{
				num--;
			}
			self.$set(self.address_list[index],purpose,num);
			self.anticipatedfreight.temp_weight=self.address_list.map((item)=>{
					return item.good_weight;
			})
			self.anticipatedfreight.temp_volume=self.address_list.map((item)=>{
					return item.good_volume;
			})
			 // self.anticipatedfreight.weight=weightsdfd.reduce((n,m) => n + m);

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
				self.anticipatedfreight.temp_weight=self.address_list.map((item)=>{
						return item.good_weight;
				})
			});
		},	
		
		//输入立方
		set_good_volume:function(index){
			var self=this;
			document.activeElement.blur();
			keyBoard.openKeyBoard('请输入体积:(立方)', self.address_list[index].good_volume, keyBoard.keyModels.PLUS, function(number){
			    self.address_list[index].good_volume = number;
				self.anticipatedfreight.temp_volume=self.address_list.map((item)=>{
						return item.good_volume;
				})
			});
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
			this.anticipatedfreight.temp_weight.splice(index,1);
			this.anticipatedfreight.temp_volume.splice(index,1);
			this.address_list = list;
		},
		
		//点击下单
		orderUse(){
			let self=this;
			var list = self.address_list;
			for (var i in list) {
				if (!list[i].good_name) {
					mui.toast('请输入货物名称！');
					return false;
				}           
			}
			
			self.anticipatedfreight.weight=self.anticipatedfreight.temp_weight.reduce((n,m) => n + m);
			self.anticipatedfreight.volume=self.anticipatedfreight.temp_volume.reduce((n,m) => n + m);
			// self.anticipatedfreight.weight=self.anticipatedfreight.weight*1000;
			let temp_data=JSON.parse(JSON.stringify(self.anticipatedfreight));
			temp_data.gather_address=JSON.stringify(temp_data.gather_address);
			temp_data.send_address=JSON.stringify(temp_data.send_address);
			self.count_price(temp_data);
		},
		
		//调用接口计算预估运费
		count_price:function(temp_data){
			var self = this;
			var data=temp_data;
			var list = self.address_list;
			var datr=JSON.parse(JSON.stringify(data));
			// datr.weight=datr.weight*1000;
			console.log('data的值是：'+JSON.stringify(data));
			// return;
			let datt={};
			request.PostInfo_new(request.linePrice,datr,function(res){
				console.log('/api/line/count_price的返回值是：'+JSON.stringify(res))
				let messagess= '￥'+JSON.stringify(res.data) +'元';
				var btnArray = ['确认','取消'];
				mui.confirm('请确认当前运费？',messagess, btnArray, function(e) {
					if (e.index == 0) {
							//这里调用下单接口
							let upData={};
							upData.order_type    ='line';
							upData.line_id       =self.anticipatedfreight.line_id;
							upData.pick_flag     =self.anticipatedfreight.pick_type;
							upData.send_flag     =self.anticipatedfreight.send_type;
							upData.send_time     =self.send_time;//发货时间
							upData.gather_time   =self.gather_time;//收货时间
							upData.pay_type      ='online';
							// upData.dispatcher    =self.address_list;
							upData.pick_money    =self.pick_price
							upData.price         =res.data;
							upData.send_money    =self.send_price
							upData.total_money   =self.min_money

							let temp_dispatcher=JSON.parse(JSON.stringify(list));
							 // temp_dispatcher.forEach((item)=>{
								// item.good_weight=item.good_weight*1000;
							 // })
							 upData.dispatcher=temp_dispatcher;
							// upData.dispatcher.forEach((item)=>{
							// 	item.good_weight=item.good_weight*1000;
							// })
							
							
							if(upData.pick_flag =='N' && upData.send_flag=='N'){
								upData.good_name=self.address_list[0].good_name;
								upData.good_number=self.address_list[0].good_number;
								// upData.good_weight=self.address_list[0].good_weight*1000;
								upData.good_weight=self.address_list[0].good_weight;
								upData.good_volume=self.address_list[0].good_volume;
								upData.clod=self.address_list[0].clod;
							}else{
								upData.good_name='';
								upData.good_number='';
								upData.good_weight='';
								upData.good_volume='';
								upData.clod='';
							}
						// console.log('upData的值是：'+JSON.stringify(upData));return;
							request.PostInfo_new(request.api_order_addOrder,upData,function(res){
								console.log('接口返回值是：'+JSON.stringify(res));
								mui.toast(res.msg);
								if(res.code==200){
									
									var index=plus.webview.getLaunchWebview();//获得初始窗口
									plus.webview.show(index);//打开初始窗口
									// plusCommon.popToTarget('user_line/line.html',true);
									index.evalJS("changSub(1)"); //改变选项卡点击位置
									// plusCommon.popToTarget('line/line.html',true);
								}
								// setTimeout(()=>{
									// window.history.back();
									// clicked("./line.html");
									
								// },1500)
							},function(res){
								mui.toast(res.msg);
							});
					} else {
						mui.toast("取消订单");
					}
				},"div");

			},function(res){
				console.log('332的是：'+JSON.stringify(res));
			})
			
		},
		

	},

	
})
function listenBack(data) { //常用地址获得选中的返回值
	console.log(JSON.stringify(data));
	indexData.shiQu(data);
};

