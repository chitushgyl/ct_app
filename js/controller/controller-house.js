/**
 * ===========================================
 * 仓库
 * ===========================================
 */
;(function($,house,r){
	/**
	 * 添加仓库
	 */
	house.addWhouse = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.addWhouseURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast('参数错误');
					break;
				case 1001:
					mui.toast('提交成功');
					callback();
					break;
				case 1002:
					mui.toast('提交失败');
					break;
				default:
					openLogin();	
					break;
			}
		});
	}
	/**
	 * 更新仓库
	 */
	house.updatehouse = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.uphouseURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast('参数错误');
					break;
				case 1001:
					mui.toast('提交成功');
					callback();
					break;
				case 1002:
					mui.toast('提交失败');
					break;
				default:
					openLogin();	
					break;
			}
		});
	}
	/**
	 * 删除仓库
	 */
	house.delhouse = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.delhouseURL,data,function(response){
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
				case 1001: // 操作成功
					callback();
					break;
				case 1002: // 暂无数据
					mui.toast(message);
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
	 * 我的仓库列表
	 */
	house.myhouselist = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.myhouseURL,data,function(response){
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
	 * 所有仓库列表
	 */
	house.houselist = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.hourseURL,data,function(response){
			callback(response);
		});
	}
	/**
	 * 仓库详情
	 */
	house.houseDetail = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.hoursedetailURL,data,function(response){
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
				case 1001: // 请求成功
					callback(data);
					break;
				case 1002: // 暂无数据
					mui.toast(message)
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
})(mui,window.house = {},request);
