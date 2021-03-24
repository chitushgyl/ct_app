/**
 * ===========================================
 * 用户账号管理(登陆、注册、修改密码、修改手机号)
 * ===========================================
 */
/**
 * 车辆信息
 */

(function(mui,window,document,order){
	/**
	 * 零担订单抢单
	 **/
	order.bulkAsk = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.bulkAskURl,data,function(response){
			callback(response);
		})
	}
	/**
	 * 整车订单抢单
	 **/
	order.vehicalAsk = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.vehicalAskURL,data,function(response){
			callback(response);
		})
	}
	
	/**
	 * 认证还是未认证
	 **/
	order.isauth = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.isauthURL,data,function(response){
			callback(response);
		})
	}
	/**
	 * 获取公司还是个体
	 **/
	order.iscompany = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.iscompanyURL,data,function(response){
			callback(response);
		})
	}
	/**
	 * 市内配送抢单
	 **/
	order.cityWithAsk = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.cityWithAskURL,data,function(response){
			callback(response);
		});
	}
	/**
	 * 干线抢单
	 **/
	order.lineorderConfirm = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.lineorderConfirmURL,data,function(response){
			// code
			var code = parseInt(response.code);
			// message 
			var message = response.message;
			// data 
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast('参数错误!');
					break;
				case 1001:
					callback();
					break;
				case 1002:
					mui.toast('操作失败!');
					break;
				case 1007:
					openLogin();
					break;
				case 1008:
					openLogin();
				default:	
					break;
			}
		})
	}
	
	
	/**
	 * 整车抢单取消
	 **/
	order.cancelOrder = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.driverCancelOrderURL,data,function(response){
			// code
			var code = parseInt(response.code);
			// message 
			var message = response.message;
			// data 
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast(message);
					break;
				case 1001:
					callback(data);
					break;
				case 1002:
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
		})
	};
	
	/**
	 * 车型列表
	 **/
	order.mode = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.carModelURl,data,function(response){
			// 状态
			var code = parseInt(response.code);
			// 信息
			var message = response.message;
			switch (code){
				case 1000:
					mui.toast('参数错误');
					break;
				case 1001:
					mui.toast('暂无数据');
					break;
				case 1002:
					var data = response.data;
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
		})
	}
	/**
	 * 司机车辆列表
	 **/
	order.list = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.carListURL,data,function(response){
			// 状态
			var code = parseInt(response.code);
			// 信息
			var message = response.message;
			switch (code){
				case 1000: // 参数错误
					mui.toast('参数错误');
					break;
				case 1002: // 暂无数据
					document.getElementById('png').style.display = 'block';
					mui.toast('暂无数据');
					break;
				case 1001: // 查询成功
					var data = response.data;
					callback(data);
					break;
				case 1007: // 非法请求
					openLogin();
					break;
				case 1008: // token已过期，请重新登录
					openLogin();
					break;
				default:
					break;
			}
		})
	}
	
	/**
	 * 司机车辆列表
	 **/
	order.licenceState = function(data,callback){
		callback = callback || mui.noop;
		// request.Post(request.licenceStateURL,data,function(response){
			// // 状态
			// var code = parseInt(response.code);
			// // 信息
			// var message = response.message;
			// var data = response.data;
			// switch (code){
			// 	case 1000: // 参数错误
			// 		// mui.toast('参数错误');
			// 		mui.toast(message);
			// 		break;
			// 	case 1002: // 暂无数据
			// 		// document.getElementById('png').style.display = 'block';
			// 		mui.toast(message);
			// 		break;
			// 	case 1001: // 查询成功
			// 		callback(data);
			// 		break;
			// 	case 1007: // 非法请求
			// 		openLogin();
			// 		break;
			// 	case 1008: // token已过期，请重新登录
			// 		openLogin();
			// 		break;
			// 	default:
			// 		break;
			// }
		// })
	}
	/**
	 * 司机车辆添加
	 **/
	order.add = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.registerURL,data,function(response){
			var code = parseInt(response.code);
			switch (code){
				case 1000:
					mui.toast('参数错误');
					break;
				case 1001:
					mui.toast("验证码不超过4位数！");
					break;
				case 1002:
					mui.toast("验证码不正确！");
					break;
				case 1003:
					mui.toast('验证码已过期！');
					break;
				case 1004:
					mui.toast("两次输入密码不一致！");
					break;
				case 1005:
					mui.toast("注册成功！");
					// 返回上一页
					mui.back();
					break;
				case 1006:
					mui.toast('注册失败！')
					break;
				case 1007:
					mui.toast('用户已存在');
					// 返回上一页
					mui.back();
					break;
				default:
					break;
			}
		});
	}
	/**
	 * 司机车辆删除
	 **/
	order.del = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.carDeleteURl,data,function(response){
			// code
			var code = parseInt(response.code);
			// message 
			var message = response.message;
			// data 
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast('参数错误!');
					break;
				case 1001:
					callback();
					break;
				case 1002:
					mui.toast('删除失败!');
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
		})
	},
	/**
	 * 是否有会员
	 **/
	order.level = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.levelURL,data,function(response){
			// code
			var code = parseInt(response.code);
			// message 
			var message = response.message;
			// data 
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast('message!');
					break;
				case 1001:
					callback(data);
					break;
				case 1002:
					mui.toast('message!');
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
		})
	}
	
	/**
	 * 会员过期时间
	 **/
	order.levelData = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.getLevelURL,data,function(response){
			// code
			var code = parseInt(response.code);
			// message 
			var message = response.message;
			// data 
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast(message);
					break;
				case 1001:
					callback(data);
					break;
				case 1002:
					// mui.toast(message);
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
		})
	};
	
	/**
	 * 验证会员后,获得下一步处理的订单id值
	 **/
	order.vehicalOrderDueId = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.vehicalOrderDueIdURL,data,function(response){
			// code
			var code = parseInt(response.code);
			// message 
			var message = response.message;
			// data 
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast(message);
					break;
				case 1001:
					callback(data);
					break;
				case 1002:
					// mui.toast(message);
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
		})
	};
	
	/**
	 * 会员调用的UpdateStatus,更新状态id;
	 **/
	order.dueUpdateStatus = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.dueUpdateStatusURL,data,function(response){
			// code
			var code = parseInt(response.code);
			// message 
			var message = response.message;
			// data 
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast(message);
					break;
				case 1001:
					callback(data);
					break;
				case 1002:
					// mui.toast(message);
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
		})
	};
	
	
	/**
	 * 会员调用的UpdateStatus,更新状态id;
	 **/
	order.getMemberPrice = function(data,callback){
		callback = callback || mui.noop;
		// request.Post(request.getMemberPriceURL,data,function(response){
		// 	// code
		// 	var code = parseInt(response.code);
		// 	// message 
		// 	var message = response.message;
		// 	// data 
		// 	var data = response.data;
			
		// 	switch (code){
		// 		case 1000:
		// 			mui.toast(message);
		// 			break;
		// 		case 1001:
		// 			callback(data);
		// 			break;
		// 		case 1002:
		// 			break;
		// 		case 1007:
		// 			openLogin();
		// 			break;
		// 		case 1008:
		// 			openLogin();
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// })
	};
	
	/**
	 * 接单前调用查看是否可以接单
	 **/
	order.checkOrderDecide = function(data,callback){
		callback = callback || mui.noop;
		request.Post(request.checkOrderDecideURL,data,function(response){
			// code
			var code = parseInt(response.code);
			// message 
			var message = response.message;
			// data 
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast(message);
					break;
				case 1001:
					callback(data);
					break;
				case 1002:
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
		})
	}
	
}(mui,window,document,window.order = {}));
