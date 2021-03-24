/**
 * ===========================================
 * 冷链整车项目
 * ===========================================
 */
;(function($,dedicat,r){
	/**
	 * 固定班次列表
	 **/
	dedicat.fixedShift = function(data,callback){
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
				case 1001: // 非定制用户
					callback(false);
				case 1002: // 暂无数据
					callback(data);
					break;
					break;
				default:
					openLogin();	
					break;
			}
		});
	}
	/**
	 * 专车数据 提交
	 **/
	dedicat.fixedAdd = function(data,callback){
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
	 * 专车数据 确认信息提交
	 **/
	dedicat.fixedConfirm = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.fixedConfirmURL,data,function(response){
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
					plus.webview.currentWebview().opener().close();
					setTimeout(function(){
						plus.webview.currentWebview().close();	
					},100)
					
					break
				case 1002:
					callback();
					break;
				default:
					openLogin();
					break;
			}
		});
	}
	/**
	 * 专车数据 列表
	 **/
	dedicat.fixedList = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.fixedListURL,data,function(response){
			callback(response);
		});
	}
	/**
	 * 订单确定完成
	 **/
	dedicat.confirm = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.fixedtrueUEL,data,function(response){
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
					callback();
					break
				case 1002:
					callback();
					break;
				default:
					openLogin();
					break;
			}
		});
	}
	/**
	 * 专车数据 列表详情
	 **/
	dedicat.fixedDetail = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.fixedDetailURL,data,function(response){
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
					mui.toast(message);
					break
				case 1002:
					callback(data);
					break;
				default:
					openLogin();
					break;
			}
		});
	}
	
})(mui,window.dedicat = {},request);


