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
var vm = new Vue({
	el: '#template',
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
		img:[],
		vehicleList:[],
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
			// console.log(JSON.stringify(data));
			request.PostInfo_new(request.api_take_details,data,function(res){
				// console.log(JSON.stringify(res.data.info));
				var data = res.data.info;
				self.list = self.list.concat(data);
				// console.log(JSON.stringify(self.list))
				console.log(JSON.stringify(data))
				self.detailData = data;
				self.lineList=data.tms_order_dispatch;
				if (self.detailData.order_type == 'vehicle') {
					self.vehicleList = data.info;
				}
				if(self.detailData.order_type == 'line'){
					self.addressList = data;
					console.log(JSON.stringify(self.addressList))
				}
				self.img = data.receipt;
				if(self.img){
					for(var i=0;i<self.img.length;i++){
						self.imgUrl=self.img[i].url;
						console.log(self.imgUrl)
					}					
				}
				// console.log( JSON.stringify(self.img))
				// self.addressList = data.info;
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
	},
});


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