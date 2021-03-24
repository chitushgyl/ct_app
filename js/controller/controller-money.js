/**
 * ===========================================
 * 意见反馈
 * ===========================================
 */
;(function($,money,r){
	/**
	 * 余额
	 */
	money.myMoney = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.PostInfo(r.personal_get_balance,data,function(response){
			var data = response.data; 
			callback(data);
		},function(response){});
	}
	/**
	 * 余额
	 */
	money.aliwithdraw = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.PostInfo(r.personal_withdraw,data,function(response){
			var data = response.data; 
			var msg = response.msg; 
			mui.toast(msg);
			callback(response);
		},function(response){});
	}
	/**
	 * 收支明细
	 */
	money.balanceList = function(data,callback,error){
		callback = callback || mui.noop;
		// 发送验证码
		r.PostInfo(r.personal_balance,data,function(response){
			callback(response);
		},function(response){
			error(response);
		});
	}	 
	/* 提现记录
	 */
	money.withlist = function(data,callback,error){
		callback = callback || mui.noop;
		// 发送验证码
		r.PostInfo(r.personal_withdraw_list,data,function(response){
			callback(response);
		},function(response){
			error(response);
		});
	}
	/**
	 * 交易记录
	 */
	money.fundsList = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.fundsListURL,data,function(response){
			callback(response);
		});
	}
	/**
	 * 优惠券列表
	 */
	money.conponsList = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.conponsListURL,data,function(response){
			// 状态
			var code = parseInt(response.code);
			// 消息
	  		var message = response.message;
			// data
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast(message);
					break;
				case 1001:
					data = [];
					mui.toast("你还没有可供使用的优惠卷");
					callback(data);
					break;
				case 1002:	
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
})(mui,window.money = {},request);
