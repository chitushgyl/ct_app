/**
 * ===========================================
 * 发布货源项目
 * ===========================================
 */
;(function($,source,r){
	/**
	 * 发布数据 提交
	 **/
	source.sourceSubmit = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.sourceSubmitURL,data,function(response){
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
	 * 发布数据 确认
	 **/
	source.sourceConfirm = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.sourceConfirmURL,data,function(response){
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
	 * 发布数据 列表
	 **/
	source.orderList = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.sourceListURL,data,function(response){
			callback(response);
		});
	}
	/**
	 * 发布数据 列表确认/取消
	 **/
	source.orderConfirm = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.orderConfirmURL,data,function(response){
			callback(response);
		});
	}
	/**
	 * 发布数据 列表详情
	 **/
	source.orderDetail = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.sourceDetailURL,data,function(response){
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
	
})(mui,window.source = {},request);


