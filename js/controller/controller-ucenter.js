/**
 * ===========================================
 * 意见反馈
 * ===========================================
 */
;(function($,ucenter,r){
	/**
	 * 提交
	 */
	ucenter.feedback = function(data,callback){
		callback = callback || mui.noop;
		// 发送验证码
		r.Post(r.feedbackURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast(message);
					break;
				case 1001:
					mui.toast('感谢你的反馈');
					callback();
					break;
				case 1002:
					mui.toast(message);
					break;
				default:
					openLogin();	
					break;
			}
		});
	}
})(mui,window.ucenter = {},request);
