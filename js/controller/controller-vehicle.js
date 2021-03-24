/**
 * ===========================================
 * 冷链整车项目
 * ===========================================
 */
;
(function($, vehicle, r) {
	// 用车 整车 预估公里 、价格
	vehicle.countKilo = function(data, callback){
		callback = callback || mui.noop;
		r.PostInfo(r.order_count_kilo,data,function(response){
			callback(response);
		},function(response){});
	}
	// 用车第二页 整车 预估公里 、价格
	vehicle.countPrice = function(data, callback){
		callback = callback || mui.noop;
		r.PostInfo(r.order_count_price,data,function(response){
			callback(response);
		},function(response){});
	}

	//订单取消
	vehicle.vehicalCance = function(data, callback) {
		callback = callback || mui.noop;
		r.PostInfo(r.order_cancel_order, data, function(response) {
			mui.toast(response.msg);
			callback(response);
			mui("#popover").popover('hide', document.getElementById("div"));
		},function(response){
			
		});
	}
	/**
	 * 提交   整车  零担
	 */
	vehicle.vehicalPost = function(data, callback) {
		callback = callback || $.noop();
		r.PostInfo(r.order_add_order, data, function(response) {
			var data = response.data;
			callback(response);
		})
	}

	/**
	 * 整车历史订单列表
	 **/
	vehicle.orderList = function(data, callback) {
		callback = callback || mui.noop;
		r.PostInfo(r.order_order_list, data, function(response) {
			callback(response);
		}, function(response){});
	}

	/**
	 * 整车取消订单列表
	 **/
	vehicle.cancelList = function(data, callback) {
		callback = callback || mui.noop;
		r.PostInfo(r.order_order_list, data, function(response) {
			callback(response);
		}, function(response){});
	}

	/**
	 * 整车订单详情
	 **/
	vehicle.orderDetail = function(data, callback) {
		callback = callback || mui.noop;
		r.PostInfo(r.order_order_view, data, function(response) {
			var data = response.data;
			callback(data);
		},function(response){});
	}
	
	/**
	 * 获取支付内容
	 **/
	vehicle.PriceGetcontent = function(data, callback) {
		callback = callback || mui.noop;
		r.PostInfo(r.car_view_app, data, function(response) {
			var code = parseInt(response.code);
			// message
			var message = response.message;
			// data
			var data = response.data;
			callback(data);
		},function(response){
			
		});
	}
     /**
	 * 获取默认地址
	 */
	vehicle.getAddresses = function(data, callback) {
		callback = callback || mui.noop;

	}
})(mui, window.vehicle = {}, request);
