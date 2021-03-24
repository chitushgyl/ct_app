/**
 * ===========================================
 * 地址
 * ===========================================
 */
;(function($,address,r){
	/**
	 * 发送验证码
	 */
	address.childAddress = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.childAddressURL,data,function(response){
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
				case 1001: // 查询失败
					break;
				case 1002: // 查询成功
					callback(data);
					break;
				default:
					break;
			}
		});
	}
})(mui,window.address = {},request);
