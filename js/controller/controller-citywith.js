/**
 * ===========================================
 * 室内配送
 * ===========================================
 */
;(function($,citywith,r){
	/**
	 * 获取价格
	 */
	citywith.getprice = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.cityGetriceURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000: // 参数错误
					mui.toast(message);
					break;
				case 1001: // 查询成功
					callback(data);
					break;
				case 1002: // 暂无数据
					mui.toast(message);
					break;
				case 1007: 
					openLogin();
					break;
				case 1008: 
					openLogin();
					break;
				default:
					break;
			}
		});
	}
	
	/**
	 * 获取价格与公里数
	 */
	citywith.getciry_count = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.cityCiry_countURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			switch (code){
				case 1000: // 参数错误
					mui.toast(message);
					break;
				case 1001: // 查询成功
					callback(data);
					break;
				case 1002: // 暂无数据
					mui.toast(message);
					break;
				case 1007: 
					openLogin();
					break;
				case 1008: 
					openLogin();
					break;
				default:
					break;
			}
		});
	}
	
	/**
	 *确认订单
	 */
	citywith.citydelivery = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.cityDeliveryURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000: // 参数错误
					console.log(code);
					mui.toast(message);
					break;
				case 1001: // 查询成功
					// console.log(data);
					// console.log(code);
					callback(response);
					break;
				case 1002: // 暂无数据
					mui.toast(message);
					break;
				case 1007: 
					openLogin();
					break;
				case 1008: 
					openLogin();
					break;
				default:
					break;
			}
		});
	}
	
	/**
	 *取消订单
	 */
	citywith.citycance = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.cityCancelURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000: // 参数错误
					console.log(code);
					mui.toast(message);
					break;
				case 1001: // 查询成功
					mui("#popover").popover('hide', document.getElementById("div"));
					location.reload();
					callback(response);
					break;
				case 1002: // 暂无数据
					mui.toast(message);
					break;
				case 1007: 
					openLogin();
					break;
				case 1008: 
					openLogin();
					break;
				default:
					break;
			}
		});
	}
	/**
	 * 提交
	 */
	citywith.citywith = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.cityWithURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000: // 参数错误
					mui.toast(message);
					break;
				case 1001: // 提交成功
					callback(data);
					break;
				case 1002: // 提交失败
					mui.toast('下单失败');
					break;
				case 1007: 
					openLogin();
					break;
				case 1008: 
					openLogin();
					break;
				default:
					break;
			}
		});
	}
	
	/**
	 * 历史订单列表：现在用的
	 */
	citywith.citydeliveryt = function(data,callback,errback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.cityDeliverytURL,data,function(response){
			callback(response);
		},errback);
	}
	/**
	 * 取消订单列表：现在用的
	 */
	citywith.citycanceldelivery = function(data,callback,errback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.cityCanceldeliveryURL,data,function(response){
			callback(response);
		},errback);
	}
	
	/**
	 * 订单列表
	 */
	citywith.orderList = function(data,callback,errback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.cityWithlistURL,data,function(response){
			callback(response);
		},errback);
	}
	/**
	**
	 * 订单详情：现在用的
	 */
	citywith.citydeliveryview = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		// r.Post(r.cityDeliveryviewURL,data,function(response){  cityWithdetailURL    // 727 城配详情，修改为以前接口
		r.Post(r.cityDeliveryviewURL,data,function(response){  
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			// console.log(JSON.stringify(response));
			switch (code){
				case 1000: // 参数错误
					mui.toast(message);
					break;
				case 1001: // 暂无数据
					mui.toast(message);
					break;
				case 1002: // 查询成功
					callback(data);
					break;
				case 1007: 
					openLogin();
					break;
				case 1008: 
					openLogin();
					break;
				default:
					break;
			}
		});
	}
	/**
	 * 订单详情
	 */
	citywith.orderDetail = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.cityWithdetailURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000: // 参数错误
					mui.toast(message);
					break;
				case 1001: // 暂无数据
					mui.toast(message);
					break;
				case 1002: // 查询成功
					callback(data);
					break;
				case 1007: 
					openLogin();
					break;
				case 1008: 
					openLogin();
					break;
				default:
					break;
			}
		});
	}
	/**
	 * 确认送达
	 */
	citywith.confirm = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.cityWithServiceURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000: //参数错误
					mui.toast(message);
					break;
				case 1001: //确认送达成功
					callback();
					break;
				case 1002: //确认送达失败
					mui.toast(message);
					break;
				default:
					openLogin();	
					break;
			}
		});
	}
})(mui,window.citywith = {},request);
