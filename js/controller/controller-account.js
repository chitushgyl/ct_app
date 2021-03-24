/**
 * ===========================================
 * 用户账号管理(登陆、注册、修改密码、修改手机号)
 * ===========================================
 */
;(function($,account,r){
	account.Inter = ''; // 计时器
	account.t = 60; // 计时器时间
	/**
	 * 发送验证码
	 */
	account.sendCode = function(phone,codeEle,data,callback){
		callback = callback || mui.noop;
		var isCode = codeEle.getAttribute('data-isCode'); //发送状态 false 正在发送中 true 可以发送 
		var InItCode = function (){ // 初始化验证码
			clearInterval(account.Inter);
			codeEle.setAttribute('data-isCode','true'); // 可发送状态
			codeEle.innerText = '重新获取'; // 重新获取
			codeEle.classList.add("btnactive"); // 可发送状态，添加css样式

			account.t = 60; // 倒计时初始化
		}
		
		// 判断是否有手机好
		if(!phone || phone.length<11){ 
			mui.toast('请输入正确手机号');
			return false;
		}
		
		// 判断是否可发送验证吗
		if(isCode == 'false'){ 
			mui.toast('验证码已发送，请勿重新获取',{ duration:'short', type:'div' }); 
			return false;
		}
		
		// 倒计时状态改变
		account.Inter = setInterval(function(){
			if(account.t>0){
				codeEle.setAttribute('data-isCode','false');
				codeEle.innerText = account.t+'秒后重新获取';
				account.t--;
			}else{
				InItCode();
			}
		},1000);
		
		// 发送验证码
		r.PostInfo(r.user_send_code,data,function(response){
			console.log('send_code:'+response);
			callback();
		},function(response){
			InItCode();
		});
	}
	
	/**
	 * 关闭发送验证吗
	 */
	account.closeCode = function(codeEle){
		clearInterval(account.Inter);
		codeEle.setAttribute('data-isCode','true'); // 可发送状态
		codeEle.innerText = '重新获取'; // 重新获取
		account.t = 60; // 倒计时初始化
	}
	
	
	/**
	 * 用户登陆
	 */
	account.login = function(data,callback){
		callback = callback || $.noop();
		r.PostInfo(r.user_login,data,function(response){
			callback(response);
		},function(response){})
	}
	/**
	 * 验证码登陆
	 */
	account.loginname = function(data,callback){
		callback = callback || $.noop();
		r.PostInfo(r.user_login_code,data,function(response){
			callback(response);
		},function(response){})
	}
	/**
	 * 用户注册
	 **/
	account.register = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.registerURL,data,function(response){
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
					callback();
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
		})
	}
	/**
	 * 密码重置
	 **/
	account.pswdFroget = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.pswdFrogetURL,data,function(response){
			var code = parseInt(response.code);
			switch (code){
				case 1000:
					mui.toast('参数错误！');
					break;
				case 1001:
					mui.toast('验证码不超过4位数！');
					break;
				case 1002:
					mui.toast('验证码不正确！');
					break;
				case 1003:
					mui.toast('验证码已过期！');
					break;
				case 1004:
					mui.toast("两次输入密码不一致！");
					break;
				case 1005:
					mui.toast("找回成功！");
					mui.back();
					break;
				case 1006:
					mui.toast('此次密码与原密码一样');
					break;
				case 1007:
					mui.toast('手机号不存在');
					break;
				default:
					break;
			}
		})
	}
	/**
	 * 密码修改
	 **/
	account.updatepwd = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.personal_set_password,data,function(response){
			callback(response);
		},function(response){})
	}
	/**
	 * 修改手机号
	 **/
	account.updatePhone = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.updatePhoneURL,data,function(response){
			var code = parseInt(response.code);
			switch (code){
				case 1000:
					mui.toast('参数错误');
					break;
				case 1001:
					mui.toast('验证码不能超过四位数字');
					break;
				case 1002:
					mui.toast('验证码不正确！');
					break;
				case 1003:
					mui.toast('验证码已过期！');
					break;
				case 1004:
					mui.toast('手机号已存在');
					break;
				case 1005:
					mui.toast('更换成功');
					openLogin();	
					break;
				case 1006:
					mui.toast('更换失败');
					break;
				default:
					openLogin();	
					break;
			}
		})
	}
	
	/**
	 * @description: 修改用户名
	 * @param {Object} 		data		请求数据
	 * @param {Function} 	callback	回调函数
	 * @return {type}
	 **/
	account.updateUsername = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.personal_update_username,data,function(response){
			callback(response);
		},function(response){})
	}
	
	/**
	 * @description: 修改真实姓名
	 * @param {Object} 		data		请求数据
	 * @param {Function} 	callback	回调函数
	 * @return {type}
	 **/
	account.updateRealname = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.personal_update_name,data,function(response){
			callback();
		})
	}
	
	/**
	 * @description: 修改性别
	 * @param {Object} 		data		请求数据
	 * @param {Function} 	callback	回调函数
	 * @return {type}
	 **/
	account.updateSex = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.personal_update_sex,data,function(response){
			callback(response);
		},function(response){})
	}
	
	/**
	 * 修改图像和昵称
	 */
	account.updateAvatar = function(data,callback){

console.log("11111打印传递的data--------"+JSON.stringify(data));		

		callback = callback || mui.noop;
		// 创建上传列表
		var task = plus.uploader.createUpload(r.ServerUrl+r.personal_update_image, {  
	    	method: "post"  
	   	}, function(t, status) { 
			
// console.log("这里就是需要上传的地方执行的回调函数区域")

console.log("打印修改头像传递的url---------"+r.ServerUrl+r.personal_update_image);
// console.log("打印修改头像传递的data--------"+JSON.stringify(data));

console.log("打印拿到t数据"+JSON.stringify(t));
console.log("打印拿到status数据"+JSON.stringify(status));
console.log("打印拿到t数据responseText"+t.responseText);
			
	        if(status == 200) { // 上传成功
				var response = JSON.parse(BASE64.decode(t.responseText));
	        	// var response = JSON.parse(t.responseText); // 0326这行数据有问题,需要备注
				console.log("执行中");
	        	// 状态值
				var code = parseInt(response.code);
				// 状态值说明
				var message =response.msg;
				// 信息
				var data = response.data;
				console.log(JSON.stringify(data));
				callback(data);
	        }else{ // 上传失败
	            mui.toast("修改失败");
	        }
	    });  
// console.log("打印整个task函数，看看是啥玩意----"+JSON.stringify(task));
// console.log("打印整个task的addFile函数，看看是啥玩意----"+JSON.stringify(task.addFile));
// console.log("打印整个task的addData函数，看看是啥玩意----"+JSON.stringify(task.addData));
// console.log("打印整个task的start函数，看看是啥玩意----"+JSON.stringify(task.start));
		// 添加文件 用户图像
	    task.addFile(data.picture, {key:"picture"});
	    // 添加其他参数  接口令牌
	    task.addData("token",data.token);
	    // 开始上传 
	    task.start();
		
	}
	/**
	 * 常用地址
	 **/
	account.addresslist = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.personal_address_list,data,function(response){
			var data = response.data;
			callback(data);
		},function(response){})
	}
	/**
	 * 默认地址
	 **/
	account.defaultAddress = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.defaultAddressURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast('参数错误！');
					break;
				case 1001:
					mui.toast('已是默认地址！');
					break;
				case 1002:
					mui.toast('设置成功');
					callback();
					break;
				case 1003:
					mui.toast('设置失败！');
					break;
				default:
					openLogin();	
					break;
			}
		})
	}
	/**
	 * 添加地址
	 **/
	account.addAddress = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo_new(r.tms_address_addAddress,data,function(response){
			var data = response.data;
			callback(data);
		},function(response){})
	}
	/**
	 * 更新地址
	 **/
	account.updateAddress = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo_new(r.tms_address_addAddress,data,function(response){
			var data = response.data;
			console.log(data);
			callback();
		},function(response){})
	}
	account.updateAddress_api = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo_new(r.api_address_addAddress,data,function(response){
			var data = response.data;
			console.log(data);
			callback();
		},function(response){})
	}
	/**
	 * 删除地址
	 **/
	 /*3PL*/
	account.delAddress = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo_new(r.tms_address_addressDelFlag,data,function(response){
			callback();
		},function(response){})
	}
	/*user*/
	account.delAddress_api = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo_new(r.api_address_addressDelFlag,data,function(response){
			callback();
		},function(response){})
	}
	/**
	 * 联系人列表
	 **/
	account.concactlist = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo_new(r.personal_contact_list,data,function(response){
			var data = response.data;
			callback(data);
		},function(response){})
	}
	/**
	 * 联系人默认
	 **/
	account.defaultContact = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.defaultContactURL,data,function(response){
			// 状态值
			var code = parseInt(response.code);
			// 状态值说明
			var message = response.message;
			// 信息
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast('参数错误！');
					break;
				case 1001:
					mui.toast('已是默认地址！');
					break;
				case 1002:
					callback();
					break;
				case 1003:
					mui.toast('设置失败！');
					break;
				default:
					openLogin();	
					break;
			}
		})
	}
	/**
	 * 添加联系人
	 **/
	account.addContact = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.personal_add_contact,data,function(response){
			callback(response);
		},function(response){})
	}
	/**
	 * 修改联系人
	 **/
	account.updateContact = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.personal_update_contact,data,function(response){
			callback();
		},function(response){})
	}
	/**
	 * 删除联系人
	 **/
	account.delContact = function(data,callback){
		callback = callback || mui.noop;
		r.PostInfo(r.personal_delete_contact,data,function(response){
			callback();
		},function(response){})
	};
	
	/**
	 * @description: 获得所有按钮标签
	 * @param {Object} 		data		请求数据
	 * @param {Function} 	callback	回调函数
	 * @return {type}
	 **/
	account.getAllButton = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.getAllButtonURL,data,function(response){
			var code = parseInt(response.code);
			var message = response.message;
			var data = response.data;
			// console.log(JSON.stringify(response));
			switch (code){
				case 1000:
					mui.toast(message);
					break;
				case 1001:
					mui.toast(message);
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

	/**
	 * @description:切换公司 获取多个公司的账号
	 * @param {Object} 		data		请求数据
	 * @param {Function} 	callback	回调函数
	 * @return {type}
	 **/
	account.getCompanyList = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.getCompanyList,data,function(response){
			var code = parseInt(response.code);
			var message = response.message;
			var data = response.data;

			console.log('公司列表：'+data);
			callback(data);
		})
	}	

	/**
	 * @description:切换公司 获取账号个数
	 * @param {Object} 		data		请求数据
	 * @param {Function} 	callback	回调函数
	 * @return {type}
	 **/
	account.getCompanyNumber = function(data,callback){
		// callback = callback || mui.noop;
		// r.Post(r.getCompanyNumber,data,function(response){
		// 	var code = parseInt(response.code);
		// 	var message = response.message;
		// 	var data = response.data;
		// 	callback(data);
		// })
	}	

	/**
	 * @description:确定切换公司
	 * @param {Object} 		data		请求数据
	 * @param {Function} 	callback	回调函数
	 * @return {type}
	 **/
	account.switch_accountURL = function(data,callback){
		callback = callback || mui.noop;
		r.Post(r.switch_accountURL,data,function(response){
			var code = parseInt(response.code);
			var message = response.message;
			var data = response.data;
			switch (code){
				case 1001:
					mui.toast(message);
					callback(data);
					break;
				case 1002:
					mui.toast(message);
					break;
				default:
					break;
			}
		})
	}
	
})(mui,window.account = {},request);
