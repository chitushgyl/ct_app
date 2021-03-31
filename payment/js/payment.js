/**
 * =================================
 * storage.js For 赤途App
 * =================================
 * Auther: 李渊
 * description: 支付
 */

//实例化vue
var vm = new Vue({
	el: '#dataList',
	data : {
        title:'支付',
        pay_type:1,
        true_pay:0,
        moto_pay:'',
        del_money:'',
        btn_title:'确认支付',
        data:{},
        total_money:0,
        forms:'',
        set_pay_type:'online',
		order_type:'',
		wxpayChannel:null,
		alipayChannel:null,
		channel:null,
		send_time:null,
		gather_time:null,
		pick_flag:null,
		send_flag:null,
		line_price:null,//客户输入的金额
		kilometre:'',//公里数
		freight:'',//里程运费	
		psPrice:'',//总装卸费
		pick_price:'',//装货费
		send_price:'',//卸货费
		multistorePrice:0,//多点提配费
		more_price:0,
		licheng_Price:0,
		line_send_price:0,
		line_pick_price:0,
		dispatcher:[],
		car_type:null,
	},
	mounted: function(){
		var self = this;
		// 初始化页面 
		mui.plusReady(function(){
			var page = plus.webview.currentWebview();
			console.log("page"+JSON.stringify(page));
			self.order_type=page.data.order_type;
			self.send_time=page.data.send_time;
			self.gather_time=page.data.gather_time;
			self.pick_flag=page.data.pick_flag;
			self.send_flag=page.data.send_flag;
			
			self.line_price=page.data.line_price;//卸货费
			self.send_price=page.data.send_price;//卸货费	
			self.pick_price=page.data.pick_price;//装货费
			self.kilometre=page.data.kilometre;//公里数
			self.freight=page.data.freight;//里程运费	
			self.psPrice=page.data.psPrice;//总装卸费
			self.multistorePrice=page.data.multistorePrice;
			self.more_price=page.data.more_price?page.data.more_price:0;
			self.line_send_price=page.data.line_send_price;
			self.line_pick_price=page.data.line_pick_price;
			// console.log("page:"+JSON.stringify(page));
			self.total_money = page.data.total_money;
			self.forms = page.data.forms
			self.dispatcher=page.data.dispatcher;
			self.car_type=page.data.car_type;
			self.data=page.data;
			// console.log("page.data.total_money:"+page.data.total_money);
			// var from = this.from;
            var order_id = this.order_id;
			
			// 	// 获取支付通道
			plus.payment.getChannels(function(channels) {
				for (var chanel in channels) {
					if(channels[chanel].id == 'alipay'){
						self.alipayChannel = channels[chanel];
					}else if(channels[chanel].id == 'wxpay'){
						self.wxpayChannel = channels[chanel];
					}
				} 
			}, function(e) {  
			  alert("获取支付通道失败：" + e.message);				  
			});
			self.set_price();
		})
		 
	},
	methods:{
    set_price:function(datas){
		var self = this;
        var price = self.total_money;
        var pay_type = self.pay_type;
        var data = self.data;
          var t_price = '';
          var d_price = '';
		  
		  if(datas==3){
			  d_price = 0;
		  }else{
			if (price > 10000) {
			  d_price = 500;
			} else if (price > 5000) {
			  d_price = 200;
			} else if (price > 1000) {
			  d_price = 100;
			} else if (price > 500) {
			  d_price = 50;
			} else if (price > 200) {
			  d_price = 20;
			} else {
			  d_price = 0;
			}  
		  }
		
		switch (self.order_type){
			case "vehicle":
			self.licheng_Price=self.line_price - self.multistorePrice - self.pick_price -self.send_price -d_price
				break;
			case "line":
			self.licheng_Price=self.line_price;
				break;				
		}

		
		
		  
		  
        if (pay_type == 1 || pay_type == 2) {
          t_price = price - 0 - d_price;
          self.set_pay_type = 'online'
		  
          // data.total_money = 0.01
        } else if (pay_type == 3) {
          t_price = price;
          self.set_pay_type = 'offline'
          data.total_money = price
        }
        self.true_pay = t_price;
        self.del_money = d_price;
        data.pay_type = self.set_pay_type;
        // data.total_money = this.true_pay;
        
        self.data = data;
      },
	 click_pay:function(data){
	  this.pay_type = data;
	  this.set_price(data);
	 },
	 onPay:function(){//添加订单
		 var self = this;
		   // 'http://demo.dcloud.net.cn/helloh5/payment/alipay.php?total=0.01'
		   // +'?price='+self.true_pay
		 var ALIPAYSERVER = request.ServerUrl_new+request.appAlipay;
		 var WXPAYSERVER = request.ServerUrl_new+request.wechat;
		 var PAYSERVER = ''; 
		 //  var data={
			// pay_type:self.set_pay_type,
			// total_money:self.total_money,
			// gather_time:self.gather_time,
			// order_type:self.order_type,
			// order_type:self.order_type,
			// pick_flag:self.pick_flag,
			// send_flag:self.send_flag,
			// send_time:self.send_time,
			// dispatcher:self.dispatcher,
			// price:self.total_money,
			// car_type:self.car_type,
		 //  }
		  self.data.price=self.true_pay;
		  self.data.pay_type=self.set_pay_type;
		  self.data.forms=self.forms;
		  // self.data.price=self.total_money;
		  // self.data.price=self.total_money;
		  self.data.order_type=self.order_type;
		  self.data.total_money=self.true_pay;
		  // console.log("self.data传参："+JSON.stringify(self.data));return;
		 if(self.pay_type == 1) {  
			PAYSERVER = ALIPAYSERVER;  
			channel = self.alipayChannel; 
			 self.pay(self.data,PAYSERVER,channel);
		 }else if(self.pay_type == 2){  
			PAYSERVER = WXPAYSERVER;  
			channel = self.wxpayChannel; 
			self.pay(self.data,PAYSERVER,channel);
		 }else if(self.pay_type == 3){

					request.PostInfo_new(request.api_order_addOrder,self.data,function(res){
									 console.log("res:"+JSON.stringify(res));
									 if(res.code==200){
										 var datt={
											 forms:self.forms,
											 order_id:res.order_id,
											 price:self.true_pay,
											 pay_type:self.pay_type,
											 set_pay_type:self.set_pay_type					 
										 }
										 clicked("../payment/pay_success.html",{data:datt});
									 }else{
										 mui.toast(res.msg);
									 }
											 
					},function(res){
					
					}); 
			 
		 }else {  
			plus.nativeUI.alert("不支持此支付通道！", null, "捐赠");  
			 return;  
		 }  

		
		
		 
	},	
	pay:function(datass,PAYSERVER,channel){//支付
		var self = this;
		// data.price=self.total_money;
		// data.pay_type=self.set_pay_type;
		// data.order_type=self.order_type;
		// console.log("支付付款传参"+JSON.stringify(self.data));return;

			//用户
			request.PostInfo_new(request.api_order_addOrder,datass,function(res){
				// alert("订单接口："+JSON.stringify(res));	 
				// alert("channel："+JSON.stringify(channel));
				// alert("PAYSERVER："+PAYSERVER);
			 if(res.code==200){
				 var daty={}
				 daty={
				 	price:self.true_pay,
				 	self_id:res.order_id
				 }
				
				 mui.ajax(PAYSERVER,{
				 			data:daty,
							// dataType:'JSON',//服务器返回json格式数据
				 			type:'POST',//HTTP请求类型
				 			timeout:10000,//超时时间设置为10秒；
							headers:{
								ftoken:localStorage.ftoken,
								// dtoken:localStorage.dtoken
							},
				 			success:function(response){
				 				// console.log(JSON.stringify(response));
				 				plus.nativeUI.closeWaiting();//关闭旋转菊花
									// console.log("channel"+JSON.stringify(channel));
									// console.log( "response"+JSON.stringify(response));
									// alert("channel"+JSON.stringify(channel));
									// alert("response"+JSON.stringify(response));
									// console.log("datass:   "+JSON.stringify(datass));
									// console.log("datt1111111111111111:   "+JSON.stringify(datass));
				 			 // 支付宝或者微信支付		
				 		    		plus.payment.request(channel,response,function(result){
										// console.log("result"result);
				 		    			mui.toast('支付成功');									
											
										var datt2={
											 forms:datass.forms,
											 order_id:res.order_id,
											 price:self.true_pay,
											 pay_type:self.pay_type,
											 set_pay_type:self.set_pay_type
										}
										// console.log("datt222222222222222222222222:   "+JSON.stringify(datt2));
										clicked("../payment/pay_success.html",{data:datt2});
			
				 		            },function(error){
				 		               	mui.toast('你已经取消了支付');
										// alert(JSON.stringify(error));
										// alert(JSON.stringify(channel) JSON.stringify(response) JSON.stringify(result));
				 						// document.getElementById('paymentone').style.display='block';
				 		            });
			
				 			},
				 			error:function(xhr,type,errorThrown){
								
				 				// console.log(JSON.stringify(xhr));
				 				// console.log(JSON.stringify(type));
				 				// console.log(JSON.stringify(errorThrown));
								// alert("xhr"+JSON.stringify(error));
								// alert("type"+JSON.stringify(type));
								// alert("errorThrown"+JSON.stringify(errorThrown));
								
				 				mui.toast('支付失败!');
				 	    		plus.nativeUI.closeWaiting();//关闭旋转菊花
				 			}
				 		});
			
			 }else{
				 mui.toast(res.msg);
			 }
									 
			},function(res){
			
			});

		
		

		
		
	},

	},
	filters:{
		fliterTimeStr: function(value){
			return value.substring(0,10);
		},
	},
	
})

