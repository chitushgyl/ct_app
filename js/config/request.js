/**!
 * ============================================
 * request.js For 赤途平台端
 * ============================================
 * Auther: pysh
 * description: 赤途平台端的所有请求接口封装
 */
;(function($, request){
	
	var request = window.request = {		

		ServerUrl_new  			: 'http://api.56cold.com/index.php', 	// 测试
		//-------------------------------- 最新APP接口----------------------------------------		
		get_city:'/api/address/get_city',//获取地址
		message_send : '/message/send',//获取验证码
		login_tel_login : '/login/tel_login',//手机 验证码登陆
		account_login:'/login/account_login',//手机 密码登陆
		user_foot : '/user/foot',//底部栏
		user_owm : '/user/owm',//我的 数据
		update_password: '/user/update_pwd',//修改密码 
		
		// 角色列表
		user_binding_page : '/user/binding_page',//角色列表
		user_switchover : '/user/switchover',//切换角色
		user_add_binding : '/user/add_binding',//绑定角色
		user_delete : '/user/del_binding',//删除角色
		get_identity:'/user/get_identity',//获取角色类型


		// 订单 - 用户
		api_order_orderPage : '/api/order/orderPage',//订单列表
		api_order_order_done :'/api/order/order_done',//确认完成
		api_order_createOrder : '/api/order/createOrder',//添加订单
		api_order_addOrder : '/api/order/addOrder',//添加订单
		api_order_details : '/api/order/details',//订单详情
		api_order_order_cancel: '/api/order/order_cancel',//取消订单

		// 订单

		tms_order_orderPage : '/tms/order/orderPage',//订单列表
		tms_order_createOrder : '/tms/order/createOrder',//添加订单
		tms_order_addOrder : '/tms/order/addOrder',//添加订单
		tms_order_details : '/tms/order/details',//订单详情
		tms_order_orderDone:'/tms/order/orderDone',//确认完成
		tms_dispatch_createDispatch : '/tms/dispatch/createDispatch',
		tms_take_orderPage : '/api/take/orderPage',
		tms_take_details : '/api/take/details',
		
		//3pl接单
		tms_order_orderCancel:'/tms/order/orderCancel',
		tms_dispatch_dispatchCancel:'/tms/dispatch/dispatchCancel',//取消调度
		tms_carriage_dispatch:'/tms/dispatch/carriageDone',//确认送达
		
		//3pl接单
		tms_online_orderCancel:'/tms/online/orderCancel',
		tms_dispatch_addDispatch:'/tms/dispatch/addDispatch',//调度
		tms_dispatch_dispatchCancel:'/tms/dispatch/dispatchCancel',//取消调度
		tms_carriage_dispatch:'/tms/dispatch/carriageDone',//确认送达
		tms_dispatch_details:'/tms/dispatch/details',//接单详情
		tms_dispatch_uploadReceipt:'/tms/dispatch/uploadReceipt',//上传回单
		
		//承运商接单
		api_carriage_dispatch:'/api/carriage/dispatch_done',//确认完成
		api_carriage_up_receipt:'/api/carriage/up_receipt',//上传回单
		api_carriage_carriageTake:'/api/carriage/carriageTake',//接单
		api_carriage_OrderPage:'/api/carriage/carriageOrderPage',
		api_carriage_details:'/api/carriage/details',
		
		//用户接单
		tms_dispatch_createDispatch : '/tms/dispatch/createDispatch',
		api_take_order_cancel:'/api/take/order_cancel',//取消接单
		api_take_carriage_done :'/api/take/carriage_done',//确认完成
		api_take_dispatch_order:'/api/take/dispatch_order',//调度
		api_take_orderPage : '/api/take/orderPage',//接单列表
		api_take_details : '/api/take/details',//订单详情
		api_take_upload:'/api/take/upload_receipt',//上传回单
		
		// 车辆类型 - 用户
		api_car_getType : '/api/car/getType',//车型列表

		//司机订单
		api_driver_orderPage: '/api/driver/driverOrderPage',
		api_driver_orderDone:'/api/driver/orderDone',
		api_driver_upload_receipt:'/api/driver/upload_receipt',
		api_driver_details:'/api/driver/details',
		


		// 车辆类型 - 用户
		getType : '/api/car/getType',//车型列表
		
		//获取温度 线路 提货类型 
		createOrder:'/api/order/createOrder',
		//温度类型

		//承运商
		tms_group_groupPage :'/tms/group/groupPage',

		
		// 承运商/业务公司 - 3PL
		tms_group_groupPage : '/tms/group/groupPage',//业务公司列表
		tms_group_createGroup : '/tms/group/createGroup',//业务公司添加
		tms_group_addgroup : '/tms/group/addGroup',//业务公司添加
		tms_group_groupDelFlag : '/tms/group/groupDelFlag',//业务公司删除



		//车辆 -用户
		api_car_carPage : '/api/car/carPage',//车辆列表
		api_car_creatCar: '/api/car/createCar',//车辆添加
		api_car_addCar:'/api/car/addCar',//车辆添加
		api_car_carDelFlag : '/api/car/carDelFlag',//车辆删除


		// 车辆 - 3PL
		tms_car_carPage : '/tms/car/carPage',//车辆列表		
		tms_car_createCar : '/tms/car/createCar',//车辆添加
		tms_car_addCar : '/tms/car/addCar',//车辆添加
		tms_car_carDelFlag : '/tms/car/carDelFlag',//车辆删除

		// 线路发布 - 3PL
		tms_line_linePage : '/tms/line/linePage',//线路列表
		tms_line_createLine : '/tms/line/createLine',//线路添加
		tms_line_addLine : '/tms/line/addLine',//线路添加
		tms_line_lineDelFlag : '/tms/line/lineDelFlag',//线路删除

		// 地址-联系人 -3pl
		tms_address_addressPage : '/tms/address/addressPage',//列表
		tms_address_createAddress : '/tms/address/createAddress',//添加
		tms_address_addAddress : '/tms/address/addAddress',//添加
		tms_address_addressDelFlag : '/tms/address/addressDelFlag',//删除

		// 地址-联系人 -用户端
		api_address_addressPage : '/api/address/addressPage',//列表
		api_address_createAddress : '/api/address/createAddress',//添加
		api_address_addAddress : '/api/address/addAddress',//添加
		api_address_addressDelFlag : '/api/address/addressDelFlag',//删除
		
		//计算线路价格
		count_price:'/api/order/count_price',//整车预估费用
		linePrice:'/api/line/count_price',//零担预估费用
		
		
		
		//3PL_客户端_零担
		lineList:'/api/line/lineList',//线路列表
		
		//用户端 
		linePage:'/api/line/linePage',//用户零担列表
		line_details:'/api/line/details',//零担线路详情
		
		
		//线上接单
		onlinePage:'/api/take/onlinePage',//接单列表
		on_line_details:'/api/take/details',//接单列表详情
		addTake:'/api/take/addTake',//user用户接单
		online_addOrder:'/tms/online/addOrder',//TMS3pl用户接单
		
		company_companyPage : '/company/company/companyPage',//公司列表
		type_getType : '/tms/type/getType',//公司列表

		
		//银行卡
		accountPage:'/api/wallet/accountPage',//银行卡列表
		createAccount:'/api/wallet/createAccount',//银行卡编辑
		accountAdd:'/api/wallet/accountAdd',//银行卡提交
		//钱包
		wallet_info:'/api/wallet/wallet_info',//资金列表
		getAccount:'/api/wallet/getAccount',//获取默认提现银行卡
		withdraw_money:'/api/wallet/withdraw_money',//提现接口
		
		//支付
		// addOrder_3pl:'/tms/order/addOrder',//3pl 货到付款下单
		
		wechat:'/alipay/appWechat',//微信支付
		appAlipay:'/alipay/appAlipay',//支付宝支付
		
		//上传图片接口
		  upload_img:'/up/upload_img',
		
		
		ftoken:localStorage.ftoken,
		dtoken:localStorage.dtoken,
		project_type:localStorage.project_type ? localStorage.project_type : 'user',
		// project_type:'',

		//新app请求接口
		PostInfo_new : function(url, data, successcallback,failcallback) {
			var URL = this.ServerUrl_new+url;
			console.log(URL);
			console.log(JSON.stringify(data));
			var that = this;
			console.log(that.project_type);
			console.log(that.ftoken);
			console.log(that.dtoken);

			mui.plusReady(function() {
				plus.nativeUI.showWaiting();
				$.ajax(URL,{
					data:data,
					dataType:'JSON',//服务器返回json格式数据
					type:'POST',//HTTP请求类型
					timeout:30000,//超时时间设置为30秒；
					headers:{
						projectType:localStorage.project_type,
						ftoken:localStorage.ftoken,
						dtoken:localStorage.dtoken
					},
					success:function(response){
						// console.log(response);、
						console.log("response:"+JSON.stringify(response));
						var res_json = JSON.parse(response);
						var code = res_json.code;
						var msg = res_json.msg;
						plus.nativeUI.closeWaiting();
						if (code == 200 || code == 201 || code == 202 ) {
						// if (code! == 401) {
							successcallback(res_json);
						}else {
							$.toast(msg);
							failcallback(res_json);
							if (code == 401) {
								openLogin();
							}
						}
					},
					
					error:function(xhr,type,errorThrown){
						console.log("xhr:"+JSON.stringify(xhr));
						console.log("type:"+JSON.stringify(type));
						console.log("errorThrown:"+JSON.stringify(errorThrown));
						plus.nativeUI.closeWaiting();
			        	if(type == 'timeout'){
			        		$.toast("网络超时..,请连接无线网络!");	
			        	}else{
			        		$.toast("连接服务器出错...");
			        	}
					}
				});
			});
		},	
		set_time_out:function(url){//同一个接口 一秒内只能请求一次
			var timestamp=new Date().getTime();
			var time_out_time = localStorage.time_out_time ? localStorage.time_out_time : 0;
			var time_out_url = localStorage.time_out_url ? localStorage.time_out_url : '';
			var get_sec = timestamp - time_out_time;
			if (get_sec < 1000 && url == time_out_url) {
				return false;
			} else {
				localStorage.time_out_time = timestamp;
				localStorage.time_out_url = url;
				return true;
			}
		},	

		to_login:function(){
			var token =localStorage.ftoken;
			if (!token) {
				openLogin();
				return false;
			} else {
				return true;
			}
		},
		numberTwoDecimals : function (obj){
	        obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
	        obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
	        obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
	        obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
	    },	
		checkEmail:function(obj){//邮箱验证
	        if((/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(obj))){
	            return false;
	        } else {
	            return '邮箱格式错误！';
	        }
	    },
	    check_str : function (str){
	    	var re = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);    
		    if (re.test(str)){  
		        return true;  
		    }else{  
		   		return false;  
		    }  
	    },
	    checkMobile:function(obj){
	        if((/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(obj))){
	            return false;
	        } else {
	            return '手机号格式错误！';
	        }
	    },
	    clear_str_null:function(str){//去除字符串空格
	    	var new_str = str.replace(/\s*/g,"");
	    	return new_str;
	    },
	    checkCarNumber:function(obj){//车牌号验证
	        if((/[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新使]{1}[A-Z]{1}[0-9a-zA-Z]{5,6}$/.test(obj))){
	            return false;
	        } else {
	            return '车牌号格式错误！';
	        }
	    },
	    click_one_second:function(time){//设置缓存时间
			var timestamp = new Date().getTime();
			var time_out_time = localStorage.click_out_time_second ? localStorage.click_out_time_second : 0;
			var get_time = timestamp - time_out_time;
			if (get_time < time) {
				return false;
			} else {
				localStorage.click_out_time_second = timestamp;
				return true;
			}
		}
	}
})(mui,window);

