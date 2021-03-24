//二维码页面
var payment = null;
/**
 * @description：预加二维码页面
 */	
function paymentWei(){
	payment = mui.preload({
        url: "weipayment.html",
        id: "weipayment.html", //默认使用当前页面的url作为id
        styles: {}, //窗口参数
        extras: {
            idd: ""
        } //自定义扩展参数
    });
}
var vm1 =new Vue({
	el:'#header',
	data:{
		id: null,
		ordernumber:null,
		paystate:null
	},
	mounted: function(){
		mui.plusReady(function(){
		// 预加载详情页面
		setTimeout(function(){
			// paymentWei();
		},200);
	})
	},
	methods:{
		weipayment:function(){
			var self = this;
			var id = self.id;
			var paystate = self.paystate;
			var ordernumber = self.ordernumber;
			if(paystate!=2){
				if(payment == null) {
			        payment = plus.webview.getWebviewById("weipayment.html");
			   	}
			    mui.fire(payment,'send',{
			        targetId: id,
			        targetOrder:ordernumber,
			        
			    });
			    payment.show("slide-in-right",300);
			}else{
				mui.toast('已支付');
				return false;
			}

		},
	}
})
var oid = null;
var vm = new Vue({
	el: '#orderDetail',
	data: {
		self_id: null,
		detailData:{},
		receipts: [],
		url:null,
		ordernumber:null,
		startstr:[],
		endstr:[],
		receipt:[],
		driverinfo:[],
		addressList:[],
		receipt_len:0,
		url:request.ServerUrl,
		from_:'',
		type:1,
		succe:'',
		type_from:'',
		list:[],
		lineList_goods:[],
		lineList:[],
	},
	mounted: function(){
		var self = this;
		mui.init({
			beforeback: function() {　　　

            }
		});
	},
	created:function(){
		var self = this;
		mui.init();
		// mui.previewImage();
		// self.serverURL = request.ServerUrl
		mui.plusReady(function() {
			var ws = plus.webview.currentWebview();
			self.self_id = ws.self_id
			console.log(self.self_id);
		})
	},
	methods: {
		getDetail: function(){
			var self = this;
			var data = {
				self_id: self.self_id
			};
			console.log(JSON.stringify(data))
			console.log(JSON.stringify(data));
			request.PostInfo_new(request.tms_order_details,data,function(res){
				// console.log(JSON.stringify(res.data.info));
				var data = res.data.info;
				self.list = self.list.concat(data);
				// console.log(JSON.stringify(self.list))
				console.log(JSON.stringify(data))
				self.detailData = data;
				self.lineList=data.tms_order_dispatch;
				for(var i=0;i<data.tms_order_dispatch.length;i++){
					self.lineList_goods=data.tms_order_dispatch[i].good_info;
				}
				if (self.detailData.order_type == 'vehicle') {
				             self.addressList = data.info;
				  }else{
					  self.addressList = [{
					  gather_address: self.detailData.line_gather_address,
					  gather_address_id: self.detailData.line_gather_address_id,
					  gather_address_latitude: self.detailData.line_gather_address_latitude,
					  gather_address_longitude: self.detailData.line_gather_address_longitude,
					  gather_contacts_id: self.detailData.line_gather_contacts_id,
					  gather_name: self.detailData.line_gather_name,
					  gather_qu: self.detailData.line_gather_qu,
					  gather_qu_name: self.detailData.line_gather_qu_name,
					  gather_sheng: self.detailData.line_gather_sheng,
					  gather_sheng_name: self.detailData.line_gather_sheng_name,
					  gather_shi: self.detailData.line_gather_shi,
					  gather_shi_name: self.detailData.line_gather_shi_name,
					  gather_tel: self.detailData.line_gather_tel,
					  send_address: self.detailData.line_send_address,
					  send_address_id: self.detailData.line_send_address_id,
					  send_address_latitude: self.detailData.line_send_address_latitude,
					  send_address_longitude: self.detailData.line_send_address_longitude,
					  send_contacts_id: self.detailData.line_send_contacts_id,
					  send_name: self.detailData.line_send_name,
					  send_qu: self.detailData.line_send_qu,
					  send_qu_name: self.detailData.line_send_qu_name,
					  send_sheng: self.detailData.line_send_sheng,
					  send_sheng_name: self.detailData.line_send_sheng_name,
					  send_shi: self.detailData.line_send_shi,
					  send_shi_name: self.detailData.line_send_shi_name,
					  send_tel: self.detailData.line_send_tel,
					  clod: "",
					  clod_name: self.detailData.temperture,
					  good_name: self.detailData.good_info[0].good_name,
					  good_number: self.detailData.good_number,
					  good_volume: self.detailData.good_volume,
					  good_weight: self.detailData.good_weight,
					  }]
			}
				if (self.receipt) {
					self.receipt_len = self.receipt.length;
					if (self.receipt_len > 0) {
						for (var i in self.receipt) {
							self.receipt[i] = self.url + self.receipt[i];
						}
					}
				}
				$('.mui-content').show();
		
			},function(response){});
		},
		
		dis_order: function(index){  //调度
			var self = this;
			var uoid = self.detailData.id;
			var order_type = self.detailData.order_type;
			var startstr = self.detailData.startstr;
			var endstr = self.detailData.endstr;
			var btnArray = ['专车','零担', '取消'];

			if (self.type == 1) {
				var from_url = '../driver/mycenter/carOrder.html';
			} else if (self.type == 2) {
				var from_url = '../driver/mycenter/carOrder_line.html';
			}

			if (self.type == 1 || self.type == 2) {
				mui.confirm('调度该订单为专车、零担运输？', '调度订单', btnArray, function(e) {
					if (e.index == 0) {
						mui.openWindow({
						    url:'../../dis/driver.html',
						    id:'../../dis/driver.html',
						    styles:{
						      
						    },
						    extras:{
						      oid:uoid,
						      startstr:startstr,
						      endstr:endstr,
						      order_type:order_type,
						      list:self.detailData,
						      from_url:from_url
						    },
						    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
						    show:{
						      autoShow:true,//页面loaded事件发生后自动显示，默认为true
						    },
						    waiting:{
						      autoShow:true,//自动显示等待框，默认为true
						      title:'正在加载...',//等待对话框上显示的提示内容
						      options:{
						        
						      }
						    }
						})
					} else if(e.index == 1)  {
						mui.openWindow({
						    url:'../../dis/driver_bulk.html',
						    id:'../../dis/driver_bulk.html',
						    styles:{
						      
						    },
						    extras:{
						      oid:uoid,
						      startstr:startstr,
						      endstr:endstr,
						      order_type:order_type,
						      list:self.detailData,
						      from_url:from_url
						    },
						    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
						    show:{
						      autoShow:true,//页面loaded事件发生后自动显示，默认为true
						    },
						    waiting:{
						      autoShow:true,//自动显示等待框，默认为true
						      title:'正在加载...',//等待对话框上显示的提示内容
						      options:{
						        
						      }
						    }
						})
					} else {

					}
				},"div");
			} else if(self.type == 3) {
				mui.openWindow({
				    url:'../../dis/driver_city.html',
				    id:'../../dis/driver_city.html',
				    styles:{},
				    extras:{
				      oid:uoid,
				      startstr:startstr,
				      endstr:endstr,
				      order_type:order_type,
				      list:self.detailData
				    },
				    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
				    show:{
				      autoShow:true,//页面loaded事件发生后自动显示，默认为true
				    },
				    waiting:{
				      autoShow:true,//自动显示等待框，默认为true
				      title:'正在加载...',//等待对话框上显示的提示内容
				      options:{
				        
				      }
				    }
				})
			}
		},

		toMap: function(val){ // 获取目的地位置 并进行导航
			var map = new plusMap();
			map.getlocation('',function(src){ // 获取自身位置
				map.geocode(val,'',function(dst){
					map.openSysMap(dst,des,src);
				},function(){
					mui.toast('你的地址有误不能为你规划路线!');
				})
			})
		},
		toadial:function(){ // 拨打电话
			var self = this;
			var value = self.detailData.phone;
			plus.device.dial(value, false );
		},
	},
	filters:{
		fliterAddress: function(str){
			var patt1 = /[[^0-9]+/ig;			
			if(str.match(patt1)){
				return str.replace(patt1,'***');
			}else{
				return str;
			}
		},
		fuliterLength:function(value){
			console.log(value.length);
			if(value.length>4){
				return value.substr(0,4)+"...";
			}else{
				return value;
			}
		},
		ispick: function(value){
			if(value == 2){
				return "客户装货";
			}else{
				return "司机装货";
			}
		},
		issend: function(value){
			if(value == 2){
				return "客户卸货";
			}else{
				return "司机卸货";
			}
		},		

		ispick_bulk: function(value){
			if(value == 2){
				return "自送到点";
			}else{
				return "上门提货";
			}
		},
		issend_bulk: function(value){
			if(value == 2){
				return "到点自提";
			}else{
				return "送货上门";
			}
		},
		change_weight:function(value){
			return value/1000;
		},
		// set_weight:function(val,e){
		//         if (e == 'vehicle'){
		//           return val/1000 + ' 吨';
		//         } else {
		//           return val + ' kg';
		//         }
		//       }
	},
});

// $(document).on('click','.mui-action-back',function(){
// 	localStorage.is_now_action = 1;
// 	plus.webview.getWebviewById('person/index-menu.html').reload();
// 	if (vm.succe) {
// 		plusCommon.popToTarget(vm.type_from, true);
// 	} else {
// 		if (vm.from_) {
// 			mui.plusReady(function() {
// 				plusCommon.popToTarget(vm.from_, true);
// 			});
// 		}
// 	}
// });

mui.plusReady(function() {
	var selfPage = plus.webview.currentWebview();
	var id = selfPage.targetId;
	var from_ = selfPage.from_;
	var type = selfPage.type;
	var type_from = selfPage.type_from;
	var succe = selfPage.succe;
	vm.type = type;
	vm.type_from = type_from;
	vm.from_ = from_;
	vm.succe = succe;
	vm1.id = id;
	vm.id = id;
	vm.getDetail();
});