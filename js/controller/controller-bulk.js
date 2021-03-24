/**
 * ===========================================
 * 冷链整车项目
 * ===========================================
 */
;(function($,bulk,r){
	/**
	 * 已开通起点城市
	 */
	bulk.startCity = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.bulkStartCityURL,data,function(response){
			// 状态码
			var code = parseInt(response.code);
			// 信息
			var message = response.message;
			// 数据
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
				default:
					openLogin();
					break;
			}
		});
	}
	/**
	 * 已开通终点城市
	 */
	bulk.endCity = function(data,callback){
		callback = callback || $.noop();
		r.Post(r.bulkEndCityURL,data,function(response){
			// 状态码
			var code = parseInt(response.code);
			// 信息
			var message = response.message;
			// 数据
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
				default:
					openLogin();
					break;
			}
		})
	}
	/**
	 * 班次列表
	 **/
	bulk.shiftList = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.bulkShiftListURL,data,function(response){
			callback(response);
		});
	}
	/**
	 * 班次详情
	 **/
	bulk.shiftDetail = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.bulkShiftDetailURL,data,function(response){
			// 状态
			var code = parseInt(response.code);
			// 信息
			var message = response.message;
			// data
			var data = response.data;
			
			switch (code){
				case 1000: // 参数错误
					mui.toast(message);
					break;
				case 1001: // 查询成功
					callback(data);
					break;
				default:
					openLogin();
					break;
			}
		});
	}
	/**
	 * 计费
	 **/
	bulk.calculation = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.bulk_count_price,data,function(response){
			var data = response.data;
			callback(data);
		},function(response){});
	}	
	/**
	 * 干线下单
	 **/
	bulk.bulk_order = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.order_bulk_order,data,function(response){
			var data = response.data;
			callback(data);
		},function(response){});
	}
	/**
	 * 数据 提交
	 **/
	bulk.bulkAdd = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.order_bulk_order,data,function(response){
			var data = response.data;
			callback(data);

		});
	}
	/**
	 * 订单列表
	 **/
	bulk.orderList = function(data,callback,error){
		callback = callback || mui.noop;
		r.PostInfo(r.order_bulk_list,data,function(response){
			callback(response);
		},function(response){
			error(response);
		});
	}
	/**
	 * 零担已取消订单列表
	 **/
	bulk.orderCancelList = function(data,callback,error){
		callback = callback || mui.noop;
		r.PostInfo(r.order_bulk_list,data,function(response){
			callback(response);
		},function(response){
			error(response);
		});
	}
	/**
	 * 订单详情
	 **/
	bulk.orderDetail = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.order_bulk_view,data,function(response){
			var data = response.data;
			callback(data);
		},function(response){});
	}
	/**
	 * 物流状态
	 **/
	bulk.orderstatus = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.orderStatusURL,data,function(response){
			// 状态
			var code = parseInt(response.code);
			// 信息
			var message = response.message;
			// data
			var data = response.data;
			
			callback(data);
		});
	}
	/**
	 * 班次发飙品论
	 **/
	bulk.addgrade = function(data,callback,errback){
		callback = callback || mui.noop;
		r.Post(r.addgradeURL,data,function(response){
			// 状态
			var code = parseInt(response.code);
			// 消息
			var message = response.message;
			// 数据
			var data = response.data;
			switch(code){
				case 1000: // 参数错误
					mui.toast(message);
					break;
				case 1001: // 添加成功
					mui.toast(message);
					callback();
					break;
				case 1002: // 添加失败
					mui.toast(message);
					break;
				default:
					openLogin();
					break;
			}
		},errback);
	}
	/**
	 * 班次评论列表
	 **/
	bulk.gradelist = function(data,callback,errback){
		callback = callback || mui.noop;
		r.Post(r.gradelistURL,data,function(response){
			callback(response);
		},errback);
	}
	/**
	 * 固定班次列表
	 **/
	bulk.fixedShift = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.fixedShiftListURL,data,function(response){
			// 状态
			var code = parseInt(response.code);
			// 信息
			var message = response.message;
			// data
			var data = response.data;
			
			switch (code){
				case 1000: // 参数错误
					mui.toast(message);
					break;
				case 1001: // 查询成功
					mui.toast(message);
				case 1002: // 暂无数据
					callback(data);
					break;
				case 1003: // 城市信息不存在
					mui.toast(message);
					break;
				default:
					openLogin();	
					break;
			}
		});
	}
	
	/**
	 * 获取到充值金额以及单票支付价格
	 **/
	
	bulk.vehicalPrice = function(data, callback) {
		callback = callback || mui.noop;
		r.Post(r.vehicalPriceURL, data, function(response) {
			var code = parseInt(response.code);
			var message = response.message;
			var data = response.data;
			switch (code) {
				case 1000: //参数错误
					mui.toast(message);
					break;
				case 1001: // 请求成功
					callback(data);
					break;
				case 1007: // 非法请求
					openLogin();
					break;
				case 1008: // 重新登陆
					openLogin();
					break;
				default:
					break;
			}
		});
	}
	
	
	
	/**
	 * 专车数据 提交
	 **/
	bulk.fixedAdd = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.fixedAddURL,data,function(response){
			// 状态
			var code = parseInt(response.code);
			// 信息
			var message = response.message;
			// data
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast(message);
					break;
				case 1001:
					callback(data);
					break
				case 1002:
					mui.toast(message);
					break;
				default:
					openLogin();
					break;
			}
		});
	}
	
	
	 /**
	 * 获取默认地址
	 */
	bulk.getAddresses = function(data, callback) {
		callback = callback || mui.noop;
		r.Post(r.postAddressURL,data, function(response) {
			var code = parseInt(response.code);
			var message = response.message;
			var data = response.data;
			// console.log(JSON.stringify(data));
			switch (code) {
				case 1000: //参数错误
					mui.toast(message);
					break;
				case 1001: // 请求成功
					callback(data);
					break;
				case 1002: // 暂无数据
					callback(data);
					break;
				default:
					break;
			}
		});
	}
	
	
	/**
	 * 评论 提交
	 **/
	bulk.viewPostUrl = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.viewPostUrl,data,function(response){
			// 状态
			// console.log(JSON.stringify(response));
			var code = parseInt(response.code);
			// 信息
			var message = response.message;
			// data
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast(message);
					break;
				case 1001:   // 添加成功
					callback(response);
					break;
				case 1002:
					mui.toast(message);
					break;
				case 1007:
					mui.toast("token错误重新登录");
					openLogin();
					break;
				default:
					openLogin();
					break;
			}
		});
	}
	
	
	/**
	 * 获得评论列表
	 **/
	bulk.getViewUrl = function(data,callback,errback){
		callback = callback || mui.noop;
		r.Post(r.getViewUrl,data,function(response){
			callback(response);
		},errback);
	}
	
	/**
	 * 追加评论
	 **/
	bulk.discussPostUrl = function(data,callback,errback){
		callback = callback || mui.noop;
		r.Post(r.discussPostUrl,data,function(response){
			callback(response);
		},errback);
	}
	
	/**
	 * 获得评论模块
	 **/
	bulk.getMarkUrl = function(data,callback,errback){
		callback = callback || mui.noop;
		r.Post(r.getMarkUrl,data,function(response){
			callback(response);
		},errback);
	}
	/**
	 * 获得评论信息  零担线路
	 **/
	bulk.getAllviewUrl = function(data,callback,errback){
		callback = callback || mui.noop;
		r.Post(r.getAllviewUrl,data,function(response){
			callback(response);
		},errback);
	}
	
	/**
	 * 获得评论列表  个人中心
	 **/
	bulk.getViewsUrl = function(data,callback,errback){
		callback = callback || mui.noop;
		r.Post(r.getViewsUrl,data,function(response){
			callback(response);
		},errback);
	}
	
	
})(mui,window.bulk = {},request);