;(function($,window,document,req){
	var _options = {
		yuPaymentURL : req.ServerUrl+req.yuPayURL, // 余额支付接口
		xinPaymentURL : req.ServerUrl+req.balancePayURL, // 信用额度
		alipayPaymentURL: req.ServerUrl+req.app_pay_vehical_alipay, // 支付宝支付接口 整车、零担
		wxPaymentURL: req.ServerUrl+req.app_pay_vehical_wechat, // 微信支付 整车、零担
		alipayPaymentURL_line: req.ServerUrl+req.pay_bulk_alipay, // 支付宝支付接口 干线下单支付
		wxPaymentURL_line: req.ServerUrl+req.pay_bulk_wechat, // 微信支付接口 干线下单支付
		alipayChannel: null, // 支付宝通道
		wxpayChannel: null, // 微信支付通道
	}
	/**
	 * @constructor payment
	 * @description 支付
	 * @param {Number} type 支付类型 1 余额支付 2 支付宝支付 3 微信支付 4 项目客户信用额度支付
	 * @param {Object} data 请求参数 
	 * @example
	 * var payment = new Payment(1,data);
	 * */
	var Payment = window.Payment = function(){}
	/**
	 * @description 获取支付通道
	 */
	Payment.prototype.getChannels = function () {
		plus.payment.getChannels( function(channels){
			for (var chanel in channels) {
		    	if(channels[chanel].id == 'alipay'){
		    		_options.alipayChannel = channels[chanel];
		    	}else if(channels[chanel].id == 'wxpay'){
		    		_options.wxpayChannel = channels[chanel];
		    	}
		    } 
		}, function(e){
			$.toast("获取支付通道列表失败："+e.message);
		});	
	}
	/**
	 * @description 请求
	 * @param {Number} type 支付方式:  1 余额支付 2 支付宝支付 3 微信支付 4 信用额度支付
	 * @param {Object} data 请求参数
	 */
	Payment.prototype.pay = function(type,ordertype,data,fun){
		var self = this;
		var PAYMENTURL = null;
		var chanel = null;
		// console.log(JSON.stringify(ordertype));
		self.callback = fun;
		// plus.nativeUI.showWaiting( "等待支付中..." );
		var from_ = data.from_;
		var type_from = data.type_from;
		if(typeof type != 'number'){
			type = parseInt(type);
		}
		switch (type){
			case 1: // 微信支付
				PAYMENTURL = _options.wxPaymentURL;
				chanel = _options.wxpayChannel;
				break;
			case 2: // 支付宝支付
				PAYMENTURL = _options.alipayPaymentURL;
				chanel = _options.alipayChannel;
				break;

			case 3: // 信用额度支付
				PAYMENTURL = _options.xinPaymentURL;
				break;
			default:
				break;
		}
		console.log(JSON.stringify(data));
		console.log(PAYMENTURL);
		$.ajax(PAYMENTURL,{
			data:data,
//			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(response){
				// console.log(JSON.stringify(response));
				plus.nativeUI.closeWaiting();//关闭旋转菊花
				if(type == 1 || type == 3){ // 余额支付或者信用额度支付
					var code = parseInt(response.code);
					var msg = response.msg;
					switch (code){
						case 400: // 参数错误
							$.toast(msg)
							break;
						case 404:
							$.toast(msg)
							openLogin();
							break;
						case 200:
							// $.toast('支付成功');
							self.callback();
							break;
						default:
							$.toast(msg)
							break;
					}
				}else{ // 支付宝或者微信支付		
		    		plus.payment.request(chanel,response,function(result){
		    			// mui.toast('支付成功');
						if(ordertype==1){    // 区分个人中心的支付还是下单的支付，1是个人中心支付，直接跳转到个人中心列表，刷新页面
							// plusCommon.popToTarget('../fullTruck/vehicleOrder.html', true);
							var list = plus.webview.currentWebview().opener();
							mui.fire(list, 'refresh');	
							mui.back();
						}else{             // 其他的支付，就要跳转到下单成功的页面。
							mui.openWindow({
								url: "../common/ssued_successful.html",
								id: "../common/ssued_successful.html",
								extras:{
									ordertype:ordertype,   // 支付类型，用于跳转下单后列表跳转
									from_:from_,
									type_from:type_from,
									datatopay:localStorage.pay_id
								}
							});
						}
						
		    			// self.callback();
		            },function(error){
		               	mui.toast('你已经取消了支付');
						// document.getElementById('paymentone').style.display='block';
		            });
				}
			},
			error:function(xhr,type,errorThrown){
				console.log(JSON.stringify(xhr));
				console.log(JSON.stringify(type));
				console.log(JSON.stringify(errorThrown));
				mui.toast('支付失败!');
	    		plus.nativeUI.closeWaiting();//关闭旋转菊花
			}
		});
	}

	/**
	 * @description 请求
	 * @param {Number} type 支付方式:  1 余额支付 2 支付宝支付 3 微信支付 4 信用额度支付
	 * @param {Object} data 请求参数
	 */
	Payment.prototype.pay_bulk = function(type,ordertype,data,fun){
		var self = this;
		var PAYMENTURL = null;
		var chanel = null;
		console.log(JSON.stringify(ordertype));
		self.callback = fun;
		plus.nativeUI.showWaiting( "等待支付中..." );
		var from_ = data.from_;
		var type_from = data.type_from;
		if(typeof type != 'number'){
			type = parseInt(type);
		}
		switch (type){
			case 1: // 余额支付
				PAYMENTURL = _options.yuPaymentURL;
				break;
			case 2: // 支付宝支付
				PAYMENTURL = _options.alipayPaymentURL_line;
				chanel = _options.alipayChannel;
				break;
			case 3: // 微信支付
				PAYMENTURL = _options.wxPaymentURL_line;
				chanel = _options.wxpayChannel;
				break;
			case 4: // 信用额度支付
				PAYMENTURL = _options.xinPaymentURL;
				break;
			default:
				break;
		}
		console.log(JSON.stringify(data));
		console.log(PAYMENTURL);
		$.ajax(PAYMENTURL,{
			data:data,
//			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(response){
				// console.log(JSON.stringify(response));
				plus.nativeUI.closeWaiting();//关闭旋转菊花
				if(type == 1 || type == 4){ // 余额支付或者信用额度支付
					var code = parseInt(response.code);
					var msg = response.msg;
					switch (code){
						case 400: // 参数错误
							$.toast(msg)
							break;
						case 404:
							$.toast(msg)
							openLogin();
							break;
						case 200:
							// $.toast('支付成功');
							self.callback();
							break;
						default:
							$.toast(msg)
							break;
					}
				}else{ // 支付宝或者微信支付		
		    		plus.payment.request(chanel,response,function(result){
		    			// mui.toast('支付成功');
						if(ordertype==1){    // 区分个人中心的支付还是下单的支付，1是个人中心支付，直接跳转到个人中心列表，刷新页面
							// plusCommon.popToTarget('../fullTruck/vehicleOrder.html', true);
							var list = plus.webview.currentWebview().opener();
							mui.fire(list, 'refresh');	
							mui.back();
						}else{             // 其他的支付，就要跳转到下单成功的页面。
							mui.openWindow({
								url: "../common/ssued_successful.html",
								id: "../common/ssued_successful.html",
								extras:{
									ordertype:ordertype,   // 支付类型，用于跳转下单后列表跳转
									from_:from_,
									type_from:type_from,
								}
							});
						}
						
		    			// self.callback();
		            },function(error){
		               	mui.toast('你已经取消了支付');
						// document.getElementById('paymentone').style.display='block';
		            });
				}
			},
			error:function(xhr,type,errorThrown){
				console.log(JSON.stringify(xhr));
				console.log(JSON.stringify(type));
				console.log(JSON.stringify(errorThrown));
				mui.toast('支付失败!');
	    		plus.nativeUI.closeWaiting();//关闭旋转菊花
			}
		});
	}
	/**
	 * @description: 初始化
	 */
	Payment.prototype.Init = function(){
		var self = this;
		if(window.plus){
			self.getChannels();
		}else{
			document.addEventListener('plusready', function(){
				self.getChannels();
			}, false);
		}
	}
	
})(mui,window,document,request);
var  payment = new Payment();
payment.Init();

